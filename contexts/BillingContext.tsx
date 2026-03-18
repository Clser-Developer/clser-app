import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CartItem, Order, PaymentRecord, PurchasedExperience, PurchasedTicket } from '../types';
import { readStorageItem, writeStorageItem } from '../lib/storage';

type PaymentMethod = 'credit-card' | 'pix';

interface BillingStateSnapshot {
  cartsByArtist: Record<string, CartItem[]>;
  hasCard: boolean;
  orders: Order[];
  paymentHistory: PaymentRecord[];
  paymentMethod: PaymentMethod;
  purchasedExperiences: PurchasedExperience[];
  purchasedTickets: PurchasedTicket[];
}

interface LegacyArtistBillingState {
  orders?: Order[];
  purchasedExperiences?: PurchasedExperience[];
  purchasedTickets?: PurchasedTicket[];
  shoppingCart?: CartItem[];
}

interface BillingContextValue {
  cartsByArtist: Record<string, CartItem[]>;
  hasCard: boolean;
  orders: Order[];
  paymentHistory: PaymentRecord[];
  paymentMethod: PaymentMethod;
  purchasedExperiences: PurchasedExperience[];
  purchasedTickets: PurchasedTicket[];
  setHasCard: Dispatch<SetStateAction<boolean>>;
  setOrders: Dispatch<SetStateAction<Order[]>>;
  setPaymentHistory: Dispatch<SetStateAction<PaymentRecord[]>>;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
  setPurchasedExperiences: Dispatch<SetStateAction<PurchasedExperience[]>>;
  setPurchasedTickets: Dispatch<SetStateAction<PurchasedTicket[]>>;
  addOrder: (order: Order) => void;
  addPaymentRecord: (record: PaymentRecord) => void;
  addPurchasedExperience: (experience: PurchasedExperience) => void;
  addPurchasedTicket: (ticket: PurchasedTicket) => void;
  clearCartForArtist: (artistId: string) => void;
  getCartForArtist: (artistId: string) => CartItem[];
  getExperiencesForArtist: (artistId: string) => PurchasedExperience[];
  getOrdersForArtist: (artistId: string) => Order[];
  getTicketsForArtist: (artistId: string) => PurchasedTicket[];
  setCartForArtist: (artistId: string, updater: SetStateAction<CartItem[]>) => void;
}

const BILLING_STORAGE_KEY = 'globalBillingState';
const LEGACY_GLOBAL_USER_STATE_KEY = 'globalUserState';
const LEGACY_ARTIST_STATE_PREFIX = 'artistState_';

const createDefaultBillingState = (): BillingStateSnapshot => ({
  cartsByArtist: {},
  hasCard: false,
  orders: [],
  paymentHistory: [],
  paymentMethod: 'credit-card',
  purchasedExperiences: [],
  purchasedTickets: [],
});

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const normalizeOrders = (orders: Order[]) =>
  orders.map((order) => ({
    ...order,
    artistId: order.artistId || order.items[0]?.artistId || '',
  }));

const getLegacyBillingState = (): Partial<BillingStateSnapshot> => {
  if (!canUseStorage()) {
    return {};
  }

  const legacyGlobalUserState = readStorageItem(LEGACY_GLOBAL_USER_STATE_KEY);
  const baseState: Partial<BillingStateSnapshot> = {};

  if (legacyGlobalUserState) {
    try {
      const parsed = JSON.parse(legacyGlobalUserState) as Partial<BillingStateSnapshot>;
      if (parsed.paymentMethod) {
        baseState.paymentMethod = parsed.paymentMethod;
      }
      if (parsed.paymentHistory) {
        baseState.paymentHistory = parsed.paymentHistory;
      }
      if (typeof parsed.hasCard === 'boolean') {
        baseState.hasCard = parsed.hasCard;
      }
    } catch (error) {
      console.error('Failed to parse legacy global user billing state.', error);
    }
  }

  const cartsByArtist: Record<string, CartItem[]> = {};
  const orders: Order[] = [];
  const purchasedTickets: PurchasedTicket[] = [];
  const purchasedExperiences: PurchasedExperience[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !key.startsWith(LEGACY_ARTIST_STATE_PREFIX)) {
      continue;
    }

    const rawArtistState = readStorageItem(key);
    if (!rawArtistState) {
      continue;
    }

    try {
      const parsedArtistState = JSON.parse(rawArtistState) as LegacyArtistBillingState;
      const artistId = key.slice(LEGACY_ARTIST_STATE_PREFIX.length);

      if (parsedArtistState.shoppingCart?.length) {
        cartsByArtist[artistId] = parsedArtistState.shoppingCart;
      }

      if (parsedArtistState.orders?.length) {
        orders.push(
          ...parsedArtistState.orders.map((order) => ({
            ...order,
            artistId: order.artistId || artistId,
          }))
        );
      }

      if (parsedArtistState.purchasedTickets?.length) {
        purchasedTickets.push(...parsedArtistState.purchasedTickets);
      }

      if (parsedArtistState.purchasedExperiences?.length) {
        purchasedExperiences.push(...parsedArtistState.purchasedExperiences);
      }
    } catch (error) {
      console.error(`Failed to parse legacy artist billing state for "${key}".`, error);
    }
  }

  return {
    ...baseState,
    cartsByArtist,
    orders,
    purchasedExperiences,
    purchasedTickets,
  };
};

const getInitialBillingState = (): BillingStateSnapshot => {
  const savedStateJSON = readStorageItem(BILLING_STORAGE_KEY);
  if (!savedStateJSON) {
    return {
      ...createDefaultBillingState(),
      ...getLegacyBillingState(),
    };
  }

  try {
    const savedState = JSON.parse(savedStateJSON) as Partial<BillingStateSnapshot>;
    return {
      ...createDefaultBillingState(),
      ...savedState,
      cartsByArtist: savedState.cartsByArtist ?? {},
      orders: normalizeOrders(savedState.orders ?? []),
      paymentHistory: savedState.paymentHistory ?? [],
      purchasedExperiences: savedState.purchasedExperiences ?? [],
      purchasedTickets: savedState.purchasedTickets ?? [],
    };
  } catch (error) {
    console.error('Failed to parse billing state, starting fresh.', error);
    return createDefaultBillingState();
  }
};

const BillingContext = createContext<BillingContextValue | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const initialState = useMemo(() => getInitialBillingState(), []);

  const [cartsByArtist, setCartsByArtist] = useState<Record<string, CartItem[]>>(initialState.cartsByArtist);
  const [hasCard, setHasCard] = useState(initialState.hasCard);
  const [orders, setOrders] = useState<Order[]>(initialState.orders);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(initialState.paymentHistory);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialState.paymentMethod);
  const [purchasedExperiences, setPurchasedExperiences] = useState<PurchasedExperience[]>(initialState.purchasedExperiences);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(initialState.purchasedTickets);

  useEffect(() => {
    writeStorageItem(
      BILLING_STORAGE_KEY,
      JSON.stringify({
        cartsByArtist,
        hasCard,
        orders,
        paymentHistory,
        paymentMethod,
        purchasedExperiences,
        purchasedTickets,
      } satisfies BillingStateSnapshot)
    );
  }, [cartsByArtist, hasCard, orders, paymentHistory, paymentMethod, purchasedExperiences, purchasedTickets]);

  const setCartForArtist = useCallback((artistId: string, updater: SetStateAction<CartItem[]>) => {
    setCartsByArtist((prev) => {
      const currentCart = prev[artistId] ?? [];
      const nextCart = typeof updater === 'function' ? updater(currentCart) : updater;

      if (nextCart.length === 0) {
        const { [artistId]: _removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [artistId]: nextCart,
      };
    });
  }, []);

  const clearCartForArtist = useCallback((artistId: string) => {
    setCartsByArtist((prev) => {
      const { [artistId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const getCartForArtist = useCallback(
    (artistId: string) => cartsByArtist[artistId] ?? [],
    [cartsByArtist]
  );

  const getOrdersForArtist = useCallback(
    (artistId: string) =>
      orders.filter((order) => order.artistId === artistId || order.items.some((item) => item.artistId === artistId)),
    [orders]
  );

  const getTicketsForArtist = useCallback(
    (artistId: string) => purchasedTickets.filter((ticket) => ticket.artistId === artistId),
    [purchasedTickets]
  );

  const getExperiencesForArtist = useCallback(
    (artistId: string) => purchasedExperiences.filter((experience) => experience.artistId === artistId),
    [purchasedExperiences]
  );

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const addPaymentRecord = useCallback((record: PaymentRecord) => {
    setPaymentHistory((prev) => [record, ...prev]);
  }, []);

  const addPurchasedTicket = useCallback((ticket: PurchasedTicket) => {
    setPurchasedTickets((prev) => [ticket, ...prev]);
  }, []);

  const addPurchasedExperience = useCallback((experience: PurchasedExperience) => {
    setPurchasedExperiences((prev) => [experience, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      cartsByArtist,
      hasCard,
      orders: normalizeOrders(orders),
      paymentHistory,
      paymentMethod,
      purchasedExperiences,
      purchasedTickets,
      setHasCard,
      setOrders,
      setPaymentHistory,
      setPaymentMethod,
      setPurchasedExperiences,
      setPurchasedTickets,
      addOrder,
      addPaymentRecord,
      addPurchasedExperience,
      addPurchasedTicket,
      clearCartForArtist,
      getCartForArtist,
      getExperiencesForArtist,
      getOrdersForArtist,
      getTicketsForArtist,
      setCartForArtist,
    }),
    [
      addOrder,
      addPaymentRecord,
      addPurchasedExperience,
      addPurchasedTicket,
      cartsByArtist,
      clearCartForArtist,
      getCartForArtist,
      getExperiencesForArtist,
      getOrdersForArtist,
      getTicketsForArtist,
      hasCard,
      orders,
      paymentHistory,
      paymentMethod,
      purchasedExperiences,
      purchasedTickets,
      setCartForArtist,
    ]
  );

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }

  return context;
};

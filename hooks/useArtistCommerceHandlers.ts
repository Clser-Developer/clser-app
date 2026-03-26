import { useCallback, type Dispatch, type SetStateAction } from 'react';
import {
  AuctionItem,
  CartItem,
  Event,
  ExperienceItem,
  FanGroup,
  Order,
  OrderStatus,
  PaymentRecord,
  PurchasedExperience,
  PurchasedTicket,
  TicketSelection,
  TransactionType,
  VaquinhaCampaign,
} from '../types';

export interface ArtistPurchaseSuccessDetails {
  isPix: boolean;
  type: 'merch' | 'ticket' | 'experience';
  event?: Event;
  experience?: ExperienceItem;
  group?: FanGroup;
}

interface UseArtistCommerceHandlersInput {
  addFanPoints: (points: number, reason: string) => void;
  addOrder: (order: Order) => void;
  addPaymentRecord: (record: PaymentRecord) => void;
  addPurchasedExperience: (experience: PurchasedExperience) => void;
  addPurchasedTicket: (ticket: PurchasedTicket) => void;
  artistId: string;
  artistName: string;
  clearCartForArtist: (artistId: string) => void;
  fanGroups: FanGroup[];
  paymentMethod: 'credit-card' | 'pix';
  setAuctions: Dispatch<SetStateAction<AuctionItem[]>>;
  setCartForArtist: (artistId: string, updater: SetStateAction<CartItem[]>) => void;
  setDonationToCheckout: Dispatch<SetStateAction<{ campaign: VaquinhaCampaign; amount: number } | null>>;
  setDonatedCampaigns: Dispatch<SetStateAction<Record<string, number>>>;
  setExperienceToPurchase: Dispatch<SetStateAction<ExperienceItem | null>>;
  setExperiences: Dispatch<SetStateAction<ExperienceItem[]>>;
  setIsCheckoutVisible: Dispatch<SetStateAction<boolean>>;
  setIsPurchaseSuccessModalVisible: Dispatch<SetStateAction<boolean>>;
  setLastPurchaseDetails: Dispatch<SetStateAction<ArtistPurchaseSuccessDetails | null>>;
  setLastPurchasePoints: Dispatch<SetStateAction<number>>;
  setTicketsToPurchase: Dispatch<SetStateAction<{ event: Event; selections: TicketSelection[] } | null>>;
  setToastMessage: Dispatch<SetStateAction<string | null>>;
  setVaquinhaCampaigns: Dispatch<SetStateAction<VaquinhaCampaign[]>>;
  shoppingCart: CartItem[];
  userNickname: string;
  setAuctionToCheckout: Dispatch<SetStateAction<{ auction: AuctionItem; bidAmount: number } | null>>;
}

export const useArtistCommerceHandlers = ({
  addFanPoints,
  addOrder,
  addPaymentRecord,
  addPurchasedExperience,
  addPurchasedTicket,
  artistId,
  artistName,
  clearCartForArtist,
  fanGroups,
  paymentMethod,
  setAuctions,
  setCartForArtist,
  setDonationToCheckout,
  setDonatedCampaigns,
  setExperienceToPurchase,
  setExperiences,
  setIsCheckoutVisible,
  setIsPurchaseSuccessModalVisible,
  setLastPurchaseDetails,
  setLastPurchasePoints,
  setTicketsToPurchase,
  setToastMessage,
  setVaquinhaCampaigns,
  shoppingCart,
  userNickname,
  setAuctionToCheckout,
}: UseArtistCommerceHandlersInput) => {
  const handleAddToCart = useCallback(
    (itemToAdd: CartItem) => {
      setCartForArtist(artistId, (previousCart) => {
        const existingIndex = previousCart.findIndex(
          (item) =>
            item.id === itemToAdd.id &&
            item.selectedSize === itemToAdd.selectedSize &&
            item.selectedColor === itemToAdd.selectedColor
        );

        if (existingIndex > -1) {
          const newCart = [...previousCart];
          const existingItem = newCart[existingIndex];
          newCart[existingIndex] = { ...existingItem, quantity: existingItem.quantity + itemToAdd.quantity };
          return newCart;
        }

        return [...previousCart, itemToAdd];
      });
    },
    [artistId, setCartForArtist]
  );

  const handleUpdateCartQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      setCartForArtist(artistId, (previousCart) =>
        newQuantity <= 0
          ? previousCart.filter((item) => item.id !== itemId)
          : previousCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    },
    [artistId, setCartForArtist]
  );

  const handlePurchaseSuccess = useCallback(
    (purchaseDetails: { total: number; shippingCost: number; paymentMethod: 'credit-card' | 'pix' }) => {
      const pointsEarned = shoppingCart.reduce((total, item) => total + item.quantity, 0) * 50;
      setLastPurchasePoints(pointsEarned);

      const newOrder: Order = {
        id: `SF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date().toLocaleDateString('pt-BR'),
        artistId,
        status: OrderStatus.PROCESSING,
        items: [...shoppingCart],
        total: purchaseDetails.total,
        shippingCost: purchaseDetails.shippingCost,
      };
      addOrder(newOrder);

      const newPaymentRecord: PaymentRecord = {
        id: `PAY-${newOrder.id}`,
        artistId,
        date: newOrder.date,
        type: TransactionType.MERCH,
        title: `Pedido #${newOrder.id} (${artistName})`,
        amount: newOrder.total,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: purchaseDetails.paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: newOrder.items.map((item) => ({
          description: `${item.quantity}x ${item.name}`,
          amount: item.price * item.quantity,
        })),
      };
      addPaymentRecord(newPaymentRecord);

      setLastPurchaseDetails({ isPix: purchaseDetails.paymentMethod === 'pix', type: 'merch' });
      clearCartForArtist(artistId);
      setIsCheckoutVisible(false);
      setIsPurchaseSuccessModalVisible(true);
    },
    [
      addOrder,
      addPaymentRecord,
      artistId,
      artistName,
      clearCartForArtist,
      setIsCheckoutVisible,
      setIsPurchaseSuccessModalVisible,
      setLastPurchaseDetails,
      setLastPurchasePoints,
      shoppingCart,
    ]
  );

  const handlePurchaseTicketSuccess = useCallback(
    (purchaseDetails: { event: Event; selections: TicketSelection[] }) => {
      const pointsEarned = purchaseDetails.selections.reduce((accumulator, selection) => accumulator + selection.quantity, 0) * 100;
      const newTicket: PurchasedTicket = {
        ...purchaseDetails.event,
        purchaseId: `TKT-${Date.now()}`,
        alertSet: false,
      };
      addPurchasedTicket(newTicket);

      const totalAmount = purchaseDetails.selections.reduce(
        (accumulator, selection) => accumulator + selection.quantity * selection.tier.price,
        0
      );
      const newPaymentRecord: PaymentRecord = {
        id: `PAY-${newTicket.purchaseId}`,
        artistId,
        date: new Date().toLocaleDateString('pt-BR'),
        type: TransactionType.TICKET,
        title: `Ingresso: ${purchaseDetails.event.name}`,
        amount: totalAmount,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: purchaseDetails.selections.map((selection) => ({
          description: `${selection.quantity}x ${selection.tier.name}`,
          amount: selection.quantity * selection.tier.price,
        })),
      };
      addPaymentRecord(newPaymentRecord);

      const eventFanGroup = fanGroups.find((group) => group.eventId === purchaseDetails.event.id) || undefined;

      setLastPurchasePoints(pointsEarned);
      setLastPurchaseDetails({
        isPix: paymentMethod === 'pix',
        type: 'ticket',
        event: purchaseDetails.event,
        group: eventFanGroup,
      });
      setTicketsToPurchase(null);
      setIsPurchaseSuccessModalVisible(true);
    },
    [
      addPaymentRecord,
      addPurchasedTicket,
      artistId,
      fanGroups,
      paymentMethod,
      setIsPurchaseSuccessModalVisible,
      setLastPurchaseDetails,
      setLastPurchasePoints,
      setTicketsToPurchase,
    ]
  );

  const handleExperiencePurchaseSuccess = useCallback(
    (experience: ExperienceItem) => {
      const pointsEarned = 250;
      const newPurchase: PurchasedExperience = {
        ...experience,
        purchaseId: `EXP-${Date.now()}`,
      };
      addPurchasedExperience(newPurchase);

      const newPaymentRecord: PaymentRecord = {
        id: `PAY-${newPurchase.purchaseId}`,
        artistId,
        date: new Date().toLocaleDateString('pt-BR'),
        type: TransactionType.EXPERIENCE,
        title: `Experiência: ${experience.name}`,
        amount: experience.price,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: [
          {
            description: `1x ${experience.name}`,
            amount: experience.price,
          },
        ],
      };
      addPaymentRecord(newPaymentRecord);

      setExperiences((previousExperiences) =>
        previousExperiences.map((currentExperience) =>
          currentExperience.id === experience.id
            ? { ...currentExperience, participantsJoined: currentExperience.participantsJoined + 1 }
            : currentExperience
        )
      );

      setLastPurchasePoints(pointsEarned);
      setLastPurchaseDetails({
        isPix: paymentMethod === 'pix',
        type: 'experience',
        experience,
      });
      setExperienceToPurchase(null);
      setIsPurchaseSuccessModalVisible(true);
    },
    [
      addPaymentRecord,
      addPurchasedExperience,
      artistId,
      paymentMethod,
      setExperienceToPurchase,
      setExperiences,
      setIsPurchaseSuccessModalVisible,
      setLastPurchaseDetails,
      setLastPurchasePoints,
    ]
  );

  const handleAuctionPurchaseSuccess = useCallback(
    (details: { auction: AuctionItem; bidAmount: number }) => {
      const { auction, bidAmount } = details;
      if (new Date(auction.endTime).getTime() < Date.now()) {
        setAuctionToCheckout(null);
        return;
      }

      addFanPoints(20, 'Por dar um lance em um leilão!');
      setAuctions((previousAuctions) =>
        previousAuctions.map((currentAuction) => {
          if (currentAuction.id === auction.id) {
            return {
              ...currentAuction,
              currentBid: bidAmount,
              highestBidderName: userNickname,
              bids: [...currentAuction.bids, { bidderName: userNickname, amount: bidAmount, timestamp: 'Agora mesmo' }],
            };
          }
          return currentAuction;
        })
      );

      const newPaymentRecord: PaymentRecord = {
        id: `PAY-AUC-${Date.now()}`,
        artistId,
        date: new Date().toLocaleDateString('pt-BR'),
        type: TransactionType.AUCTION,
        title: `Lance: ${auction.name}`,
        amount: bidAmount,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: [
          {
            description: `Lance no leilão para "${auction.name}"`,
            amount: bidAmount,
          },
        ],
      };
      addPaymentRecord(newPaymentRecord);

      setAuctionToCheckout(null);
      setToastMessage('Seu lance foi confirmado com sucesso!');
    },
    [addFanPoints, addPaymentRecord, artistId, paymentMethod, setAuctionToCheckout, setAuctions, setToastMessage, userNickname]
  );

  const handleDonationSuccess = useCallback(
    (details: { campaign: VaquinhaCampaign; amount: number }) => {
      const { campaign, amount } = details;
      const pointsToAdd = Math.floor(amount);
      addFanPoints(pointsToAdd, 'Por sua doação na Vaquinha!');

      setVaquinhaCampaigns((previousCampaigns) =>
        previousCampaigns.map((currentCampaign) =>
          currentCampaign.id === campaign.id
            ? {
                ...currentCampaign,
                currentAmount: currentCampaign.currentAmount + amount,
                supporterCount: currentCampaign.supporterCount + 1,
              }
            : currentCampaign
        )
      );

      setDonatedCampaigns((previousDonations) => ({
        ...previousDonations,
        [campaign.id]: (previousDonations[campaign.id] || 0) + amount,
      }));

      const newPaymentRecord: PaymentRecord = {
        id: `PAY-DON-${Date.now()}`,
        artistId,
        date: new Date().toLocaleDateString('pt-BR'),
        type: TransactionType.DONATION,
        title: `Doação: ${campaign.title}`,
        amount,
        status: 'Pago',
        invoiceUrl: '#',
        paymentMethod: paymentMethod === 'credit-card' ? 'Mastercard **** 1234' : 'Pix',
        items: [
          {
            description: `Doação para a campanha "${campaign.title}"`,
            amount,
          },
        ],
      };
      addPaymentRecord(newPaymentRecord);

      setDonationToCheckout(null);
      setToastMessage('Sua doação foi recebida! Muito obrigado!');
    },
    [
      addFanPoints,
      addPaymentRecord,
      artistId,
      paymentMethod,
      setDonationToCheckout,
      setDonatedCampaigns,
      setToastMessage,
      setVaquinhaCampaigns,
    ]
  );

  return {
    handleAddToCart,
    handleAuctionPurchaseSuccess,
    handleDonationSuccess,
    handleExperiencePurchaseSuccess,
    handlePurchaseSuccess,
    handlePurchaseTicketSuccess,
    handleUpdateCartQuantity,
  };
};

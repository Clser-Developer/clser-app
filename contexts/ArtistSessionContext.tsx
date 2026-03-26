import {
  useCallback,
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FanAreaSection, Section, StoreSection } from '../types';
import { readStorageItem, removeStorageItem, writeStorageItem } from '../lib/storage';

type TicketTab = 'available' | 'my_tickets';

interface ArtistSessionContextValue {
  activeSection: Section;
  activeTicketTab: TicketTab;
  currentArtistId: string | null;
  fanAreaSection: FanAreaSection;
  fanAreaViewTargetItemId: string | null;
  isSwitcherVisible: boolean;
  lastViewedArtistId: string | null;
  resetFanNavigation: () => void;
  setActiveSection: Dispatch<SetStateAction<Section>>;
  setActiveTicketTab: Dispatch<SetStateAction<TicketTab>>;
  setCurrentArtistId: Dispatch<SetStateAction<string | null>>;
  setFanAreaSection: Dispatch<SetStateAction<FanAreaSection>>;
  setFanAreaViewTargetItemId: Dispatch<SetStateAction<string | null>>;
  setLastViewedArtistId: Dispatch<SetStateAction<string | null>>;
  setStoreSection: Dispatch<SetStateAction<StoreSection>>;
  setStoreViewTargetItemId: Dispatch<SetStateAction<string | null>>;
  setSwitcherVisible: Dispatch<SetStateAction<boolean>>;
  storeSection: StoreSection;
  storeViewTargetItemId: string | null;
}

const CURRENT_ARTIST_STORAGE_KEY = 'currentArtistId';

const ArtistSessionContext = createContext<ArtistSessionContextValue | undefined>(undefined);

const getInitialCurrentArtistId = () => {
  const savedCurrentArtistId = readStorageItem(CURRENT_ARTIST_STORAGE_KEY);
  if (!savedCurrentArtistId) {
    return null;
  }

  try {
    return JSON.parse(savedCurrentArtistId) as string;
  } catch (error) {
    console.error('Failed to parse current artist session.', error);
    return null;
  }
};

export const ArtistSessionProvider = ({ children }: { children: ReactNode }) => {
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(() => getInitialCurrentArtistId());
  const [lastViewedArtistId, setLastViewedArtistId] = useState<string | null>(null);
  const [isSwitcherVisible, setSwitcherVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>(Section.TIMELINE);
  const [storeSection, setStoreSection] = useState<StoreSection>(StoreSection.HOME);
  const [fanAreaSection, setFanAreaSection] = useState<FanAreaSection>(FanAreaSection.HOME);
  const [storeViewTargetItemId, setStoreViewTargetItemId] = useState<string | null>(null);
  const [fanAreaViewTargetItemId, setFanAreaViewTargetItemId] = useState<string | null>(null);
  const [activeTicketTab, setActiveTicketTab] = useState<TicketTab>('available');

  useEffect(() => {
    if (currentArtistId) {
      writeStorageItem(CURRENT_ARTIST_STORAGE_KEY, JSON.stringify(currentArtistId));
      return;
    }

    removeStorageItem(CURRENT_ARTIST_STORAGE_KEY);
  }, [currentArtistId]);

  const resetFanNavigation = useCallback(() => {
    setActiveSection(Section.TIMELINE);
    setStoreSection(StoreSection.HOME);
    setFanAreaSection(FanAreaSection.HOME);
    setStoreViewTargetItemId(null);
    setFanAreaViewTargetItemId(null);
    setActiveTicketTab('available');
    setSwitcherVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      activeSection,
      activeTicketTab,
      currentArtistId,
      fanAreaSection,
      fanAreaViewTargetItemId,
      isSwitcherVisible,
      lastViewedArtistId,
      resetFanNavigation,
      setActiveSection,
      setActiveTicketTab,
      setCurrentArtistId,
      setFanAreaSection,
      setFanAreaViewTargetItemId,
      setLastViewedArtistId,
      setStoreSection,
      setStoreViewTargetItemId,
      setSwitcherVisible,
      storeSection,
      storeViewTargetItemId,
    }),
    [
      activeSection,
      activeTicketTab,
      currentArtistId,
      fanAreaSection,
      fanAreaViewTargetItemId,
      isSwitcherVisible,
      lastViewedArtistId,
      resetFanNavigation,
      storeSection,
      storeViewTargetItemId,
    ]
  );

  return <ArtistSessionContext.Provider value={value}>{children}</ArtistSessionContext.Provider>;
};

export const useArtistSession = () => {
  const context = useContext(ArtistSessionContext);
  if (!context) {
    throw new Error('useArtistSession must be used within an ArtistSessionProvider');
  }

  return context;
};

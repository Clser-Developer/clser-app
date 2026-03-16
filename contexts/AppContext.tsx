import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Artist, Plan } from '../types';
import { getArtists } from '../services/mockApiService';

interface AppContextType {
  // Artists data
  allArtists: Artist[];
  subscribedArtists: Artist[];
  currentArtist: Artist | null;
  selectedArtistForPurchase: Artist | null;

  // Navigation state
  currentArtistId: string | null;
  lastViewedArtistId: string | null;
  isSwitcherVisible: boolean;

  // Payment flow
  subscriptionFlow: { artist: Artist; plan: Plan } | null;
  showPaymentSuccessModal: boolean;

  // UI state
  isLoading: boolean;
  pointsModalData: { points: number; reason: string } | null;
  imageToView: string | null;

  // Actions
  setSubscribedArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  setCurrentArtistId: (id: string | null) => void;
  setLastViewedArtistId: (id: string | null) => void;
  setSwitcherVisible: (visible: boolean) => void;
  setSubscriptionFlow: React.Dispatch<React.SetStateAction<{ artist: Artist; plan: Plan } | null>>;
  setShowPaymentSuccessModal: (show: boolean) => void;
  setSelectedArtistForPurchase: (artist: Artist | null) => void;
  setPointsModalData: React.Dispatch<React.SetStateAction<{ points: number; reason: string } | null>>;
  setImageToView: (url: string | null) => void;

  // Business logic actions
  handleEnterFanClub: () => void;
  handlePaymentComplete: () => void;
  handleInitiateSubscription: (artist: Artist, plan: Plan) => void;
  handleCancelSubscription: () => void;
  handleSelectArtistForPurchase: (artist: Artist) => void;
  handleBackToDiscovery: () => void;
  handleFindMoreArtists: () => void;
  handleBackFromDiscovery: () => void;
  handleViewImage: (url: string) => void;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Artists data
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [subscribedArtists, setSubscribedArtists] = useState<Artist[]>([]);
  const [selectedArtistForPurchase, setSelectedArtistForPurchase] = useState<Artist | null>(null);

  // Navigation state
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(null);
  const [lastViewedArtistId, setLastViewedArtistId] = useState<string | null>(null);
  const [isSwitcherVisible, setSwitcherVisible] = useState(false);

  // Payment flow
  const [subscriptionFlow, setSubscriptionFlow] = useState<{ artist: Artist; plan: Plan } | null>(null);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [pointsModalData, setPointsModalData] = useState<{ points: number; reason: string } | null>(null);
  const [imageToView, setImageToView] = useState<string | null>(null);

  // Fetch all artists on initial load
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artists = await getArtists();
        setAllArtists(artists);
      } catch (e) {
        console.error("Failed to load artists", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, []);

  // Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedSubscribedArtists = localStorage.getItem('subscribedArtists');
      const savedCurrentArtistId = localStorage.getItem('currentArtistId');

      if (savedSubscribedArtists) {
        const parsedArtists: Artist[] = JSON.parse(savedSubscribedArtists);
        setSubscribedArtists(parsedArtists);
      }

      if (savedCurrentArtistId) {
        setCurrentArtistId(JSON.parse(savedCurrentArtistId));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
      localStorage.removeItem('subscribedArtists');
      localStorage.removeItem('currentArtistId');
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('subscribedArtists', JSON.stringify(subscribedArtists));
      if (currentArtistId) {
        localStorage.setItem('currentArtistId', JSON.stringify(currentArtistId));
      } else {
        localStorage.removeItem('currentArtistId');
      }
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [subscribedArtists, currentArtistId]);

  // Business logic actions
  const handleEnterFanClub = () => {
    if (!subscriptionFlow) return;

    const artistToSubscribe = subscriptionFlow.artist;
    const bonusPoints = 500;
    if (!subscribedArtists.find(a => a.id === artistToSubscribe.id)) {
      const artistWithBonus = {
        ...artistToSubscribe,
        fanPoints: (artistToSubscribe.fanPoints || 0) + bonusPoints
      };
      setSubscribedArtists(prev => [...prev, artistWithBonus]);
    }
    setCurrentArtistId(artistToSubscribe.id);
    setSelectedArtistForPurchase(null);
    setSubscriptionFlow(null);
    setShowPaymentSuccessModal(false);

    // Show points modal after subscribing
    setPointsModalData({ points: bonusPoints, reason: 'Por se inscrever no Fã Clube!' });
  };

  const handlePaymentComplete = () => {
    setShowPaymentSuccessModal(true);
  };

  const handleInitiateSubscription = (artist: Artist, plan: Plan) => {
    setSelectedArtistForPurchase(null);
    setSubscriptionFlow({ artist, plan });
  };

  const handleCancelSubscription = () => {
    setSubscriptionFlow(null);
    setSelectedArtistForPurchase(subscriptionFlow?.artist ?? null);
  };

  const handleSelectArtistForPurchase = (artist: Artist) => {
    setSelectedArtistForPurchase(artist);
  };

  const handleBackToDiscovery = () => {
    setSelectedArtistForPurchase(null);
  };

  const handleFindMoreArtists = () => {
    setLastViewedArtistId(currentArtistId);
    setCurrentArtistId(null);
    setSelectedArtistForPurchase(null);
    setSwitcherVisible(false);
  };

  const handleBackFromDiscovery = () => {
    if (lastViewedArtistId) {
      setCurrentArtistId(lastViewedArtistId);
      setLastViewedArtistId(null);
    }
  };

  const handleViewImage = (imageUrl: string) => {
    setImageToView(imageUrl);
  };

  const handleLogout = () => {
    // Clear all user-specific data to simulate logout
    localStorage.removeItem('subscribedArtists');
    localStorage.removeItem('currentArtistId');
    allArtists.forEach(artist => {
      localStorage.removeItem(`artistState_${artist.id}`);
    });
    setSubscribedArtists([]);
    setCurrentArtistId(null);
    setLastViewedArtistId(null);
  };

  const currentArtist = subscribedArtists.find(a => a.id === currentArtistId);

  const value: AppContextType = {
    // State
    allArtists,
    subscribedArtists,
    currentArtist,
    selectedArtistForPurchase,
    currentArtistId,
    lastViewedArtistId,
    isSwitcherVisible,
    subscriptionFlow,
    showPaymentSuccessModal,
    isLoading,
    pointsModalData,
    imageToView,

    // Setters
    setSubscribedArtists,
    setCurrentArtistId,
    setLastViewedArtistId,
    setSwitcherVisible,
    setSubscriptionFlow,
    setShowPaymentSuccessModal,
    setSelectedArtistForPurchase,
    setPointsModalData,
    setImageToView,

    // Actions
    handleEnterFanClub,
    handlePaymentComplete,
    handleInitiateSubscription,
    handleCancelSubscription,
    handleSelectArtistForPurchase,
    handleBackToDiscovery,
    handleFindMoreArtists,
    handleBackFromDiscovery,
    handleViewImage,
    handleLogout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
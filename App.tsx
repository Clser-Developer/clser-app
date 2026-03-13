import React, { useState, useEffect } from 'react';
import { Artist, Plan } from './types';
import { getArtists } from './services/mockApiService';
import ArtistShowcase from './components/ArtistShowcase';
import ArtistLandingPage from './components/ArtistLandingPage';
import ArtistPage from './components/ArtistPage';
import ArtistSwitcher from './components/ArtistSwitcher';
import PaymentScreen from './components/PaymentScreen';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import PointsAwardedModal from './components/PointsAwardedModal';
import ImageViewerModal from './components/ImageViewerModal';

const App = () => {
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [selectedArtistForPurchase, setSelectedArtistForPurchase] = useState<Artist | null>(null);
  
  // State for post-purchase experience
  const [subscribedArtists, setSubscribedArtists] = useState<Artist[]>([]);
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(null);
  const [lastViewedArtistId, setLastViewedArtistId] = useState<string | null>(null);
  const [isSwitcherVisible, setSwitcherVisible] = useState(false);
  
  // State for payment flow
  const [subscriptionFlow, setSubscriptionFlow] = useState<{ artist: Artist; plan: Plan } | null>(null);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [pointsModalData, setPointsModalData] = useState<{ points: number; reason: string } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
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


  const handleEnterFanClub = () => {
    if (!subscriptionFlow) return;

    const artistToSubscribe = subscriptionFlow.artist;
    const bonusPoints = 500;
    if (!subscribedArtists.find(a => a.id === artistToSubscribe.id)) {
      // Add a one-time 500 points bonus for subscribing
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
  const artistsForShowcase = allArtists.filter(
    artist => !subscribedArtists.some(sub => sub.id === artist.id)
  );

  const mainContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-gray-900 text-white">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-semibold">Carregando seu universo...</p>
        </div>
      );
    }

    if (subscriptionFlow) {
      return (
        <>
          <PaymentScreen
            artist={subscriptionFlow.artist}
            plan={subscriptionFlow.plan}
            onPaymentSuccess={handlePaymentComplete}
            onBack={handleCancelSubscription}
            onViewImage={handleViewImage}
          />
          <PaymentSuccessModal
            isVisible={showPaymentSuccessModal}
            artist={subscriptionFlow.artist}
            onConfirm={handleEnterFanClub}
          />
        </>
      );
    }

    if (currentArtist && subscribedArtists.length > 0) {
      return (
        <div className="bg-gray-900 text-white">
          <ArtistPage 
            artist={currentArtist} 
            onViewImage={handleViewImage}
            onSwitchArtist={() => setSwitcherVisible(true)}
            onLogout={handleLogout}
          />
          <ArtistSwitcher
            isVisible={isSwitcherVisible}
            onClose={() => setSwitcherVisible(false)}
            artists={subscribedArtists}
            currentArtistId={currentArtistId!}
            onSelectArtist={(artistId) => setCurrentArtistId(artistId)}
            onFindMoreArtists={handleFindMoreArtists}
            onViewImage={handleViewImage}
          />
          {pointsModalData && (
              <PointsAwardedModal
                  isVisible={true}
                  points={pointsModalData.points}
                  reason={pointsModalData.reason}
                  onClose={() => setPointsModalData(null)}
              />
          )}
        </div>
      );
    }
    
    return (
      <div className="bg-gray-900 text-white">
        {selectedArtistForPurchase ? (
          <ArtistLandingPage 
            artist={selectedArtistForPurchase} 
            onBack={handleBackToDiscovery}
            onSubscribe={handleInitiateSubscription} 
            onViewImage={handleViewImage}
          />
        ) : (
          <ArtistShowcase 
            artists={artistsForShowcase}
            onSelectArtist={handleSelectArtistForPurchase}
            onBack={lastViewedArtistId ? handleBackFromDiscovery : undefined}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {mainContent()}
      <ImageViewerModal imageUrl={imageToView} onClose={() => setImageToView(null)} />
    </>
  );
};

export default App;
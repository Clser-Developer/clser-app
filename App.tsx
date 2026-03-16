import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import ArtistShowcase from './components/ArtistShowcase';
import ArtistLandingPage from './components/ArtistLandingPage';
import ArtistPage from './components/ArtistPage';
import ArtistSwitcher from './components/ArtistSwitcher';
import PaymentScreen from './components/PaymentScreen';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import PointsAwardedModal from './components/PointsAwardedModal';
import ImageViewerModal from './components/ImageViewerModal';

const AppContent = () => {
  const {
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
    setCurrentArtistId,
    setSwitcherVisible,
    setPointsModalData,
    setImageToView,
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
  } = useAppContext();

  const artistsForShowcase = allArtists.filter(
    artist => !subscribedArtists.some(sub => sub.id === artist.id)
  );

  const renderMainContent = () => {
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
            onSelectArtist={(id) => setCurrentArtistId(id)}
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
  };

  return (
    <>
      {renderMainContent()}
      <ImageViewerModal
        imageUrl={imageToView}
        onClose={() => setImageToView(null)}
      />
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
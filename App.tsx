
import React, { useState, useEffect } from 'react';
import { Artist, Plan, UserAddress, UserPhone, PaymentRecord, TransactionType, PlanType, UserDemographics } from './types';
import { getArtists } from './services/mockApiService';
import { useGlobalUserState, OnboardingDraft } from './hooks/useGlobalUserState';
import ArtistShowcase from './components/ArtistShowcase';
import ArtistLandingPage from './components/ArtistLandingPage';
import ArtistPage from './components/ArtistPage';
import ArtistSwitcher from './components/ArtistSwitcher';
import PaymentScreen from './components/PaymentScreen';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import PointsAwardedModal from './components/PointsAwardedModal';
import ImageViewerModal from './components/ImageViewerModal';
import Onboarding from './components/Onboarding';
import ArtistApp from './components/artist/ArtistApp';
import DemoSelectionScreen from './components/DemoSelectionScreen';
import PaymentSetupScreen from './components/PaymentSetupScreen';
import Icon from './components/Icon';

interface ImageViewerDetails {
  url: string;
  caption?: string;
  postId?: string;
  isLiked?: boolean;
  likeCount?: number;
  onLike?: (postId: string) => void;
}

export interface BillingData {
    fullName: string;
    email: string;
    cpf: string;
    phone: UserPhone;
    address: UserAddress;
}

type AppMode = 'selection' | 'fan' | 'artist';

const App = () => {
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [selectedArtistForAccess, setSelectedArtistForAccess] = useState<Artist | null>(null);
  const [subscribedArtists, setSubscribedArtists] = useState<Artist[]>([]);
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(null);
  const [lastViewedArtistId, setLastViewedArtistId] = useState<string | null>(null);
  const [isSwitcherVisible, setSwitcherVisible] = useState(false);
  const [showPaymentSetup, setShowPaymentSetup] = useState(false);
  const [pointsModalData, setPointsModalData] = useState<{ points: number; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageViewerState, setImageViewerState] = useState<ImageViewerDetails | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('selection');
  const [showResumeScreen, setShowResumeScreen] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  const {
    username, setUsername,
    nickname, setNickname,
    profileImageUrl, setProfileImageUrl,
    paymentMethod, setPaymentMethod,
    paymentHistory, setPaymentHistory,
    isAccountCreated, setIsAccountCreated,
    email, setEmail,
    fullName, setFullName,
    cpf, setCpf,
    phone, setPhone,
    address, setAddress,
    demographics, setDemographics,
    hasCard, setHasCard,
    onboardingDraft, setOnboardingDraft,
    clearOnboardingDraft
  } = useGlobalUserState();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artists = await getArtists();
        setAllArtists(artists);
      } catch (e) { console.error("Failed to load artists", e); }
      finally { setIsLoading(false); }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    try {
      const savedSubscribedArtists = localStorage.getItem('subscribedArtists');
      const savedCurrentArtistId = localStorage.getItem('currentArtistId');
      if (savedSubscribedArtists) setSubscribedArtists(JSON.parse(savedSubscribedArtists));
      if (savedCurrentArtistId) setCurrentArtistId(JSON.parse(savedCurrentArtistId));
    } catch (e) { console.error("Failed to load state", e); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('subscribedArtists', JSON.stringify(subscribedArtists));
      if (currentArtistId) localStorage.setItem('currentArtistId', JSON.stringify(currentArtistId));
      else localStorage.removeItem('currentArtistId');
    } catch (e) { console.error("Failed to save state", e); }
  }, [subscribedArtists, currentArtistId]);

  const handleOnboardingComplete = (details: { 
      email: string, 
      phone: string,
      username: string, 
      nickname: string, 
      profileImageUrl: string, 
      demographics: UserDemographics 
  }) => {
    setEmail(details.email);
    setPhone({ ddi: '+55', number: details.phone });
    setUsername(details.username);
    setNickname(details.nickname);
    setProfileImageUrl(details.profileImageUrl);
    setDemographics(details.demographics);
    setIsAccountCreated(true);
    setIsOnboardingActive(false);
    clearOnboardingDraft();
    // Directly finalize access without payment setup screen to reduce friction
    finalizeAccess();
  };

  const handlePaymentSetupSave = (billingData: BillingData) => {
      setFullName(billingData.fullName);
      setEmail(billingData.email);
      setCpf(billingData.cpf);
      setPhone(billingData.phone);
      setAddress(billingData.address);
      setHasCard(true);
      setPointsModalData({ points: 500, reason: 'Por cadastrar seu cartão!' });
      finalizeAccess();
  };

  const finalizeAccess = () => {
      setShowPaymentSetup(false);
      if (selectedArtistForAccess) {
          if (!subscribedArtists.find(a => a.id === selectedArtistForAccess.id)) {
              setSubscribedArtists(prev => [...prev, selectedArtistForAccess]);
          }
          setCurrentArtistId(selectedArtistForAccess.id);
          setSelectedArtistForAccess(null);
          if (!pointsModalData) {
              setPointsModalData({ 
                  points: 500, 
                  reason: 'Bem-vindo ao clube! Aqui, cada ação e interação sua vale pontos. Acumule para participar de sorteios, eventos especiais e garantir descontos exclusivos em nossa loja!' 
              });
          }
      }
  };

  const handleJoinFree = (artist: Artist) => {
    if (isAccountCreated) {
        if (!subscribedArtists.find(a => a.id === artist.id)) {
            setSubscribedArtists(prev => [...prev, artist]);
        }
        setCurrentArtistId(artist.id);
        setSelectedArtistForAccess(null);
    } else {
        setIsOnboardingActive(true);
    }
  };

  const handleLogout = () => { 
    setAppMode('selection'); 
    setSelectedArtistForAccess(null);
    setIsOnboardingActive(false);
  };
  
  const currentArtist = subscribedArtists.find(a => a.id === currentArtistId);
  const artistsForShowcase = allArtists.filter(a => !subscribedArtists.some(sub => sub.id === a.id));

  const enterFanApp = () => {
      setAppMode('fan');
      if (onboardingDraft && !isAccountCreated) {
          setShowResumeScreen(true);
      }
  };

  const enterArtistApp = () => {
      if (allArtists.length > 0) setCurrentArtistId(allArtists[0].id);
      setAppMode('artist');
  };

  const handleResumeOnboarding = () => {
      if (onboardingDraft?.artistId) {
          const savedArtist = allArtists.find(a => a.id === onboardingDraft.artistId);
          if (savedArtist) {
              setSelectedArtistForAccess(savedArtist);
              setIsOnboardingActive(true);
          }
      }
      setShowResumeScreen(false);
  };

  const ResumeScreen = () => (
      <div className="bg-white h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 text-rose-500 shadow-xl shadow-rose-100 border border-rose-100">
              <Icon name="users" className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">Olá novamente!</h2>
          <p className="text-gray-500 mt-3 font-medium leading-relaxed">Vimos que você já começou seu cadastro como fã. Deseja continuar de onde parou?</p>
          <div className="w-full space-y-3 mt-12">
              <button onClick={handleResumeOnboarding} className="w-full bg-rose-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-transform">Continuar cadastro</button>
              <button onClick={() => { clearOnboardingDraft(); setShowResumeScreen(false); }} className="w-full bg-gray-50 text-gray-400 font-bold py-4 rounded-2xl hover:text-gray-600 transition-colors">Começar do zero</button>
          </div>
      </div>
  );

  const mainContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-gray-50 text-gray-900">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-semibold">Carregando universo...</p>
        </div>
      );
    }

    if (appMode === 'selection') return <DemoSelectionScreen onSelectFan={enterFanApp} onSelectArtist={enterArtistApp} />;
    
    if (appMode === 'artist') {
        const activeArtist = allArtists.find(a => a.id === currentArtistId) || allArtists[0];
        return activeArtist ? <ArtistApp artist={activeArtist} onExit={handleLogout} onViewImage={setImageViewerState}/> : <div className="p-4">Erro.</div>;
    }

    // FÃ MODE
    if (showResumeScreen) return <ResumeScreen />;
    
    // Se o usuário já está em um clube específico (Subscrito)
    if (currentArtist && subscribedArtists.length > 0) {
      return (
        <div className="bg-gray-50 text-gray-900 h-full">
          <ArtistPage 
            artist={currentArtist} onViewImage={setImageViewerState} updateImageViewer={(u) => setImageViewerState(p => p ? {...p, ...u} : null)}
            onSwitchArtist={() => setSwitcherVisible(true)} onLogout={handleLogout} userNickname={nickname}
            onNicknameChange={setNickname} userProfileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl}
            globalPaymentMethod={paymentMethod} onGlobalPaymentMethodChange={setPaymentMethod} globalPaymentHistory={paymentHistory}
            onGlobalPaymentHistoryChange={setPaymentHistory}
          />
          <ArtistSwitcher
            isVisible={isSwitcherVisible} onClose={() => setSwitcherVisible(false)} artists={subscribedArtists}
            currentArtistId={currentArtistId!} onSelectArtist={setCurrentArtistId} onFindMoreArtists={() => { setLastViewedArtistId(currentArtistId); setCurrentArtistId(null); setSelectedArtistForAccess(null); setSwitcherVisible(false); }}
            onViewImage={(url) => setImageViewerState({ url })}
          />
          {pointsModalData && <PointsAwardedModal isVisible={true} points={pointsModalData.points} reason={pointsModalData.reason} onClose={() => setPointsModalData(null)} />}
        </div>
      );
    }

    // Fluxo de Aquisição (Não subscrito ou explorando)
    if (selectedArtistForAccess) {
        if (isOnboardingActive && !isAccountCreated) {
            return (
                <Onboarding 
                    artistId={selectedArtistForAccess.id} 
                    draft={onboardingDraft} 
                    onUpdateDraft={setOnboardingDraft} 
                    onComplete={handleOnboardingComplete}
                    onCancel={() => setIsOnboardingActive(false)}
                />
            );
        }

        if (showPaymentSetup && !isSwitcherVisible) {
            return <PaymentSetupScreen artistName={selectedArtistForAccess.name} onSkip={finalizeAccess} onSaveCard={handlePaymentSetupSave} />;
        }

        return (
            <ArtistLandingPage 
                artist={selectedArtistForAccess} 
                onBack={() => setSelectedArtistForAccess(null)} 
                onSubscribe={() => handleJoinFree(selectedArtistForAccess)} 
                onViewImage={(url) => setImageViewerState({ url })} 
            />
        );
    }

    return (
        <ArtistShowcase 
            artists={artistsForShowcase} 
            onSelectArtist={setSelectedArtistForAccess} 
            onBack={lastViewedArtistId ? () => { setCurrentArtistId(lastViewedArtistId); setLastViewedArtistId(null); } : handleLogout} 
        />
    );
  }

  return (
    <>
      {mainContent()}
      <ImageViewerModal details={imageViewerState} onClose={() => setImageViewerState(null)} />
    </>
  );
};

export default App;

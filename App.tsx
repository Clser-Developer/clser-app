import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Artist, ArtistMembership, UserAddress, UserPhone, UserDemographics } from './types';
import { getArtists } from './services/mockApiService';
import { useGlobalUserState } from './hooks/useGlobalUserState';
import { BillingProvider, useBilling } from './contexts/BillingContext';
import { ArtistSessionProvider, useArtistSession } from './contexts/ArtistSessionContext';
import { readStorageItem, writeStorageItem } from './lib/storage';
import ArtistShowcase from './components/ArtistShowcase';
import ArtistSwitcher from './components/ArtistSwitcher';
import PointsAwardedModal from './components/PointsAwardedModal';
import ImageViewerModal from './components/ImageViewerModal';
import DemoSelectionScreen from './components/DemoSelectionScreen';
import Icon from './components/Icon';

const ArtistLandingPage = lazy(() => import('./components/ArtistLandingPage'));
const ArtistPage = lazy(() => import('./components/ArtistPage'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const ArtistApp = lazy(() => import('./components/artist/ArtistApp'));
const PaymentSetupScreen = lazy(() => import('./components/PaymentSetupScreen'));

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
const ARTIST_MEMBERSHIPS_STORAGE_KEY = 'artistMemberships';
const LEGACY_SUBSCRIBED_ARTISTS_STORAGE_KEY = 'subscribedArtists';

const createArtistMembership = (artistId: string): ArtistMembership => ({
  artistId,
  joinedAt: new Date().toISOString(),
  status: 'active',
});

const normalizeArtistMemberships = (rawValue: unknown): ArtistMembership[] => {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue.reduce<ArtistMembership[]>((memberships, item) => {
    if (typeof item !== 'object' || item === null) {
      return memberships;
    }

    if ('artistId' in item && typeof item.artistId === 'string') {
      memberships.push({
        artistId: item.artistId,
        joinedAt: typeof item.joinedAt === 'string' ? item.joinedAt : new Date().toISOString(),
        status: 'active',
      });
      return memberships;
    }

    if ('id' in item && typeof item.id === 'string') {
      memberships.push(createArtistMembership(item.id));
    }

    return memberships;
  }, []);
};

const ScreenLoader = () => (
  <div className="w-full h-full flex flex-col justify-center items-center bg-gray-50 text-gray-900">
    <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-lg font-semibold">Carregando universo...</p>
  </div>
);

const AppContent = () => {
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [selectedArtistForAccess, setSelectedArtistForAccess] = useState<Artist | null>(null);
  const [artistMemberships, setArtistMemberships] = useState<ArtistMembership[]>([]);
  const [showPaymentSetup, setShowPaymentSetup] = useState(false);
  const [pointsModalData, setPointsModalData] = useState<{ points: number; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageViewerState, setImageViewerState] = useState<ImageViewerDetails | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('selection');
  const [showResumeScreen, setShowResumeScreen] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const {
    currentArtistId,
    isSwitcherVisible,
    lastViewedArtistId,
    resetFanNavigation,
    setCurrentArtistId,
    setLastViewedArtistId,
    setSwitcherVisible,
  } = useArtistSession();

  const {
    emailVerified, setEmailVerified,
    phoneVerified, setPhoneVerified,
    username, setUsername,
    nickname, setNickname,
    profileImageUrl, setProfileImageUrl,
    isAccountCreated, setIsAccountCreated,
    email, setEmail,
    fullName, setFullName,
    cpf, setCpf,
    phone, setPhone,
    address, setAddress,
    demographics, setDemographics,
    onboardingDraft, setOnboardingDraft,
    clearOnboardingDraft
  } = useGlobalUserState();
  const {
    setHasCard,
  } = useBilling();

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
      const savedMemberships = readStorageItem(ARTIST_MEMBERSHIPS_STORAGE_KEY);
      const legacySubscribedArtists = readStorageItem(LEGACY_SUBSCRIBED_ARTISTS_STORAGE_KEY);

      if (savedMemberships) {
        setArtistMemberships(normalizeArtistMemberships(JSON.parse(savedMemberships)));
        return;
      }

      if (legacySubscribedArtists) {
        setArtistMemberships(normalizeArtistMemberships(JSON.parse(legacySubscribedArtists)));
      }
    } catch (e) { console.error("Failed to load artist memberships", e); }
  }, []);

  useEffect(() => {
    try {
      writeStorageItem(ARTIST_MEMBERSHIPS_STORAGE_KEY, JSON.stringify(artistMemberships));
    } catch (e) { console.error("Failed to save artist memberships", e); }
  }, [artistMemberships]);

  const subscribedArtists = useMemo(
    () =>
      artistMemberships
        .map((membership) => allArtists.find((artist) => artist.id === membership.artistId))
        .filter((artist): artist is Artist => Boolean(artist)),
    [allArtists, artistMemberships]
  );

  const hasArtistMembership = (artistId: string) =>
    artistMemberships.some((membership) => membership.artistId === artistId);

  const ensureArtistMembership = (artistId: string) => {
    setArtistMemberships((prev) => {
      if (prev.some((membership) => membership.artistId === artistId)) {
        return prev;
      }

      return [...prev, createArtistMembership(artistId)];
    });
  };

  const handleOnboardingComplete = (details: { 
      email: string, 
      phone: string,
      emailVerified: boolean,
      phoneVerified: boolean,
      username: string, 
      nickname: string, 
      profileImageUrl: string, 
      demographics: UserDemographics 
  }) => {
    setEmail(details.email);
    setPhone({ ddi: '+55', number: details.phone });
    setEmailVerified(details.emailVerified);
    setPhoneVerified(details.phoneVerified);
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
      resetFanNavigation();
      if (selectedArtistForAccess) {
          if (!hasArtistMembership(selectedArtistForAccess.id)) {
              ensureArtistMembership(selectedArtistForAccess.id);
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
        resetFanNavigation();
        if (!hasArtistMembership(artist.id)) {
            ensureArtistMembership(artist.id);
        }
        setCurrentArtistId(artist.id);
        setSelectedArtistForAccess(null);
    } else {
        setIsOnboardingActive(true);
    }
  };

  const handleLogout = () => { 
    resetFanNavigation();
    setAppMode('selection'); 
    setSelectedArtistForAccess(null);
    setIsOnboardingActive(false);
  };
  
  const currentArtist = useMemo(
    () => subscribedArtists.find((artist) => artist.id === currentArtistId),
    [subscribedArtists, currentArtistId]
  );
  const artistsForShowcase = useMemo(
    () => allArtists.filter((artist) => !artistMemberships.some((membership) => membership.artistId === artist.id)),
    [allArtists, artistMemberships]
  );

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
      return <ScreenLoader />;
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
            onLogout={handleLogout} userNickname={nickname}
            onNicknameChange={setNickname} userProfileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl}
          />
          <ArtistSwitcher
            isVisible={isSwitcherVisible} onClose={() => setSwitcherVisible(false)} artists={subscribedArtists}
            currentArtistId={currentArtistId!} onSelectArtist={setCurrentArtistId} onFindMoreArtists={() => { setLastViewedArtistId(currentArtistId); resetFanNavigation(); setCurrentArtistId(null); setSelectedArtistForAccess(null); }}
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
    <Suspense fallback={<ScreenLoader />}>
      <>
        {mainContent()}
        <ImageViewerModal details={imageViewerState} onClose={() => setImageViewerState(null)} />
      </>
    </Suspense>
  );
};

const App = () => {
  return (
    <BillingProvider>
      <ArtistSessionProvider>
        <AppContent />
      </ArtistSessionProvider>
    </BillingProvider>
  );
};

export default App;

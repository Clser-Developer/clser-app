import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Artist, UserAddress, UserPhone, UserDemographics } from './types';
import { useGlobalUserState } from './hooks/useGlobalUserState';
import { BillingProvider, useBilling } from './contexts/BillingContext';
import { ArtistSessionProvider, useArtistSession } from './contexts/ArtistSessionContext';
import { getArtistDataRepository } from './services/artistDataRepository';
import { loginFanAccount, registerFanAccount } from './services/authService';
import { executeQueuedMutationSync } from './services/offlineMutationSync';
import { setQueuedMutationExecutor } from './lib/offline/mutation-queue';
import { useFanFlowState } from './hooks/useFanFlowState';
import { useArtistMemberships } from './hooks/useArtistMemberships';
import AppErrorModal from './components/AppErrorModal';
import ImageViewerModal from './components/ImageViewerModal';
import DemoSelectionScreen from './components/DemoSelectionScreen';
import SplashScreen from './components/SplashScreen';
import ResumeOnboardingScreen from './components/ResumeOnboardingScreen';
import FanStageRouter from './components/fan/FanStageRouter';
import FanSessionView from './components/fan/FanSessionView';
import SelectedArtistAccess from './components/fan/SelectedArtistAccess';

const ArtistPage = lazy(() => import('./components/ArtistPage'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const ArtistApp = lazy(() => import('./components/artist/ArtistApp'));

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
    taxId: string;
    phone: UserPhone;
    address: UserAddress;
}

type AppMode = 'selection' | 'fan' | 'artist';

const ScreenLoader = () => (
  <div className="w-full h-full flex flex-col justify-center items-center bg-gray-50 text-gray-900">
    <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-lg font-semibold">Carregando universo...</p>
  </div>
);

const normalizeGender = (value: string): UserDemographics['gender'] => {
  if (value === 'Masculino' || value === 'Feminino' || value === 'Outro' || value === 'Prefiro não dizer') {
    return value;
  }
  return '';
};

const toUserDemographics = (value: { birthDate: string; city: string; gender: string }): UserDemographics => ({
  birthDate: value.birthDate ?? '',
  city: value.city ?? '',
  gender: normalizeGender(value.gender),
});

const AppContent = () => {
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [showPaymentSetup, setShowPaymentSetup] = useState(false);
  const [pointsModalData, setPointsModalData] = useState<{ points: number; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBootSplashVisible, setIsBootSplashVisible] = useState(true);
  const [imageViewerState, setImageViewerState] = useState<ImageViewerDetails | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('selection');
  const [appErrorMessage, setAppErrorMessage] = useState<string | null>(null);
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
    setInternalUserId,
    internalUserId,
    emailVerified, setEmailVerified,
    phoneVerified, setPhoneVerified,
    username, setUsername,
    nickname, setNickname,
    profileImageUrl, setProfileImageUrl,
    isAccountCreated, setIsAccountCreated,
    email, setEmail,
    fullName, setFullName,
    setTaxId,
    phone, setPhone,
    address, setAddress,
    demographics, setDemographics,
    onboardingDraft, setOnboardingDraft,
    clearOnboardingDraft,
    resetForNewAccount
  } = useGlobalUserState();
  const {
    fanModeStage,
    isFanAuthenticated,
    isOnboardingActive,
    selectedArtistForAccess,
    showResumeScreen,
    setFanModeStage,
    setIsFanAuthenticated,
    setIsOnboardingActive,
    setSelectedArtistForAccess,
    setShowResumeScreen,
    enterFanApp: enterFanAppFlow,
    exploreArtists: exploreArtistsFlow,
    openLogin: openLoginFlow,
    resetAfterLogout: resetAfterLogoutFlow,
    resumeOnboarding: resumeOnboardingFlow,
    startRegistration: startRegistrationFlow,
  } = useFanFlowState({
    allArtists,
    isAccountCreated,
    onboardingDraft,
    resetForNewAccount,
  });
  const {
    setHasCard,
    setStorageScope,
  } = useBilling();
  const artistDataRepository = useMemo(() => getArtistDataRepository(), []);
  const {
    artistsForShowcase,
    ensureArtistMembership,
    hasArtistMembership,
    reloadMemberships,
    subscribedArtists,
  } = useArtistMemberships({
    allArtists,
    internalUserId,
  });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artists = await artistDataRepository.getArtists();
        setAllArtists(artists);
      } catch (e) { console.error("Failed to load artists", e); }
      finally { setIsLoading(false); }
    };
    void fetchArtists();
  }, [artistDataRepository]);

  useEffect(() => {
    setQueuedMutationExecutor(executeQueuedMutationSync);
    return () => {
      setQueuedMutationExecutor(null);
    };
  }, []);

  useEffect(() => {
    setStorageScope(internalUserId);
  }, [internalUserId, setStorageScope]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBootSplashVisible(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [
    appMode,
    fanModeStage,
    showResumeScreen,
    isOnboardingActive,
    selectedArtistForAccess?.id,
    isBootSplashVisible,
    showPaymentSetup,
  ]);

  const handleOnboardingComplete = async (details: {
      email: string, 
      phone: string,
      password: string,
      emailVerified: boolean,
      phoneVerified: boolean,
      fullName: string,
      username: string, 
      nickname: string, 
      profileImageUrl: string, 
      demographics: UserDemographics 
  }) => {
    const authResult = await registerFanAccount({
      internalUserId,
      email: details.email,
      phone: details.phone,
      password: details.password,
      emailVerified: details.emailVerified,
      phoneVerified: details.phoneVerified,
      username: details.username,
      nickname: details.nickname,
      profileImageUrl: details.profileImageUrl,
      demographics: details.demographics,
    });

    if (!authResult.success || !authResult.profile) {
      setAppErrorMessage(authResult.reason ?? 'Não foi possível concluir o cadastro agora.');
      return;
    }

    setInternalUserId(authResult.profile.internalUserId);
    setEmail(details.email);
    setFullName(details.fullName);
    setPhone({ ddi: '+55', number: details.phone });
    setEmailVerified(details.emailVerified);
    setPhoneVerified(details.phoneVerified);
    setUsername(details.username);
    setNickname(details.nickname);
    setProfileImageUrl(details.profileImageUrl);
    setDemographics(details.demographics);
    setIsAccountCreated(true);
    setIsFanAuthenticated(true);
    setIsOnboardingActive(false);
    clearOnboardingDraft();
    // Directly finalize access without payment setup screen to reduce friction
    void finalizeAccess(authResult.profile.internalUserId);
  };

  const handlePaymentSetupSave = (billingData: BillingData) => {
      setFullName(billingData.fullName);
      setEmail(billingData.email);
      setTaxId(billingData.taxId);
      setPhone(billingData.phone);
      setAddress(billingData.address);
      setHasCard(true);
      setPointsModalData({ points: 500, reason: 'Por cadastrar seu cartão!' });
      void finalizeAccess();
  };

  const finalizeAccess = async (scopeUserId: string = internalUserId) => {
      setShowPaymentSetup(false);
      resetFanNavigation();
      if (selectedArtistForAccess) {
          if (!hasArtistMembership(selectedArtistForAccess.id)) {
              await ensureArtistMembership(selectedArtistForAccess.id, scopeUserId);
          }
          setCurrentArtistId(selectedArtistForAccess.id);
          setFanModeStage('session');
          setSelectedArtistForAccess(null);
          if (!pointsModalData) {
              setPointsModalData({ 
                  points: 500, 
                  reason: 'Bem-vindo ao clube! Aqui, cada ação e interação sua vale pontos. Acumule para participar de sorteios, eventos especiais e garantir descontos exclusivos em nossa loja!' 
              });
          }
          return;
      }

      setFanModeStage('browse');
  };

  const handleJoinFree = async (artist: Artist) => {
    if (isAccountCreated && !isFanAuthenticated) {
        setSelectedArtistForAccess(artist);
        setIsOnboardingActive(false);
        setFanModeStage('login');
        return;
    }

    if (isAccountCreated) {
        resetFanNavigation();
        if (!hasArtistMembership(artist.id)) {
            await ensureArtistMembership(artist.id);
        }
        setFanModeStage('session');
        setCurrentArtistId(artist.id);
        setSelectedArtistForAccess(null);
    } else {
        setIsOnboardingActive(true);
    }
  };

  const handleLogout = () => { 
    resetFanNavigation();
    resetAfterLogoutFlow();
    setAppMode('selection'); 
  };
  
  const currentArtist = useMemo(
    () =>
      subscribedArtists.find((artist) => artist.id === currentArtistId) ||
      allArtists.find((artist) => artist.id === currentArtistId) ||
      null,
    [allArtists, subscribedArtists, currentArtistId]
  );

  const enterFanApp = () => {
      setAppMode('fan');
      enterFanAppFlow();
  };

  const enterArtistApp = () => {
      if (allArtists.length > 0) setCurrentArtistId(allArtists[0].id);
      setAppMode('artist');
  };

  const handleResumeOnboarding = () => {
      resumeOnboardingFlow();
  };

  const handleStartRegistration = () => {
      startRegistrationFlow();
  };

  const handleOpenLogin = () => {
      openLoginFlow();
  };

  const handleEnterExistingAccount = async (credentials: { email: string; password: string }) => {
      const authResult = await loginFanAccount(credentials);
      if (!authResult.success || !authResult.profile) {
          return { success: false, reason: authResult.reason ?? 'Não foi possível entrar agora.' };
      }

      const profile = authResult.profile;
      setInternalUserId(profile.internalUserId);
      setEmail(profile.email);
      setPhone({ ddi: '+55', number: profile.phone });
      setEmailVerified(profile.emailVerified);
      setPhoneVerified(profile.phoneVerified);
      setUsername(profile.username);
      setNickname(profile.nickname);
      setProfileImageUrl(profile.profileImageUrl);
      setDemographics(toUserDemographics(profile.demographics));
      setIsAccountCreated(true);
      setIsFanAuthenticated(true);
      clearOnboardingDraft();

      let memberships = await reloadMemberships(profile.internalUserId);

      resetFanNavigation();
      if (selectedArtistForAccess) {
          const targetArtistId = selectedArtistForAccess.id;
          const hasMembership = memberships.some((membership) => membership.artistId === targetArtistId);
          if (!hasMembership) {
            memberships = await ensureArtistMembership(targetArtistId, profile.internalUserId);
          }
          setCurrentArtistId(targetArtistId);
          setSelectedArtistForAccess(null);
          setFanModeStage('session');
          return { success: true };
      }

      const preferredArtistId =
          (currentArtistId && memberships.some((membership) => membership.artistId === currentArtistId) && currentArtistId) ||
          (lastViewedArtistId && memberships.some((membership) => membership.artistId === lastViewedArtistId) && lastViewedArtistId) ||
          memberships[0]?.artistId ||
          null;

      if (preferredArtistId) {
          setCurrentArtistId(preferredArtistId);
          setFanModeStage('session');
          return { success: true };
      }

      setFanModeStage('browse');
      return { success: true };
  };

  const handleExploreArtists = () => {
      resetFanNavigation();
      exploreArtistsFlow();
  };

  const handleBrowseArtistSelection = async (artist: Artist) => {
      setShowResumeScreen(false);

      if (!isAccountCreated) {
          setSelectedArtistForAccess(artist);
          setFanModeStage('browse');
          setIsOnboardingActive(true);
          return;
      }

      if (!isFanAuthenticated) {
          setSelectedArtistForAccess(artist);
          setFanModeStage('login');
          setIsOnboardingActive(false);
          return;
      }

      resetFanNavigation();
      await ensureArtistMembership(artist.id);
      setLastViewedArtistId(artist.id);
      setCurrentArtistId(artist.id);
      setSelectedArtistForAccess(null);
      setFanModeStage('session');
  };

  const handleBrowseBack = () => {
      if (lastViewedArtistId) {
        setCurrentArtistId(lastViewedArtistId);
        setLastViewedArtistId(null);
        setFanModeStage('session');
        return;
      }

      setFanModeStage('gateway');
  };

  const handleOnboardingCancel = () => {
      setIsOnboardingActive(false);

      if (selectedArtistForAccess && !isAccountCreated) {
          setSelectedArtistForAccess(null);
          setFanModeStage('browse');
          return;
      }

      setFanModeStage('gateway');
  };

  const handleOnboardingDiscard = () => {
      clearOnboardingDraft();
      setIsOnboardingActive(false);

      if (selectedArtistForAccess && !isAccountCreated) {
          setSelectedArtistForAccess(null);
          setFanModeStage('browse');
          return;
      }

      setFanModeStage('gateway');
  };

  const mainContent = () => {
    if (isBootSplashVisible) {
      return <SplashScreen />;
    }

    if (isLoading) {
      return <ScreenLoader />;
    }

    if (appMode === 'selection') return <DemoSelectionScreen onSelectFan={enterFanApp} onSelectArtist={enterArtistApp} />;
    
    if (appMode === 'artist') {
        const activeArtist = allArtists.find(a => a.id === currentArtistId) || allArtists[0];
        return activeArtist ? <ArtistApp artist={activeArtist} onExit={handleLogout} onViewImage={setImageViewerState}/> : <div className="p-4">Erro.</div>;
    }

    if (showResumeScreen) {
      return (
        <ResumeOnboardingScreen
          onResume={handleResumeOnboarding}
          onRestart={() => {
            clearOnboardingDraft();
            setShowResumeScreen(false);
          }}
        />
      );
    }

    if (isOnboardingActive && !isAccountCreated) {
        return (
            <Onboarding 
                internalUserId={internalUserId}
                artistId={selectedArtistForAccess?.id ?? 'account'} 
                draft={onboardingDraft} 
                onUpdateDraft={setOnboardingDraft} 
                onComplete={handleOnboardingComplete}
                onCancel={handleOnboardingCancel}
                onDiscard={handleOnboardingDiscard}
            />
        );
    }

    if (fanModeStage === 'gateway' || fanModeStage === 'login' || fanModeStage === 'browse') {
      return (
        <FanStageRouter
          fanModeStage={fanModeStage}
          defaultEmail={email}
          artistsForShowcase={artistsForShowcase}
          onOpenLogin={handleOpenLogin}
          onStartRegistration={handleStartRegistration}
          onExploreArtists={handleExploreArtists}
          onBackToSelection={handleLogout}
          onLoginSubmit={handleEnterExistingAccount}
          onLoginBack={() => setFanModeStage('gateway')}
          onBrowseArtistSelect={handleBrowseArtistSelection}
          onBrowseBack={handleBrowseBack}
        />
      );
    }

    if (currentArtist && fanModeStage === 'session') {
      return (
        <FanSessionView
          ArtistPageComponent={ArtistPage}
          artist={currentArtist}
          currentArtistId={currentArtistId!}
          userScopeId={internalUserId}
          userNickname={nickname}
          userProfileImageUrl={profileImageUrl}
          isSwitcherVisible={isSwitcherVisible}
          subscribedArtists={subscribedArtists}
          pointsModalData={pointsModalData}
          onLogout={handleLogout}
          onSetImageViewerState={setImageViewerState}
          onNicknameChange={setNickname}
          onProfileImageChange={setProfileImageUrl}
          onCloseSwitcher={() => setSwitcherVisible(false)}
          onSelectArtist={(artistId) => {
            setFanModeStage('session');
            setCurrentArtistId(artistId);
          }}
          onFindMoreArtists={() => {
            setLastViewedArtistId(currentArtistId);
            resetFanNavigation();
            setCurrentArtistId(null);
            setSelectedArtistForAccess(null);
            setFanModeStage('browse');
          }}
          onClosePointsModal={() => setPointsModalData(null)}
        />
      );
    }

    if (selectedArtistForAccess) {
      return (
        <SelectedArtistAccess
          artist={selectedArtistForAccess}
          showPaymentSetup={showPaymentSetup}
          isSwitcherVisible={isSwitcherVisible}
          onSkipPaymentSetup={finalizeAccess}
          onSaveCard={handlePaymentSetupSave}
          onBack={() => setSelectedArtistForAccess(null)}
          onSubscribe={handleJoinFree}
          onViewImage={(url) => setImageViewerState({ url })}
        />
      );
    }

    return <ScreenLoader />;
  }

  return (
    <Suspense fallback={<ScreenLoader />}>
      <>
        {mainContent()}
        <ImageViewerModal details={imageViewerState} onClose={() => setImageViewerState(null)} />
        <AppErrorModal message={appErrorMessage} onClose={() => setAppErrorMessage(null)} />
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

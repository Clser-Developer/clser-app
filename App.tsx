import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Artist, ArtistMembership, UserAddress, UserPhone, UserDemographics } from './types';
import { useGlobalUserState } from './hooks/useGlobalUserState';
import { BillingProvider, useBilling } from './contexts/BillingContext';
import { ArtistSessionProvider, useArtistSession } from './contexts/ArtistSessionContext';
import { getArtistDataRepository } from './services/artistDataRepository';
import { getMembershipRepository } from './services/membershipRepository';
import { loginFanAccount, registerFanAccount } from './services/authService';
import { executeQueuedMutationSync } from './services/offlineMutationSync';
import { setQueuedMutationExecutor } from './lib/offline/mutation-queue';
import { useFanFlowState } from './hooks/useFanFlowState';
import ArtistShowcase from './components/ArtistShowcase';
import ArtistSwitcher from './components/ArtistSwitcher';
import PointsAwardedModal from './components/PointsAwardedModal';
import ImageViewerModal from './components/ImageViewerModal';
import DemoSelectionScreen from './components/DemoSelectionScreen';
import FanAccessScreen from './components/FanAccessScreen';
import FanLoginScreen from './components/FanLoginScreen';
import Icon from './components/Icon';
import SplashScreen from './components/SplashScreen';
import ResumeOnboardingScreen from './components/ResumeOnboardingScreen';
import { Button } from './components/ui/button';
import { ModalBody, ModalFooter, ModalShell, ModalTitle } from './components/ui/modal-shell';

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
  const [artistMemberships, setArtistMemberships] = useState<ArtistMembership[]>([]);
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
  const membershipRepository = useMemo(() => getMembershipRepository(), []);

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

  useEffect(() => {
    let isMounted = true;
    const loadMemberships = async () => {
      try {
        const memberships = await membershipRepository.listByUser(internalUserId);
        if (isMounted) {
          setArtistMemberships(memberships);
        }
      } catch (error) {
        console.error('Failed to load artist memberships', error);
      }
    };
    void loadMemberships();
    return () => {
      isMounted = false;
    };
  }, [internalUserId, membershipRepository]);

  const subscribedArtists = useMemo(
    () =>
      artistMemberships
        .map((membership) => allArtists.find((artist) => artist.id === membership.artistId))
        .filter((artist): artist is Artist => Boolean(artist)),
    [allArtists, artistMemberships]
  );

  const hasArtistMembership = (artistId: string) =>
    artistMemberships.some((membership) => membership.artistId === artistId);

  const ensureArtistMembership = async (artistId: string, userId: string = internalUserId) => {
    try {
      const memberships = await membershipRepository.ensureMembership(userId, artistId);
      setArtistMemberships(memberships);
    } catch (error) {
      console.error('Failed to ensure artist membership', error);
    }
  };

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
  const artistsForShowcase = useMemo(
    () => allArtists.filter((artist) => !artistMemberships.some((membership) => membership.artistId === artist.id)),
    [allArtists, artistMemberships]
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

      let memberships = artistMemberships;
      try {
          memberships = await membershipRepository.listByUser(profile.internalUserId);
          setArtistMemberships(memberships);
      } catch (error) {
          console.error('Failed to load memberships after login', error);
      }

      resetFanNavigation();
      if (selectedArtistForAccess) {
          const targetArtistId = selectedArtistForAccess.id;
          const hasMembership = memberships.some((membership) => membership.artistId === targetArtistId);
          if (!hasMembership) {
            const ensuredMemberships = await membershipRepository.ensureMembership(profile.internalUserId, targetArtistId);
            memberships = ensuredMemberships;
            setArtistMemberships(ensuredMemberships);
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

    if (fanModeStage === 'gateway') {
      return (
        <FanAccessScreen
          onEnter={handleOpenLogin}
          onRegister={handleStartRegistration}
          onExploreArtists={handleExploreArtists}
          onBack={handleLogout}
        />
      );
    }

    if (fanModeStage === 'login') {
      return (
        <FanLoginScreen
          defaultEmail={email}
          onSubmit={handleEnterExistingAccount}
          onBack={() => setFanModeStage('gateway')}
        />
      );
    }

    if (fanModeStage === 'browse') {
      return (
          <ArtistShowcase 
              artists={artistsForShowcase} 
              onSelectArtist={(artist) => {
                void handleBrowseArtistSelection(artist);
              }} 
              onBack={lastViewedArtistId ? () => { setCurrentArtistId(lastViewedArtistId); setLastViewedArtistId(null); setFanModeStage('session'); } : () => setFanModeStage('gateway')} 
          />
      );
    }

    if (currentArtist && fanModeStage === 'session') {
      return (
        <div className="bg-gray-50 text-gray-900 h-full">
          <ArtistPage 
            artist={currentArtist} onViewImage={setImageViewerState} updateImageViewer={(u) => setImageViewerState(p => p ? {...p, ...u} : null)}
            onLogout={handleLogout} userNickname={nickname}
            userScopeId={internalUserId}
            onNicknameChange={setNickname} userProfileImageUrl={profileImageUrl} onProfileImageChange={setProfileImageUrl}
          />
          <ArtistSwitcher
            isVisible={isSwitcherVisible} onClose={() => setSwitcherVisible(false)} artists={subscribedArtists}
            currentArtistId={currentArtistId!} onSelectArtist={(artistId) => { setFanModeStage('session'); setCurrentArtistId(artistId); }} onFindMoreArtists={() => { setLastViewedArtistId(currentArtistId); resetFanNavigation(); setCurrentArtistId(null); setSelectedArtistForAccess(null); setFanModeStage('browse'); }}
            onViewImage={(url) => setImageViewerState({ url })}
          />
          {pointsModalData && <PointsAwardedModal isVisible={true} points={pointsModalData.points} reason={pointsModalData.reason} onClose={() => setPointsModalData(null)} />}
        </div>
      );
    }

    if (selectedArtistForAccess) {
        if (showPaymentSetup && !isSwitcherVisible) {
            return (
              <PaymentSetupScreen
                artistName={selectedArtistForAccess.name}
                onSkip={() => {
                  void finalizeAccess();
                }}
                onSaveCard={handlePaymentSetupSave}
              />
            );
        }

        return (
            <ArtistLandingPage 
                artist={selectedArtistForAccess} 
                onBack={() => setSelectedArtistForAccess(null)} 
                onSubscribe={() => {
                  void handleJoinFree(selectedArtistForAccess);
                }} 
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
        <ModalShell
          open={Boolean(appErrorMessage)}
          onClose={() => setAppErrorMessage(null)}
          variant="dialog"
          className="max-w-sm"
        >
          <ModalBody className="px-6 pb-4 pt-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500">
              <Icon name="question-mark-circle" className="h-8 w-8" />
            </div>
            <ModalTitle className="mb-2 text-[1.7rem] leading-none">Cadastro não concluído</ModalTitle>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">{appErrorMessage}</p>
          </ModalBody>
          <ModalFooter className="px-6 pb-6 pt-0">
            <Button onClick={() => setAppErrorMessage(null)} className="h-12 w-full rounded-2xl text-sm font-black">
              Entendi
            </Button>
          </ModalFooter>
        </ModalShell>
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

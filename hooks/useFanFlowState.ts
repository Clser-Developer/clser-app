import { useCallback, useState } from 'react';
import { Artist } from '../types';
import type { OnboardingDraft } from './useGlobalUserState';

export type FanModeStage = 'gateway' | 'login' | 'browse' | 'session';

interface UseFanFlowStateInput {
  allArtists: Artist[];
  isAccountCreated: boolean;
  onboardingDraft: OnboardingDraft | null;
  resetForNewAccount: () => void;
}

export const useFanFlowState = ({
  allArtists,
  isAccountCreated,
  onboardingDraft,
  resetForNewAccount,
}: UseFanFlowStateInput) => {
  const [selectedArtistForAccess, setSelectedArtistForAccess] = useState<Artist | null>(null);
  const [showResumeScreen, setShowResumeScreen] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [fanModeStage, setFanModeStage] = useState<FanModeStage>('gateway');
  const [isFanAuthenticated, setIsFanAuthenticated] = useState(false);

  const enterFanApp = useCallback(() => {
    setFanModeStage('gateway');
    setSelectedArtistForAccess(null);
    if (onboardingDraft && !isAccountCreated) {
      setShowResumeScreen(true);
    }
  }, [isAccountCreated, onboardingDraft]);

  const startRegistration = useCallback(() => {
    if (isAccountCreated) {
      resetForNewAccount();
    }
    setSelectedArtistForAccess(null);
    setShowResumeScreen(false);
    setIsOnboardingActive(true);
    setFanModeStage('gateway');
  }, [isAccountCreated, resetForNewAccount]);

  const openLogin = useCallback(() => {
    setShowResumeScreen(false);
    setIsOnboardingActive(false);
    setFanModeStage('login');
  }, []);

  const exploreArtists = useCallback(() => {
    setShowResumeScreen(false);
    setIsOnboardingActive(false);
    setSelectedArtistForAccess(null);
    setFanModeStage('browse');
  }, []);

  const resumeOnboarding = useCallback(() => {
    if (onboardingDraft?.artistId && onboardingDraft.artistId !== 'account') {
      const savedArtist = allArtists.find((artist) => artist.id === onboardingDraft.artistId);
      if (savedArtist) {
        setSelectedArtistForAccess(savedArtist);
      }
    }

    setFanModeStage('browse');
    setIsOnboardingActive(true);
    setShowResumeScreen(false);
  }, [allArtists, onboardingDraft]);

  const resetAfterLogout = useCallback(() => {
    setIsFanAuthenticated(false);
    setFanModeStage('gateway');
    setSelectedArtistForAccess(null);
    setIsOnboardingActive(false);
    setShowResumeScreen(false);
  }, []);

  return {
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
    enterFanApp,
    exploreArtists,
    openLogin,
    resetAfterLogout,
    resumeOnboarding,
    startRegistration,
  };
};

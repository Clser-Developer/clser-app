import { useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import { ExclusiveReward, FanAreaSection, Section, StoreSection } from '../types';

type TicketTab = 'available' | 'my_tickets';

interface UseArtistNavigationInput {
  activeSection: Section;
  storeSection: StoreSection;
  setActiveSection: (section: Section) => void;
  setStoreSection: (section: StoreSection) => void;
  setFanAreaSection: (section: FanAreaSection) => void;
  setActiveTicketTab: (tab: TicketTab) => void;
  setStoreViewTargetItemId: (itemId: string | null) => void;
  setFanAreaViewTargetItemId: (itemId: string | null) => void;
  setSelectedReward: (reward: ExclusiveReward | null) => void;
  mainScrollRef: RefObject<HTMLElement | null>;
  exclusiveRewards: ExclusiveReward[];
  handleClosePurchaseSuccess: () => void;
}

export const useArtistNavigation = ({
  activeSection,
  storeSection,
  setActiveSection,
  setStoreSection,
  setFanAreaSection,
  setActiveTicketTab,
  setStoreViewTargetItemId,
  setFanAreaViewTargetItemId,
  setSelectedReward,
  mainScrollRef,
  exclusiveRewards,
  handleClosePurchaseSuccess,
}: UseArtistNavigationInput) => {
  useEffect(() => {
    if (activeSection !== Section.STORE) {
      setStoreSection(StoreSection.HOME);
      setActiveTicketTab('available');
    }
    if (activeSection !== Section.FAN_AREA) {
      setFanAreaSection(FanAreaSection.HOME);
    }
  }, [activeSection, setActiveTicketTab, setFanAreaSection, setStoreSection]);

  const handleSectionChange = useCallback(
    (section: Section) => {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });

      if (section === activeSection) {
        if (section === Section.STORE) {
          setStoreSection(StoreSection.HOME);
          setActiveTicketTab('available');
        } else if (section === Section.FAN_AREA) {
          setFanAreaSection(FanAreaSection.HOME);
        }
        requestAnimationFrame(() => {
          mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
        });
      } else {
        setActiveSection(section);
      }
    },
    [activeSection, mainScrollRef, setActiveSection, setActiveTicketTab, setFanAreaSection, setStoreSection]
  );

  const handleStoreSectionChange = useCallback(
    (section: StoreSection) => {
      setStoreSection(section);
      setActiveTicketTab('available');
    },
    [setActiveTicketTab, setStoreSection]
  );

  const handleNavigation = useCallback(
    (section: Section, subSection?: StoreSection | FanAreaSection, itemId?: string) => {
      setActiveSection(section);
      if (section === Section.STORE) {
        if (subSection) {
          handleStoreSectionChange(subSection as StoreSection);
        }
        if (itemId) {
          setStoreViewTargetItemId(itemId);
        }
      } else if (section === Section.FAN_AREA) {
        if (subSection) {
          setFanAreaSection(subSection as FanAreaSection);
        }
        if (itemId) {
          setFanAreaViewTargetItemId(itemId);
        }
        if (subSection === FanAreaSection.REWARDS && itemId) {
          const rewardToView = exclusiveRewards.find((reward) => reward.id === itemId);
          if (rewardToView) {
            setSelectedReward(rewardToView);
          }
        }
      }
    },
    [
      exclusiveRewards,
      handleStoreSectionChange,
      setActiveSection,
      setFanAreaSection,
      setFanAreaViewTargetItemId,
      setSelectedReward,
      setStoreViewTargetItemId,
    ]
  );

  const handleGoToGroups = useCallback(() => {
    handleClosePurchaseSuccess();
    setActiveSection(Section.FAN_AREA);
    setFanAreaSection(FanAreaSection.GROUPS);
  }, [handleClosePurchaseSuccess, setActiveSection, setFanAreaSection]);

  const handleNavigateToFanArea = useCallback(() => {
    setActiveSection(Section.FAN_AREA);
    setFanAreaSection(FanAreaSection.LEADERBOARD);
  }, [setActiveSection, setFanAreaSection]);

  return {
    handleGoToGroups,
    handleNavigateToFanArea,
    handleNavigation,
    handleSectionChange,
    handleStoreSectionChange,
  };
};

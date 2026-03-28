import { useEffect, useState } from 'react';
import {
  AuctionItem,
  Comment,
  Event,
  ExclusiveReward,
  FanArtPost,
  FanGroup,
  FanProfile,
  MediaItem,
  MuralPost,
  Post,
  Section,
  VaquinhaCampaign,
  MerchItem,
  ExperienceItem,
} from '../types';
import { getArtistDataRepository } from '../services/artistDataRepository';

interface UseArtistDataLoadingInput {
  artistId: string;
  activeSection: Section;
  fanPoints: number;
  selectedPostForComments: Post | null;
  artistDataRepository: ReturnType<typeof getArtistDataRepository>;
  posts: Post[];
  merch: MerchItem[];
  events: Event[];
  auctions: AuctionItem[];
  experiences: ExperienceItem[];
  vaquinhaCampaigns: VaquinhaCampaign[];
  media: MediaItem[];
  exclusiveRewards: ExclusiveReward[];
  leaderboard: FanProfile[];
  muralPosts: MuralPost[];
  fanArtPosts: FanArtPost[];
  setPosts: (value: Post[]) => void;
  setFanGroups: (value: FanGroup[]) => void;
  setMerch: (value: MerchItem[]) => void;
  setEvents: (value: Event[]) => void;
  setAuctions: (value: AuctionItem[]) => void;
  setExperiences: (value: ExperienceItem[]) => void;
  setVaquinhaCampaigns: (value: VaquinhaCampaign[]) => void;
  setMedia: (value: MediaItem[]) => void;
  setExclusiveRewards: (value: ExclusiveReward[]) => void;
  setLeaderboard: (value: FanProfile[]) => void;
  setMuralPosts: (value: MuralPost[]) => void;
  setFanArtPosts: (value: FanArtPost[]) => void;
  setComments: (value: Comment[]) => void;
}

export const useArtistDataLoading = ({
  artistId,
  activeSection,
  fanPoints,
  selectedPostForComments,
  artistDataRepository,
  posts,
  merch,
  events,
  auctions,
  experiences,
  vaquinhaCampaigns,
  media,
  exclusiveRewards,
  leaderboard,
  muralPosts,
  fanArtPosts,
  setPosts,
  setFanGroups,
  setMerch,
  setEvents,
  setAuctions,
  setExperiences,
  setVaquinhaCampaigns,
  setMedia,
  setExclusiveRewards,
  setLeaderboard,
  setMuralPosts,
  setFanArtPosts,
  setComments,
}: UseArtistDataLoadingInput) => {
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingPosts(true);
      try {
        if (posts.length === 0) {
          const [postsData, fanGroupsData] = await Promise.all([
            artistDataRepository.getPostsForArtist(artistId),
            artistDataRepository.getFanGroupsForArtist(artistId),
          ]);
          setPosts(postsData);
          setFanGroups(fanGroupsData);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    void fetchInitialData();
  }, [artistDataRepository, artistId, posts.length, setFanGroups, setPosts]);

  useEffect(() => {
    const loadStoreData = async () => {
      if (
        merch.length === 0 &&
        events.length === 0 &&
        auctions.length === 0 &&
        vaquinhaCampaigns.length === 0 &&
        experiences.length === 0
      ) {
        setIsLoadingStore(true);
        try {
          const [merchData, eventsData, auctionsData, vaquinhaData, experiencesData] = await Promise.all([
            artistDataRepository.getMerchForArtist(artistId),
            artistDataRepository.getEventsForArtist(artistId),
            artistDataRepository.getAuctionsForArtist(artistId),
            artistDataRepository.getVaquinhaCampaignsForArtist(artistId),
            artistDataRepository.getExperiencesForArtist(artistId),
          ]);
          setMerch(merchData);
          setEvents(eventsData);
          setAuctions(auctionsData);
          setVaquinhaCampaigns(vaquinhaData);
          setExperiences(experiencesData);
        } catch (error) {
          console.error('Failed to load store data', error);
        } finally {
          setIsLoadingStore(false);
        }
      }
    };

    const loadMediaData = async () => {
      if (media.length === 0) {
        setIsLoadingMedia(true);
        try {
          const mediaData = await artistDataRepository.getMediaForArtist(artistId);
          setMedia(mediaData);
        } catch (error) {
          console.error('Failed to load media data', error);
        } finally {
          setIsLoadingMedia(false);
        }
      }
    };

    const loadProfileData = async () => {
      if (leaderboard.length > 0 && exclusiveRewards.length > 0 && muralPosts.length > 0 && fanArtPosts.length > 0) {
        return;
      }

      setIsLoadingProfile(true);
      try {
        const [rewardsData, leaderboardData, muralData, fanArtData] = await Promise.all([
          exclusiveRewards.length === 0
            ? artistDataRepository.getExclusiveRewardsForArtist(artistId)
            : Promise.resolve(exclusiveRewards),
          leaderboard.length === 0
            ? artistDataRepository.getFanLeaderboard(artistId, fanPoints)
            : Promise.resolve(leaderboard),
          muralPosts.length === 0 ? artistDataRepository.getMuralPosts(artistId) : Promise.resolve(muralPosts),
          fanArtPosts.length === 0 ? artistDataRepository.getFanArtPosts(artistId) : Promise.resolve(fanArtPosts),
        ]);
        if (exclusiveRewards.length === 0) setExclusiveRewards(rewardsData as ExclusiveReward[]);
        if (leaderboard.length === 0) setLeaderboard(leaderboardData as FanProfile[]);
        if (muralPosts.length === 0) setMuralPosts(muralData as MuralPost[]);
        if (fanArtPosts.length === 0) setFanArtPosts(fanArtData as FanArtPost[]);
      } catch (error) {
        console.error('Failed to load profile data', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (activeSection === Section.STORE) {
      void loadStoreData();
    } else if (activeSection === Section.MEDIA) {
      void loadMediaData();
    } else if (activeSection === Section.PROFILE || activeSection === Section.FAN_AREA) {
      void loadProfileData();
    }
  }, [
    activeSection,
    artistDataRepository,
    artistId,
    fanArtPosts.length,
    fanPoints,
    exclusiveRewards.length,
    events.length,
    experiences.length,
    auctions.length,
    leaderboard.length,
    media.length,
    merch.length,
    muralPosts.length,
    setAuctions,
    setEvents,
    setExclusiveRewards,
    setExperiences,
    setFanArtPosts,
    setLeaderboard,
    setMedia,
    setMerch,
    setMuralPosts,
    setVaquinhaCampaigns,
    vaquinhaCampaigns.length,
  ]);

  useEffect(() => {
    if (!selectedPostForComments) return;
    const fetchComments = async () => {
      setIsCommentsLoading(true);
      try {
        setComments(await artistDataRepository.getCommentsForPost(selectedPostForComments.id));
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setIsCommentsLoading(false);
      }
    };
    void fetchComments();
  }, [artistDataRepository, selectedPostForComments?.id, setComments]);

  return {
    isCommentsLoading,
    isLoadingMedia,
    isLoadingPosts,
    isLoadingProfile,
    isLoadingStore,
  };
};

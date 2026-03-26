import {
  getArtists as getArtistsFromMock,
  getAuctionsForArtist,
  getCommentsForPost,
  getEventsForArtist,
  getExclusiveRewardsForArtist,
  getExperiencesForArtist,
  getFanArtPosts,
  getFanGroupsForArtist,
  getFanLeaderboard,
  getMediaForArtist,
  getMerchForArtist,
  getMuralPosts,
  getPostsForArtist,
  getVaquinhaCampaignsForArtist,
} from './mockApiService';
import type {
  Artist,
  AuctionItem,
  Comment,
  Event,
  ExclusiveReward,
  ExperienceItem,
  FanArtPost,
  FanGroup,
  FanProfile,
  MediaItem,
  MerchItem,
  MuralPost,
  Post,
  VaquinhaCampaign,
} from '../types';

export interface ArtistDataRepository {
  getArtists(): Promise<Artist[]>;
  getPostsForArtist(artistId: string): Promise<Post[]>;
  getMerchForArtist(artistId: string): Promise<MerchItem[]>;
  getEventsForArtist(artistId: string): Promise<Event[]>;
  getAuctionsForArtist(artistId: string): Promise<AuctionItem[]>;
  getExperiencesForArtist(artistId: string): Promise<ExperienceItem[]>;
  getFanLeaderboard(artistId: string, currentUserPoints: number): Promise<FanProfile[]>;
  getCommentsForPost(postId: string): Promise<Comment[]>;
  getExclusiveRewardsForArtist(artistId: string): Promise<ExclusiveReward[]>;
  getMediaForArtist(artistId: string): Promise<MediaItem[]>;
  getMuralPosts(artistId: string): Promise<MuralPost[]>;
  getFanArtPosts(artistId: string): Promise<FanArtPost[]>;
  getVaquinhaCampaignsForArtist(artistId: string): Promise<VaquinhaCampaign[]>;
  getFanGroupsForArtist(artistId: string): Promise<FanGroup[]>;
}

class MockArtistDataRepository implements ArtistDataRepository {
  getArtists() {
    return getArtistsFromMock();
  }

  getPostsForArtist(artistId: string) {
    return getPostsForArtist(artistId);
  }

  getMerchForArtist(artistId: string) {
    return getMerchForArtist(artistId);
  }

  getEventsForArtist(artistId: string) {
    return getEventsForArtist(artistId);
  }

  getAuctionsForArtist(artistId: string) {
    return getAuctionsForArtist(artistId);
  }

  getExperiencesForArtist(artistId: string) {
    return getExperiencesForArtist(artistId);
  }

  getFanLeaderboard(artistId: string, currentUserPoints: number) {
    return getFanLeaderboard(artistId, currentUserPoints);
  }

  getCommentsForPost(postId: string) {
    return getCommentsForPost(postId);
  }

  getExclusiveRewardsForArtist(artistId: string) {
    return getExclusiveRewardsForArtist(artistId);
  }

  getMediaForArtist(artistId: string) {
    return getMediaForArtist(artistId);
  }

  getMuralPosts(artistId: string) {
    return getMuralPosts(artistId);
  }

  getFanArtPosts(artistId: string) {
    return getFanArtPosts(artistId);
  }

  getVaquinhaCampaignsForArtist(artistId: string) {
    return getVaquinhaCampaignsForArtist(artistId);
  }

  getFanGroupsForArtist(artistId: string) {
    return getFanGroupsForArtist(artistId);
  }
}

let repository: ArtistDataRepository | null = null;

export const getArtistDataRepository = (): ArtistDataRepository => {
  if (!repository) {
    repository = new MockArtistDataRepository();
  }

  return repository;
};

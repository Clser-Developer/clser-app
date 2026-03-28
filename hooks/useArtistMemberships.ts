import { useCallback, useEffect, useMemo, useState } from 'react';
import { Artist, ArtistMembership } from '../types';
import { getMembershipRepository } from '../services/membershipRepository';

interface UseArtistMembershipsInput {
  allArtists: Artist[];
  internalUserId: string;
}

export const useArtistMemberships = ({ allArtists, internalUserId }: UseArtistMembershipsInput) => {
  const [artistMemberships, setArtistMemberships] = useState<ArtistMembership[]>([]);
  const membershipRepository = useMemo(() => getMembershipRepository(), []);

  const reloadMemberships = useCallback(
    async (userId: string = internalUserId): Promise<ArtistMembership[]> => {
      try {
        const memberships = await membershipRepository.listByUser(userId);
        setArtistMemberships(memberships);
        return memberships;
      } catch (error) {
        console.error('Failed to load artist memberships', error);
        return [];
      }
    },
    [internalUserId, membershipRepository]
  );

  const ensureArtistMembership = useCallback(
    async (artistId: string, userId: string = internalUserId): Promise<ArtistMembership[]> => {
      try {
        const memberships = await membershipRepository.ensureMembership(userId, artistId);
        setArtistMemberships(memberships);
        return memberships;
      } catch (error) {
        console.error('Failed to ensure artist membership', error);
        return artistMemberships;
      }
    },
    [artistMemberships, internalUserId, membershipRepository]
  );

  const hasArtistMembership = useCallback(
    (artistId: string) => artistMemberships.some((membership) => membership.artistId === artistId),
    [artistMemberships]
  );

  const subscribedArtists = useMemo(
    () =>
      artistMemberships
        .map((membership) => allArtists.find((artist) => artist.id === membership.artistId))
        .filter((artist): artist is Artist => Boolean(artist)),
    [allArtists, artistMemberships]
  );

  const artistsForShowcase = useMemo(
    () => allArtists.filter((artist) => !artistMemberships.some((membership) => membership.artistId === artist.id)),
    [allArtists, artistMemberships]
  );

  useEffect(() => {
    void reloadMemberships(internalUserId);
  }, [internalUserId, reloadMemberships]);

  return {
    artistMemberships,
    artistsForShowcase,
    ensureArtistMembership,
    hasArtistMembership,
    reloadMemberships,
    subscribedArtists,
  };
};

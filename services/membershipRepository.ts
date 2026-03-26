import { getSupabaseClient, hasSupabaseConfig } from '../lib/supabase/client';
import { readStorageItem, writeStorageItem } from '../lib/storage';
import type { ArtistMembership } from '../types';

const LEGACY_STORAGE_KEY = 'artistMemberships';
const LOCAL_PREFIX = 'clser:artist-memberships:v1:';

interface MembershipRepository {
  listByUser(internalUserId: string): Promise<ArtistMembership[]>;
  saveByUser(internalUserId: string, memberships: ArtistMembership[]): Promise<void>;
  ensureMembership(internalUserId: string, artistId: string): Promise<ArtistMembership[]>;
}

const storageKeyForUser = (internalUserId: string) => `${LOCAL_PREFIX}${internalUserId}`;

const normalizeMemberships = (rawValue: unknown): ArtistMembership[] => {
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
      memberships.push({
        artistId: item.id,
        joinedAt: new Date().toISOString(),
        status: 'active',
      });
    }

    return memberships;
  }, []);
};

class LocalMembershipRepository implements MembershipRepository {
  async listByUser(internalUserId: string): Promise<ArtistMembership[]> {
    const raw = readStorageItem(storageKeyForUser(internalUserId));
    if (raw) {
      try {
        return normalizeMemberships(JSON.parse(raw));
      } catch {
        return [];
      }
    }

    const legacy = readStorageItem(LEGACY_STORAGE_KEY);
    if (!legacy) return [];

    try {
      return normalizeMemberships(JSON.parse(legacy));
    } catch {
      return [];
    }
  }

  async saveByUser(internalUserId: string, memberships: ArtistMembership[]): Promise<void> {
    writeStorageItem(storageKeyForUser(internalUserId), JSON.stringify(memberships));
  }

  async ensureMembership(internalUserId: string, artistId: string): Promise<ArtistMembership[]> {
    const current = await this.listByUser(internalUserId);
    if (current.some((membership) => membership.artistId === artistId)) {
      return current;
    }

    const next = [
      ...current,
      {
        artistId,
        joinedAt: new Date().toISOString(),
        status: 'active',
      } satisfies ArtistMembership,
    ];
    await this.saveByUser(internalUserId, next);
    return next;
  }
}

class SupabaseMembershipRepository implements MembershipRepository {
  async listByUser(internalUserId: string): Promise<ArtistMembership[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
      .from('artist_memberships')
      .select('artist_id, joined_at, status')
      .eq('internal_user_id', internalUserId)
      .order('joined_at', { ascending: true });

    if (error || !data) return [];

    return data.map((row) => ({
      artistId: row.artist_id,
      joinedAt: row.joined_at,
      status: 'active',
    }));
  }

  async saveByUser(internalUserId: string, memberships: ArtistMembership[]): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    const payload = memberships.map((membership) => ({
      internal_user_id: internalUserId,
      artist_id: membership.artistId,
      joined_at: membership.joinedAt,
      status: membership.status,
    }));

    await client.from('artist_memberships').upsert(payload, {
      onConflict: 'internal_user_id,artist_id',
    });
  }

  async ensureMembership(internalUserId: string, artistId: string): Promise<ArtistMembership[]> {
    const current = await this.listByUser(internalUserId);
    if (current.some((membership) => membership.artistId === artistId)) {
      return current;
    }

    const next = [
      ...current,
      {
        artistId,
        joinedAt: new Date().toISOString(),
        status: 'active',
      } satisfies ArtistMembership,
    ];
    await this.saveByUser(internalUserId, next);
    return next;
  }
}

let repository: MembershipRepository | null = null;

export const getMembershipRepository = (): MembershipRepository => {
  if (repository) return repository;

  repository = hasSupabaseConfig ? new SupabaseMembershipRepository() : new LocalMembershipRepository();
  return repository;
};

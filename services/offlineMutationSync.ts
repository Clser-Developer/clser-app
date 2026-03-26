import { getSupabaseClient, hasSupabaseConfig } from '../lib/supabase/client';
import { readStorageItem, writeStorageItem } from '../lib/storage';
import type { QueuedMutation } from '../lib/offline/mutation-queue';

interface LocalSyncedMutation extends QueuedMutation {
  syncedAt: string;
  syncTarget: 'local_fallback' | 'supabase';
}

const LOCAL_SYNCED_MUTATIONS_KEY = 'clser:offline-synced-mutations:v1';

const readLocalSyncedMutations = (): LocalSyncedMutation[] => {
  const raw = readStorageItem(LOCAL_SYNCED_MUTATIONS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const appendLocalSyncedMutation = (mutation: QueuedMutation, syncTarget: LocalSyncedMutation['syncTarget']) => {
  const current = readLocalSyncedMutations();
  const nextMutation: LocalSyncedMutation = {
    ...mutation,
    syncedAt: new Date().toISOString(),
    syncTarget,
  };

  writeStorageItem(LOCAL_SYNCED_MUTATIONS_KEY, JSON.stringify([...current, nextMutation]));
};

const syncWithSupabase = async (mutation: QueuedMutation): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) {
    return false;
  }

  const { error } = await client.from('fan_activity_events').insert({
    mutation_id: mutation.id,
    operation: mutation.op,
    artist_id: mutation.artistId ?? null,
    payload: mutation.payload,
    mutation_created_at: mutation.createdAt,
    mutation_attempts: mutation.attempts,
    synced_at: new Date().toISOString(),
  });

  if (error) {
    console.error(`Failed to sync queued mutation "${mutation.id}"`, error);
    return false;
  }

  return true;
};

export const executeQueuedMutationSync = async (mutation: QueuedMutation): Promise<boolean> => {
  if (hasSupabaseConfig) {
    const synced = await syncWithSupabase(mutation);
    if (synced) {
      appendLocalSyncedMutation(mutation, 'supabase');
    }
    return synced;
  }

  appendLocalSyncedMutation(mutation, 'local_fallback');
  return true;
};


import { operationPolicy, type OperationKey } from './operation-contract';
import { isStorageAvailable, readStorageItem, writeStorageItem } from '../storage';

const QUEUE_STORAGE_KEY = 'clser:offline-mutation-queue:v1';
const QUEUE_CHANGE_EVENT = 'clser:offline-mutation-queue:changed';

export interface QueuedMutation {
  id: string;
  op: OperationKey;
  artistId?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
}

interface QueueMutationInput {
  op: OperationKey;
  payload: Record<string, unknown>;
  artistId?: string;
}

type MutationExecutor = (mutation: QueuedMutation) => Promise<boolean>;

let queuedMutationExecutor: MutationExecutor | null = null;

const readQueue = (): QueuedMutation[] => {
  if (!isStorageAvailable()) return [];
  try {
    const raw = readStorageItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === 'string' && typeof item.op === 'string');
  } catch {
    return [];
  }
};

const writeQueue = (queue: QueuedMutation[]) => {
  if (!isStorageAvailable()) return;
  writeStorageItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  window.dispatchEvent(
    new CustomEvent(QUEUE_CHANGE_EVENT, {
      detail: { pending: queue.length },
    })
  );
};

export const listQueuedMutations = () => readQueue();

export const countQueuedMutations = () => readQueue().length;

export const queueMutation = ({ op, payload, artistId }: QueueMutationInput): QueuedMutation | null => {
  const policy = operationPolicy[op];
  if (!policy.queueWhenOffline) return null;

  const mutation: QueuedMutation = {
    id: `mq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    op,
    payload,
    artistId,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };

  const currentQueue = readQueue();
  writeQueue([...currentQueue, mutation]);
  return mutation;
};

export const queueMutationWhenOffline = (input: QueueMutationInput): QueuedMutation | null => {
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    return null;
  }
  return queueMutation(input);
};

export const removeQueuedMutation = (id: string) => {
  const currentQueue = readQueue();
  writeQueue(currentQueue.filter((item) => item.id !== id));
};

export const setQueuedMutationExecutor = (executor: MutationExecutor | null) => {
  queuedMutationExecutor = executor;
};

export const hasQueuedMutationExecutor = () => queuedMutationExecutor !== null;

export const flushQueuedMutations = async (executor?: MutationExecutor) => {
  const executeMutation = executor ?? queuedMutationExecutor;
  if (!executeMutation) {
    return;
  }

  const currentQueue = readQueue();
  if (currentQueue.length === 0) return;

  const remaining: QueuedMutation[] = [];
  for (const mutation of currentQueue) {
    try {
      const success = await executeMutation(mutation);
      if (!success) {
        remaining.push({ ...mutation, attempts: mutation.attempts + 1 });
      }
    } catch {
      remaining.push({ ...mutation, attempts: mutation.attempts + 1 });
    }
  }

  writeQueue(remaining);
};

export const subscribeToMutationQueue = (listener: (pending: number) => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ pending?: number }>;
    const pending = customEvent.detail?.pending ?? countQueuedMutations();
    listener(pending);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(QUEUE_CHANGE_EVENT, handler);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(QUEUE_CHANGE_EVENT, handler);
    }
  };
};

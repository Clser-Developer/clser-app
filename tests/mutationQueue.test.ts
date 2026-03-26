import { beforeEach, describe, expect, it } from 'vitest';
import {
  countQueuedMutations,
  flushQueuedMutations,
  listQueuedMutations,
  queueMutationWhenOffline,
  setQueuedMutationExecutor,
} from '../lib/offline/mutation-queue';

const setNavigatorOnline = (value: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value,
  });
};

describe('offline mutation queue', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setQueuedMutationExecutor(null);
    setNavigatorOnline(true);
  });

  it('queues mutation only when offline', () => {
    const ignored = queueMutationWhenOffline({
      op: 'fan.like_post',
      artistId: 'lia',
      payload: { postId: 'p1', liked: true },
    });
    expect(ignored).toBeNull();
    expect(countQueuedMutations()).toBe(0);

    setNavigatorOnline(false);
    const queued = queueMutationWhenOffline({
      op: 'fan.like_post',
      artistId: 'lia',
      payload: { postId: 'p1', liked: true },
    });
    expect(queued).not.toBeNull();
    expect(countQueuedMutations()).toBe(1);
  });

  it('flushes queued mutations with registered executor', async () => {
    setNavigatorOnline(false);

    queueMutationWhenOffline({
      op: 'fan.comment_post',
      artistId: 'lia',
      payload: { postId: 'p2', text: 'Teste' },
    });
    queueMutationWhenOffline({
      op: 'fan.vote_poll',
      artistId: 'lia',
      payload: { postId: 'p3', optionIndex: 1 },
    });
    expect(countQueuedMutations()).toBe(2);

    setNavigatorOnline(true);
    setQueuedMutationExecutor(async (mutation) => mutation.op !== 'fan.vote_poll');
    await flushQueuedMutations();

    const remaining = listQueuedMutations();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].op).toBe('fan.vote_poll');
    expect(remaining[0].attempts).toBe(1);
  });
});


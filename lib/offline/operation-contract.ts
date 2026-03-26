export type OperationScope = 'global_account' | 'artist_session';

export interface OperationPolicy {
  scope: OperationScope;
  requiresNetwork: boolean;
  queueWhenOffline: boolean;
  optimistic: boolean;
}

export const operationPolicy = {
  'fan.like_post': {
    scope: 'artist_session',
    requiresNetwork: true,
    queueWhenOffline: true,
    optimistic: true,
  },
  'fan.comment_post': {
    scope: 'artist_session',
    requiresNetwork: true,
    queueWhenOffline: true,
    optimistic: true,
  },
  'fan.vote_poll': {
    scope: 'artist_session',
    requiresNetwork: true,
    queueWhenOffline: true,
    optimistic: true,
  },
  'fan.like_mural': {
    scope: 'artist_session',
    requiresNetwork: true,
    queueWhenOffline: true,
    optimistic: true,
  },
  'fan.like_fan_art': {
    scope: 'artist_session',
    requiresNetwork: true,
    queueWhenOffline: true,
    optimistic: true,
  },
  'fan.join_group': {
    scope: 'artist_session',
    requiresNetwork: true,
    queueWhenOffline: true,
    optimistic: true,
  },
  'profile.update_account': {
    scope: 'global_account',
    requiresNetwork: true,
    queueWhenOffline: true,
    optimistic: false,
  },
  'billing.checkout': {
    scope: 'global_account',
    requiresNetwork: true,
    queueWhenOffline: false,
    optimistic: false,
  },
} as const satisfies Record<string, OperationPolicy>;

export type OperationKey = keyof typeof operationPolicy;

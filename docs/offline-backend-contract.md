# Offline x Backend Contract (Phase 3)

This document defines which operations are optimistic/offline and how they should be synced when the backend is connected.

## Scope model

- `global_account`: shared across all artists (account, billing, orders).
- `artist_session`: scoped per artist (fan points, mural, polls, fan groups).

## Current policy source

- `lib/offline/operation-contract.ts`

## Queue implementation

- `lib/offline/mutation-queue.ts`

Queue behavior in this phase:

- Only operations marked `queueWhenOffline: true` are queued.
- Queue stores operation key, payload, artist scope and attempt counter.
- Queue publishes changes via `clser:offline-mutation-queue:changed`.
- When network returns, queue is flushed through `services/offlineMutationSync.ts`.
- In local fallback mode (sem Supabase), queued mutations are persisted as synced locally.
- With Supabase configured, queued mutations are inserted in `public.fan_activity_events` and only then removed from queue.

## Operations already wired

- `fan.like_post`
- `fan.comment_post`
- `fan.vote_poll`
- `fan.like_mural`
- `fan.like_fan_art`
- `fan.join_group`

## Next step in Phase 4

- Keep optimistic UI behavior and only clear queue on confirmed server write.
- Add retry strategy by error class (network, auth, validation).
- Expand from event-log syncing to domain-level writes (likes/comments/polls/groups) as backend endpoints are introduced.

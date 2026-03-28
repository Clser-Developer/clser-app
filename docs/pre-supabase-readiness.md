# Pre-Supabase Readiness

## Phase 0 - Mobile shell hardening

Status: **done (core)**

- Safe-area variables and utility classes configured.
- Bottom navigation spacing reservation configured.
- App shell no longer constrained by fake device frame.

## Phase 1 - Multi-smartphone QA

Status: **in progress**

- Matrix/checklist documented in [mobile-qa-matrix.md](/Users/andremarangon/Documents/_Projetos%20Nocode/app_clser/docs/mobile-qa-matrix.md).
- Automated regression (`test`/`tsc`/`build`) green.
- Automated smoke QA across full viewport/orientation matrix passed:
  - report: [mobile-qa-report-2026-03-26.md](/Users/andremarangon/Documents/_Projetos%20Nocode/app-clser-bkp%20(antigo)/docs/mobile-qa-report-2026-03-26.md)
- Manual viewport/device sign-off still required.

## Phase 2 - Frontend pre-backend refactor

Status: **partially done**

- Account state isolation by `internalUserId` implemented.
- Billing state isolation by account scope implemented.
- Local storage now uses centralized adapter in key modules.
- `isStorageAvailable` centralized in `lib/storage.ts` and reused by billing/offline queue.
- Entry/auth flow fixed:
  - register flow opens correctly
  - session authentication no longer auto-restores silently after reload.
- Internationalization hardening:
  - `cpf` replaced by optional `taxId` in account/billing flows.
  - billing/profile forms no longer require Brazilian-only fields.
- Domain extraction started in `ArtistPage`:
  - fan engagement actions moved to `hooks/useArtistFanEngagement.ts`.
  - media connection flow moved to `hooks/useArtistMediaConnections.ts`.
  - community publishing actions moved to `hooks/useArtistCommunityPublishing.ts`.
  - commerce and checkout handlers moved to `hooks/useArtistCommerceHandlers.ts`.
- Fan entry flow extraction started in `App.tsx`:
  - gateway/login/browse/session state transitions moved to `hooks/useFanFlowState.ts`.
- Artist membership orchestration extracted from `App.tsx`:
  - loading/ensuring memberships and artist subscription derivations moved to `hooks/useArtistMemberships.ts`.
- Fan entry/session view routing decomposed from `App.tsx`:
  - stage screens moved to `components/fan/FanStageRouter.tsx`.
  - selected-artist access surface moved to `components/fan/SelectedArtistAccess.tsx`.
  - authenticated fan session shell moved to `components/fan/FanSessionView.tsx` (preserving lazy `ArtistPage` chunking).
  - account error dialog moved to `components/AppErrorModal.tsx`.
- Artist navigation orchestration extracted from `components/ArtistPage.tsx`:
  - section/subsection routing and reset behavior moved to `hooks/useArtistNavigation.ts`.
- Artist data loading extracted from `components/ArtistPage.tsx`:
  - feed/store/media/profile/comments loaders moved to `hooks/useArtistDataLoading.ts`.
- Artist modal/overlay surface extracted from `components/ArtistPage.tsx`:
  - checkout, feedback, media and support modals moved to `components/artist/ArtistPageOverlays.tsx`.
- Artist section rendering extracted from `components/ArtistPage.tsx`:
  - timeline/media/store/fan/profile view composition moved to `components/artist/ArtistPageSections.tsx`.

Remaining:

- Further decomposition of large files (`App.tsx`, `components/ArtistPage.tsx`) into domain modules/hooks.
- Continue decomposition of remaining UI/navigation handlers in `ArtistPage`.

## Phase 3 - PWA base

Status: **done**

- Manifest + icons + service worker generation configured.
- Install/update prompts implemented.
- Offline shell active.
- Dev SW generation disabled to avoid noisy warnings in local development.

## Phase 4 - Offline x backend contract

Status: **done (pre-backend baseline)**

- Operation policy mapped by scope.
- Offline queue + event system implemented.
- Real queue executor introduced:
  - local fallback marks as synced locally
  - Supabase mode writes to `fan_activity_events`.

## Gate before Supabase wiring

1. Execute manual QA matrix in all target viewports/orientations.
2. Complete decomposition of `App.tsx` and `ArtistPage.tsx` by domain.

# Supabase Phase 4 Notes

## Infra added

- `@supabase/supabase-js` dependency.
- `lib/supabase/client.ts` with env-based client creation.
- `.env.example` with:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- `services/accountRepository.ts`:
  - Local fallback repository (localStorage).
  - Supabase repository (`accounts` table contract).

## App wiring done

- Onboarding now registers account with `services/authService.ts`:
  - Supabase Auth (`signUp`) when env vars exist.
  - Local fallback credential store when env vars are missing.
- Login now uses `authService` (`signInWithPassword` on Supabase or local fallback).
- Artist memberships now go through `services/membershipRepository.ts`:
  - Supabase `artist_memberships` when configured.
  - Local per-user fallback storage otherwise.
- Artist/Fan data reads are now routed through `services/artistDataRepository.ts`
  so UI is no longer directly coupled to `mockApiService` imports.
- Offline mutation queue now has a real executor (`services/offlineMutationSync.ts`):
  - local fallback marks queued mutations as locally synced.
  - Supabase mode writes queued mutations into `fan_activity_events`.

## Supabase setup

1. Run [supabase-schema.sql](/Users/andremarangon/Documents/_Projetos%20Nocode/app_clser/docs/supabase-schema.sql) in Supabase SQL Editor.
2. In project root, create `.env.local` with:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
3. Restart dev server (`npm run dev`).

If env vars are absent, app remains functional in local fallback mode.

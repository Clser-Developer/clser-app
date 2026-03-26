# Mobile QA Matrix (Pre-Supabase)

## Target viewports

- `320x568` (small legacy)
- `360x640` (baseline Android)
- `375x667` (older iPhone)
- `390x844` (modern iPhone)
- `412x915` (large Android)
- `430x932` (iPhone Pro Max)

## Orientation

- Portrait
- Landscape

## Critical flows to verify

1. Fan entry:
   - `Sou Fã` -> `Cadastrar` -> onboarding steps.
   - `Sou Fã` -> `Já tem uma conta? Entre`.
   - `Sou Fã` -> `Entrar sem login` -> escolha de artistas.
2. Artist selection:
   - Artist cards clickable.
   - Redirect rules:
     - no account: artist -> onboarding
     - account + logged out: artist -> login
     - account + authenticated: artist -> artist area
3. Navigation shell:
   - Bottom nav stays fixed.
   - Section changes open from top.
   - No overlap with safe area/inset on iOS/Android.
4. Commerce:
   - Product modal CTA visible in all target sizes.
   - Cart and checkout steps accessible without clipping.
5. Modals:
   - Rounded corners all around.
   - No overflow outside viewport on small devices.
   - Action buttons always reachable.

## Current status

- Safe-area CSS and fixed bottom-nav spacing are active (`styles/globals.css`).
- Scroll-to-top behavior on section switches is active.
- Core regression checks (`npm test`, `tsc`, `build`) are passing.
- Manual device-by-device sign-off remains required before production release.


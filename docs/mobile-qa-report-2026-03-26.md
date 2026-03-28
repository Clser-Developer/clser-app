# Mobile QA Smoke Report (2026-03-26)

Base URL: `http://127.0.0.1:4173`
Total checks: **36**
Passed: **36**
Failed: **0**

| Viewport | Orientation | Check | Status | Notes |
|---|---|---|---|---|
| 320x568 | portrait | guest-entry | PASS | - |
| 320x568 | portrait | invalid-login | PASS | - |
| 320x568 | portrait | auth-shell | PASS | - |
| 320x568 | landscape | guest-entry | PASS | - |
| 320x568 | landscape | invalid-login | PASS | - |
| 320x568 | landscape | auth-shell | PASS | - |
| 360x640 | portrait | guest-entry | PASS | - |
| 360x640 | portrait | invalid-login | PASS | - |
| 360x640 | portrait | auth-shell | PASS | - |
| 360x640 | landscape | guest-entry | PASS | - |
| 360x640 | landscape | invalid-login | PASS | - |
| 360x640 | landscape | auth-shell | PASS | - |
| 375x667 | portrait | guest-entry | PASS | - |
| 375x667 | portrait | invalid-login | PASS | - |
| 375x667 | portrait | auth-shell | PASS | - |
| 375x667 | landscape | guest-entry | PASS | - |
| 375x667 | landscape | invalid-login | PASS | - |
| 375x667 | landscape | auth-shell | PASS | - |
| 390x844 | portrait | guest-entry | PASS | - |
| 390x844 | portrait | invalid-login | PASS | - |
| 390x844 | portrait | auth-shell | PASS | - |
| 390x844 | landscape | guest-entry | PASS | - |
| 390x844 | landscape | invalid-login | PASS | - |
| 390x844 | landscape | auth-shell | PASS | - |
| 412x915 | portrait | guest-entry | PASS | - |
| 412x915 | portrait | invalid-login | PASS | - |
| 412x915 | portrait | auth-shell | PASS | - |
| 412x915 | landscape | guest-entry | PASS | - |
| 412x915 | landscape | invalid-login | PASS | - |
| 412x915 | landscape | auth-shell | PASS | - |
| 430x932 | portrait | guest-entry | PASS | - |
| 430x932 | portrait | invalid-login | PASS | - |
| 430x932 | portrait | auth-shell | PASS | - |
| 430x932 | landscape | guest-entry | PASS | - |
| 430x932 | landscape | invalid-login | PASS | - |
| 430x932 | landscape | auth-shell | PASS | - |

## Coverage
- `guest-entry`: Sou Fã -> Entrar sem login -> seleção de artista -> onboarding.
- `invalid-login`: Sou Fã -> Login com conta inválida -> modal de erro.
- `auth-shell`: login com conta seed -> bottom nav fixa -> clique Loja/Feed + scroll reset.

## Manual Follow-up Required
- Confirmar aparência visual fina em dispositivos reais iOS/Android.
- Validar teclado virtual e safe-area com notch/dynamic island.
- Validar autofill OTP em iOS Safari e Android Chrome.

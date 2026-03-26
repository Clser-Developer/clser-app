# Clser

Aplicacao React + Vite para explorar experiencias, conteudo e comunidade entre artistas e fas.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Estrutura atual

- `App.tsx` coordena a escolha entre fluxo de fa e fluxo de artista.
- `hooks/useGlobalUserState.ts` persiste o estado global do usuario.
- `hooks/usePersistentArtistState.ts` persiste o estado por artista.
- `services/mockApiService.ts` concentra os dados simulados usados pela interface.

## Observacoes

- O projeto nao depende mais de Google AI Studio nem de `GEMINI_API_KEY`.
- Ainda existe oportunidade de dividir arquivos grandes como `App.tsx` e `components/ArtistPage.tsx`.

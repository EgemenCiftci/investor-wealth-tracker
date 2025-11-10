## Quick context for AI coding agents

This is an Angular (v20) single-page app that uses Firebase Realtime Database for storage and NgRx for client state management. Use these notes to make safe, idiomatic changes and to find the right places to modify behavior.

- App bootstrap: `src/main.ts` uses Angular's standalone `bootstrapApplication` and registers providers via `importProvidersFrom(...)`. Do not add global module imports — prefer adding providers in `bootstrapApplication` or using `providedIn: 'root'` for services.
- Routing: `src/app/app-routing.module.ts` uses lazy-loaded standalone components via `loadComponent(...)` and an `authenticationGuard` for protected routes.
- State: NgRx store is configured in `src/main.ts` with two reducers: `entriesReducer` and `progressReducer` (see `src/app/reducers/*`). Actions live in `src/app/actions/` and side-effects are in `src/app/effects/entries.effects.ts`.
- Data model & persistence: Entries are saved per-user in Firebase Realtime DB under `users/{uid}/entries/{YYYY-MM-DD}` using date strings produced by `EntriesService.formatDate()` (see `src/app/services/entries.service.ts`). Rates are stored on each entry in `entry.rates` keyed by currency code.
- External APIs: Currency data and historical rates are fetched from OpenExchangeRates in `src/app/services/rates.service.ts`. The API key is in `src/environment.ts` (`openExchangeRatesConfig.appId`).
- Authentication: Firebase Auth is used (`src/app/services/authentication.service.ts`). The app expects email verification (`isLoggedIn()` checks `emailVerified`) and may persist the user in localStorage when "remember me" is used. Deleting a user requires reauthentication.

Important conventions and patterns
- Reducers use `cloneDeep` (lodash) and mutate the cloned state. When adding new state fields, update `AppState` in `src/app/reducers/entries.reducer.ts` and ensure effects/selectors reference them.
- Date keys: many flows identify entries by date value equality (`entry.date.getTime()`); when adding comparisons, ensure date equality uses getTime().
- Rates base: `RatesService.base` is `'USD'`. Effects and components assume rates are normalized to that base.
- UI patterns: components use OnPush change detection and standalone material imports (see `src/app/components/*/*.ts`). Prefer immutable updates to keep UI reactive.
- Dialogs & Snackbars: `DialogService` and `SnackBarService` are used by effects (e.g. `EntriesEffects`) — use them for confirmations and user messages to stay consistent.

Developer workflows / common commands
- Install dependencies: `npm install` (Windows PowerShell accepted)
- Run dev server: `npm start` or `ng serve` (default port 4200)
- Build for production: `npm run build` (uses Angular build)
- Run tests: `npm test` (Karma)

Files to check for changes when touching a feature
- UI + routing: `src/app/components/*` and `src/app/app-routing.module.ts`
- State changes: `src/app/actions/*.ts`, `src/app/reducers/*.ts`, `src/app/effects/*.ts`
- Persistence & API keys: `src/app/services/entries.service.ts`, `src/app/services/rates.service.ts`, `src/environment.ts`, `firebase.json`
- Auth changes: `src/app/services/authentication.service.ts`, `src/app/guards/authentication.guard.ts`

Small examples / snippets to follow
- If you need to add a new action that updates entries:
  1. Add action in `src/app/actions/entries.actions.ts`.
  2. Handle it in `entries.reducer.ts` using `cloneDeep` and return the cloned state.
  3. If it triggers side effects (network, dialogs), add an effect in `src/app/effects/entries.effects.ts` and dispatch `progress` actions for UI feedback.

- To fetch historical rates for an entry date, look at `fillRates` effect which calls `RatesService.getRates(entryDate, keys)` and then merges `fillRatesSuccess` into the reducer.

Debugging notes
- The app boots with `bootstrapApplication`, so errors during provider registration appear early in console — check `src/main.ts` first for missing imports/providers.
- Firebase DB structure is Realtime DB (not Firestore) — inspect `src/environment.ts` and `firebase.json` when troubleshooting sync issues.

Constraints for automated edits
- Never expose or rotate secrets — `src/environment.ts` currently contains keys used by the running app; do not commit new secrets.
- When changing storage schema (entry keys, rates shape), add a migration note and update both `EntriesService` and `entries.reducer`/effects.

If anything below is unclear or you'd like more examples (tests, how to add a new reducer+effect, or how to mock Firebase in tests), tell me which area to expand.

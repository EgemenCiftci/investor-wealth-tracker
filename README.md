# Investor Wealth Tracker

Investor Wealth Tracker is a web application to track your assets and debts, supporting multiple currencies with automatic conversion to USD. It provides a dashboard, entry management, and user authentication.

## Features

- Add, edit, and remove entries for assets and debts
- Support for multiple asset and debt types
- Automatic currency conversion using up-to-date exchange rates
- Track net worth over time
- User authentication (email/password & Google)
- Download or delete your data
- Responsive UI built with Angular Material

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/egemen-ciftci/investor-wealth-tracker.git
   cd investor-wealth-tracker
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure Firebase and API keys:**
   - Copy your Firebase config to `src/environment.ts` as `firebaseConfig`
   - Add your OpenExchangeRates API key to `src/environment.ts` in the `openExchangeRatesConfig.appId` field
   - Refer to [src/environment.ts](src/environment.ts) for the expected structure

4. **Run the application:**
   ```
   npm start
   ```
   or
   ```
   ng serve
   ```

5. **Open in browser:**
   - Visit [http://localhost:4200](http://localhost:4200)

## Development Commands

- **Run tests:**
  ```
  npm test
  ```

- **Build for production:**
  ```
  npm run build
  ```

- **Build with esbuild:**
  ```
  ng b
  ```

## Tech Stack

- **Framework:** [Angular](https://angular.dev/) v20 with standalone components
- **State Management:** [NgRx](https://ngrx.io/) (store, reducers, actions, effects)
- **Database:** [Firebase](https://firebase.google.com/) Realtime Database & Authentication
- **UI Components:** [Angular Material](https://material.angular.io/)
- **APIs:** OpenExchangeRates for currency conversion
- **Testing:** Karma & Jasmine
- **Build System:** Angular CLI with esbuild

## Project Structure

- `src/main.ts` – Application bootstrap using standalone `bootstrapApplication` with NgRx store configuration
- `src/app/components/` – UI components (dashboard, entries, login, register, edit, about, dialog, header)
- `src/app/models/` – Data models (Entry, Asset, Debt, Currency, etc.)
- `src/app/reducers/` – NgRx reducers (`entriesReducer`, `progressReducer`) for state management
- `src/app/actions/` – NgRx actions (entries and progress actions)
- `src/app/effects/` – NgRx effects for side effects (HTTP calls, Firebase operations, dialogs)
- `src/app/services/` – Services:
  - `AuthenticationService` – Firebase Auth integration with email verification
  - `EntriesService` – Firebase Realtime DB operations (users/{uid}/entries/{YYYY-MM-DD})
  - `RatesService` – OpenExchangeRates API integration for currency conversion
  - `DialogService` – Material dialog utilities
  - `SnackBarService` – Material snackbar notifications
- `src/app/guards/` – Route guards (authentication guard for protected routes)
- `src/app/pipes/` – Custom Angular pipes (camelCaseToSpaces, total calculation)
- `src/app/enums/` – Enumerations (assetTypes, debtTypes)

## License

MIT License

---

**Author:** [Egemen Çiftci](https://egemen-ciftci.web.app/)
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
   git clone https://github.com/yourusername/investor-wealth-tracker.git
   cd investor-wealth-tracker
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure Firebase:**
   - Copy your Firebase config to `src/environment.ts` as `firebaseConfig`.

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

## Tech Stack

- [Angular](https://angular.io/)
- [Firebase](https://firebase.google.com/)
- [NgRx](https://ngrx.io/) for state management
- [Angular Material](https://material.angular.io/)

## Project Structure

- `src/app/components/` – UI components (dashboard, entries, login, register, edit, etc.)
- `src/app/models/` – Data models (Entry, Asset, Debt, etc.)
- `src/app/reducers/` – NgRx reducers for state management
- `src/app/actions/` – NgRx actions
- `src/app/effects/` – NgRx effects for side effects (e.g., API calls)
- `src/app/services/` – Services for authentication, rates, data, etc.

## License

MIT License

---

**Author:** [Egemen Çiftci](https://egemen-ciftci.web.app/)
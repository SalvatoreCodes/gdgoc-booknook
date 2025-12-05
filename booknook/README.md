# BookNook

A minimalist book borrowing and purchasing SPA built with React, Tailwind CSS, and Lucide Icons.

## Features

- **Account-Based Login**: Demo accounts with per-user data persistence
- **Browse Books**: Grid layout of available books with pricing and details
- **Borrow Books**: 14-day free borrowing with real-time countdown timer
- **Buy Books**: Simulated card payment flow for purchasing
- **Track Borrowed Books**: Monitor due dates and overdue status
- **Late Return Fees**: $2/day charge for books returned after 3-day grace period
- **Persistent Storage**: All user data saved to localStorage

## Demo Accounts

| Username | Password | Books |
|----------|----------|-------|
| `alice` | `password123` | Designing Calm (borrowed), The First Chapter (owned) |
| `bob` | `letmein` | Small Things (owned) |

## Tech Stack

- **React 18**: Component framework with hooks
- **Vite 5.4.21**: Lightning-fast build tool with HMR
- **Tailwind CSS 3.4.8**: Utility-first styling with custom Google color palette
- **Lucide Icons 0.269.0**: Clean SVG icons
- **PostCSS & Autoprefixer**: CSS processing pipeline

## Quick Start

### 1. Install Dependencies

```bash
cd d:\gdgoc\booknook
npm install
```

### 2. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation & user greeting
│   ├── LoginScreen.jsx     # Authentication entry point
│   ├── Browse.jsx          # Book grid for browsing
│   ├── BookCard.jsx        # Individual book display
│   ├── MyBooks.jsx         # User's borrowed & owned books
│   ├── BorrowTimer.jsx     # Live countdown & overdue status
│   ├── PaymentModal.jsx    # Card payment simulation
│   └── LateFeeModal.jsx    # Late return fee collection
├── hooks/
│   └── useLocalStorage.js  # Custom hook for persistent state
├── utils.js                # Utility functions (fmtPrice, addDays, shortDate)
├── styles/
│   └── index.css           # Tailwind directives & custom utilities
├── main.jsx                # React entry point
├── App.jsx                 # Main app orchestration
└── index.html              # HTML entry point
```

## Key Business Logic

### Borrowing Flow
1. User clicks **Borrow** on a book card
2. System creates borrowed item with 14-day due date
3. Item appears in **My Books** tab with live countdown timer
4. User can mark book as **Received** (visual confirmation)

### Return Flow
1. User clicks **Return** on a borrowed book
2. If overdue (>3 days from borrow date):
   - Late fee modal appears: $2 per day overdue
   - User must pay fee to complete return
3. If on-time (≤3 days):
   - Book removed immediately, no fee

### Buying Flow
1. User clicks **Buy** on a book card
2. Payment modal appears with card form
3. Simulates 1.4–2.4s processing
4. Book added to **My Books** as owned item

### Data Persistence

- Per-user book list stored in localStorage as `booknook_items_<username>`
- Current user stored in `booknook_user`
- Active tab stored in `booknook_active`
- All data cleared on logout

## Mock Data

### Books (8 titles)
Each book has: id, title, author, price, and seed (for consistent placeholder images)

### Accounts (2 demo users)
- **alice** / password123 — has 1 borrowed & 1 owned book
- **bob** / letmein — has 1 owned book


## Color Palette

Google-inspired minimalist colors:
- **Blue**: `#4285F4` (primary actions, BookNook logo)
- **Red**: `#EA4335` (alerts, late fees)
- **Yellow**: `#FBBC05` (accents)
- **Green**: `#34A853` (confirmations, received status)

## Development Notes

- Book images use seed-based placeholder service (picsum.photos)
- Timer updates every 1 second for real-time countdown
- All transactions are simulated; no real payment processing
- State persists across page reloads via localStorage
- Components are modular and accept clean prop interfaces

## Firebase (optional)

This project can integrate with Firebase Auth and Firestore to persist users, the book catalog, and per-user libraries.

Setup:

1. Create a Firebase project and enable **Authentication (Email/Password)** and **Firestore**.
2. Add Firebase config to a file at the project root named `.env.local` with Vite variables:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Install dependencies and start the app:

```powershell
cd d:\gdgoc\booknook
npm install
npm run dev
```

Seeding the `books` collection:

This repo includes `scripts/seedFirestore.js` which uses the Firebase Admin SDK to push the embedded `MOCK_BOOKS` into your Firestore `books` collection.

Prerequisites:
- Create a Firebase service account and download its JSON key.
- Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of that JSON file.

Then run:

```powershell
npm run seed:books
```

Firestore rules example:

- File: `firestore.rules` (provided in the project root)
- Deploy rules using the Firebase CLI:

```powershell
firebase deploy --only firestore:rules
```

Security notes:
- The example rules allow public reads of `books`, and restrict reads/writes for `users/{uid}` and `user_books/{uid}` to the authenticated user with the same UID. Adjust rules to your needs for production.


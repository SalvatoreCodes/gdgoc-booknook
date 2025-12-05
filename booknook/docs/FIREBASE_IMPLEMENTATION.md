# Firebase Implementation (Plain English)

This document explains, step-by-step and in simple terms, how Firebase is used in BookNook and how to set it up locally.

Overview
- Firebase Auth: handles signing up and signing in with email/password.
- Firestore: stores the books catalog (`books`) and each user's library (`user_books/<uid>`), plus a small `users/<uid>` profile doc.

Why this structure?
- `books` is the shared catalog everyone browses.
- `user_books/<uid>` holds the current user's borrowed/owned items so each user has their own library.
- `users/<uid>` stores the user's profile (display name, username, email) separate from library items.

Step-by-step setup (for non-technical readers)
1. Create a Firebase project
   - Go to https://console.firebase.google.com and make a new project.
   - In the project, enable **Authentication** and choose **Email/Password** as a sign-in method.
   - Enable **Firestore** and create a database in test or production mode.

2. Get configuration values
   - In the Firebase console, open Project Settings ➜ Your apps and add a new Web app if you don't have one.
   - Copy the `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId` values.
   - Add them to a file named `.env.local` at the project root (these are harmless client-side keys for connecting to Firebase):

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Install dependencies
   - In the project root run:

```powershell
cd d:\gdgoc\booknook
npm install
```

If `npm install` fails because of the `firebase` package version (some npm registries or caches can be out-of-date), try:

```powershell
npm cache clean --force
npm install --legacy-peer-deps
```

If that still fails, see the Troubleshooting section at the end of this doc.

4. Seed the `books` collection (optional but useful)
   - The repo includes a script to add the built-in catalog to Firestore using the Admin SDK. This requires a service account JSON file from the Firebase console (Project settings ➜ Service accounts ➜ Generate new private key).
   - Save the JSON file somewhere on your machine, then set an environment variable so the seed script can find it:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\service-account.json'
npm run seed:books
```

This will write the sample catalog to `books` in your Firestore.

5. Run the app

```powershell
npm run dev
```

Open the app at `http://localhost:5173` (Vite's default). Sign up with an email and password, then the app will save your library to Firestore under `user_books/<your-uid>`.

How the code uses Firebase (plain language)
- `src/firebase.js` initializes a Firebase client using the Vite env variables. It exports `auth` (for login/signup) and `db` (for Firestore reads/writes).
- `src/App.jsx` listens for authentication state changes (who's signed in). When someone signs in it:
  1. Loads the user's profile doc `users/<uid>` (if present) for display name.
  2. Loads `user_books/<uid>` and sets the app state to show that user's borrowed/owned items.
  3. When the user's library changes (borrow, return, buy), the app saves the updated list back to `user_books/<uid>`.

Important detail (why we made a small change):
- When a user signs in, the app first learns "who" the user is and then asks Firestore for that user's saved books. There was a timing issue where the app would try to save an empty list before the saved list was loaded — this could overwrite the saved library with an empty list.
- Fix implemented: the app now waits until the initial load of `user_books` completes before it begins saving changes. This avoids accidental overwrites.

Firestore document layout (what you'll see in the console)
- `books` (collection)
  - document id (string) -> fields: `title`, `author`, `price`, `isbn`, etc.
- `users` (collection)
  - `<uid>` -> fields: `username`, `email`, `displayName`
- `user_books` (collection)
  - `<uid>` -> fields: `items` (array) where each item is a borrowed/owned book instance with `instanceId`, `id` (book id), `type` (`borrowed` or `owned`), `borrowDate`, `dueDate`, etc.

Tips and troubleshooting
- If `npm install` fails for `firebase` with version errors (ETARGET), try clearing the npm cache and using `--legacy-peer-deps` as shown above.
- As a last resort, the app can be run without installing the Firebase npm package by using the Firebase CDN in `index.html` and adjusting imports — contact me if you'd like that fallback and I will add it.
- If seeding fails, ensure `GOOGLE_APPLICATION_CREDENTIALS` points to the service account JSON and that the account has permissions for Firestore.

If you'd like, I can also:
- Add a small admin page to view the Firestore collections from the app (developer-only view).
- Implement the CDN fallback so the app runs even if `npm install` is not possible in your environment.

---
Created by BookNook dev tooling. If any step is unclear, tell me which part and I will expand it further with screenshots or exact console commands tailored to your machine.

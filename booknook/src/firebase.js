import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBSR7jktiEf-Dx2ZuSd7Wod1rLd8Lvvbnc",
  authDomain: "library-app-c2de6.firebaseapp.com",
  projectId: "library-app-c2de6",
  storageBucket: "library-app-c2de6.firebasestorage.app",
  messagingSenderId: "883170901168",
  appId: "1:883170901168:web:e570b9db2e2bd0aa994f75",
  measurementId: "G-6X62Y0LS3B"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app

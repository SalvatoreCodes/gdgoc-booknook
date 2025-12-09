// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSR7jktiEf-Dx2ZuSd7Wod1rLd8Lvvbnc",
  authDomain: "library-app-c2de6.firebaseapp.com",
  projectId: "library-app-c2de6",
  storageBucket: "library-app-c2de6.firebasestorage.app",
  messagingSenderId: "883170901168",
  appId: "1:883170901168:web:e570b9db2e2bd0aa994f75",
  measurementId: "G-6X62Y0LS3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
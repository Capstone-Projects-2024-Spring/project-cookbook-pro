/**
 * Firebase initialization and configuration.
 * @typedef {Object} FirebaseConfig
 * @property {string} apiKey - Firebase API key.
 * @property {string} authDomain - Firebase authentication domain.
 * @property {string} projectId - Firebase project ID.
 * @property {string} storageBucket - Firebase storage bucket.
 * @property {string} messagingSenderId - Firebase messaging sender ID.
 * @property {string} appId - Firebase application ID.
 * @property {string} measurementId - Firebase measurement ID.
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// Web app firebase config
/**
 * Firebase configuration object.
 * @type {FirebaseConfig}
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize references to our Firebase project for references elsewhere in the application

/**
 * Firebase application instance.
 * @type {import("firebase/app").FirebaseApp}
 */
const firebaseApp = initializeApp(firebaseConfig);

/**
 * Firebase authentication instance.
 * @type {import("firebase/auth").Auth}
 */
const firebaseAuth = getAuth(firebaseApp);

/**
 * Firestore database instance.
 * @type {import("@firebase/firestore").Firestore}
 */
const firestoreDb = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firestoreDb };

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjtknvyyLO6aB2gF-lONxPGyu3sypZIpI",
  authDomain: "house-d9a01.firebaseapp.com",
  projectId: "house-d9a01",
  storageBucket: "house-d9a01.firebasestorage.app",
  messagingSenderId: "739342841322",
  appId: "1:739342841322:web:4e1703d490f91be0df6e93",
  measurementId: "G-CMDJK6CLG7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhjaLNtTUweWDQ-3MHO5ikhLrbfwFC0tI",
  authDomain: "samdb-c9a1c.firebaseapp.com",
  projectId: "samdb-c9a1c",
  storageBucket: "samdb-c9a1c.appspot.com",
  messagingSenderId: "470585313604",
  appId: "1:470585313604:web:4fd4bf03e0a4ba9805af11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Predefined Collections (Easy Access if you want)
export const likedCollection = collection(db, "liked");
export const watchlistCollection = collection(db, "watchlist");
export const listsCollection = collection(db, "lists");

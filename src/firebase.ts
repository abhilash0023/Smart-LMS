// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB9277TJsfM1wzttsHsqspPAEtK9LKJ0Y",
  authDomain: "learn-7891b.firebaseapp.com",
  projectId: "learn-7891b",
  storageBucket: "learn-7891b.firebasestorage.app",
  messagingSenderId: "755092441717",
  appId: "1:755092441717:web:8738dfdbb3157b9ab5863c",
  measurementId: "G-B4D985RMCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

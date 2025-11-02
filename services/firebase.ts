import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCFJUwY_T92ftP6Hks5hejPTkCVSsPF-ew",
  authDomain: "rakhiproject-3fbd6.firebaseapp.com",
  projectId: "rakhiproject-3fbd6",
  storageBucket: "rakhiproject-3fbd6.firebasestorage.app",
  messagingSenderId: "143451905459",
  appId: "1:143451905459:web:0aa60a95f7387440e2ffc6",
  measurementId: "G-XDVTXJ1Q4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

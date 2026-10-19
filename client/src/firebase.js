// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-f0f10.firebaseapp.com",
  projectId: "mern-estate-f0f10",
  storageBucket: "mern-estate-f0f10.firebasestorage.app",
  messagingSenderId: "717682543331",
  appId: "1:717682543331:web:0e09a6eb418c34569213d6"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
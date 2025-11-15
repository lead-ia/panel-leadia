import { initializeApp } from "firebase/app";

const config = {
  apiKey: "AIzaSyDCNqGh-L5rNiiDQ-5vByQ6chb1R1k7JA0",
  authDomain: "leadiaweb.firebaseapp.com",
  projectId: "leadiaweb",
  storageBucket: "leadiaweb.firebasestorage.app",
  messagingSenderId: "799575129374",
  appId: "1:799575129374:web:82c04365dda6ef6ddc5d0f",
  measurementId: "G-DKY3XQ46VQ"
};

// Initialize Firebase
const app = initializeApp(config);
export { app };
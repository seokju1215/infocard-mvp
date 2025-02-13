// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPKwDzuYYyCftvcHwn4vg0-6lewG7ktSQ",
  authDomain: "infocardmvp.firebaseapp.com",
  projectId: "infocardmvp",
  storageBucket: "infocardmvp.firebasestorage.app",
  messagingSenderId: "435228471308",
  appId: "1:435228471308:web:f0504d208ed9e9f6c7fe29",
  measurementId: "G-97YBFZZEE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

alert("🔥 Firebase 초기화 완료");

export {db};
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbYV1Lv5V2SsxXFM1FaGlzj8lpxhKi_mE",
  authDomain: "propertypro-39565.firebaseapp.com",
  projectId: "propertypro-39565",
  storageBucket: "propertypro-39565.firebasestorage.app",
  messagingSenderId: "408555647727",
  appId: "1:408555647727:web:b38758863f621d11fd611a",
  measurementId: "G-5X4Y4LM7DH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

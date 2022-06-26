
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJQBi_1RykHtucbq88Lf9SukhFxmqLf24",
  authDomain: "agencija-za-nekretnine-b4fc0.firebaseapp.com",
  projectId: "agencija-za-nekretnine-b4fc0",
  storageBucket: "agencija-za-nekretnine-b4fc0.appspot.com",
  messagingSenderId: "711731049287",
  appId: "1:711731049287:web:9d3ca8748e514d8cb75262"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore()
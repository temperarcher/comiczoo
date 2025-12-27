//  apiKey: "AIzaSyCMWWtqeymGjCxQiQbGcIEZUAEkhaUt-TI",
//  authDomain: "comiczoo.firebaseapp.com",
//  projectId: "comiczoo",
//  storageBucket: "comiczoo.firebasestorage.app",
//  messagingSenderId: "854173216358",
//  appId: "1:854173216358:web:3b0485ceab341046f907a7"
// firebase-config.js

// Firebase SDK v9 (modulare)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMWWtqeymGjCxQiQbGcIEZUAEkhaUt-TI",
  authDomain: "comiczoo.firebaseapp.com",
  projectId: "comiczoo",
  storageBucket: "comiczoo.firebasestorage.app",
  messagingSenderId: "854173216358",
  appId: "1:854173216358:web:3b0485ceab341046f907a7"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

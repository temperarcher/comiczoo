//  apiKey: "AIzaSyCMWWtqeymGjCxQiQbGcIEZUAEkhaUt-TI",
//  authDomain: "comiczoo.firebaseapp.com",
//  projectId: "comiczoo",
//  storageBucket: "comiczoo.firebasestorage.app",
//  messagingSenderId: "854173216358",
//  appId: "1:854173216358:web:3b0485ceab341046f907a7"
// firebase-config.js

// Importa i moduli di Firebase necessari
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Configurazione di Firebase (prendi i dati dal tuo progetto Firebase)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMWWtqeymGjCxQiQbGcIEZUAEkhaUt-TI",
  authDomain: "comiczoo.firebaseapp.com",
  projectId: "comiczoo",
  storageBucket: "comiczoo.firebasestorage.app",
  messagingSenderId: "854173216358",
  appId: "1:854173216358:web:3b0485ceab341046f907a7"
};


// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Firestore e Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, GoogleAuthProvider, signInWithPopup, signOut };

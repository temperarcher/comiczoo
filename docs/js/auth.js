import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

export function login() {
  signInWithPopup(auth, provider);
}

export function logout() {
  signOut(auth);
}

export function observeAuth(callback) {
  onAuthStateChanged(auth, callback);
}

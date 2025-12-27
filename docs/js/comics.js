import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function getUserComics(uid) {
  const ref = collection(db, "users", uid, "comics");
  const snap = await getDocs(ref);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addComic(uid, comic) {
  const ref = collection(db, "users", uid, "comics");
  await addDoc(ref, comic);
}

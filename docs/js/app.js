import { auth, db, GoogleAuthProvider, signInWithPopup, signOut } from "./firebase-config.js";
import { getUserComics, addComic } from "./comics.js";

const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const comicForm = document.getElementById("comic-form");
const comicsList = document.getElementById("comics");

loginBtn.onclick = login;
logoutBtn.onclick = logout;

// Funzione per il submit del form
comicForm.onsubmit = async (event) => {
  event.preventDefault();  // Evita il comportamento di submit predefinito del form

  const title = document.getElementById("title").value;
  const series = document.getElementById("series").value;
  const publisher = document.getElementById("publisher").value;
  const annata = document.getElementById("annata").value;
  const collana = document.getElementById("collana").value;
  const testata = document.getElementById("testata").value;
  const publicationDate = document.getElementById("publicationDate").value;
  const publisherCode = document.getElementById("publisherCode").value;
  const condition = document.getElementById("condition").value;
  const value = document.getElementById("value").value;
  const cover = document.getElementById("cover").value;

  // Recupera l'ID dell'utente autenticato
  const user = auth.currentUser;  // Usa auth da firebase-config
  if (user) {
    // Crea un oggetto fumetto con i nuovi campi
    const comic = {
      title,
      series,
      publisher,
      annata: annata || null,  // Facoltativo
      collana: collana || null, // Facoltativo
      testata: testata || null, // Facoltativo
      publicationDate: publicationDate ? new Date(publicationDate) : null,
      publisherCode,
      condition,
      value: parseFloat(value),
      coverUrl: cover || "placeholder-cover.jpg",  // Se non c'è un URL, usa un'immagine di default
      addedAt: new Date()  // Timestamp per quando il fumetto è stato aggiunto
    };

    // Aggiungi il fumetto a Firestore
    await addComic(user.uid, comic);

    // Rendi il modulo vuoto dopo l'invio
    comicForm.reset();
  }
};

async function observeAuth(callback) {
  auth.onAuthStateChanged(callback);
}

observeAuth(async (user) => {
  if (!user) {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    comicsList.innerHTML = "";
    return;
  }

  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";

  // Carica e mostra i fumetti dell'utente
  const comics = await getUserComics(user.uid);
  renderComics(comics);
});

function renderComics(comics) {
  comicsList.innerHTML = comics.map(c => `
    <div class="comic-card">
      <h3>${c.title}</h3>
      <p>${c.series} (${c.publicationDate.toLocaleDateString()})</p>
      <p>${c.publisher}</p>
      <p>Annata: ${c.annata || 'N/A'}</p>
      <p>Collana: ${c.collana || 'N/A'}</p>
      <p>Testata: ${c.testata || 'N/A'}</p>
      <p>Condizione: ${c.condition}</p>
      <p>Valore: €${c.value}</p>
      <img src="${c.coverUrl}" alt="${c.title}" width="150">
    </div>
  `).join("");
}

async function login() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // Puoi accedere al result, che contiene l'informazione sull'utente
    console.log(result.user);
  } catch (error) {
    console.error(error);
  }
}

async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

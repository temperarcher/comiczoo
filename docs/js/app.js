import { login, logout, observeAuth } from "./auth.js";
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
  const year = document.getElementById("year").value;
  const condition = document.getElementById("condition").value;
  const value = document.getElementById("value").value;
  const cover = document.getElementById("cover").value;

  // Recupera l'ID dell'utente autenticato
  const user = firebase.auth().currentUser;
  if (user) {
    // Crea un oggetto fumetto
    const comic = {
      title,
      series,
      publisher,
      year: parseInt(year),
      condition,
      value: parseFloat(value),
      coverUrl: cover || "placeholder-cover.jpg"  // Se non c'è un URL, usa un'immagine di default
    };

    // Aggiungi il fumetto a Firestore
    await addComic(user.uid, comic);

    // Rendi il modulo vuoto dopo l'invio
    comicForm.reset();
  }
};

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
      <p>${c.series} (${c.year})</p>
      <p>${c.publisher}</p>
      <p>Condizione: ${c.condition}</p>
      <p>Valore: €${c.value}</p>
      <img src="${c.coverUrl}" alt="${c.title}" width="150">
    </div>
  `).join("");
}

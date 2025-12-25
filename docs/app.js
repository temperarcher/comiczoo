/*********************************
 * 1️⃣ Firebase setup
 *********************************/
const auth = firebase.auth();
const db = firebase.firestore();

/*********************************
 * 2️⃣ DOM elements
 *********************************/
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const comicForm = document.getElementById("comic-form");
const comicsList = document.getElementById("comics-list");

/*********************************
 * 3️⃣ Login / Logout
 *********************************/
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

/*********************************
 * 4️⃣ Render fumetto (UI)
 *********************************/
function renderComic(doc) {
  const data = doc.data();

  const card = document.createElement("div");
  card.className = "comic-card";

  card.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.name}">
    <div class="content">
      <h3>${data.name}</h3>
      <span class="badge ${data.owned ? "owned" : "missing"}">
        ${data.owned ? "Ce l'ho" : "Manca"}
      </span>
    </div>
  `;

  comicsList.appendChild(card);
}

/*********************************
 * 5️⃣ Firestore listener (post-login)
 *********************************/
let unsubscribeComics = null;

auth.onAuthStateChanged(user => {
  if (user) {
    // UI
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    comicForm.style.display = "block";

    // sicurezza: rimuove listener pr
}
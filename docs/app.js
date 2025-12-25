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

    // sicurezza: rimuove listener precedenti
    if (unsubscribeComics) unsubscribeComics();

    unsubscribeComics = db
      .collection("comics")
      .where("ownerUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        comicsList.innerHTML = "";
        snapshot.forEach(doc => renderComic(doc));
      });

  } else {
    // logout
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    comicForm.style.display = "none";

    comicsList.innerHTML = "";
    if (unsubscribeComics) unsubscribeComics();
  }
});

/*********************************
 * 6️⃣ Submit form → Firestore
 *********************************/
comicForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = comicForm.name.value;
  const imageUrl = comicForm.imageUrl.value;
  const owned = comicForm.owned.checked;

  const user = auth.currentUser;
  if (!user) return;

  db.collection("comics").add({
    name,
    imageUrl,
    owned,
    ownerUid: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  comicForm.reset();
});

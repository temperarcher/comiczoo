// Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// DOM
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const comicForm = document.getElementById("comic-form");
const comicsList = document.getElementById("comics-list");

// Login
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// Render comic
function renderComic(doc) {
  const data = doc.data();

  const card = document.createElement("div");
  card.className = "comic-card";

  card.innerHTML =
    '<img src="' + data.imageUrl + '" alt="' + data.name + '">' +
    '<div class="content">' +
      '<h3>' + data.name + '</h3>' +
      '<span class="badge ' + (data.owned ? 'owned' : 'missing') + '">' +
        (data.owned ? "Ce l'ho" : "Manca") +
      '</span>' +
    '</div>';

  comicsList.appendChild(card);
}

// Listener Firestore
let unsubscribe = null;

auth.onAuthStateChanged(user => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    comicForm.style.display = "block";

    if (unsubscribe) unsubscribe();

    unsubscribe = db
      .collection("comics")
      .where("ownerUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        comicsList.innerHTML = "";
        snapshot.forEach(doc => renderComic(doc));
      });

  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    comicForm.style.display = "none";
    comicsList.innerHTML = "";

    if (unsubscribe) unsubscribe();
  }
});

// Submit form
comicForm.addEventListener("submit", e => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  db.collection("comics").add({
    name: comicForm.name.value,
    imageUrl: comicForm.imageUrl.value,
    owned: comicForm.owned.checked,
    ownerUid: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  comicForm.reset();
});

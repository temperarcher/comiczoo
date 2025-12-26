// === Firebase instances (UNA SOLA VOLTA) ===
const auth = firebase.auth();
const db = firebase.firestore();

// === DOM ===
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const comicForm = document.getElementById("comic-form");
const comicsList = document.getElementById("comics-list");

// === Login ===
loginBtn.onclick = function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

// === Logout ===
logoutBtn.onclick = function () {
  auth.signOut();
};

// === Render fumetto ===
function renderComic(doc) {
  const d = doc.data();
  const div = document.createElement("div");
  div.innerHTML =
    "<img src='" + d.imageUrl + "' width='100'><br>" +
    "<strong>" + d.name + "</strong><br>" +
    (d.owned ? "✔ Ce l'ho" : "❌ Manca");
  comicsList.appendChild(div);
}

// === Listener Auth + Firestore ===
let unsubscribe = null;

auth.onAuthStateChanged(function (user) {
  comicsList.innerHTML = "";

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    comicForm.style.display = "block";

    if (unsubscribe) unsubscribe();

    unsubscribe = db
      .collection("comics")
      .where("ownerUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(function (snap) {
        comicsList.innerHTML = "";
        snap.forEach(renderComic);
      });

  } else {
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    comicForm.style.display = "none";
    if (unsubscribe) unsubscribe();
  }
});

// === Submit ===
comicForm.onsubmit = function (e) {
  e.preventDefault();

  if (!auth.currentUser) return;

  db.collection("comics").add({
    name: document.getElementById("name").value,
    imageUrl: document.getElementById("imageUrl").value,
    owned: document.getElementById("owned").checked,
    ownerUid: auth.currentUser.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  comicForm.reset();
};

// Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// DOM
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const comicForm = document.getElementById("comic-form");
const comicsList = document.getElementById("comics-list");

// Login
loginBtn.addEventListener("click", function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// Logout
logoutBtn.addEventListener("click", function () {
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

// Firestore listener
let unsubscribe = null;

auth.onAuthStateChanged(function (user) {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    comicForm.style.display = "block";

    if (unsubscribe) unsubscribe();

    unsubscribe = db
      .collection("comics")
      .where("ownerUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(function (snapshot) {
        comicsList.innerHTML = "";
        snapshot.forEach(function (doc) {
          renderComic(doc);
        });
      });

  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    comicForm.style.display = "none";
    comicsList.innerHTML = "";

    if (unsubscribe) unsubscribe();
  }
});

// Submit
comicForm.addEventListener("submit", function (e) {
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

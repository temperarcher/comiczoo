// === Firebase instances ===
const auth = firebase.auth();
const db = firebase.firestore();

// === DOM elements ===
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const comicForm = document.getElementById("comic-form");
const comicsList = document.getElementById("comics-list");

// === Login con Google ===
loginBtn.onclick = function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(function(result) {
      console.log("User signed in: ", result.user);
    })
    .catch(function(error) {
      console.error("Error during login: ", error);
    });
};

// === Logout ===
logoutBtn.onclick = function () {
  auth.signOut()
    .then(function() {
      console.log("User signed out");
    })
    .catch(function(error) {
      console.error("Error during logout: ", error);
    });
};

// === Render comic to DOM ===
function renderComic(doc) {
  const data = doc.data();
  const div = document.createElement("div");
  div.innerHTML =
    `<img src="${data.imageUrl}" width="100"><br>
     <strong>${data.name}</strong><br>
     ${data.owned ? "✔ Ce l'ho" : "❌ Manca"}`;
  comicsList.appendChild(div);
}

// === Firestore listener (solo per utenti loggati) ===
let unsubscribe = null;

auth.onAuthStateChanged(function (user) {
  comicsList.innerHTML = "";

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    comicForm.style.display = "block";

    // Start Firestore listener per l'utente autenticato
    if (unsubscribe) unsubscribe(); // Unsubscribe dal vecchio listener

    unsubscribe = db
      .collection("comics")
      .where("ownerUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(function (snapshot) {
        comicsList.innerHTML = ""; // Svuota la lista
        snapshot.forEach(renderComic); // Aggiungi ogni fumetto
      });

  } else {
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    comicForm.style.display = "none";
    comicsList.innerHTML = ""; // Svuota la lista quando disconnesso

    if (unsubscribe) unsubscribe(); // Unsubscribe quando utente esce
  }
});

// === Aggiungi fumetto a Firestore ===
comicForm.onsubmit = function (e) {
  e.preventDefault();

  if (!auth.currentUser) return;

  db.collection("comics").add({
    name: document.getElementById("name").value,
    imageUrl: document.getElementById("imageUrl").value,
    owned: document.getElementById("owned").checked,
    ownerUid: auth.currentUser.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp() // Timestamp per ordine cronologico
  });

  comicForm.reset();
};

// Firebase setup (una sola volta all'inizio)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const comicForm = document.getElementById("comic-form");
const comicsList = document.getElementById("comics-list");

// Login button - Login with Google
loginBtn.addEventListener("click", function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// Logout button
logoutBtn.addEventListener("click", function () {
  auth.signOut();
});

// Render comic to the DOM
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

// Firestore listener (only when user is logged in)
let unsubscribe = null;

auth.onAuthStateChanged(function (user) {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    comicForm.style.display = "block";

    // Firestore listener setup for logged-in users
    if (unsubscribe) unsubscribe(); // If there was a previous listener, unsubscribe from it

    unsubscribe = db
      .collection("comics")
      .where("ownerUid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot(function (snapshot) {
        comicsList.innerHTML = ""; // Clear previous comics
        snapshot.forEach(function (doc) {
          renderComic(doc); // Render each comic in the list
        });
      });

  } else {
    // If user is logged out
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    comicForm.style.display = "none";
    comicsList.innerHTML = ""; // Clear comics list when logged out

    if (unsubscribe) unsubscribe(); // Unsubscribe from Firestore listener
  }
});

// Submit form to add a new comic
comicForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return; // Ensure user is logged in before adding a comic

  db.collection("comics").add({
    name: comicForm.name.value,
    imageUrl: comicForm.imageUrl.value,
    owned: comicForm.owned.checked,
    ownerUid: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp() // Timestamp for sorting by date
  });

  comicForm.reset(); // Reset the form after submission
});

console.log("App JS caricato correttamente");

// Test Firebase
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Utente autenticato: ", user);
  } else {
    console.log("Nessun utente autenticato.");
  }
});
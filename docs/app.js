const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const fumettiListContent = document.getElementById("fumettiListContent");
const addComicForm = document.getElementById("addComicForm");

loginBtn.addEventListener("click", signInWithGoogle);
logoutBtn.addEventListener("click", signOut);

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline";
        loadComics();
    }).catch(error => {
        console.error("Errore nel login:", error);
    });
}

function signOut() {
    firebase.auth().signOut().then(() => {
        loginBtn.style.display = "inline";
        logoutBtn.style.display = "none";
    });
}

function loadComics() {
    const comicsRef = db.collection("comics");
    comicsRef.get().then(snapshot => {
        fumettiListContent.innerHTML = "";
        snapshot.forEach(doc => {
            const comic = doc.data();
            const li = document.createElement("li");
            li.textContent = `${comic.name} - Serie: ${comic.seriesId}`;
            fumettiListContent.appendChild(li);
        });
    });
}

addComicForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const seriesId = document.getElementById("seriesId").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const publisherId = document.getElementById("publisherId").value;

    db.collection("comics").add({
        name: name,
        seriesId: seriesId,
        imageUrl: imageUrl,
        publisherId: publisherId,
        owned: true,
        condition: "mint",
        publicationDate: new Date().toISOString(),
    }).then(() => {
        alert("Fumetto aggiunto!");
        loadComics();
    }).catch(error => {
        console.error("Errore nell'aggiungere il fumetto:", error);
    });
});

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline";
        loadComics();
    } else {
        loginBtn.style.display = "inline";
        logoutBtn.style.display = "none";
    }
});

const comicsList = document.getElementById("comics-list");

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


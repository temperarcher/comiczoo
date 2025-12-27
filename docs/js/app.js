import { login, logout, observeAuth } from "./auth.js";
import { getUserComics } from "./comics.js";

const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const comicsList = document.getElementById("comics");

loginBtn.onclick = login;
logoutBtn.onclick = logout;

observeAuth(async user => {
  if (!user) {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    comicsList.innerHTML = "";
    return;
  }

  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";

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
    </div>
  `).join("");
}

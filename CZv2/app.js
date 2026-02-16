// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';

async function bootstrap() {
    // 1. Inizializziamo la connessione e controlliamo la sessione
    await Auth.init();

    const appContainer = document.getElementById('app');

    // 2. Se non è loggato, mostra il form di login
    if (!Auth.isLoggedIn()) {
        appContainer.innerHTML = AUTH_UI.LOGIN_FORM;
        attachLoginEvents();
        return;
    }

    // 3. Se è loggato, avvia l'applicazione vera e propria
    startApp();
}

function attachLoginEvents() {
    const btn = document.getElementById('btn-login');
    btn.onclick = async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        const errorDiv = document.getElementById('auth-error');

        try {
            btn.innerText = "VERIFICA IN CORSO...";
            btn.disabled = true;
            await Auth.login(email, pass);
            // OnAuthStateChange in Auth.init() si occuperà di ricaricare l'app
        } catch (err) {
            errorDiv.innerText = "ERRORE: CREDENZIALI NON VALIDE";
            btn.innerText = "ENTRA NEL DATABASE";
            btn.disabled = false;
        }
    };
}

function startApp() {
    // Qui caricheremo i componenti: Topbar, Sidebar e Grid
    document.getElementById('app').innerHTML = `
        <div class="text-white p-20">
            <h2 class="text-2xl font-bold italic">Bentornato, ${Auth.user.email}</h2>
            <button id="btn-logout" class="mt-4 text-xs text-slate-500 hover:text-white uppercase tracking-widest underline">Esci</button>
        </div>
    `;
    
    document.getElementById('btn-logout').onclick = () => Auth.logout();
}

bootstrap();
// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';
import { LAYOUT } from './ui/layout.js'; // <--- AGGIUNTO
import { CZ_EVENTS } from './core/events.js';

// Import dei componenti atomici
import { Topbar } from './components/topbar.js';
import { SeriesSelector } from './components/series-selector.js';
import { Grid } from './components/grid.js'; // <--- AGGIUNTO

const app = document.getElementById('app');

/**
 * Bootloader dell'applicazione.
 * Gestisce la barriera di ingresso (Login) e l'avvio del sistema.
 */
async function bootstrap() {
    // 1. Sentinella dell'autenticazione: reagisce a ogni cambio di stato (Login/Logout)
    window.addEventListener(CZ_EVENTS.AUTH_CHANGED, (e) => {
        const user = e.detail;
        if (user) {
            initMainApp(); 
        } else {
            showLoginScreen();
        }
    });

    // 2. Verifica se esiste già una sessione attiva al caricamento
    await Auth.init();
}

/**
 * Visualizza il form di accesso e aggancia la logica di validazione
 */
function showLoginScreen() {
    app.innerHTML = AUTH_UI.LOGIN_FORM;
    
    const btn = document.getElementById('btn-login');
    if (!btn) return;
    
    btn.onclick = async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        const errorDiv = document.getElementById('auth-error');

        try {
            btn.innerText = "VERIFICA IN CORSO...";
            btn.disabled = true;
            await Auth.login(email, pass);
        } catch (err) {
            errorDiv.innerText = "ERRORE: CREDENZIALI NON VALIDE";
            btn.innerText = "ENTRA NEL DATABASE";
            btn.disabled = false;
        }
    };
}

/**
 * Inizializza l'interfaccia principale e i componenti reattivi
 */
async function initMainApp() {
    // 1. Iniezione dello scheletro HTML atomizzato (Layout verticale di Febbraio)
    app.innerHTML = LAYOUT.MAIN_STRUCTURE;

    // Aggancio evento logout manuale
    document.getElementById('btn-logout').onclick = () => Auth.logout();

    // 2. Avvio dei componenti in ordine gerarchico
    // Topbar recupera i Codici Editori
    await Topbar.render();
    
    // SeriesSelector si inizializza e si mette in ascolto dei cambi nella Topbar
    await SeriesSelector.init();

    // Grid si inizializza e si mette in ascolto dei cambi nella Sidebar
    await Grid.init(); // <--- AGGIUNTO
}

// Esecuzione del processo di boot
bootstrap();
// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';
import { CZ_EVENTS } from './core/events.js';

// Import componenti
import { Topbar } from './components/topbar.js'; // Sostituisce renderSearchEditor per la gestione atomica
import { renderHeader } from './components/header.js';
import { renderSeriesSelector } from './components/series-selector.js';
import { renderGrid } from './components/grid.js';
import { openIssueModal } from './modals/issue-modal.js';
import { initEditSystem } from './core/edit-handler.js'; 

const app = document.getElementById('app');

async function bootstrap() {
    // 1. Ascolta i cambiamenti di autenticazione (Login/Logout)
    window.addEventListener(CZ_EVENTS.AUTH_CHANGED, (e) => {
        const user = e.detail;
        if (user) {
            initMainApp(); // Se loggato, costruisci l'app
        } else {
            showLoginScreen(); // Altrimenti, resta al login
        }
    });

    // 2. Inizializza Auth (questo scatenerà il primo AUTH_CHANGED)
    await Auth.init();
}

function showLoginScreen() {
    app.innerHTML = AUTH_UI.LOGIN_FORM;
    
    const btn = document.getElementById('btn-login');
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

async function initMainApp() {
    // 1. Iniezione Atomica dello Scheletro
    app.innerHTML = `
        <header id="header-container"></header>
        <section id="topbar-container" class="px-4 py-2 bg-slate-900/50"></section>
        <section id="series-selector-container"></section>
        <main id="grid-container"></main>
        <div id="modal-container"></div> 
    `;

    // 2. Registrazione Eventi Globali
    window.addEventListener('comiczoo:open-modal', (e) => {
        openIssueModal(e.detail);
    });

    // Logout rapido (opzionale, se non è già nell'header)
    window.addEventListener('cz:request-logout', () => Auth.logout());

    // Inizializzazione Sistema di Editing
    initEditSystem();

    // 3. Montaggio componenti
    renderHeader();
    
    // Carichiamo la Topbar (ex SearchEditor) che gestisce gli Editori
    await Topbar.render();
    
    // Poi i dati dinamici
    await renderSeriesSelector();
    await renderGrid();
}

// Avvio del Bootloader
bootstrap();
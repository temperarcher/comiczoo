// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';
import { CZ_EVENTS } from './core/events.js';

// Import dei componenti atomici
import { Topbar } from './components/topbar.js';
import { SeriesSelector } from './components/series-selector.js';

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
    // 1. Iniezione dello scheletro HTML basato su Tailwind
    app.innerHTML = `
        <div class="min-h-screen bg-slate-950 text-white font-sans">
            <header class="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <h1 class="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">ComicZoo v2</h1>
                <button id="btn-logout" class="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest underline transition-colors">Logout</button>
            </header>

            <section id="topbar-container" class="p-6 bg-slate-900/30 border-b border-slate-900"></section>

            <div class="flex p-6 gap-8">
                <aside id="series-selector-container" class="w-72 shrink-0 border border-slate-900 rounded-2xl p-4 bg-slate-900/10 min-h-[500px]">
                    <p class="text-[10px] text-slate-700 uppercase tracking-widest text-center py-20">Caricamento...</p>
                </aside>

                <main id="grid-container" class="flex-1 border border-slate-900 rounded-2xl p-4 bg-slate-900/5 min-h-[500px]">
                    <p class="text-[10px] text-slate-700 uppercase tracking-widest text-center py-20">Area Albi</p>
                </main>
            </div>
        </div>
    `;

    // Aggancio evento logout manuale
    document.getElementById('btn-logout').onclick = () => Auth.logout();

    // 2. Avvio dei componenti in ordine gerarchico
    // Topbar recupera i Codici Editori
    await Topbar.render();
    
    // SeriesSelector si inizializza e si mette in ascolto dei cambi nella Topbar
    await SeriesSelector.init();
}

// Esecuzione del processo di boot
bootstrap();
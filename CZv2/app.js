// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';
import { CZ_EVENTS } from './core/events.js';

// Importiamo solo i componenti "Nuovi" che abbiamo già codificato 
import { Topbar } from './components/topbar.js';

const app = document.getElementById('app');

async function bootstrap() {
    // 1. Gestore dell'autenticazione
    window.addEventListener(CZ_EVENTS.AUTH_CHANGED, (e) => {
        const user = e.detail;
        if (user) {
            initMainApp(); 
        } else {
            app.innerHTML = AUTH_UI.LOGIN_FORM;
            attachLoginEvents();
        }
    });

    await Auth.init();
}

function attachLoginEvents() {
    const btn = document.getElementById('btn-login');
    if(!btn) return;
    
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
    // 2. Costruiamo lo scheletro HTML pulito
    app.innerHTML = `
        <div class="min-h-screen bg-slate-950 text-white font-sans">
            <header class="p-6 border-b border-slate-900 flex justify-between items-center">
                <h1 class="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">ComicZoo v2</h1>
                <button id="btn-logout" class="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest underline">Logout</button>
            </header>

            <section id="topbar-container" class="p-6 bg-slate-900/30"></section>

            <div class="flex p-6 gap-8">
                <aside id="series-selector-container" class="w-72 shrink-0 border border-slate-900 rounded-2xl p-4 bg-slate-900/10">
                    <p class="text-[10px] text-slate-700 uppercase tracking-widest text-center py-10">Seleziona un editore per vedere le serie</p>
                </aside>

                <main id="grid-container" class="flex-1 border border-slate-900 rounded-2xl p-4 bg-slate-900/5">
                    <p class="text-[10px] text-slate-700 uppercase tracking-widest text-center py-10">Area Albi</p>
                </main>
            </div>
        </div>
    `;

    document.getElementById('btn-logout').onclick = () => Auth.logout();

    // 3. Avviamo i componenti pronti
    // La Topbar ora funzionerà perché abbiamo creato il suo Fetcher e il suo Atomo
    await Topbar.render();
	// Avvia la Sidebar (che si aggancia agli eventi della Topbar)
    await SeriesSelector.init();
	
}

bootstrap();
// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';
import { CZ_EVENTS } from './core/events.js';

async function bootstrap() {
    // 1. Ascolta i cambiamenti di autenticazione (Login/Logout)
    window.addEventListener(CZ_EVENTS.AUTH_CHANGED, (e) => {
        const user = e.detail;
        if (user) {
            startApp(); // Se l'utente c'è, avvia l'app
        } else {
            showLogin(); // Altrimenti mostra il login
        }
    });

    // 2. Inizializza Auth (questo scatenerà il primo AUTH_CHANGED)
    await Auth.init();
}

function showLogin() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = AUTH_UI.LOGIN_FORM;
    
    const btn = document.getElementById('btn-login');
    btn.onclick = async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        const errorDiv = document.getElementById('auth-error');

        try {
            btn.innerText = "VERIFICA IN CORSO...";
            btn.disabled = true;
            await Auth.login(email, pass);
            // Non serve fare altro qui, Auth.init() rileverà il cambio 
            // e scatenerà l'evento che chiama startApp()
        } catch (err) {
            errorDiv.innerText = "ERRORE: CREDENZIALI NON VALIDE";
            btn.innerText = "ENTRA NEL DATABASE";
            btn.disabled = false;
        }
    };
}

function startApp() {
    const appContainer = document.getElementById('app');
    // Qui puliamo tutto e carichiamo l'interfaccia reale
    appContainer.innerHTML = `
        <div class="min-h-screen bg-slate-950 text-white p-8">
            <header class="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                <div>
                    <h1 class="text-2xl font-black italic text-yellow-500 uppercase">ComicZoo v2</h1>
                    <p class="text-[10px] text-slate-500 tracking-widest uppercase">Logged as: ${Auth.user.email}</p>
                </div>
                <button id="btn-logout" class="text-[10px] bg-slate-900 hover:bg-red-900/20 text-slate-400 hover:text-red-500 border border-slate-800 px-4 py-2 rounded transition-all uppercase tracking-tighter">
                    Logout
                </button>
            </header>
            
            <div id="topbar-container" class="mb-8"></div>

            <div class="flex gap-6">
                <aside id="sidebar-container" class="w-64 shrink-0"></aside>
                <main id="grid-container" class="flex-1"></main>
            </div>
        </div>
    `;
    
    document.getElementById('btn-logout').onclick = () => Auth.logout();

    // Inizializziamo il primo componente atomico: La Topbar
    // Topbar.render(); 
}

bootstrap();
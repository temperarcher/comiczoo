// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';

async function bootstrap() {
    await Auth.init();

    if (!Auth.isLoggedIn()) {
        const app = document.getElementById('app');
        app.innerHTML = AUTH_UI.LOGIN_SCREEN;
        
        document.getElementById('btn-google-login').onclick = async () => {
            try {
                await Auth.loginWithGoogle();
            } catch (err) {
                document.getElementById('auth-error').innerText = "ERRORE DI AUTENTICAZIONE";
            }
        };
        return;
    }

    // Se arriviamo qui, l'utente è loggato
    console.log("Welcome,", Auth.user.email);
    startMainApp();
}

function startMainApp() {
    // Qui inizieremo a caricare i componenti della Topbar, Sidebar e Grid
    document.getElementById('app').innerHTML = `<h1 class="text-white p-10">Accesso Eseguito: Caricamento Database...</h1>`;
}

bootstrap();
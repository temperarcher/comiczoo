// CZv2/app.js
import { Auth } from './core/auth.js';
import { AUTH_UI } from './ui/auth-ui.js';

async function bootstrap() {
    await Auth.init();

    if (!Auth.isLoggedIn()) {
        document.body.innerHTML = AUTH_UI.LOGIN_FORM;
        attachLoginEvents();
        return;
    }

    // SE LOGGATO: Inizializza l'app vera e propria
    startApp();
}

function attachLoginEvents() {
    document.getElementById('btn-login').onclick = async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        try {
            await Auth.login(email, pass);
        } catch (err) {
            document.getElementById('auth-error').innerText = "ACCESSO NEGATO: CREDENZIALI ERRATE";
        }
    };
}

bootstrap();
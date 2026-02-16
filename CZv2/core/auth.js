// CZv2/core/auth.js
import { client } from './supabase.js';
import { CZ_EVENTS } from './events.js';

export const Auth = {
    user: null,

    async init() {
        // Controlla se c'è già una sessione attiva al caricamento
        const { data: { session } } = await client.auth.getSession();
        this.user = session?.user ?? null;

        // Ascolta cambiamenti (login/logout) in tempo reale
        client.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user ?? null;
            window.dispatchEvent(new CustomEvent(CZ_EVENTS.AUTH_CHANGED, { detail: this.user }));
        });
    },

    async login(email, password) {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
    },

    async logout() {
        await client.auth.signOut();
        location.reload(); // Reset totale per sicurezza
    },

    isLoggedIn() {
        return !!this.user;
    }
};
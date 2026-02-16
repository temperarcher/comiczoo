// CZv2/core/auth.js
import { client } from './supabase.js';
import { CZ_EVENTS } from './events.js';

export const Auth = {
    user: null,

    async init() {
        // Al caricamento, chiediamo a Supabase se c'è una sessione attiva
        const { data: { session } } = await client.auth.getSession();
        this.user = session?.user ?? null;

        // Monitoriamo i cambi di stato (Login/Logout)
        client.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user ?? null;
            // Lanciamo un evento per avvisare l'app
            window.dispatchEvent(new CustomEvent(CZ_EVENTS.AUTH_CHANGED, { detail: this.user }));
        });
    },

    async login(email, password) {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    async logout() {
        await client.auth.signOut();
        location.reload(); 
    },

    isLoggedIn() {
        return !!this.user;
    }
};
// CZv2/core/auth.js
import { client } from './supabase.js';
import { CZ_EVENTS } from './events.js';

export const Auth = {
    user: null,

    async init() {
        // Recupera la sessione persistente (se esiste)
        const { data: { session } } = await client.auth.getSession();
        this.user = session?.user ?? null;

        // Listener per i cambi di stato (Login/Logout)
        client.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user ?? null;
            window.dispatchEvent(new CustomEvent(CZ_EVENTS.AUTH_CHANGED, { detail: this.user }));
        });
    },

    async loginWithGoogle() {
        const { error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Supabase gestirà il redirect automaticamente
                redirectTo: window.location.origin 
            }
        });
        if (error) throw error;
    },

    async logout() {
        await client.auth.signOut();
        location.reload(); 
    },

    isLoggedIn() {
        return !!this.user;
    }
};
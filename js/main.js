/**
 * VERSION: 1.0.0
 
 */
import { Render } from './render.js';

// Funzione di inizializzazione principale
async function initApp() {
    try {
        // 1. Inizializza il layout base (Header e Modale)
        Render.initLayout();

        // Nota: Qui aggiungerai le tue chiamate Supabase/Fetch 
        // per popolare i dati quando pronti.
        
        console.log("Architettura Atomica caricata: main.js collegato a Render.");
    } catch (error) {
        console.error("Errore fatale durante l'avvio:", error);
    }
}

// Avvio al caricamento del DOM
document.addEventListener('DOMContentLoaded', initApp);
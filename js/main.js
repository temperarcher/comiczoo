/**
 * VERSION: 1.0.0
 
 */
import { Render } from './render.js';
// Assicurati che gli altri import (supabase, ecc) siano corretti

async function initApp() {
    try {
        // 1. Costruisce la base della pagina
        Render.initLayout();

        // 2. Esempio caricamento (sostituisci con la tua logica fetch)
        // const issues = await fetchIssues(); 
        // Render.grid(issues);

        console.log("Sistema Atomizzato Pronto.");
    } catch (error) {
        console.error("Errore inizializzazione:", error);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
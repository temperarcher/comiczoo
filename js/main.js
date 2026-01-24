/**
 * VERSION: 1.0.0
 
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js'; // Assumi che il client sia qui

async function initApp() {
    try {
        // Inizializza la struttura
        Render.initLayout();

        // Caricamento dati iniziali
        const { data: issues } = await supabase.from('issue_view').select('*');
        const { data: publishers } = await supabase.from('editore').select('*');
        const { data: series } = await supabase.from('serie').select('*');

        // Renderizza i componenti
        Render.publishers(publishers);
        Render.series(series);
        Render.grid(issues);

        console.log("App Atomizzata Inizializzata con successo");
    } catch (error) {
        console.error("Errore durante l'inizializzazione:", error);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
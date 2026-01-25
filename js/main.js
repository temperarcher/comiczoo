/**
 * VERSION: 1.0.0
 
 */
import { Render } from './render.js';
// Assicurati che supabase-client.js sia anch'esso in js/
import { supabase } from './supabase-client.js'; 

async function initApp() {
    try {
        Render.initLayout();

        const [resIssues, resPubs, resSeries] = await Promise.all([
            supabase.from('issue_view').select('*').order('numero'),
            supabase.from('editore').select('*'),
            supabase.from('serie').select('*')
        ]);

        Render.publishers(resPubs.data || []);
        Render.series(resSeries.data || []);
        Render.grid(resIssues.data || []);

        console.log("App avviata correttamente dalla cartella js/");
    } catch (e) {
        console.error("Errore inizializzazione:", e);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
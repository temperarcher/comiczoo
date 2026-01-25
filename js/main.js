/**
 * VERSION: 1.0.1
 * FIX: Query relazionale diretta su tabella issue per evitare 404 su issue_view
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js'; 

async function initApp() {
    try {
        Render.initLayout();

        // Interroghiamo direttamente la tabella issue con i join relazionali
        const [resIssues, resPubs, resSeries] = await Promise.all([
            supabase.from('issue').select(`
                *,
                testata:serie_id(nome),
                annata:annata_id(nome)
            `).order('numero'),
            supabase.from('editore').select('*'),
            supabase.from('serie').select('*')
        ]);

        if (resIssues.error) throw resIssues.error;

        // Adattamento dati per l'atomo card.js
        const formattedIssues = (resIssues.data || []).map(i => ({
            ...i,
            testata: i.testata?.nome || 'N/D',
            annata: i.annata?.nome || 'N/D'
        }));

        Render.publishers(resPubs.data || []);
        Render.series(resSeries.data || []);
        Render.grid(formattedIssues);

        console.log("App avviata: Dati caricati correttamente tramite join relazionale.");
    } catch (e) {
        console.error("Errore inizializzazione:", e.message);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
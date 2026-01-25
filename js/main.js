/**
 * VERSION: 1.0.1
 * FIX: Query relazionale diretta per evitare URL 'null'
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js'; 

async function initApp() {
    try {
        Render.initLayout();

        // Join relazionale: chiediamo a 'issue' di portarsi dietro il nome della serie e dell'annata
        const [resIssues, resPubs, resSeries] = await Promise.all([
            supabase.from('issue').select(`
                *,
                testata:serie_id(nome),
                annata:annata_id(nome)
            `).order('numero'),
            supabase.from('editore').select('*').order('nome'),
            supabase.from('serie').select('*').order('nome')
        ]);

        if (resIssues.error) throw resIssues.error;

        // Pulizia dati: se un'immagine manca, mettiamo un placeholder invece di 'null'
        const issues = (resIssues.data || []).map(i => ({
            ...i,
            testata: i.testata?.nome || 'Serie Ignota',
            annata: i.annata?.nome || 'N/D',
            immagine_url: i.immagine_url || 'https://via.placeholder.com/300x450?text=No+Cover'
        }));

        Render.publishers(resPubs.data || []);
        Render.series(resSeries.data || []);
        Render.grid(issues);

        console.log("Dati caricati con successo senza errori 404.");
    } catch (e) {
        console.error("Errore fatale:", e.message);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
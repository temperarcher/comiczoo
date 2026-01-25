/**
 * VERSION: 1.0.2
 * FIX: Query relazionale corretta per evitare valori 'null' negli URL e nei testi
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js'; 

async function initApp() {
    try {
        Render.initLayout();

        // Recuperiamo i dati con i join necessari
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

        // Formattazione dati per evitare i 'null' che causano il 404
        const issues = (resIssues.data || []).map(i => ({
            ...i,
            testata: i.testata?.nome || 'Serie Ignota',
            annata: i.annata?.nome || 'N/D',
            immagine_url: i.immagine_url || 'https://via.placeholder.com/300x450?text=No+Cover'
        }));

        Render.publishers(resPubs.data || []);
        Render.series(resSeries.data || []);
        Render.grid(issues);

        console.log("Dati renderizzati con successo.");
    } catch (e) {
        console.error("Errore Inizializzazione:", e.message);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
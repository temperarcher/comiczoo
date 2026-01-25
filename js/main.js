/**
 * VERSION: 1.1.4
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js';

async function initApp() {
    try {
        Render.initLayout();

        // 1. Caricamento Editori
        const { data: publishers, error: pError } = await supabase
            .from('codice_editore')
            .select('*')
            .order('nome');
        if (pError) throw pError;
        Render.publishers(publishers || []);

        // 2. Caricamento Serie (Fetch reale dal DB)
        const { data: series, error: sError } = await supabase
            .from('serie')
            .select('*')
            .order('nome');
        if (sError) throw sError;
        Render.series(series || []);

        console.log("Sistema Inizializzato v1.1.4 - Showcase Serie Attivo.");
    } catch (e) {
        console.error("Errore Inizializzazione:", e.message);
    }
}
document.addEventListener('DOMContentLoaded', initApp);
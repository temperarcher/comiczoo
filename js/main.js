/**
 * VERSION: 1.1.7
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js';
import { Logic } from './logic.js';

async function initApp() {
    try {
        Render.initLayout();

        // Caricamento Editori
        const { data: publishers, error: pError } = await supabase
            .from('codice_editore')
            .select('*')
            .order('nome');
        if (pError) throw pError;
        
        // Caricamento Serie
        const { data: series, error: sError } = await supabase
            .from('serie')
            .select('*')
            .order('nome');
        if (sError) throw sError;

        // Salvo nello stato logico per i filtri rapidi
        Logic.state.allPublishers = publishers || [];
        Logic.state.allSeries = series || [];

        // Esposizione funzioni globali per onclick degli atomi
        window.selectCodice = Logic.selectCodice;
        window.resetAllFilters = Logic.resetAllFilters;
        window.selectSerie = Logic.selectSerie;

        Render.publishers(publishers || []);
        Render.series(series || []);

        console.log("Sistema Inizializzato v1.1.7 - Logica Filtri Attiva.");
    } catch (e) {
        console.error("Errore Inizializzazione:", e.message);
    }
}
document.addEventListener('DOMContentLoaded', initApp);
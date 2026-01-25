/**
 * VERSION: 1.1.2
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js';

async function initApp() {
    try {
        // 1. Inizializzazione Layout base
        Render.initLayout();

        // 2. Recupero dati reali da Supabase (Tabella codice_editore)
        const { data: publishers, error } = await supabase
            .from('codice_editore')
            .select('*')
            .order('nome');

        if (error) throw error;

        // 3. Rendering della sezione editori con dati reali
        Render.publishers(publishers || []);

        console.log("Sistema Inizializzato v1.1.2 - Dati Supabase caricati.");
    } catch (e) {
        console.error("Errore durante l'inizializzazione dell'App:", e.message);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
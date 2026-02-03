/**
 * VERSION: 1.3.6
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js';
import { Logic } from './logic.js';

async function initApp() {
    try {
        Render.initLayout();

        const { data: publishers, error: pError } = await supabase
            .from('codice_editore')
            .select('*')
            .order('nome');
        if (pError) throw pError;
        
        const { data: series, error: sError } = await supabase
            .from('serie')
            .select('*')
            .order('nome');
        if (sError) throw sError;

        Logic.state.allPublishers = publishers || [];
        Logic.state.allSeries = series || [];

        window.selectCodice = Logic.selectCodice;
        window.resetAllFilters = Logic.resetAllFilters;
        window.selectSerie = Logic.selectSerie;
        
        // Esposizione per il modale dettagli come richiesto dal protocollo
        window.selectSerieDetail = Logic.openIssueDetail;
        window.closeModal = () => {
            const m = document.getElementById('modal-root');
            if(m) m.innerHTML = '';
        };

        Render.publishers(publishers || []);
        Render.series(series || []);

        console.log("Sistema v1.1.9 Pronto - Griglia Albi (Album Figurine) e Modale Dettagli Attivi.");
    } catch (e) {
        console.error("Errore Inizializzazione:", e.message);
    }
}
document.addEventListener('DOMContentLoaded', initApp);
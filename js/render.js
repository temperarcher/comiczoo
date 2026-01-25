/**
 * VERSION: 1.1.4
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { UI } from './ui.js';

export const Render = {
    initLayout: () => {
        UI.ROOTS.APPLY_BODY_STYLE();
        document.body.innerHTML = 
            UI.ROOTS.HEADER_SLOT() + 
            UI.ROOTS.PUBLISHER_SLOT() + 
            UI.ROOTS.SERIES_SLOT() + // Inserito nuovo slot
            UI.ROOTS.MAIN_ROOT();
        
        const headerContainer = document.getElementById('ui-header-slot');
        if (headerContainer) headerContainer.innerHTML = UI.HEADER();
    },

    publishers: (data, activeId = null) => {
        const target = document.getElementById('ui-publisher-slot');
        if (!target) return;
        const content = UI.ALL_PUBLISHERS_BUTTON(!activeId) + 
                        data.map(p => UI.PUBLISHER_PILL(p)).join('');
        target.innerHTML = UI.PUBLISHER_SECTION(content);
    },

    // Nuova funzione di rendering per le serie
    series: (data) => {
        const target = document.getElementById('ui-series-slot');
        if (!target) return;
        const content = data.map(s => UI.SERIES_CARD(s)).join('');
        target.innerHTML = UI.SERIES_SECTION(content);
    }
};
/**
 * VERSION: 1.1.7
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
            UI.ROOTS.SERIES_SLOT() + 
            UI.ROOTS.MAIN_ROOT();
        
        const headerContainer = document.getElementById('ui-header-slot');
        if (headerContainer) headerContainer.innerHTML = UI.HEADER();
    },

    publishers: (data, activeId = null) => {
        const target = document.getElementById('ui-publisher-slot');
        if (!target) return;
        // La logica di isActive viene passata all'atomo ALL_BUTTON e PILL (tramite controllo id)
        const content = UI.ALL_PUBLISHERS_BUTTON(!activeId) + 
                        data.map(p => {
                            // Qui non alteriamo l'atomo, passiamo solo il dato per l'onclick già presente
                            return UI.PUBLISHER_PILL(p);
                        }).join('');
        target.innerHTML = UI.PUBLISHER_SECTION(content);
        
        // Gestione feedback visivo classi active senza alterare atomi
        if(activeId) {
            document.querySelectorAll('.codice-item').forEach(el => el.classList.remove('active', 'border-yellow-500'));
            const activeEl = document.getElementById(`codice-${activeId}`);
            if(activeEl) activeEl.classList.add('active', 'border-yellow-500');
        }
    },

    series: (data) => {
        const target = document.getElementById('ui-series-slot');
        if (!target) return;
        const content = data.map(s => UI.SERIES_CARD(s)).join('');
        target.innerHTML = UI.SERIES_SECTION(content);
    }
};
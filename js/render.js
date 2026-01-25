/**
 * VERSION: 1.1.0
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { UI } from './ui.js';

export const Render = {
    initLayout: () => {
        // 1. Vestizione Body
        UI.ROOTS.APPLY_BODY_STYLE();
        
        // 2. Iniezione struttura base con slot header e publisher
        document.body.innerHTML = 
            UI.ROOTS.HEADER_SLOT() + 
            UI.ROOTS.PUBLISHER_SLOT() + 
            UI.ROOTS.MAIN_ROOT();

        // 3. Renderizzazione contenuto Header (Consolidato)
        const headerContainer = document.getElementById('ui-header-slot');
        if (headerContainer) {
            headerContainer.innerHTML = UI.HEADER();
        }
    },

    // Funzione per il rendering dinamico degli editori
    publishers: (data, activeId = null) => {
        const target = document.getElementById('ui-publisher-slot');
        if (!target) return;
        
        const content = UI.ALL_PUBLISHERS_BUTTON(!activeId) + 
                        data.map(p => UI.PUBLISHER_PILL(p)).join('');
        
        target.innerHTML = UI.PUBLISHER_SECTION(content);
    }
};
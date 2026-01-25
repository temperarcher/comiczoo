/**
 * VERSION: 1.0.0
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { UI } from './ui.js';

export const Render = {
    initLayout: () => {
        // 1. Vestizione Body
        UI.ROOTS.APPLY_BODY_STYLE();
        
        // 2. Iniezione struttura base con slot header
        document.body.innerHTML = 
            UI.ROOTS.HEADER_SLOT() + 
            UI.ROOTS.MAIN_ROOT();

        // 3. Renderizzazione contenuto Header
        const headerContainer = document.getElementById('ui-header-slot');
        if (headerContainer) {
            headerContainer.innerHTML = UI.HEADER();
        }
    }
};
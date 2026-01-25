/**
 * VERSION: 1.1.6
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const sections = {
    APPLY_BODY_STYLE: () => {
        const b = document.body;
        b.className = "bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col";
    },
    HEADER_SLOT: () => `<div id="ui-header-slot"></div>`,
    PUBLISHER_SLOT: () => `<div id="ui-publisher-slot"></div>`,
    SERIES_SLOT: () => `<div id="ui-series-slot"></div>`, // Nuovo slot aggiunto
    MAIN_ROOT: () => `<main id="ui-main-root" class="flex-grow"></main>`
};
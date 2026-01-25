/**
 * VERSION: 1.0.0
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const sections = {
    // Applica lo stile atomizzato al body
    APPLY_BODY_STYLE: () => {
        const b = document.body;
        b.className = "bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col";
    },

    // Punto di innesto principale
    MAIN_ROOT: () => `<main id="ui-main-root" class="flex-grow"></main>`
};
/**
 * VERSION: 1.1.0
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * ATOMIZZAZIONE DEGLI SLOT E DELLO STILE DEL BODY.
 */
export const Layout = {
    sections: {
        APPLY_BODY_STYLE: () => {
            const b = document.body;
            b.className = "bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col";
        },
        HEADER_SLOT: () => `<div id="ui-header-slot"></div>`,
        PUBLISHER_SLOT: () => `<div id="ui-publisher-slot"></div>`,
        SERIES_SLOT: () => `<div id="ui-series-slot"></div>`,
        MAIN_ROOT: () => `<main id="ui-main-root" class="flex-grow"></main>`
    },

    assemble: () => {
        // Applica lo stile atomico
        Layout.sections.APPLY_BODY_STYLE();

        // Inserisce i componenti nello scheletro
        document.body.innerHTML = `
            ${Layout.sections.HEADER_SLOT()}
            ${Layout.sections.PUBLISHER_SLOT()}
            ${Layout.sections.SERIES_SLOT()}
            ${Layout.sections.MAIN_ROOT()}
            <div id="ui-modals"></div>
        `;
    }
};
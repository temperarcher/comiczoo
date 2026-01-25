/**
 * VERSION: 1.1.3
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const publishers = {
    // Contenitore principale della barra editori
    SECTION: (content) => `
        <section class="bg-slate-800/30 border-b border-slate-800 py-3">
            <div class="container mx-auto px-6">
                <div id="codici-bar" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                    ${content}
                </div>
            </div>
        </section>`,

    // Pulsante di reset "TUTTI" - Altezza allineata a h-9 (36px)
    ALL_BUTTON: (isActive) => `
        <button id="codice-tutti" onclick="resetAllFilters()" class="codice-item ${isActive ? 'active' : ''} shrink-0 h-9 px-6 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-yellow-500">
            TUTTI
        </button>`,

    // Singola pillola editore - Dimensioni fisse 36x36px (w-9 h-9)
    PILL: (pub) => `
        <div id="codice-${pub.id}" onclick="selectCodice('${pub.id}')" class="codice-item codice-item-square shrink-0 w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center p-0">
             <img src="${pub.immagine_url}" alt="${pub.nome}" title="${pub.nome}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all">
        </div>`
};
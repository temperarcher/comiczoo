/**
 * VERSION: 1.1.4
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const series = {
    // Contenitore Showcase
    SECTION: (content) => `
        <section class="bg-slate-900/50 border-b border-slate-800 py-4 overflow-hidden">
            <div class="container mx-auto px-6">
                <div id="serie-showcase" class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar items-center">
                    ${content}
                </div>
            </div>
        </section>`,

    // Atomo singola Serie (Card)
    CARD: (serie) => `
        <div class="serie-showcase-item shrink-0 h-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden cursor-pointer shadow-lg relative group">
            <div onclick="selectSerie('${serie.id}', '${serie.nome}')" class="h-full">
                <img src="${serie.immagine_url}" alt="${serie.nome}" class="h-full w-auto object-contain">
            </div>
            <button onclick="openSerieModal('${serie.id}')" class="absolute top-1 right-1 bg-yellow-500 text-slate-900 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-[10px] z-10">✏️</button>
        </div>`
};
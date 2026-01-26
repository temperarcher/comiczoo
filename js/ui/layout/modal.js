/**
 * VERSION: 1.1.7
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const series = {
    // Contenitore Showcase con correzione CSS per eliminare la striscia bianca della scrollbar
    SECTION: (content) => `
        <style>
            #serie-showcase::-webkit-scrollbar {
                height: 6px;
            }
            #serie-showcase::-webkit-scrollbar-track {
                background: transparent; 
            }
            #serie-showcase::-webkit-scrollbar-thumb {
                background: transparent;
                border-radius: 10px;
            }
            #serie-showcase:hover::-webkit-scrollbar-thumb {
                background: #334155; /* slate-700 */
            }
        </style>
        <section class="bg-slate-900/50 border-b border-slate-800 py-4 overflow-hidden">
            <div class="container mx-auto px-6">
                <div id="serie-showcase" class="flex gap-4 overflow-x-auto pb-2 items-center">
                    ${content}
                </div>
            </div>
        </section>`,

    // Atomo singola Serie (Card) - Rimosso pulsante matita
    CARD: (serie) => `
        <div class="serie-showcase-item shrink-0 h-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden cursor-pointer shadow-lg relative group">
            <div onclick="selectSerie('${serie.id}', '${serie.nome}')" class="h-full">
                <img src="${serie.immagine_url}" alt="${serie.nome}" class="h-full w-auto object-contain">
            </div>
        </div>`
};
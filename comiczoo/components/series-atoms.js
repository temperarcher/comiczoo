export const SERIES_UI = {
    // Contenitore dello showcase con scrollbar custom
    CONTAINER: (content) => `
        <style>
            #serie-showcase::-webkit-scrollbar { height: 6px; }
            #serie-showcase::-webkit-scrollbar-track { background: transparent; }
            #serie-showcase::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            #serie-showcase { scroll-behavior: smooth; }
        </style>
        <section class="bg-slate-900/50 border-b border-slate-800 py-4 overflow-hidden">
            <div class="container mx-auto px-6">
                <div id="serie-showcase" class="flex gap-4 overflow-x-auto pb-2 items-center">
                    ${content}
                </div>
            </div>
        </section>`,

    // Atomo della singola Serie (pillola con immagine)
    ITEM: (s) => `
        <div class="serie-item shrink-0 h-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden cursor-pointer shadow-lg relative group transition-all hover:border-yellow-500" 
             data-id="${s.id}" data-nome="${s.nome}">
            <div class="h-full pointer-events-none p-1">
                <img src="${s.immagine_url || ''}" alt="${s.nome}" class="h-full w-auto object-contain transition-transform group-hover:scale-105">
            </div>
        </div>`,

    // Stato vuoto
    EMPTY: `<p class="text-[10px] text-slate-600 uppercase tracking-widest w-full text-center py-4">Nessuna serie disponibile per questo editore</p>`
};
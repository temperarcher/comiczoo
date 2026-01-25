/**
 * VERSION: 1.0.0 

 */
export const series = {
    // Il guscio che contiene lo showcase orizzontale
    SECTION: (content) => `
        <div class="container mx-auto px-6 py-8">
            <h2 class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Le tue Serie</h2>
            <div id="ui-serie-section" class="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                ${content}
            </div>
        </div>`,

    // Il singolo item dello showcase (Proporzioni originali mantenute)
    ITEM: (serie) => `
        <div data-serie-id="${serie.id}" class="flex-none group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-500/50 transition-all cursor-pointer shadow-lg">
            <img src="${serie.immagine_url}" class="h-40 md:h-48 w-auto object-cover transition-all duration-500 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p class="text-white font-bold text-[10px] uppercase tracking-tighter drop-shadow-md">${serie.nome}</p>
            </div>
        </div>`
};
/**
 * VERSION: 1.0.0 

 */
export const publishers = {
    // Il guscio che contiene la barra degli editori
    SECTION: (content) => `
        <div class="bg-slate-800/50 border-b border-slate-700/50 py-4 overflow-x-auto no-scrollbar">
            <div id="ui-publisher-bar" class="container mx-auto flex gap-3 px-6 items-center">
                ${content}
            </div>
        </div>`,

    // La singola pillola dell'editore
    PILL: (pub, active) => `
        <button data-brand-id="${pub.id}" class="flex-none flex items-center gap-3 px-4 py-2 rounded-full border transition-all shrink-0 ${active ? 'bg-yellow-500 border-yellow-500 text-slate-900 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}">
            <img src="${pub.immagine_url}" class="w-5 h-5 object-contain rounded-sm" alt="${pub.nome}">
            <span class="text-xs uppercase tracking-wider">${pub.nome}</span>
        </button>`,

    // Il tasto "Tutti" per resettare il filtro
    ALL_BUTTON: (active) => `
        <button id="reset-brand-filter" class="px-5 py-2 rounded-full border text-xs uppercase font-bold tracking-widest transition-all shrink-0 ${active ? 'bg-white border-white text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}">
            Tutti
        </button>`
};
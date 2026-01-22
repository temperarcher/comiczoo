/**
 * VERSION: 1.4.0 (Fully Atomized)
 */
export const UI = {
    // HEADER: Barra di ricerca e filtri
    HEADER: () => `
        <header class="p-4 border-b border-slate-800 sticky top-0 bg-slate-950/90 backdrop-blur z-40">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
                <div class="relative w-full md:w-96">
                    <input type="text" id="search-input" 
                           class="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                           placeholder="Cerca numero o titolo...">
                </div>
                <div class="flex gap-2">
                    <button data-filter="all" class="px-3 py-1.5 rounded-lg bg-yellow-500 text-black font-bold text-xs transition-transform active:scale-95">Tutti</button>
                    <button data-filter="celo" class="px-3 py-1.5 rounded-lg bg-slate-800 text-xs hover:bg-slate-700 transition-colors">Celo</button>
                    <button data-filter="manca" class="px-3 py-1.5 rounded-lg bg-slate-800 text-xs hover:bg-slate-700 transition-colors">Manca</button>
                </div>
            </div>
        </header>`,

    // PUBLISHER: Barra codici editori (v7.4)
    PUBLISHER_SECTION: (contentHtml) => `
        <section class="bg-slate-800/30 border-b border-slate-800 py-3">
            <div class="container mx-auto px-6">
                <div id="codici-bar" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                    ${contentHtml}
                </div>
            </div>
        </section>`,

    // SERIE: Showcase orizzontale
    SERIE_SECTION: (contentHtml) => `
        <section class="max-w-7xl mx-auto px-4 mt-6">
            <div id="serie-showcase" class="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center">
                ${contentHtml}
            </div>
        </section>`,

    // MAIN: Griglia principale
    MAIN_GRID_CONTAINER: () => `
        <main class="max-w-7xl mx-auto p-4 md:p-6">
            <div id="main-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                <div class="col-span-full text-center py-20 text-slate-600 italic">Seleziona una serie per iniziare</div>
            </div>
        </main>`,

    // MODAL: Struttura fissa del modale
    MODAL_WRAPPER: () => `
        <div id="issue-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div class="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative custom-scrollbar">
                <button id="close-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white z-10 transition-all hover:rotate-90">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div id="modal-body" class="p-6"></div>
            </div>
        </div>`,

    // Elementi atomici (già consolidati)
    PUBLISHER_PILL: (data, isActive) => {
        const activeClass = isActive 
            ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)] opacity-100 grayscale-0' 
            : 'border-slate-800 bg-slate-900/40 grayscale opacity-50 hover:opacity-100 hover:grayscale-0';
        return `<div class="flex-none ${activeClass} border rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 cursor-pointer" data-brand-id="${data.id}" title="${data.nome}">
                    <img src="${data.immagine_url}" class="w-8 md:w-10 h-8 md:h-10 object-contain">
                </div>`;
    },

    ALL_PUBLISHERS_BUTTON: (isActive) => {
        const activeClass = isActive 
            ? 'border-yellow-500 bg-yellow-500 text-black' 
            : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-white hover:border-slate-600';
        return `<div class="flex-none ${activeClass} border rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 cursor-pointer text-[10px] font-black uppercase tracking-tighter" id="reset-brand-filter">Tutti</div>`;
    },

    SERIE_ITEM: (serie) => `
        <div class="flex-none group cursor-pointer" data-serie-id="${serie.id}" title="${serie.nome}">
            <div class="relative overflow-hidden rounded-lg border border-slate-800 group-hover:border-yellow-500 transition-all shadow-lg">
                <img src="${serie.immagine_url}" class="h-40 md:h-48 w-auto object-cover transition-transform group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p class="text-[8px] font-bold text-white truncate uppercase tracking-widest">${serie.nome}</p>
                </div>
            </div>
        </div>`,

    ISSUE_CARD: (issue, badgeStyle) => `
        <div class="flex flex-col bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-yellow-500 transition-all cursor-pointer" data-id="${issue.id}">
            <img src="${issue.immagine_url}" class="w-full h-auto aspect-[2/3] object-cover" loading="lazy">
            <div class="p-3 flex-1">
                <div class="flex justify-between items-start">
                    <span class="text-[9px] uppercase font-bold text-slate-500">${issue.testata}</span>
                    <span class="px-2 py-0.5 text-[8px] rounded-full border ${badgeStyle}">${issue.possesso}</span>
                </div>
                <h3 class="font-bold text-yellow-500 text-sm leading-tight mt-1 line-clamp-2">${issue.nome}</h3>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-white font-mono">#${issue.numero}</span>
                    <span class="text-[10px] text-slate-400">${issue.annata}</span>
                </div>
            </div>
        </div>`,

    MODAL_LAYOUT: (issue, storiesHtml) => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <img src="${issue.immagine_url}" class="w-full rounded-xl shadow-2xl border border-slate-700">
                <div class="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div class="bg-slate-800/50 p-2 rounded border border-slate-700">
                        <span class="block text-[8px] text-slate-500 uppercase">Condizione</span>
                        <span class="text-xs text-white">${issue.condizione}</span>
                    </div>
                    <div class="bg-slate-800/50 p-2 rounded border border-slate-700">
                        <span class="block text-[8px] text-slate-500 uppercase">Valore</span>
                        <span class="text-xs text-green-400 font-bold">${issue.valore} €</span>
                    </div>
                </div>
            </div>
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <img src="${issue.brand_logo}" class="h-6 w-auto brightness-200">
                    <span class="text-slate-500 text-[10px] uppercase tracking-tighter">${issue.testata}</span>
                </div>
                <h2 class="text-2xl font-black text-white leading-tight">${issue.nome}</h2>
                <p class="text-yellow-500 font-mono mb-6">#${issue.numero} — ${issue.annata}</p>
                <div class="space-y-2">
                    <h3 class="text-[9px] uppercase font-bold text-slate-500 border-b border-slate-800 pb-1">Sommario Albo</h3>
                    <div class="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        ${storiesHtml}
                    </div>
                </div>
            </div>
        </div>`,

    STORY_ROW: (storia, si, charsHtml) => `
        <div class="py-3 border-l-2 border-yellow-600 pl-4 mb-3 bg-slate-800/30 rounded-r-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[9px] text-yellow-600 font-bold uppercase">Pos. ${si.posizione}</span>
                <h4 class="text-white font-bold flex-1 ml-3 text-sm">${storia.nome}</h4>
            </div>
            <div class="flex wrap gap-1.5">${charsHtml}</div>
        </div>`,

    CHARACTER_TAG: (p) => `
        <div class="flex items-center gap-1 bg-slate-950 rounded-full pr-2 border border-slate-800">
            <img src="${p.immagine_url}" class="w-5 h-5 rounded-full object-cover">
            <span class="text-[9px] text-slate-400">${p.nome}</span>
        </div>`
};
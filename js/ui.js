/**
 * VERSION: 1.5.0 (Header v7.4 Consolidato + Atomizzazione)
 * SCOPO: Custode unico del design per evitare modifiche accidentali in index.html
 */
export const UI = {
    // Ripristino esatto Header v7.4
    HEADER: () => `
        <header class="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-50 shadow-2xl">
            <div class="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
                <h1 id="logo-reset" class="text-3xl font-black text-yellow-500 tracking-tighter uppercase italic cursor-pointer select-none shrink-0">Comic Archive</h1>
                
                <div class="flex flex-col md:flex-row w-full gap-4 items-center">
                    <div class="relative w-full">
                        <input type="text" id="serie-search" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-full pl-12 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="Cerca una serie...">
                        <span class="absolute left-4 top-3.5 opacity-40">🔍</span>
                        <div id="serie-results" class="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl hidden shadow-2xl max-h-60 overflow-y-auto custom-scrollbar z-50"></div>
                    </div>

                    <div class="flex gap-3 items-center shrink-0">
                        <button id="btn-add-albo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-5 py-2.5 rounded-full uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-yellow-500/20">
                            + Nuovo Albo
                        </button>
                        
                        <div class="flex bg-slate-900 p-1 rounded-full border border-slate-700 mr-1">
                            <button id="view-grid" class="view-btn active px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white" title="Vista Griglia">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </button>
                            <button id="view-list" class="view-btn px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white" title="Vista Lista">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>

                        <div class="flex bg-slate-900 p-1 rounded-full border border-slate-700">
                            <button data-filter="all" id="btn-all" class="filter-btn active px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all">Tutti</button>
                            <button data-filter="celo" id="btn-celo" class="filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all">Celo</button>
                            <button data-filter="manca" id="btn-manca" class="filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all">Manca</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>`,

    PUBLISHER_SECTION: (contentHtml) => `
        <section class="bg-slate-800/30 border-b border-slate-800 py-3">
            <div class="container mx-auto px-6">
                <div id="codici-bar" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                    ${contentHtml}
                </div>
            </div>
        </section>`,

    SERIE_SECTION: (contentHtml) => `
        <section class="max-w-7xl mx-auto px-4 mt-6">
            <div id="serie-showcase" class="flex gap-4 overflow-x-auto pb-4 no-scrollbar items-center">
                ${contentHtml}
            </div>
        </section>`,

    MAIN_GRID_CONTAINER: () => `
        <main class="max-w-7xl mx-auto p-4 md:p-6">
            <div id="main-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                <div class="col-span-full text-center py-20 text-slate-600 italic">Seleziona una serie per iniziare</div>
            </div>
        </main>`,

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

    PUBLISHER_PILL: (data, isActive) => {
        const activeClass = isActive 
            ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)] opacity-100 grayscale-0' 
            : 'border-slate-800 bg-slate-900/40 grayscale opacity-50 hover:opacity-100 hover:grayscale-0';
        return `
            <div class="flex-none ${activeClass} border rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 cursor-pointer" 
                 data-brand-id="${data.id}" title="${data.nome}">
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
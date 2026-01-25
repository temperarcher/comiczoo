/**
 * VERSION: 1.0.0 

 */
export const container = (gridContent = '') => `
    <div id="main-display-area" class="container mx-auto px-6 pb-20">
        <div class="flex items-center gap-4 mb-8">
            <div class="h-px flex-1 bg-slate-800"></div>
            <div class="flex gap-2">
                <button data-filter="all" class="filter-btn bg-yellow-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Tutti</button>
                <button data-filter="celo" class="filter-btn text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Celo</button>
                <button data-filter="manca" class="filter-btn text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Manca</button>
            </div>
        </div>
        <div id="main-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            ${gridContent}
        </div>
    </div>`;
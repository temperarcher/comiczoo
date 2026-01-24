/**
 * VERSION: 1.0.0 

 */
export const display = {
    CONTAINER: () => `
        <div class="container mx-auto px-6 pb-20">
            <div class="flex items-center gap-4 mb-8">
                <div class="h-px flex-1 bg-slate-800"></div>
                <div class="flex gap-2">
                    <button data-filter="all" class="filter-btn bg-yellow-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20">Tutti</button>
                    <button data-filter="celo" class="filter-btn text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Celo</button>
                    <button data-filter="manca" class="filter-btn text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Manca</button>
                </div>
            </div>
            <div id="main-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"></div>
        </div>`,
    CARD: (issue, badgeStyle) => `
        <div data-id="${issue.id}" class="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-yellow-500/50 transition-all cursor-pointer shadow-xl">
            <div class="relative aspect-[3/4] overflow-hidden">
                <img src="${issue.immagine_url}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-700">
                <div class="absolute top-3 right-3">
                    <span class="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border backdrop-blur-md ${badgeStyle}">${issue.possesso}</span>
                </div>
            </div>
            <div class="p-4">
                <div class="flex flex-col gap-1">
                    <span class="text-yellow-500 font-black text-[10px] uppercase tracking-widest">${issue.testata}</span>
                    <h3 class="text-white font-bold text-sm truncate uppercase leading-tight">${issue.nome}</h3>
                    <div class="flex justify-between items-center mt-2 pt-2 border-t border-slate-700/50">
                        <span class="text-slate-500 font-bold text-xs italic">Anno ${issue.annata}</span>
                        <span class="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-black">#${issue.numero}</span>
                    </div>
                </div>
            </div>
        </div>`
};
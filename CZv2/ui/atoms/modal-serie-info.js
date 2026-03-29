// CZv2/ui/atoms/modal-serie-info.js
export const MODAL_SERIE_INFO = {
    RENDER: (serie, isAdmin = false) => {
        if (!serie) return `<div class="p-4 bg-red-900/20 rounded-xl border border-red-500/50 text-[10px] uppercase text-red-500 font-bold">Dati Serie Mancanti</div>`;

        return `
            <div class="relative group overflow-hidden bg-slate-800/20 rounded-xl border border-white/5 transition-all duration-500 hover:border-yellow-500/30">
                <div class="absolute inset-0 opacity-10 blur-2xl pointer-events-none">
                    <img src="${serie.immagine_url}" class="w-full h-full object-cover">
                </div>

                <div class="relative p-5 flex items-center gap-6">
                    <div class="relative h-12 shrink-0 bg-slate-900 rounded-lg border border-white/10 overflow-hidden shadow-xl flex items-center justify-center">
                        <img src="${serie.immagine_url}" class="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700">
                        ${isAdmin ? `
                            <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span class="text-[8px] font-black text-white uppercase">Cambia</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="flex-1">
                        ${isAdmin 
                            ? `<input type="text" id="edit-serie-nome" 
                                      class="bg-transparent text-xl font-black text-white uppercase tracking-tighter w-full focus:outline-none focus:text-yellow-500 border-b border-transparent focus:border-yellow-500/50 transition-all" 
                                      value="${serie.nome}">`
                            : `<h3 class="text-xl font-black text-white uppercase tracking-tighter">${serie.nome}</h3>`
                        }
                    </div>

                    ${isAdmin ? `
                        <div class="flex flex-col gap-2">
                            <button title="Gestisci Testate, Annate e Albi" class="p-2 bg-slate-900 text-slate-400 hover:text-yellow-500 rounded-lg border border-white/5 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
};
// CZv2/ui/atoms/modal-serie-info.js
export const MODAL_SERIE_INFO = {
    RENDER: (serie, issuePossesso, isAdmin = false) => {
        if (!serie) return `<div class="p-4 bg-red-900/20 rounded-xl border border-red-500/50 text-[10px] uppercase text-red-500 font-bold">Dati Serie Mancanti</div>`;

        const isCelo = issuePossesso === 'celo';

        return `
            <div class="relative group overflow-hidden bg-slate-800/20 rounded-xl border border-white/5 transition-all duration-500 hover:border-yellow-500/30">
                <div class="absolute inset-0 opacity-10 blur-2xl pointer-events-none">
                    <img src="${serie.immagine_url}" class="w-full h-full object-cover">
                </div>

                <div class="relative p-5 flex items-center justify-between gap-6">
                    
                    <div class="flex items-center gap-6">
                        <div class="relative h-12 shrink-0 bg-slate-900 rounded-lg border border-white/10 overflow-hidden shadow-xl flex items-center justify-center">
                            <img src="${serie.immagine_url}" class="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700">
                        </div>

                        <div class="flex-1">
                            ${isAdmin 
                                ? `<input type="text" id="edit-serie-nome" 
                                          class="bg-transparent text-xl font-black text-white uppercase tracking-tighter w-full focus:outline-none focus:text-yellow-500 border-b border-transparent focus:border-yellow-500/50 transition-all" 
                                          value="${serie.nome}">`
                                : `<h3 class="text-xl font-black text-white uppercase tracking-tighter">${serie.nome}</h3>`
                            }
                        </div>
                    </div>

                    <div class="flex items-center shrink-0">
                        ${isAdmin ? `
                            <button id="toggle-possesso" class="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-4 py-2 rounded-full hover:border-yellow-500/50 transition-all active:scale-95 shadow-lg">
                                <div class="w-2 h-2 rounded-full ${isCelo ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'bg-slate-600'}"></div>
                                <span class="text-[10px] font-black uppercase tracking-[0.2em] ${isCelo ? 'text-white' : 'text-slate-500'}">
                                    ${issuePossesso}
                                </span>
                            </button>
                        ` : `
                            <div class="flex items-center gap-2 px-4 py-2 bg-slate-900/30 rounded-full border border-white/5">
                                <div class="w-1.5 h-1.5 rounded-full ${isCelo ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-slate-600'}"></div>
                                <span class="text-[10px] font-black uppercase tracking-[0.2em] ${isCelo ? 'text-slate-200' : 'text-slate-500'}">
                                    ${issuePossesso}
                                </span>
                            </div>
                        `}
                    </div>

                </div>
            </div>
        `;
    }
};
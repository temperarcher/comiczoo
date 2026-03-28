// CZv2/ui/atoms/modal-header.js
export const MODAL_HEADER = {
    RENDER: (issue, isAdmin = false) => {
        // Logica per il testo del supplemento
        let supplementoHtml = '';
        if (issue.supplemento) {
            const s = issue.supplemento;
            const dataFormattata = s.data_pubblicazione 
                ? new Date(s.data_pubblicazione).toLocaleDateString('it-IT') 
                : 'n.d.';
            
            supplementoHtml = `
                <span class="text-slate-500 mx-2">—</span>
                <span class="text-[10px] text-slate-400 uppercase tracking-tight">
                    Supplemento a: <b class="text-slate-200">${s.serie?.nome} n.${s.numero}</b> del ${dataFormattata}
                </span>
            `;
        }

        return `
            <div class="flex justify-between items-start p-6 border-b border-white/5 bg-slate-900/50">
                <div class="flex flex-col gap-1">
                    <div class="flex items-baseline flex-wrap gap-y-1">
                        ${issue.annata ? `<span class="text-slate-500 font-medium text-xs uppercase tracking-widest mr-3">${issue.annata.nome}</span>` : ''}
                        <span class="text-yellow-500 font-black italic text-3xl tracking-tighter mr-3">#${issue.numero}</span>
                        ${issue.nome ? `<h2 class="text-white font-bold text-xl uppercase tracking-tight mr-2">${issue.nome}</h2>` : ''}
                        ${supplementoHtml}
                    </div>
                    
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[11px] font-black text-white uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded">${issue.serie?.nome || 'Serie non definita'}</span>
                        ${issue.testata ? `
                            <span class="text-slate-600 text-xs">/</span>
                            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">${issue.testata.nome}</span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="flex items-center gap-6">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <span class="text-[9px] font-black text-slate-500 group-hover:text-yellow-500 transition-colors uppercase">Admin Mode</span>
                        <div class="relative">
                            <input type="checkbox" id="admin-mode-toggle" class="sr-only peer" ${isAdmin ? 'checked' : ''}>
                            <div class="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:bg-yellow-500/20 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-slate-600 peer-checked:after:bg-yellow-500 after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:after:translate-x-4"></div>
                        </div>
                    </label>

                    <button id="close-modal" class="text-slate-500 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }
};
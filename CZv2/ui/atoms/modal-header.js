// CZv2/ui/atoms/modal-header.js
export const MODAL_HEADER = {
    RENDER: (issue, isAdmin = false) => `
        <div class="flex justify-between items-center p-6 border-b border-white/5 bg-slate-900/50">
            <div class="flex items-center gap-4">
                <span class="text-yellow-500 font-black italic text-2xl tracking-tighter">#${issue.numero}</span>
                <div>
                    <h2 class="text-white font-bold leading-none uppercase tracking-tight">${issue.nome || 'Senza Titolo'}</h2>
                    <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">${issue.serie?.nome || 'Serie non definita'}</p>
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
    `
};
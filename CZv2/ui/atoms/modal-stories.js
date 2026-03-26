// CZv2/ui/atoms/modal-stories.js
export const MODAL_STORIES = {
    RENDER: (stories = [], isAdmin = false) => `
        <div class="space-y-6">
            <div class="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sommario Storie</h3>
                ${isAdmin ? `<button class="text-[9px] bg-yellow-500 text-black px-2 py-1 rounded font-bold hover:bg-yellow-400">+ AGGIUNGI</button>` : ''}
            </div>
            
            <div class="space-y-4">
                ${stories.length > 0 ? stories.map(s => `
                    <div class="group relative bg-slate-800/20 p-4 rounded-xl border border-white/5">
                        <div class="flex justify-between items-start mb-3">
                            <h4 class="text-sm font-bold text-yellow-500/80 uppercase italic">${s.storia?.nome || 'Titolo Storia'}</h4>
                            ${isAdmin ? `<button class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>` : ''}
                        </div>
                        
                        <div class="flex flex-wrap gap-2">
                            ${(s.storia?.personaggio_storia || []).map(ps => `
                                <div class="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-full border border-white/5">
                                    <div class="w-3 h-3 rounded-full bg-slate-700 overflow-hidden">
                                        ${ps.personaggio?.immagine_url ? `<img src="${ps.personaggio.immagine_url}" class="w-full h-full object-cover">` : ''}
                                    </div>
                                    <span class="text-[9px] text-slate-400 font-medium">${ps.personaggio?.nome}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('') : '<p class="text-[10px] text-slate-600 italic">Nessuna storia censita per questo albo.</p>'}
            </div>
        </div>
    `
};
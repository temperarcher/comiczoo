// CZv2/ui/atoms/issue-card.js
export const ISSUE_CARD = {
    RENDER: (issue) => `
        <div class="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 shadow-xl">
            <div class="relative aspect-[2/3] overflow-hidden bg-slate-800">
                <img src="${issue.immagine_url || 'https://via.placeholder.com/300x450?text=No+Cover'}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                
                <div class="absolute top-2 right-2">
                    <span class="px-2 py-1 text-[8px] font-black uppercase rounded shadow-lg ${issue.possesso === 'celo' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}">
                        ${issue.possesso}
                    </span>
                </div>
            </div>
            
            <div class="p-3">
                <div class="flex justify-between items-start mb-1">
                    <span class="text-yellow-500 font-black text-lg">#${issue.numero}</span>
                    <span class="text-[9px] text-slate-500 font-bold uppercase">${issue.annata?.nome || ''}</span>
                </div>
                <p class="text-[10px] text-slate-400 truncate uppercase font-medium">${issue.editore?.nome || 'Editore Ignoto'}</p>
                
                <div class="mt-3 flex justify-between items-center border-t border-slate-800 pt-2">
                    <span class="text-[9px] text-slate-500 uppercase tracking-tighter italic">Cond: ${issue.condizione || '-'}/5</span>
                    <span class="text-[10px] font-bold text-white">${issue.valore > 0 ? issue.valore + ' €' : ''}</span>
                </div>
            </div>
        </div>
    `
};
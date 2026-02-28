// CZv2/ui/atoms/issue-card.js
export const ISSUE_CARD = {
    RENDER: (issue) => {
        // Controllo rigoroso sulle stringhe "celo" / "manca"
        const isOwned = issue.possesso === "celo";
        
        // Debug per verificare cosa arriva effettivamente dal DB
        // console.log(`Albo #${issue.numero} - Stato: ${issue.possesso}`);

        // Se "celo" -> Colore e Opacità 100%
        // Se "manca" -> Greyscale e Opacità 40%
        const statusClasses = isOwned 
            ? "border-yellow-500/50 opacity-100 shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
            : "border-slate-800 opacity-40 grayscale contrast-125 shadow-none";

        return `
            <div class="group relative flex flex-col gap-2 transition-all duration-500 hover:-translate-y-2">
                <div class="relative aspect-[2/3] rounded-lg border-2 overflow-hidden bg-slate-900 ${statusClasses} transition-all duration-500 group-hover:border-yellow-500">
                    <img src="${issue.immagine_url || 'https://via.placeholder.com/300x450?text=?'}" 
                         class="w-full h-full object-cover" 
                         loading="lazy">
                    
                    <div class="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 z-10">
                        <span class="text-[10px] font-black text-white italic">#${issue.numero}</span>
                    </div>

                    ${!isOwned ? `
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-950/20">
                            <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] -rotate-12 border border-white/10 px-2 py-1">Mancante</span>
                        </div>
                    ` : ''}
                </div>

                <div class="flex flex-col px-1">
                    <div class="flex justify-between items-start gap-2">
                        <h3 class="text-[10px] font-bold text-slate-300 truncate uppercase tracking-tight group-hover:text-yellow-500 transition-colors">
                            ${issue.numero} - ${issue.annata?.nome || ''}
                        </h3>
                    </div>
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-[8px] font-black text-slate-600 uppercase">${issue.condizione || ''}</span>
                        ${issue.valore ? `<span class="text-[8px] font-bold text-yellow-600 tracking-tighter">${issue.valore}€</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
};
// CZv2/ui/atoms/codice-editore-pill.js
export const CODICE_EDITORE_PILL = {
    RENDER: (item, isActive) => {
        // Se è il tasto "TUTTI", usiamo il formato rettangolare con testo
        if (item.id === 'all') {
            return `
                <button data-id="all" 
                    class="cz-pill-codice-editore shrink-0 h-9 px-6 rounded-lg border flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-all
                    ${isActive 
                        ? 'bg-yellow-500 border-yellow-500 text-black' 
                        : 'bg-slate-800 border-slate-700 text-yellow-500 hover:border-yellow-500/50'}">
                    TUTTI
                </button>
            `;
        }

        // Se è un codice editore, usiamo il formato quadrato con immagine
        return `
            <div data-id="${item.id}" 
                class="cz-pill-codice-editore shrink-0 w-9 h-9 rounded-lg border overflow-hidden flex items-center justify-center p-0 cursor-pointer transition-all
                ${isActive 
                    ? 'bg-yellow-500 border-yellow-500' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'}">
                
                ${item.immagine_url 
                    ? `<img src="${item.immagine_url}" 
                         class="w-full h-full object-cover transition-all duration-300 ${isActive ? '' : 'grayscale hover:grayscale-0'}">` 
                    : `<span class="text-[10px] font-bold text-slate-400">${item.nome.substring(0,2)}</span>`}
            </div>
        `;
    }
};
// CZv2/ui/atoms/codice-editore-pill.js
export const CODICE_EDITORE_PILL = {
    // Cambiato da EDITORE a RENDER o CODICE_PILL per massima chiarezza
    RENDER: (item, isActive) => `
        <button data-id="${item.id}" 
            class="cz-pill-codice-editore shrink-0 h-12 px-5 rounded-2xl border transition-all duration-300 flex items-center gap-3 group
            ${isActive 
                ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800'}">
            
            ${item.immagine_url 
                ? `<img src="${item.immagine_url}" class="h-6 w-auto object-contain ${isActive ? '' : 'grayscale group-hover:grayscale-0 transition-all'}">` 
                : `<span class="text-[11px] font-black uppercase tracking-widest">${item.nome}</span>`}
        </button>
    `
};
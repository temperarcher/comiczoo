// CZv2/ui/atoms/series-pill.js
export const SERIES_PILL = {
    RENDER: (item, isActive) => `
        <button data-id="${item.id}" 
            class="cz-series-pill shrink-0 h-9 px-4 rounded-lg border flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all
            ${isActive 
                ? 'bg-slate-100 border-white text-black shadow-lg shadow-white/10' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}">
            ${item.nome}
        </button>
    `
};
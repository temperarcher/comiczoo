// CZv2/ui/atoms/series-pill.js
export const SERIES_PILL = {
    RENDER: (item, isActive) => `
        <div data-id="${item.id}" 
            class="cz-series-pill shrink-0 h-28 rounded-xl border-2 overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300 group
            ${isActive 
                ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-105 z-10' 
                : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600 shadow-xl'}">
            
            <img src="${item.immagine_url || 'https://via.placeholder.com/150?text=?'}" 
                 class="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                 title="${item.nome}"
                 alt="${item.nome}">
        </div>
    `
};
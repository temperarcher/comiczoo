// CZv2/ui/atoms/toggle-filter.js
export const TOGGLE_FILTER = {
    RENDER: (currentFilter) => {
        const options = [
            { id: 'all', label: 'TUTTO' },
            { id: 'celo', label: 'CELO' },
            { id: 'manca', label: 'MANCA' }
        ];

        return `
            <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                ${options.map(opt => `
                    <button data-filter="${opt.id}" 
                        class="cz-filter-btn px-3 py-1.5 rounded-lg text-[9px] font-black transition-all duration-300
                        ${currentFilter === opt.id 
                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                            : 'text-slate-500 hover:text-white'}">
                        ${opt.label}
                    </button>
                `).join('')}
            </div>
        `;
    }
};
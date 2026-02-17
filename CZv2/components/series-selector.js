// CZv2/components/series-selector.js
import { Fetcher } from '../api/fetcher.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';

export const SeriesSelector = {
    async init() {
        // 1. Ascolta il segnale di cambio codice editore
        window.addEventListener(CZ_EVENTS.EDITORE_CHANGED, () => {
            this.render();
        });
        
        // 2. Primo caricamento
        await this.render();
    },

    async render() {
        const container = document.getElementById('series-selector-container');
        if (!container) return;

        container.innerHTML = `<div class="p-8 text-center text-slate-700 text-[10px] animate-pulse uppercase tracking-[0.2em]">Cerco Serie...</div>`;

        try {
            const codiceEditoreId = AppState.current.codice_editore_id;
            const serieList = await Fetcher.getSerieByCodiceEditore(codiceEditoreId);

            if (serieList.length === 0) {
                container.innerHTML = `<div class="p-8 text-center text-slate-500 text-[10px] uppercase">Nessuna serie per questo editore</div>`;
                return;
            }

            container.innerHTML = `
                <div class="flex flex-col gap-1">
                    <h3 class="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-slate-900 mb-2">
                        Serie (${serieList.length})
                    </h3>
                    <div class="space-y-1">
                        ${serieList.map(s => `
                            <button data-id="${s.id}" 
                                class="cz-series-pill w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 group
                                ${AppState.current.serie_id === s.id 
                                    ? 'bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500' 
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border-l-2 border-transparent'}">
                                <span class="text-[11px] font-bold uppercase tracking-tight">${s.nome}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            this.attachEvents();
        } catch (err) {
            console.error(err);
            container.innerHTML = `<div class="p-4 text-red-500 text-[10px] text-center uppercase">Errore nel caricamento</div>`;
        }
    },

    attachEvents() {
        const pills = document.querySelectorAll('.cz-series-pill');
        pills.forEach(p => {
            p.onclick = () => {
                const id = p.dataset.id;
                AppState.set('serie_id', id);
                
                // Avvisiamo la griglia che deve caricare gli albi di questa serie
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.SERIE_CHANGED, { detail: id }));
                
                // Rinfreschiamo per mostrare quale serie è selezionata (giallo)
                this.render();
            };
        });
    }
};
// CZv2/components/series-selector.js
import { Fetcher } from '../api/fetcher.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';
import { SERIES_PILL } from '../ui/atoms/series-pill.js';
import { TOGGLE_FILTER } from '../ui/atoms/toggle-filter.js';

export const SeriesSelector = {
    async init() {
        if (!AppState.current.filter) AppState.set('filter', 'all');

        window.addEventListener(CZ_EVENTS.EDITORE_CHANGED, () => {
            AppState.set('serie_id', null);
            this.render();
        });
        await this.render();
    },

    async render() {
        const container = document.getElementById('series-selector-container');
        if (!container) return;

        try {
            const codiceId = AppState.current.codice_editore_id;
            const serieList = await Fetcher.getSerieByCodiceEditore(codiceId);
            const currentFilter = AppState.current.filter || 'all';

            if (serieList.length === 0) {
                container.innerHTML = `<div class="bg-slate-950 px-6 py-8 text-[10px] text-slate-700 uppercase tracking-[0.4em] text-center">Nessuna serie trovata</div>`;
                return;
            }

            container.innerHTML = `
                <div class="relative bg-slate-950 border-b border-slate-900">
                    <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
                    
                    <div class="container mx-auto px-6">
                        <div class="flex gap-6 overflow-x-auto py-4 items-center bg-slate-950 scroll-smooth 
                                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            
                            <div class="shrink-0 flex items-center gap-3 border-r border-slate-800 pr-6 z-20">
                                ${TOGGLE_FILTER.RENDER(currentFilter)}
                            </div>
                            
                            <div class="flex gap-6 items-center pr-20 z-20">
                                ${serieList.map(s => SERIES_PILL.RENDER(s, AppState.current.serie_id === s.id)).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
                </div>
            `;

            this.attachEvents();
        } catch (err) {
            console.error("Errore SeriesSelector:", err);
        }
    },

    attachEvents() {
        document.querySelectorAll('.cz-series-pill').forEach(p => {
            p.onclick = () => {
                AppState.set('serie_id', p.dataset.id);
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.SERIE_CHANGED, { detail: p.dataset.id }));
                this.render();
            };
        });

        document.querySelectorAll('.cz-filter-btn').forEach(btn => {
            btn.onclick = () => {
                const newFilter = btn.dataset.filter;
                AppState.set('filter', newFilter);
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.SERIE_CHANGED)); 
                this.render();
            };
        });
    }
};
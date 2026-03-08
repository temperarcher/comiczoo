// CZv2/components/series-selector.js
import { Fetcher } from '../api/fetcher.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';
import { SERIES_PILL } from '../ui/atoms/series-pill.js';
import { TOGGLE_FILTER } from '../ui/atoms/toggle-filter.js'; // <--- NUOVO

export const SeriesSelector = {
    async init() {
        // Inizializziamo lo stato del filtro se non esiste
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

            container.innerHTML = `
                <div class="container mx-auto px-6">
                    <div class="flex gap-6 overflow-x-auto py-4 no-scrollbar items-center">
                        
                        <div class="shrink-0 flex items-center gap-3 border-r border-slate-800 pr-6">
                            ${TOGGLE_FILTER.RENDER(currentFilter)}
                        </div>
                        
                        <div class="flex gap-6 items-center">
                            ${serieList.map(s => SERIES_PILL.RENDER(s, AppState.current.serie_id === s.id)).join('')}
                        </div>
                    </div>
                </div>
            `;

            this.attachEvents();
        } catch (err) {
            console.error("Errore SeriesSelector:", err);
        }
    },

    attachEvents() {
        // Eventi per le Serie
        document.querySelectorAll('.cz-series-pill').forEach(p => {
            p.onclick = () => {
                AppState.set('serie_id', p.dataset.id);
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.SERIE_CHANGED, { detail: p.dataset.id }));
                this.render();
            };
        });

        // Eventi per il Filtro Toggle
        document.querySelectorAll('.cz-filter-btn').forEach(btn => {
            btn.onclick = () => {
                const newFilter = btn.dataset.filter;
                AppState.set('filter', newFilter);
                
                // Notifichiamo la Grid che deve rifiltrare i dati
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.SERIE_CHANGED)); 
                this.render();
            };
        });
    }
};
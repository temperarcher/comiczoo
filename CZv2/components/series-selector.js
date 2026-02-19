// CZv2/components/series-selector.js
import { Fetcher } from '../api/fetcher.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';
import { SERIES_PILL } from '../ui/atoms/series-pill.js';

export const SeriesSelector = {
    async init() {
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

            if (serieList.length === 0) {
                container.innerHTML = `
                    <div class="container mx-auto px-6 py-4 text-[10px] text-slate-600 uppercase tracking-widest italic font-bold">
                        Nessuna serie per questo editore
                    </div>`;
                return;
            }

            container.innerHTML = `
                <div class="container mx-auto px-6">
                    <div class="flex gap-4 overflow-x-auto py-4 no-scrollbar items-center">
                        <div class="flex flex-col justify-center mr-2 shrink-0 border-r border-slate-800 pr-4">
                            <span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Seleziona</span>
                            <span class="text-[10px] font-black text-white uppercase tracking-widest">Serie</span>
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
        const pills = document.querySelectorAll('.cz-series-pill');
        pills.forEach(p => {
            p.onclick = () => {
                const id = p.dataset.id;
                AppState.set('serie_id', id);
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.SERIE_CHANGED, { detail: id }));
                this.render();
            };
        });
    }
};
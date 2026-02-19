// CZv2/components/series-selector.js
import { Fetcher } from '../api/fetcher.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';
import { SERIES_PILL } from '../ui/atoms/series-pill.js';

export const SeriesSelector = {
    async init() {
        window.addEventListener(CZ_EVENTS.EDITORE_CHANGED, () => {
            AppState.set('serie_id', null); // Resetta la serie se cambia l'editore
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

            container.innerHTML = `
                <div class="container mx-auto px-6">
                    <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar items-center">
                        <span class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mr-2">Serie:</span>
                        ${serieList.map(s => SERIES_PILL.RENDER(s, AppState.current.serie_id === s.id)).join('')}
                    </div>
                </div>
            `;

            this.attachEvents();
        } catch (err) {
            console.error(err);
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
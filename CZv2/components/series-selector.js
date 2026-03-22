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
                container.innerHTML = ``; // Nascondi se vuoto
                return;
            }

            container.innerHTML = `
                <div class="relative bg-slate-950 border-b border-slate-900 group">
                    <div class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
                    
                    <div class="container mx-auto px-6">
                        <div class="flex gap-6 overflow-x-auto py-5 items-center bg-slate-950 
                                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            
                            <div class="flex flex-col justify-center mr-2 shrink-0 border-r border-slate-800 pr-4">
                                <span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Catalogo</span>
                                <span class="text-[10px] font-black text-white uppercase tracking-widest">Serie</span>
                            </div>

                            <div class="flex gap-6 items-center pr-20">
                                ${serieList.map(s => SERIES_PILL.RENDER(s, AppState.current.serie_id === s.id)).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.attachEvents();
        } catch (err) { console.error(err); }
    },

    attachEvents() {
        document.querySelectorAll('.cz-series-pill').forEach(p => {
            p.onclick = () => {
                AppState.set('serie_id', p.dataset.id);
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.SERIE_CHANGED, { detail: p.dataset.id }));
                this.render();
            };
        });
    }
};
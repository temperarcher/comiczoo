// CZv2/components/grid.js
import { Fetcher } from '../api/fetcher.js';
import { ISSUE_CARD } from '../ui/atoms/issue-card.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';

export const Grid = {
    async init() {
        window.addEventListener(CZ_EVENTS.SERIE_CHANGED, () => this.render());
        
        window.addEventListener(CZ_EVENTS.EDITORE_CHANGED, () => {
            const container = document.getElementById('grid-container');
            if (container) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-32 opacity-20">
                        <div class="w-16 h-px bg-slate-500 mb-4"></div>
                        <p class="text-[10px] uppercase tracking-[0.5em]">Sfoglia il database</p>
                    </div>
                `;
            }
        });
    },

    async render() {
        const container = document.getElementById('grid-container');
        if (!container) return;

        const serieId = AppState.current.serie_id;
        if (!serieId) return;

        container.innerHTML = `
            <div class="flex justify-center py-20">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
            </div>
        `;

        try {
            const issues = await Fetcher.getIssuesBySerie(serieId);

            if (issues.length === 0) {
                container.innerHTML = `<p class="text-center py-20 text-slate-500 text-[10px] uppercase tracking-widest">Nessuna figurina trovata</p>`;
                return;
            }

            // Layout a griglia densa (Album style)
            container.innerHTML = `
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-x-6 gap-y-10">
                    ${issues.map(issue => ISSUE_CARD.RENDER(issue)).join('')}
                </div>
            `;
        } catch (err) {
            console.error(err);
            container.innerHTML = `<p class="text-center py-20 text-red-800 text-[10px] uppercase">Errore nel caricamento album</p>`;
        }
    }
};
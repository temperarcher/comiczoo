// CZv2/components/grid.js
import { Fetcher } from '../api/fetcher.js';
import { ISSUE_CARD } from '../ui/atoms/issue-card.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';

export const Grid = {
    async init() {
        // Ascolta quando viene selezionata una serie
        window.addEventListener(CZ_EVENTS.SERIE_CHANGED, () => {
            this.render();
        });

        // Se cambia l'editore, svuotiamo la griglia in attesa di una nuova serie
        window.addEventListener(CZ_EVENTS.EDITORE_CHANGED, () => {
            document.getElementById('grid-container').innerHTML = `
                <div class="h-full flex items-center justify-center text-slate-700 text-[10px] uppercase tracking-[0.3em]">
                    Seleziona una serie dalla sidebar
                </div>
            `;
        });
    },

    async render() {
        const container = document.getElementById('grid-container');
        if (!container) return;

        const serieId = AppState.current.serie_id;
        if (!serieId) return;

        container.innerHTML = `<div class="p-20 text-center animate-pulse text-yellow-500 uppercase text-xs font-black tracking-widest">Caricamento Albi...</div>`;

        try {
            const issues = await Fetcher.getIssuesBySerie(serieId);

            if (issues.length === 0) {
                container.innerHTML = `<div class="p-20 text-center text-slate-500 uppercase text-xs">Nessun albo trovato in questa serie</div>`;
                return;
            }

            container.innerHTML = `
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    ${issues.map(issue => ISSUE_CARD.RENDER(issue)).join('')}
                </div>
            `;
        } catch (err) {
            console.error(err);
            container.innerHTML = `<div class="p-20 text-center text-red-500 uppercase text-xs font-bold">Errore nel recupero dati</div>`;
        }
    }
};
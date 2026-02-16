// CZv2/components/topbar.js
import { Fetcher } from '../api/fetcher.js';
import { PILL } from '../ui/atoms/pill.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';

export const Topbar = {
    async render() {
        const container = document.getElementById('topbar-container');
        if (!container) return;

        // Mostriamo uno skeleton loader o un caricamento semplice
        container.innerHTML = `<div class="animate-pulse text-slate-700 text-[10px] uppercase tracking-widest">Caricamento Editori...</div>`;

        try {
            const codici = await Fetcher.getCodiciEditori();
            const currentId = AppState.current.codice_editore_id;

            container.innerHTML = `
                <div class="flex items-center gap-4 overflow-x-auto py-2 no-scrollbar">
                    ${PILL.EDITORE({ id: 'all', nome: 'TUTTI' }, currentId === 'all')}
                    ${codici.map(c => PILL.EDITORE(c, currentId === c.id)).join('')}
                </div>
            `;

            this.attachEvents();
        } catch (err) {
            container.innerHTML = `<div class="text-red-500 text-xs">Errore nel caricamento editori</div>`;
        }
    },

    attachEvents() {
        const pills = document.querySelectorAll('.cz-pill-editore');
        pills.forEach(p => {
            p.onclick = () => {
                const newId = p.dataset.id;
                
                // Aggiorniamo lo Stato
                AppState.set('codice_editore_id', newId);
                
                // Lanciamo l'evento globale: così Sidebar e Grid sapranno cosa fare
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.EDITORE_CHANGED, { detail: newId }));
                
                // Facciamo il re-render della barra per spostare l'evidenziazione gialla
                this.render();
            };
        });
    }
};
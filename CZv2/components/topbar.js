// CZv2/components/topbar.js
import { Fetcher } from '../api/fetcher.js';
import { CODICE_EDITORE_PILL } from '../ui/atoms/codice-editore-pill.js'; // Import aggiornato
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';

export const Topbar = {
    async render() {
        const container = document.getElementById('topbar-container');
        if (!container) return;

        try {
            const codici = await Fetcher.getCodiciEditori();
            const currentId = AppState.current.codice_editore_id;

            container.innerHTML = `
                <div class="flex items-center gap-4 overflow-x-auto py-2 no-scrollbar">
                    ${CODICE_EDITORE_PILL.RENDER({ id: 'all', nome: 'TUTTI' }, currentId === 'all')}
                    ${codici.map(c => CODICE_EDITORE_PILL.RENDER(c, currentId === c.id)).join('')}
                </div>
            `;

            this.attachEvents();
        } catch (err) {
            console.error("Errore Topbar:", err);
        }
    },

    attachEvents() {
        // Aggiornato anche il selettore CSS per coerenza
        const pills = document.querySelectorAll('.cz-pill-codice-editore');
        pills.forEach(p => {
            p.onclick = () => {
                const newId = p.dataset.id;
                AppState.set('codice_editore_id', newId);
                
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.EDITORE_CHANGED, { detail: newId }));
                this.render(); 
            };
        });
    }
};
// CZv2/components/topbar.js
import { Fetcher } from '../api/fetcher.js';
import { CODICE_EDITORE_PILL } from '../ui/atoms/codice-editore-pill.js';
import { AppState } from '../core/state.js';
import { CZ_EVENTS } from '../core/events.js';

export const Topbar = {
    async render() {
        const container = document.getElementById('topbar-container');
        if (!container) return;

        try {
            const codici = await Fetcher.getCodiciEditori();
            const currentId = AppState.current.codice_editore_id;

            // Applichiamo la struttura esatta che hai richiesto
            container.innerHTML = `
                <section class="bg-slate-800/30 border-b border-slate-800 py-3">
                    <div class="container mx-auto px-6">
                        <div class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                            ${CODICE_EDITORE_PILL.RENDER({ id: 'all', nome: 'TUTTI' }, currentId === 'all')}
                            ${codici.map(c => CODICE_EDITORE_PILL.RENDER(c, currentId === c.id)).join('')}
                        </div>
                    </div>
                </section>
            `;

            this.attachEvents();
        } catch (err) {
            console.error("Errore Topbar:", err);
        }
    },

    attachEvents() {
        const pills = document.querySelectorAll('.cz-pill-codice-editore');
        pills.forEach(p => {
            p.onclick = () => {
                const newId = p.dataset.id;
                AppState.set('codice_editore_id', newId);
                
                // Lanciamo l'evento per la Sidebar e la Grid
                window.dispatchEvent(new CustomEvent(CZ_EVENTS.EDITORE_CHANGED, { detail: newId }));
                
                // Re-render per aggiornare lo stato attivo (giallo)
                this.render(); 
            };
        });
    }
};
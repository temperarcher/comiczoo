/**
 * VERSION: 8.2.0
 * INIT: Caricamento simultaneo Showcase e Grid
 */
import { render } from './render.js';
import { store } from './store.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Inizializzazione Eventi Filtri
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            store.state.filter = btn.dataset.filter;
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.replace('bg-yellow-500', 'bg-slate-800'));
            btn.classList.replace('bg-slate-800', 'bg-yellow-500');
            render.refreshGrid();
        });
    });

    // Evento Ricerca dinamica
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        store.state.searchQuery = e.target.value;
        render.refreshGrid();
    });

    // Chiusura Modale
    document.getElementById('close-modal')?.addEventListener('click', () => {
        document.getElementById('issue-modal').classList.replace('flex', 'hidden');
    });

    // AVVIO APPLICAZIONE
    await render.refreshShowcases();
    await render.refreshGrid();
});
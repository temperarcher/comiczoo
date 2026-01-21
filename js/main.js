/**
 * VERSION: 8.0.0
 * VINCOLO: Solo logica di alto livello e bridge tra UI e Render.
 */
import { store } from './store.js';
import { render } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Comics Manager v8.0 Inizializzato");

    // 1. Inizializzazione: Carichiamo una serie predefinita (es. la prima trovata)
    // In produzione, questo ID verrebbe preso dall'URL o da una selezione utente.
    store.state.selectedSerie = { id: 'IL_TUO_SERIE_ID_QUI', nome: 'Serie Attuale' };
    
    // Primo caricamento della griglia
    render.refreshGrid();

    // 2. Gestione Ricerca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            store.state.searchQuery = e.target.value;
            render.refreshGrid();
        });
    }

    // 3. Gestione Filtri (Celo / Manca)
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Aggiorna UI bottoni
            filterButtons.forEach(b => b.classList.remove('bg-yellow-500', 'text-black'));
            btn.classList.add('bg-yellow-500', 'text-black');
            
            // Aggiorna stato e renderizza
            store.state.filter = btn.dataset.filter;
            render.refreshGrid();
        });
    } );

    // 4. Gestione Chiusura Modale
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.onclick = () => {
            document.getElementById('issue-modal').classList.add('hidden');
        };
    }
});
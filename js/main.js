/**
 * VERSION: 8.0.1
 * VINCOLO: Solo logica di alto livello e bridge tra UI e Render.
 */
import { store } from './store.js';
import { render } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Comics Manager v8.0 Inizializzato");

// 1. Inizializzazione Automatica
    try {
        // Recuperiamo la prima serie disponibile per popolare la pagina
        const { data: series, error } = await window.supabaseClient
            .from('serie')
            .select('id, nome')
            .limit(1);

        if (error) throw error;

        if (series && series.length > 0) {
            store.state.selectedSerie = { id: series[0].id, nome: series[0].nome };
            console.log(`Serie caricata: ${series[0].nome}`);
            
            // Primo caricamento della griglia
            await render.refreshGrid();
        } else {
            console.warn("Nessuna serie trovata nel database.");
            document.getElementById('main-grid').innerHTML = "Nessuna serie disponibile.";
        }
    } catch (err) {
        console.error("Errore durante l'inizializzazione:", err);
    }
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
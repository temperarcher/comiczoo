import { client } from '../core/supabase.js';
import { SERIES_UI } from './series-atoms.js'; // Importiamo gli atomi grafici

export async function renderSeriesSelector(codiceEditoreId = null) {
    const container = document.getElementById('series-selector-container');
    if (!container) return;

    let serieData = [];

    // Query con logica esatta: serie -> issue -> editore -> codice_editore
    const query = client.from('serie').select(`
        *,
        issue!inner(
            id,
            editore!inner(codice_editore_id)
        )
    `);

    if (codiceEditoreId && codiceEditoreId !== 'all') {
        query.eq('issue.editore.codice_editore_id', codiceEditoreId);
    }

    const { data, error } = await query.order('nome');
    
    if (error) {
        console.error('Errore DB Serie:', error);
        return;
    }

    // Deduplicazione atomica
    const uniqueSerie = Array.from(new Set((data || []).map(s => s.id)))
        .map(id => data.find(s => s.id === id));

    // Assemblaggio tramite atomi grafici
    const content = uniqueSerie.length > 0 
        ? uniqueSerie.map(s => SERIES_UI.ITEM(s)).join('') 
        : SERIES_UI.EMPTY;

    container.innerHTML = SERIES_UI.CONTAINER(content);

    attachSeriesEvents();
}

function attachSeriesEvents() {
    const items = document.querySelectorAll('.serie-item');
    items.forEach(item => {
        item.onclick = (e) => {
            const id = e.currentTarget.dataset.id;
            // UI Feedback
            items.forEach(el => el.classList.remove('ring-2', 'ring-yellow-500', 'border-yellow-500'));
            e.currentTarget.classList.add('ring-2', 'ring-yellow-500', 'border-yellow-500');
            
            window.dispatchEvent(new CustomEvent('comiczoo:filter-serie', { detail: id }));
        };
    });
}
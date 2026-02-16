import { client } from '../core/supabase.js';
import { SERIES_UI } from './series-atoms.js';
import { renderGrid } from './grid.js';

export async function renderSeriesSelector(codiceEditoreId = null) {
    const container = document.getElementById('series-selector-container');
    if (!container) return;

    // --- RIPRISTINO LOGICA DI ASCOLTO (Quella che mancava) ---
    if (!window.seriesListenerInitialized) {
        window.addEventListener('comiczoo:codice-changed', (e) => {
            renderSeriesSelector(e.detail);
        });
        window.seriesListenerInitialized = true;
    }

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
    if (error) return;

    const uniqueSerie = Array.from(new Set((data || []).map(s => s.id)))
        .map(id => data.find(s => s.id === id));

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
            items.forEach(i => i.classList.remove('border-yellow-500', 'bg-slate-700'));
            e.currentTarget.classList.add('border-yellow-500', 'bg-slate-700');
            renderGrid({ serie_id: id });
        };
    });
}
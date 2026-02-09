import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';

export function initEditSystem() {
    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { field } = e.detail;
        const infoPanel = document.querySelector('.flex-1.p-6.md\\:p-12');
        if (!infoPanel) return;

        // Recuperiamo gli ID attuali dai pulsanti edit nel modale per filtrare
        const context = {
            serie_id: document.querySelector('button[data-field="serie_id"]')?.dataset.id,
            testata_id: document.querySelector('button[data-field="testata_id"]')?.dataset.id,
            editore_id: document.querySelector('button[data-field="editore_id"]')?.dataset.id
        };

        const options = await getFilteredData(field, context);
        const displayTitle = field.replace('_id', '').replace('_', ' ').toUpperCase();

        const oldOverlay = document.getElementById('selector-overlay');
        if (oldOverlay) oldOverlay.remove();

        infoPanel.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(`SELEZIONA ${displayTitle}`, options));
        document.getElementById('selector-overlay').dataset.targetField = field;
    });

    // ... (listener apply-edit seguirà al punto 4)
}

async function getFilteredData(field, context) {
    const tableMap = {
        'serie_id': 'serie',
        'testata_id': 'testata',
        'annata_id': 'annata',
        'editore_id': 'editore',
        'tipo_pubblicazione_id': 'tipo_pubblicazione',
        'supplemento_id': 'issue'
    };

    const targetTable = tableMap[field];
    let query = client.from(targetTable).select('id, nome' + (targetTable === 'editore' || targetTable === 'serie' ? ', immagine_url' : ''));

    // --- FILTRI A CASCATA BASATI SULLO SCHEMA ---
    
    // Se scelgo la TESTATA, mostro solo quelle legate alla SERIE già scelta
    if (field === 'testata_id' && context.serie_id) {
        query = query.eq('serie_id', context.serie_id);
    }

    // Se scelgo l'ANNATA, mostro solo quelle legate alla SERIE già scelta
    if (field === 'annata_id' && context.serie_id) {
        query = query.eq('serie_id', context.serie_id);
    }

    // Per l'EDITORE, nello schema non c'è legame con serie/testata, 
    // quindi mostriamo tutti gli editori (o potremmo filtrare per codice_editore se necessario)

    const { data } = await query.order('nome');
    return data || [];
}
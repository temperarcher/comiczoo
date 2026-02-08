import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';

export function initEditSystem() {
    console.log("🛠️ Edit System Initialized"); // Debug: controlla se vedi questo in console

    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { field, table } = e.detail;
        console.log("📡 Event captured for field:", field);

        const infoPanel = document.querySelector('.flex-1.p-6.md\\:p-12'); 
        if (!infoPanel) return;

        // Rimuovi eventuali overlay già aperti
        const oldOverlay = document.getElementById('selector-overlay');
        if (oldOverlay) oldOverlay.remove();

        // Recupero dati
        const options = await getFilteredData(field);
        
        // Titolo pulito per l'utente
        const displayTitle = field.replace('_id', '').replace('_', ' ').toUpperCase();
        
        // Inserimento Overlay
        infoPanel.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(`SELEZIONA ${displayTitle}`, options));
    });
}

async function getFilteredData(field) {
    const tableMap = {
        'testata_id': 'testata',
        'serie_id': 'serie',
        'editore_id': 'editore',
        'annata_id': 'annata',
        'tipo_pubblicazione_id': 'tipo_pubblicazione'
    };

    const targetTable = tableMap[field];
    if (!targetTable) return [];

    const { data, error } = await client
        .from(targetTable)
        .select('id, nome' + (targetTable === 'editore' ? ', immagine_url' : ''))
        .order('nome');

    if (error) {
        console.error("DB Error:", error);
        return [];
    }
    return data;
}
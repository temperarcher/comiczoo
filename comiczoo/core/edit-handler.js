import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';

export function initEditSystem() {
    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { field, currentId } = e.detail;
        const infoPanel = document.querySelector('.flex-1.p-6.md\\:p-12'); // Il pannello destro del modale
        if (!infoPanel) return;

        // Recuperiamo i dati filtrati dal DB
        const options = await getFilteredData(field);
        
        // Inseriamo l'overlay atomizzato
        const title = `SELEZIONA ${field.replace('_id', '').replace('_', ' ').toUpperCase()}`;
        infoPanel.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(title, options));
    });
}

async function getFilteredData(field) {
    // Determiniamo la tabella di destinazione in base al campo
    const tableMap = {
        'testata_id': 'testata',
        'serie_id': 'serie',
        'editore_id': 'editore',
        'annata_id': 'annata',
        'tipo_pubblicazione_id': 'tipo_pubblicazione',
        'supplemento_id': 'issue' // Per il supplemento cerchiamo altri albi
    };

    const targetTable = tableMap[field];
    if (!targetTable) return [];

    let query = client.from(targetTable).select('id, nome' + (targetTable === 'editore' ? ', immagine_url' : ''));
    
    // Filtro alfabetico per default
    const { data } = await query.order('nome');
    return data || [];
}
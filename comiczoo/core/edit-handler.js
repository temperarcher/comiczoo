import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';
import { openIssueModal } from '../modals/issue-modal.js';
import { renderGrid } from '../components/grid.js';

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

    // ASCOLTATORE 2: Applicazione della scelta e Salvataggio (PUNTO 4)
    window.addEventListener('comiczoo:apply-edit', async (e) => {
        const { id, label } = e.detail;
        const overlay = document.getElementById('selector-overlay');
        const field = overlay.dataset.targetField;
        
        // Recuperiamo l'ID dell'albo dal modale
        const currentIssueId = document.querySelector('button[data-issue-id]')?.dataset.issueId;

        if (!currentIssueId) {
            console.error("Errore: ID Albo non trovato");
            return;
        }

        // 1. Salvataggio su Supabase
        const { error } = await client
            .from('issue')
            .update({ [field]: id })
            .eq('id', currentIssueId);

        if (error) {
            alert("Errore durante il salvataggio: " + error.message);
            return;
        }

        // 2. Feedback Visivo: Chiudiamo l'overlay
        overlay.remove();

        // 3. Refresh Atomico
        await openIssueModal(currentIssueId);

        // 4. Refresh Griglia
        renderGrid();
    });
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

    if (field === 'testata_id' && context.serie_id) {
        query = query.eq('serie_id', context.serie_id);
    }

    if (field === 'annata_id' && context.serie_id) {
        query = query.eq('serie_id', context.serie_id);
    }

    const { data } = await query.order('nome');
    return data || [];
}
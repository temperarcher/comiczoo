import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';
import { openIssueModal } from '../modals/issue-modal.js';
import { renderGrid } from '../components/grid.js';

export function initEditSystem() {
    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { field } = e.detail;
        const infoPanel = document.querySelector('.flex-1.p-6.md\\:p-12');
        if (!infoPanel) return;

        const displayTitle = field.replace('_id', '').replace('_', ' ').toUpperCase();
        const oldOverlay = document.getElementById('selector-overlay');
        if (oldOverlay) oldOverlay.remove();

        // --- LOGICA CHIRURGICA: RELAZIONALE VS SEMPLICE ---
        if (field.endsWith('_id') || field === 'supplemento_id') {
            // CAMPO RELAZIONALE (ID): Mostra la lista dal DB
            const context = {
                serie_id: document.querySelector('button[data-field="serie_id"]')?.dataset.id,
                testata_id: document.querySelector('button[data-field="testata_id"]')?.dataset.id,
                editore_id: document.querySelector('button[data-field="editore_id"]')?.dataset.id
            };

            const options = await getFilteredData(field, context);
            infoPanel.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(`SELEZIONA ${displayTitle}`, options));
        } else {
            // CAMPO SEMPLICE (Testo/Numero): Mostra un prompt o un input
            const newValue = prompt(`Inserisci nuovo valore per ${displayTitle}:`);
            if (newValue !== null) {
                // Se l'utente scrive qualcosa, simuliamo l'evento apply-edit
                window.dispatchEvent(new CustomEvent('comiczoo:apply-edit', { 
                    detail: { id: newValue } 
                }));
                // Creiamo un overlay fittizio per far leggere il targetField al listener sotto
                const dummy = document.createElement('div');
                dummy.id = 'selector-overlay';
                dummy.dataset.targetField = field;
                document.body.appendChild(dummy);
            }
            return; // Esci, non serve altro
        }

        document.getElementById('selector-overlay').dataset.targetField = field;
    });

    window.addEventListener('comiczoo:apply-edit', async (e) => {
        const { id } = e.detail;
        const overlay = document.getElementById('selector-overlay');
        if (!overlay) return;
        
        const field = overlay.dataset.targetField;
        const currentIssueElement = document.querySelector('[data-issue-id]');
        const currentIssueId = currentIssueElement ? currentIssueElement.dataset.issueId : null;

        if (!currentIssueId) return;

        const { error } = await client
            .from('issue')
            .update({ [field]: id })
            .eq('id', currentIssueId);

        if (!error) {
            overlay.remove();
            await openIssueModal(currentIssueId);
            renderGrid();
        }
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
    if (!targetTable) return []; // Sicurezza contro nomi tabella vuoti

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
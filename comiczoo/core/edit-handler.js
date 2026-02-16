import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';
import { openIssueModal } from '../modals/issue-modal.js';
import { renderGrid } from '../components/grid.js';

export function initEditSystem() {
    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { field } = e.detail;
        const currentIssueId = document.querySelector('[data-issue-id]')?.dataset.issueId;
        const currentSerieId = document.querySelector('button[data-field="serie_id"]')?.dataset.id;
        
        if (!field.endsWith('_id') && field !== 'supplemento_id') {
            const newValue = prompt(`Nuovo valore:`);
            if (newValue !== null) {
                let val = (field === 'numero' || field === 'valore' || field === 'condizione') 
                          ? parseFloat(newValue.replace(',', '.')) : newValue;
                await client.from('issue').update({ [field]: val }).eq('id', currentIssueId);
                await openIssueModal(currentIssueId);
                // BLOCCA IL TREMOLIO: ricarica solo la serie corrente
                renderGrid({ serie_id: currentSerieId });
            }
            return;
        }

        const context = {
            serie_id: currentSerieId,
            codice_editore_id: document.querySelector('[data-codice-container]')?.dataset.codiceContainer
        };

        const options = await getFilteredData(field, context);
        document.getElementById('selector-overlay')?.remove();
        document.querySelector('.flex-1.p-6.md\\:p-12')?.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(`SELEZIONA ${field.toUpperCase()}`, options));
        document.getElementById('selector-overlay').dataset.targetField = field;
    });

    window.addEventListener('comiczoo:apply-edit', async (e) => {
        const { id } = e.detail;
        const overlay = document.getElementById('selector-overlay');
        const field = overlay.dataset.targetField;
        const currentIssueId = document.querySelector('[data-issue-id]').dataset.issueId;
        const currentSerieId = document.querySelector('button[data-field="serie_id"]')?.dataset.id;

        await client.from('issue').update({ [field]: id }).eq('id', currentIssueId);
        overlay.remove();
        await openIssueModal(currentIssueId);
        renderGrid({ serie_id: currentSerieId });
    });

    window.addEventListener('comiczoo:toggle-possesso', async (e) => {
        const { field, current, id } = e.detail;
        const currentSerieId = document.querySelector('button[data-field="serie_id"]')?.dataset.id;
        await client.from('issue').update({ [field]: current === 'celo' ? 'manca' : 'celo' }).eq('id', id);
        await openIssueModal(id);
        renderGrid({ serie_id: currentSerieId });
    });
}

async function getFilteredData(field, context) {
    const tableMap = { 'serie_id': 'serie', 'testata_id': 'testata', 'annata_id': 'annata', 'editore_id': 'editore', 'supplemento_id': 'v_collezione_profonda' };
    const targetTable = tableMap[field];
    let query = client.from(targetTable).select('id, nome' + (targetTable === 'editore' || targetTable === 'serie' ? ', immagine_url' : ''));

    if (field === 'supplemento_id') {
        query = client.from('v_collezione_profonda').select('*');
        if (context.codice_editore_id) query = query.eq('codice_editore_id', context.codice_editore_id);
    }
    if (field === 'testata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);

    const { data } = await query.order('nome');
    return field === 'supplemento_id' ? data.map(a => ({ id: a.issue_id, nome: `${a.serie_nome} #${a.numero}` })) : (data || []);
}
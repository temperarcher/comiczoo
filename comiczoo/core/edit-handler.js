import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';
import { openIssueModal } from '../modals/issue-modal.js';
import { renderGrid } from '../components/grid.js';

export function initEditSystem() {
    // 1. EDIT CAMPI E FILTRI
    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { field } = e.detail;
        const infoPanel = document.querySelector('.flex-1.p-6.md\\:p-12');
        if (!infoPanel) return;

        const currentIssueId = document.querySelector('[data-issue-id]')?.dataset.issueId;
        const context = {
            serie_id: document.querySelector('button[data-field="serie_id"]')?.dataset.id,
            codice_editore_id: document.querySelector('[data-codice-container]')?.dataset.codiceContainer
        };

        if (!field.endsWith('_id') && field !== 'supplemento_id') {
            const newValue = prompt(`Inserisci nuovo valore:`);
            if (newValue !== null) {
                let finalValue = (field === 'numero' || field === 'valore' || field === 'condizione') 
                    ? parseFloat(newValue.replace(',', '.')) : newValue;
                await client.from('issue').update({ [field]: finalValue }).eq('id', currentIssueId);
                await openIssueModal(currentIssueId);
                renderGrid({ serie_id: context.serie_id }); // Mantiene il filtro serie per evitare il tremolio
            }
            return; 
        }

        const options = await getFilteredData(field, context);
        document.getElementById('selector-overlay')?.remove();
        infoPanel.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(`SELEZIONA ${field.replace('_id','').toUpperCase()}`, options));
        document.getElementById('selector-overlay').dataset.targetField = field;
    });

    // 2. APPLY EDIT
    window.addEventListener('comiczoo:apply-edit', async (e) => {
        const { id } = e.detail;
        const overlay = document.getElementById('selector-overlay');
        if (!overlay) return;
        const field = overlay.dataset.targetField;
        const currentIssueId = document.querySelector('[data-issue-id]').dataset.issueId;
        const currentSerieId = document.querySelector('button[data-field="serie_id"]')?.dataset.id;

        await client.from('issue').update({ [field]: id }).eq('id', currentIssueId);
        overlay.remove();
        await openIssueModal(currentIssueId);
        renderGrid({ serie_id: currentSerieId });
    });

    // 3. TOGGLE POSSESSO
    window.addEventListener('comiczoo:toggle-possesso', async (e) => {
        const { field, current, id } = e.detail;
        const newValue = (current === 'celo') ? 'manca' : 'celo';
        const currentSerieId = document.querySelector('button[data-field="serie_id"]')?.dataset.id;
        
        await client.from('issue').update({ [field]: newValue }).eq('id', id);
        await openIssueModal(id);
        renderGrid({ serie_id: currentSerieId });
    });
}

async function getFilteredData(field, context) {
    const tableMap = {
        'serie_id': 'serie', 'testata_id': 'testata', 'annata_id': 'annata',
        'editore_id': 'editore', 'tipo_pubblicazione_id': 'tipo_pubblicazione', 'supplemento_id': 'v_collezione_profonda'
    };
    const targetTable = tableMap[field];
    let query = client.from(targetTable).select('id, nome' + (targetTable === 'editore' || targetTable === 'serie' ? ', immagine_url' : ''));

    if (field === 'supplemento_id') {
        query = client.from('v_collezione_profonda').select('*'); 
        if (context.codice_editore_id) query = query.eq('codice_editore_id', context.codice_editore_id);
    }
    if (field === 'testata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);
    if (field === 'annata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);

    const { data } = await query.order(field === 'supplemento_id' ? 'serie_nome' : 'nome');
    
    if (field === 'supplemento_id') {
        return data.map(albo => ({ id: albo.issue_id, nome: `${albo.serie_nome} #${albo.numero}` }));
    }
    return data || [];
}
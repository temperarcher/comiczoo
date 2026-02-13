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
        
        // 1. GESTIONE CAMPI SEMPLICI (Testo/Numero)
        if (!field.endsWith('_id') && field !== 'supplemento_id') {
            const newValue = prompt(`Inserisci nuovo valore per ${displayTitle}:`);
            
            if (newValue !== null && newValue.trim() !== "") {
                const currentIssueId = document.querySelector('[data-issue-id]')?.dataset.issueId;
                if (!currentIssueId) return;

                let finalValue = newValue;
                if (field === 'numero' || field === 'valore' || field === 'condizione') {
                    finalValue = parseFloat(newValue.replace(',', '.'));
                }

                const { error } = await client
                    .from('issue')
                    .update({ [field]: finalValue })
                    .eq('id', currentIssueId);

                if (!error) {
                    await openIssueModal(currentIssueId);
                    renderGrid();
                } else {
                    console.error("Errore salvataggio semplice:", error);
                }
            }
            return; 
        }

        // 2. GESTIONE CAMPI RELAZIONALI (ID)
        const oldOverlay = document.getElementById('selector-overlay');
        if (oldOverlay) oldOverlay.remove();

        const context = {
            serie_id: document.querySelector('button[data-field="serie_id"]')?.dataset.id,
            testata_id: document.querySelector('button[data-field="testata_id"]')?.dataset.id,
            codice_editore: document.querySelector('button[data-field="editore_id"]')?.dataset.codice 
        };

        const options = await getFilteredData(field, context);
        infoPanel.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(`SELEZIONA ${displayTitle}`, options));
        
        const overlay = document.getElementById('selector-overlay');
        if (overlay) overlay.dataset.targetField = field;
    });

    window.addEventListener('comiczoo:apply-edit', async (e) => {
        const { id } = e.detail;
        const overlay = document.getElementById('selector-overlay');
        if (!overlay) return;
        
        const field = overlay.dataset.targetField;
        const currentIssueId = document.querySelector('[data-issue-id]')?.dataset.issueId;

        if (!currentIssueId) return;

        const { error } = await client
            .from('issue')
            .update({ [field]: id })\
            .eq('id', currentIssueId);

        if (!error) {
            overlay.remove();
            await openIssueModal(currentIssueId);
            renderGrid();
        }
    });

    window.addEventListener('comiczoo:toggle-possesso', async (e) => {
        const { field, current, id } = e.detail;
        const newValue = (current === 'celo') ? 'manca' : 'celo';
        const { error } = await client
            .from('issue')
            .update({ [field]: newValue })
            .eq('id', id);

        if (!error) {
            await openIssueModal(id);
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
        'supplemento_id': 'v_collezione_profonda'
    };

    const targetTable = tableMap[field];
    if (!targetTable) return [];

    let query;

    if (field === 'supplemento_id') {
        query = client
            .from('v_collezione_profonda')
            .select('issue_id, titolo, numero, serie_nome, data_pubblicazione, codice_editore');

        if (context.codice_editore) {
            query = query.eq('codice_editore', context.codice_editore);
        }
    } else {
        query = client.from(targetTable).select('id, nome' + (targetTable === 'editore' || targetTable === 'serie' ? ', immagine_url' : ''));
    }

    if (field === 'testata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);
    if (field === 'annata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);

    // MODIFICA CHIRURGICA: Ordinamento per data_pubblicazione ASC per i supplementi
    const orderBy = field === 'supplemento_id' ? 'data_pubblicazione' : 'nome';
    const { data, error } = await query.order(orderBy, { ascending: true });
    
    if (error) {
        console.error("Errore fetch dati:", error);
        return [];
    }

    if (field === 'supplemento_id' && data) {
        return data.map(albo => {
            const d = albo.data_pubblicazione ? new Date(albo.data_pubblicazione).toLocaleDateString('it-IT') : '---';
            return {
                id: albo.issue_id, 
                nome: `${albo.serie_nome || 'Senza Serie'} #${albo.numero || '?'} del ${d}`
            };
        });
    }

    return data || [];
}
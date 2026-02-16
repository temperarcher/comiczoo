import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';
import { openIssueModal } from '../modals/issue-modal.js';
import { renderGrid } from '../components/grid.js';

export function initEditSystem() {
    // 1. GESTIONE NEW RECORD (AGGIUNTA CHIRURGICA)
    window.addEventListener('comiczoo:new-record', async (e) => {
        const { field } = e.detail;
        if (field === 'serie_id') {
            let subContainer = document.getElementById('submodal-container') || (() => {
                const div = document.createElement('div');
                div.id = 'submodal-container';
                document.body.appendChild(div);
                return div;
            })();

            subContainer.innerHTML = UI.MODAL_NEW_SERIE();
            document.getElementById('btn-save-new-serie').onclick = async () => {
                const nome = document.getElementById('new-serie-nome').value.trim();
                const url = document.getElementById('new-serie-url').value.trim();
                if (!nome) return alert("Nome serie obbligatorio");

                const { data, error } = await client.from('serie').insert([{ nome, immagine_url: url }]).select().single();
                if (!error && data) {
                    const currentIssueId = document.querySelector('[data-issue-id]').dataset.issueId;
                    await client.from('issue').update({ serie_id: data.id }).eq('id', currentIssueId);
                    subContainer.innerHTML = '';
                    // Refresh coordinato per evitare tremolii
                    await openIssueModal(currentIssueId);
                    renderGrid();
                }
            };
        }
    });

    // 2. GESTIONE EDIT FIELD (RIPRISTINO LOGICA ORIGINALE)
    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { field } = e.detail;
        const infoPanel = document.querySelector('.flex-1.p-6.md\\:p-12');
        if (!infoPanel) return;

        const displayTitle = field.replace('_id', '').replace('_', ' ').toUpperCase();
        
        // RECUPERO CONTESTO (Fondamentale per i filtri del selettore)
        const context = {
            serie_id: document.querySelector('button[data-field="serie_id"]')?.dataset.id,
            testata_id: document.querySelector('button[data-field="testata_id"]')?.dataset.id,
            codice_editore_id: document.querySelector('[data-codice-container]')?.dataset.codiceContainer
        };

        if (!field.endsWith('_id') && field !== 'supplemento_id') {
            const newValue = prompt(`Inserisci nuovo valore per ${displayTitle}:`);
            if (newValue !== null && newValue.trim() !== "") {
                const currentIssueId = document.querySelector('[data-issue-id]')?.dataset.issueId;
                let finalValue = (field === 'numero' || field === 'valore' || field === 'condizione') 
                    ? parseFloat(newValue.replace(',', '.')) : newValue;

                const { error } = await client.from('issue').update({ [field]: finalValue }).eq('id', currentIssueId);
                if (!error) {
                    await openIssueModal(currentIssueId);
                    renderGrid();
                }
            }
            return; 
        }

        const oldOverlay = document.getElementById('selector-overlay');
        if (oldOverlay) oldOverlay.remove();

        const options = await getFilteredData(field, context);
        infoPanel.insertAdjacentHTML('beforeend', UI.SELECTOR_OVERLAY(`SELEZIONA ${displayTitle}`, options));
        
        const overlay = document.getElementById('selector-overlay');
        if (overlay) overlay.dataset.targetField = field;
    });

    // 3. APPLY EDIT (Senza interferenze con la sidebar)
    window.addEventListener('comiczoo:apply-edit', async (e) => {
        const { id } = e.detail;
        const overlay = document.getElementById('selector-overlay');
        if (!overlay) return;
        
        const field = overlay.dataset.targetField;
        const currentIssueId = document.querySelector('[data-issue-id]').dataset.issueId;

        const { error } = await client.from('issue').update({ [field]: id }).eq('id', currentIssueId);
        if (!error) {
            overlay.remove();
            await openIssueModal(currentIssueId);
            renderGrid();
        }
    });

    // 4. TOGGLE POSSESSO (Semplificato per evitare tremolii)
    window.addEventListener('comiczoo:toggle-possesso', async (e) => {
        const { field, current, id } = e.detail;
        const newValue = (current === 'celo') ? 'manca' : 'celo';
        const { error } = await client.from('issue').update({ [field]: newValue }).eq('id', id);
        if (!error) {
            await openIssueModal(id);
            renderGrid();
        }
    });
}

// 5. FUNZIONE DATI FILTRATI (RIPRISTINO COMPLETO)
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
        query = client.from('v_collezione_profonda').select('*'); 
        if (context.codice_editore_id) query = query.eq('codice_editore_id', context.codice_editore_id);
    } else {
        query = client.from(targetTable).select('id, nome' + (targetTable === 'editore' || targetTable === 'serie' ? ', immagine_url' : ''));
    }

    if (field === 'testata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);
    if (field === 'annata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);

    const { data, error } = await query.order('nome', { ascending: true });
    if (error) return [];

    if (field === 'supplemento_id') {
        return data.map(albo => ({
            id: albo.issue_id, 
            nome: `${albo.serie_nome} #${albo.numero} (${albo.data_pubblicazione || '---'})`
        }));
    }
    return data || [];
}
import { client } from './supabase.js';
import { UI } from '../components/issue-atoms.js';
import { openIssueModal } from '../modals/issue-modal.js';
import { renderGrid } from '../components/grid.js';

export function initEditSystem() {
    // GESTIONE CREAZIONE NUOVI RECORD (NEW BUTTON)
    window.addEventListener('comiczoo:new-record', async (e) => {
        const { field } = e.detail;
        
        let subContainer = document.getElementById('submodal-container');
        if (!subContainer) {
            subContainer = document.createElement('div');
            subContainer.id = 'submodal-container';
            document.body.appendChild(subContainer);
        }

        if (field === 'serie_id') {
            subContainer.innerHTML = UI.MODAL_NEW_SERIE();
            
            document.getElementById('btn-save-new-serie').onclick = async () => {
                const nome = document.getElementById('new-serie-nome').value.trim();
                const url = document.getElementById('new-serie-url').value.trim();

                if (!nome) return alert("Inserisci almeno il nome della serie");

                const { data, error } = await client
                    .from('serie')
                    .insert([{ nome: nome, immagine_url: url }])
                    .select()
                    .single();

                if (!error && data) {
                    const currentIssueId = document.querySelector('[data-issue-id]').dataset.issueId;
                    await client.from('issue').update({ serie_id: data.id }).eq('id', currentIssueId);
                    
                    subContainer.innerHTML = '';
                    await openIssueModal(currentIssueId);
                    renderGrid();
                } else {
                    console.error("Errore creazione serie:", error);
                }
            };
        }
    });

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
            codice_editore_id: document.querySelector('[data-codice-container]')?.dataset.codiceContainer 
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
            .update({ [field]: id })
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

    // CHIRURGICO: Logica di filtraggio Serie basata su Codice Editore
    if (field === 'serie_id' && context.codice_editore_id) {
        const { data, error } = await client
            .from('v_collezione_profonda')
            .select('serie_id, serie_nome, serie_immagine_url')
            .eq('codice_editore_id', context.codice_editore_id);
            
        if (error) return [];
        
        const uniqueSeries = Array.from(new Map(data.map(item => [item.serie_id, item])).values());
        return uniqueSeries.map(s => ({
            id: s.serie_id,
            nome: s.serie_nome,
            immagine_url: s.serie_immagine_url
        })).sort((a, b) => a.nome.localeCompare(b.nome));
    }

    if (field === 'supplemento_id') {
        query = client
            .from('v_collezione_profonda')
            .select('*'); 

        if (context.codice_editore_id) {
            query = query.eq('codice_editore_id', context.codice_editore_id);
        }
    } else {
        query = client.from(targetTable).select('id, nome' + (targetTable === 'editore' || targetTable === 'serie' ? ', immagine_url' : ''));
    }

    if (field === 'testata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);
    if (field === 'annata_id' && context.serie_id) query = query.eq('serie_id', context.serie_id);

    if (field === 'supplemento_id') {
        query = query.order('serie_nome', { ascending: true }).order('data_pubblicazione', { ascending: true });
    } else {
        query = query.order('nome', { ascending: true });
    }

    const { data, error } = await query;
    
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
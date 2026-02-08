import { client } from './supabase.js';
import { openIssueModal } from '../modals/issue-modal.js';

export function initEditSystem() {
    window.addEventListener('comiczoo:edit-field', async (e) => {
        const { table, field, currentIssue } = e.detail;
        
        // 1. Identifichiamo il tipo di campo
        if (isRelational(field)) {
            openRelationalSelector(field, currentIssue);
        } else {
            openInlineInput(field, currentIssue);
        }
    });
}

// Funzione che decide cosa mostrare in base ai dati già presenti
async function getFilteredOptions(field, currentIssue) {
    let query = client.from(getTargetTable(field)).select('*');

    // ESEMPIO DI FILTRO A CASCATA:
    if (field === 'testata_id' && currentIssue.editore_id) {
        // Se sto scegliendo la testata e ho già l'editore, filtra!
        query = query.eq('editore_id', currentIssue.editore_id);
    }
    
    if (field === 'serie_id' && currentIssue.testata_id) {
        // Se sto scegliendo la serie e ho la testata...
        query = query.eq('testata_id', currentIssue.testata_id);
    }

    const { data } = await query.order('nome');
    return data;
}
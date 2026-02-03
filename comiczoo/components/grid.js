import { client } from '../core/supabase.js';
import { openModal } from '../modals/issue-modal.js';

export async function renderGrid(filters = {}) {
    let query = client.from('v_collezione_profonda').select('*');
    
    if (filters.serie_id) query = query.eq('serie_id', filters.serie_id);
    if (filters.editore_id) query = query.eq('editore_id', filters.editore_id);

    const { data } = await query;
    const container = document.getElementById('grid-container');
    
    container.innerHTML = data.map(albo => `
        <div class="comic-card bg-zinc-900 cursor-pointer" onclick="this.dispatchEvent(new CustomEvent('open-issue', {detail: '${albo.issue_id}', bubbles: true}))">
            <img src="${albo.immagine_url || ''}" class="w-full aspect-[2/3] object-cover">
            <p class="p-2 text-xs">${albo.testata_nome} #${albo.numero}</p>
        </div>
    `).join('');

    container.addEventListener('open-issue', (e) => openModal(e.detail));
}
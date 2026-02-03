import { client } from '../core/supabase.js';

export async function openIssueModal(issueId) {
    const container = document.getElementById('modal-container');
    
    // Recupero dati atomico
    const { data: albo, error } = await client
        .from('v_collezione_profonda')
        .select('*')
        .eq('issue_id', issueId)
        .single();

    if (error) return console.error(error);

    container.innerHTML = `
        <div id="modal-backdrop" class="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col md:flex-row">
                
                <div class="w-full md:w-1/3 bg-black flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-zinc-800 relative">
                    <img src="${albo.immagine_url}" class="shadow-2xl rounded-sm w-full h-auto object-contain">
                    <button id="edit-img" class="absolute bottom-10 bg-yellow-500 text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase">Cambia Cover</button>
                </div>

                <div class="w-full md:w-2/3 p-8 flex flex-col gap-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-2xl font-black italic uppercase text-yellow-500 tracking-tighter">${albo.testata_nome}</h2>
                            <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">${albo.serie_nome}</p>
                        </div>
                        <button onclick="document.getElementById('modal-backdrop').remove()" class="text-zinc-500 hover:text-white text-2xl">&times;</button>
                    </div>

                    <div class="grid grid-cols-2 gap-y-4 gap-x-8">
                        ${renderEditableField('Titolo Albo', albo.issue_nome, 'nome', 'issue')}
                        ${renderEditableField('Numero', albo.numero, 'numero', 'issue')}
                        ${renderEditableField('Possesso', albo.possesso, 'possesso', 'issue')}
                        ${renderEditableField('Valore (€)', albo.valore, 'valore', 'issue')}
                    </div>

                    <div class="mt-4 border-t border-zinc-800 pt-4">
                        <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Contenuti Storie</span>
                        <div class="mt-2 flex flex-col gap-2">
                            ${albo.contenuti_storie ? albo.contenuti_storie.map(s => `
                                <div class="bg-zinc-800/50 p-2 rounded border border-zinc-700/50 flex justify-between items-center">
                                    <span class="text-xs font-medium text-zinc-200">${s.storia_nome}</span>
                                    <span class="text-[9px] text-zinc-500">${s.personaggi ? s.personaggi.join(', ') : ''}</span>
                                </div>
                            `).join('') : '<p class="text-xs italic text-zinc-600">Nessuna storia caricata</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Aggancia l'evento di chiusura al backdrop
    document.getElementById('modal-backdrop').onclick = (e) => {
        if(e.target.id === 'modal-backdrop') e.target.remove();
    };
}

// Funzione atomica per generare campi editabili
function renderEditableField(label, value, fieldName, table) {
    return `
        <div class="flex flex-col border-b border-zinc-800 pb-2 group">
            <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">${label}</label>
            <div class="flex justify-between items-center">
                <span class="text-sm text-zinc-200 font-medium">${value || '---'}</span>
                <button onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {table: '${table}', field: '${fieldName}', value: '${value}'}}))" 
                        class="opacity-0 group-hover:opacity-100 text-yellow-500 text-[9px] font-black uppercase transition-all">Edit</button>
            </div>
        </div>
    `;
}
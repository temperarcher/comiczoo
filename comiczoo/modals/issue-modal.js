import { client } from '../core/supabase.js';

export async function openIssueModal(issueId) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    const { data: albo, error } = await client
        .from('v_collezione_profonda')
        .select('*')
        .eq('issue_id', issueId)
        .single();

    if (error) return console.error(error);

    container.innerHTML = `
        <div id="modal-backdrop" class="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div class="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                
                <div class="w-full md:w-1/3 bg-black/40 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-zinc-800 relative group">
                    <img src="${albo.immagine_url || ''}" class="shadow-2xl rounded-sm w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]">
                    <button class="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                        Cambia Copertina
                    </button>
                </div>

                <div class="w-full md:w-2/3 p-8 flex flex-col gap-8">
                    
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">${albo.serie_nome || 'Serie'}</span>
                            <h2 class="text-3xl font-black italic uppercase text-yellow-500 tracking-tighter leading-none">${albo.testata_nome || 'Testata'}</h2>
                        </div>
                        <button id="close-modal" class="text-zinc-600 hover:text-white text-4xl leading-none transition-colors">&times;</button>
                    </div>

                    <div class="grid grid-cols-2 gap-x-12 gap-y-6">
                        ${renderField('Titolo Albo', albo.issue_nome, 'nome', 'issue')}
                        ${renderField('Numero', albo.numero ? `#${albo.numero}` : '---', 'numero', 'issue')}
                        ${renderField('Annata', albo.annata_nome, 'annata_id', 'issue')}
                        ${renderField('Editore', albo.editore_nome, 'editore_id', 'issue')}
                        ${renderField('Valore stimato', albo.valore ? `${albo.valore} €` : '0.00 €', 'valore', 'issue')}
                        ${renderField('Stato Possesso', albo.possesso, 'possesso', 'issue')}
                    </div>

                    <div class="mt-4">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="h-px bg-zinc-800 flex-grow"></span>
                            <span class="text-[10px] text-zinc-500 font-black uppercase tracking-widest whitespace-nowrap">Sommario Storie</span>
                            <span class="h-px bg-zinc-800 flex-grow"></span>
                        </div>
                        
                        <div class="flex flex-col gap-2">
                            ${albo.contenuti_storie ? albo.contenuti_storie.map(s => `
                                <div class="group/story flex flex-col bg-zinc-800/30 border border-zinc-800 p-3 rounded-lg hover:border-zinc-700 transition-colors">
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-bold text-zinc-200 uppercase tracking-tight">${s.storia_nome}</span>
                                        <button class="opacity-0 group-hover/story:opacity-100 text-yellow-500 text-[9px] font-black uppercase">Edit</button>
                                    </div>
                                    <div class="flex gap-1 mt-1">
                                        ${s.personaggi ? s.personaggi.map(p => `
                                            <span class="text-[9px] bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-800">${p}</span>
                                        `).join('') : ''}
                                    </div>
                                </div>
                            `).join('') : '<p class="text-[10px] italic text-zinc-600 uppercase text-center py-4">Nessun contenuto registrato</p>'}
                        </div>
                        
                        <button class="w-full mt-4 py-2 border border-dashed border-zinc-800 text-zinc-600 hover:text-yellow-500 hover:border-yellow-500/50 rounded text-[10px] font-black uppercase tracking-widest transition-all">
                            + Aggiungi Storia
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Binding Eventi
    document.getElementById('close-modal').onclick = () => container.innerHTML = '';
    document.getElementById('modal-backdrop').onclick = (e) => {
        if(e.target.id === 'modal-backdrop') container.innerHTML = '';
    };
}

// Helper per i campi: Genera l'atomo label + valore + pulsante edit
function renderField(label, value, field, table) {
    return `
        <div class="flex flex-col border-b border-zinc-800/50 pb-2 group/field relative">
            <label class="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">${label}</label>
            <div class="flex justify-between items-baseline">
                <span class="text-sm text-zinc-100 font-medium truncate pr-8">${value || '---'}</span>
                <button onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {table: '${table}', field: '${field}', current: '${value}'}}))" 
                        class="opacity-0 group-hover/field:opacity-100 absolute right-0 bottom-2 text-yellow-500 text-[9px] font-black uppercase transition-all hover:scale-110">
                    Edit
                </button>
            </div>
        </div>
    `;
}
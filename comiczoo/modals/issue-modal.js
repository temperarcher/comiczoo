import { client } from '../core/supabase.js';
import { UI } from '../components/issue-atoms.js';

export async function openIssueModal(issueId) {
    let container = document.getElementById('modal-container');
    if (!container) return;

    const { data: albo, error } = await client
        .from('v_collezione_profonda')
        .select('*')
        .eq('issue_id', issueId)
        .single();

    if (error) return;

    container.innerHTML = `
        <div id="modal-backdrop" class="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-slate-900 border border-slate-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl flex flex-col md:flex-row">
                
                <div class="w-full md:w-[400px] bg-slate-950 flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
                    <div class="p-6">
                        <img src="${albo.immagine_url || ''}" class="w-full h-auto shadow-2xl border border-slate-800 rounded">
                    </div>
                </div>

                <div class="flex-1 p-8">
                    <div class="flex justify-between items-start mb-8">
                        <div>
                            <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">${albo.serie_nome || 'SERIE'}</span>
                            <h2 class="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">${albo.testata_nome || '---'}</h2>
                        </div>
                        <button id="close-modal-btn" class="text-slate-500 hover:text-white text-4xl leading-none">&times;</button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${UI.FIELD('TITOLO ALBO', albo.issue_nome, 'nome', 'issue')}
                        ${UI.FIELD('NUMERO', albo.numero, 'numero', 'issue')}
                        ${UI.FIELD('ANNATA', albo.annata_nome, 'annata_id', 'issue')}
                        ${UI.FIELD('EDITORE', albo.editore_nome, 'editore_id', 'issue')}
                        ${UI.FIELD('VALORE', albo.valore + ' €', 'valore', 'issue')}
                        ${UI.FIELD('CONDIZIONE', albo.condizione + '/5', 'condizione', 'issue')}
                        ${UI.FIELD('POSSESSO', albo.possesso, 'possesso', 'issue')}
                    </div>

                    <div class="mt-10 pt-6 border-t border-slate-800">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Contenuti Storie</h3>
                        </div>
                        <div class="space-y-3">
                            ${albo.contenuti_storie ? albo.contenuti_storie.map(s => UI.STORY_ITEM(s)).join('') : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('close-modal-btn').onclick = () => { container.innerHTML = ''; };
}
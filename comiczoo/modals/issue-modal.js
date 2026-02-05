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
        <div id="modal-backdrop" class="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <div class="bg-slate-900 border border-slate-800 w-full max-w-6xl h-[85vh] overflow-hidden rounded shadow-2xl flex flex-col md:flex-row">
                
                <div class="w-full md:w-[400px] bg-slate-950 flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
                    <div class="p-8 flex-grow flex items-center justify-center">
                        <img src="${albo.immagine_url || ''}" class="w-full h-auto shadow-[0_0_40px_rgba(0,0,0,0.7)] border border-slate-800 rounded">
                    </div>
                    <div class="p-4 border-t border-slate-800 flex justify-center">
                        <button class="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-500 hover:text-white transition-colors">Change Cover Image</button>
                    </div>
                </div>

                <div class="flex-1 p-12 overflow-y-auto custom-scrollbar">
                    <div class="flex justify-between items-start">
                        ${UI.HEADER(albo.testata_nome, albo.serie_nome)}
                        <button id="close-modal-btn" class="text-slate-600 hover:text-white text-5xl font-light leading-none mt-[-15px] transition-colors">&times;</button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 mt-6">
                        ${UI.FIELD('TITOLO ALBO', albo.issue_nome, 'nome', 'issue')}
                        ${UI.FIELD('NUMERO', albo.numero, 'numero', 'issue')}
                        ${UI.FIELD('ANNATA', albo.annata_nome, 'annata_id', 'issue')}
                        ${UI.FIELD('VALORE STIMATO', albo.valore + ' €', 'valore', 'issue')}
                        ${UI.FIELD('STATO CONDIZIONE', albo.condizione + '/5', 'condizione', 'issue')}
                        ${UI.FIELD('POSSESSO', albo.possesso, 'possesso', 'issue')}
                    </div>

                    <div class="mt-16 pt-8 border-t border-slate-800">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sommario Contenuti</h3>
                            <button class="text-[9px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded uppercase hover:bg-yellow-500 hover:text-black transition-all">New Story</button>
                        </div>
                        <div class="space-y-3">
                            ${albo.contenuti_storie ? albo.contenuti_storie.map(s => UI.STORY_ITEM(s)).join('') : '<div class="text-center p-8 border border-dashed border-slate-800 text-slate-600 text-[10px] uppercase">Nessuna storia collegata</div>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('close-modal-btn').onclick = () => { container.innerHTML = ''; };
}
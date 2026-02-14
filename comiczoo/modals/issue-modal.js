import { client } from '../core/supabase.js';
import { UI } from '../components/issue-atoms.js';

export async function openIssueModal(issueId) {
    let container = document.getElementById('modal-container');
    if (!container) return;

    // Gestione Albo Nuovo o Esistente
    let albo = { 
        valore: 0, 
        condizione: 0, 
        contenuti_storie: [] 
    };

    if (issueId && issueId !== 'new') {
        const { data, error } = await client
            .from('v_collezione_profonda')
            .select('*')
            .eq('issue_id', issueId)
            .single();
        
        // CHIRURGICO: Fallback se il record è appena creato e non ancora nella vista
        if (error || !data) {
            albo = { 
                issue_id: issueId, 
                issue_nome: 'NUOVO ALBO', 
                valore: 0, 
                condizione: 0,
                contenuti_storie: []
            };
        } else {
            albo = data;
        }
    }

    const dataDisp = albo.data_pubblicazione 
        ? new Date(albo.data_pubblicazione).toLocaleDateString('it-IT') 
        : '---';

    container.innerHTML = `
        <div id="modal-backdrop" class="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-2 md:p-4 backdrop-blur-md">
            <div class="bg-slate-900 border border-slate-800 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded shadow-2xl flex flex-col md:flex-row relative" data-issue-id="${issueId}">
                
                <button onclick="document.getElementById('modal-container').innerHTML=''" class="absolute top-6 right-6 z-[110] text-slate-500 hover:text-white transition-colors">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div class="w-full md:w-2/5 bg-slate-800/50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-slate-800 min-h-[400px]">
                    <img src="${albo.issue_immagine_url || ''}" class="w-full h-full object-contain shadow-2xl rounded" onerror="this.src='https://via.placeholder.com/400x600?text=No+Cover'">
                </div>

                <div class="flex-1 p-6 md:p-12">
                    <div class="mb-10">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Issue #${albo.numero || '?'}</span>
                            <span class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">${dataDisp}</span>
                        </div>
                        <h2 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">${albo.issue_nome || 'SENZA TITOLO'}</h2>
                        <p class="text-slate-400 text-lg font-medium tracking-tight">${albo.serie_nome || 'Serie non definita'}</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                        <div class="space-y-6">
                            ${UI.FIELD_WITH_ICON('EDITORE', albo.editore_nome, 'editore_id', 'issue', albo.editore_immagine_url, albo.codice_editore_id)}
                            ${UI.FIELD_WITH_ICON('SERIE', albo.serie_nome, 'serie_id', 'issue', albo.serie_immagine_url)}
                            ${UI.FIELD_WITH_ICON('TESTATA', albo.testata_nome, 'testata_id', 'issue')}
                        </div>
                        <div class="space-y-6">
                            ${UI.FIELD('ANNATA', albo.annata_nome, 'annata_id', 'issue')}
                            ${UI.FIELD('TIPO PUBBLICAZIONE', albo.tipo_nome, 'tipo_pubblicazione_id', 'issue')}
                            ${UI.FIELD('SUPPLEMENTO A', albo.supplemento_nome, 'supplemento_id', 'issue')}
                        </div>
                    </div>

                    <div class="mt-12 pt-8 border-t border-slate-800">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            ${UI.FIELD('VALORE STIMATO', (albo.valore || '0') + ' €', 'valore', 'issue')}
                            ${UI.FIELD_RATING('STATO CONDIZIONE', albo.condizione || 0, 'condizione', 'issue')}
                            ${UI.FIELD_TOGGLE('POSSESSO', albo.possesso, 'possesso', issueId)}
                        </div>
                    </div>

                    <div class="mt-12 md:mt-16 pt-8 border-t border-slate-800">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sommario Contenuti</h3>
                            <button class="text-[9px] font-black text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded uppercase hover:bg-yellow-500 hover:text-black transition-all">New Storia</button>
                        </div>
                        <div class="space-y-3 pb-8">
                            ${albo.contenuti_storie && albo.contenuti_storie.length > 0 
                                ? albo.contenuti_storie.map(s => UI.STORY_ITEM(s)).join('') 
                                : '<div class="text-center p-8 border border-dashed border-slate-800 text-slate-600 text-[10px] uppercase tracking-widest">Nessuna storia collegata</div>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-backdrop').onclick = (e) => {
        if (e.target.id === 'modal-backdrop') container.innerHTML = '';
    };
}
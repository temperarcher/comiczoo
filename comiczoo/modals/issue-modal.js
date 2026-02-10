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
        if (error) return;
        albo = data;
    }

    const dataDisp = albo.data_pubblicazione 
        ? new Date(albo.data_pubblicazione).toLocaleDateString('it-IT') 
        : '---';

    container.innerHTML = `
        <div id="modal-backdrop" class="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-2 md:p-4 backdrop-blur-md">
            <div class="bg-slate-900 border border-slate-800 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded shadow-2xl flex flex-col md:flex-row custom-scrollbar">
                
                <div class="w-full md:w-[400px] md:min-w-[400px] bg-slate-950 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
                    <div class="p-6 md:p-8 flex items-center justify-center">
                        <img src="${albo.immagine_url || ''}" class="w-full max-w-[300px] md:max-w-full h-auto shadow-[0_0_40px_rgba(0,0,0,0.7)] border border-slate-800 rounded">
                    </div>
                </div>

                <div class="flex-1 p-6 md:p-12">
                    <div class="flex justify-between items-start">
                        ${UI.HEADER(albo.testata_nome, albo.serie_nome, albo.testata_id, albo.serie_id, issueId)}
                        <button id="close-modal-btn" class="text-slate-600 hover:text-white text-4xl md:text-5xl font-light p-2 transition-colors">&times;</button>
                    </div>

                    <div class="flex flex-col gap-8 md:gap-10 mt-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                            ${UI.FIELD('ANNATA', albo.annata_nome, 'annata_id', 'issue')}
                            ${UI.FIELD('NUMERO', albo.numero, 'numero', 'issue')}
                            ${UI.FIELD('TITOLO ALBO', albo.issue_nome, 'nome', 'issue')}
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                            ${UI.FIELD('DATA PUBBLICAZIONE', dataDisp, 'data_pubblicazione', 'issue')}
                            ${UI.FIELD_WITH_ICON('EDITORE', albo.editore_nome, 'editore_id', 'issue', albo.editore_immagine_url)}
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                            <div class="md:col-span-2">
                                ${UI.FIELD('SUPPLEMENTO A', albo.supplemento_info, 'supplemento_id', 'issue')}
                            </div>
                            <div class="md:col-span-1">
                                ${UI.FIELD('TIPO PUBBLICAZIONE', albo.tipo_pubblicazione_nome, 'tipo_pubblicazione_id', 'issue')}
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                            ${UI.FIELD('VALORE STIMATO', (albo.valore || '0') + ' €', 'valore', 'issue')}
                            ${UI.FIELD_RATING('STATO CONDIZIONE', albo.condizione || 0, 'condizione', 'issue')}
                            ${UI.FIELD('POSSESSO', albo.possesso, 'possesso', 'issue')}
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

    document.getElementById('close-modal-btn').onclick = () => { container.innerHTML = ''; };
}
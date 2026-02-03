/**
 * VERSION: 1.5.3
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { supabase } from './supabase-client.js';
import { Render } from './render.js';
import { UI } from './ui.js';

export const Logic = {
    state: { 
        allSeries: [], 
        allPublishers: [],
        lookups: { testate: [], annate: [], tipi: [], albi: [], editori: [] }
    },

    refreshLookups: async () => {
        try {
            const [t, a, tp, alb, ed] = await Promise.all([
                supabase.from('testata').select('id, nome, serie_id'),
                supabase.from('annata').select('id, nome, serie_id'),
                supabase.from('tipo_pubblicazione').select('id, nome'),
                supabase.from('issue').select('id, numero, serie:serie_id(nome)').order('numero'),
                supabase.from('editore').select('id, nome')
            ]);
            Logic.state.lookups = {
                testate: t.data || [],
                annate: a.data || [],
                tipi: tp.data || [],
                albi: (alb.data || []).map(x => ({id: x.id, nome: `${x.serie?.nome} n°${x.numero}`})),
                editori: ed.data || []
            };
        } catch (e) { console.error("Lookup Error:", e); }
    },

    openEditForm: async (id = null) => {
        await Logic.refreshLookups();
        let data = null;
        if (id) {
            const { data: issue } = await supabase.from('issue').select('*').eq('id', id).single();
            data = issue;
        }
        Render.editForm(data, Logic.state.lookups);
    },

    saveIssue: async (id = null) => {
        try {
            const possesso = document.getElementById('f-possesso').value;
            const ratingInput = document.getElementById('f-condizione').value;

            const payload = {
                serie_id: getValue('f-serie'),
                testata_id: getValue('f-testata'),
                annata_id: getValue('f-annata'),
                tipo_pubblicazione_id: getValue('f-tipo'),
                editore_id: getValue('f-editore'),
                supplemento_id: getValue('f-supplemento'),
                numero: parseInt(document.getElementById('f-numero').value) || 0,
                nome: document.getElementById('f-nome').value || '',
                immagine_url: document.getElementById('f-immagine').value || '',
                data_pubblicazione: getValue('f-data'),
                possesso: possesso,
                valore: parseFloat(document.getElementById('f-valore').value) || 0,
                condizione: possesso === 'manca' ? null : (parseInt(ratingInput) || null)
            };

            const { error } = id 
                ? await supabase.from('issue').update(payload).eq('id', id)
                : await supabase.from('issue').insert([payload]);

            if (error) throw error;
            UI.MODAL_CLOSE();
            if (payload.serie_id) Logic.selectSerie(payload.serie_id);
        } catch (e) { 
            console.error("Errore Supabase:", e);
            alert("Errore durante il salvataggio");
        }
    },

    selectCodice: (id) => {
        const filtered = Logic.state.allSeries.filter(s => s.editore_id === id);
        Render.series(filtered, id);
    },

    resetAllFilters: () => {
        Render.series(Logic.state.allSeries);
        const mainRoot = document.getElementById('ui-main-root');
        if(mainRoot) mainRoot.innerHTML = '';
    },

    selectSerie: async (serieId) => {
        const { data, error } = await supabase
            .from('issue')
            .select(`
                *,
                serie:serie_id(nome),
                testata:testata_id(nome),
                annata:annata_id(nome)
            `)
            .eq('serie_id', serieId)
            .order('numero', { ascending: true });

        if (error) console.error(error);
        Render.issues(data || []);
    },

    openIssueDetail: async (issueId) => {
        const { data, error } = await supabase
            .from('issue')
            .select(`
                *,
                serie:serie_id(*),
                testata:testata_id(*),
                annata:annata_id(*),
                editore:editore_id(*),
                tipo:tipo_pubblicazione_id(*),
                storie_in_issue(
                    posizione,
                    storie(
                        nome,
                        personaggi_storie(
                            personaggi(nome, immagine_url)
                        )
                    )
                )
            `)
            .eq('id', issueId)
            .single();

        if (error) return console.error(error);

        const formattedStorie = data.storie_in_issue.map(si => ({
            posizione: si.posizione,
            nome: si.storie?.nome || 'Senza Titolo',
            personaggi: si.storie?.personaggi_storie?.map(ps => ps.personaggi).filter(Boolean) || []
        })).sort((a, b) => a.posizione - b.posizione);

        Render.issueModal(data, formattedStorie);
    }
};

// --- LOGICA DI FILTRAGGIO E RICERCA CONSOLIDATA ---
document.addEventListener('input', (e) => {
    if (e.target.id === 'serie-search') {
        const query = e.target.value.toLowerCase();
        const results = Logic.state.allSeries.filter(s => s.nome.toLowerCase().includes(query));
        const container = document.getElementById('serie-results');
        if (container) {
            container.innerHTML = results.map(s => `
                <div onclick="selectSerie('${s.id}'); document.getElementById('serie-results').innerHTML=''" class="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-0">
                    <span class="text-sm font-bold text-slate-200">${s.nome}</span>
                </div>
            `).join('');
            container.classList.toggle('hidden', query.length === 0);
        }
    }
});

window.setView = (mode) => {
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    if (!gridBtn || !listBtn) return;

    if (mode === 'grid') {
        gridBtn.classList.add('bg-yellow-500', 'text-black');
        listBtn.classList.remove('bg-yellow-500', 'text-black');
    } else {
        listBtn.classList.add('bg-yellow-500', 'text-black');
        gridBtn.classList.remove('bg-yellow-500', 'text-black');
    }
    // La logica di re-render effettiva dipenderà dalla implementazione specifica in Render.js
};
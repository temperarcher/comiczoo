/**
 * VERSION: 1.4.7
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
                albi: (alb.data || []).map(x => ({ id: x.id, nome: `${x.serie?.nome || 'Serie Ignota'} n°${x.numero}` })),
                editori: ed.data || []
            };
        } catch (e) { console.error("Errore lookup:", e); }
    },

    selectCodice: async (id) => {
        try {
            const { data: editori } = await supabase.from('editore').select('id').eq('codice_editore_id', id);
            if (!editori || editori.length === 0) return Render.series([]);
            const editoreIds = editori.map(e => e.id);
            const { data: issues } = await supabase.from('issue').select('serie_id').in('editore_id', editoreIds);
            const serieIds = [...new Set(issues.map(i => i.serie_id))];
            const filteredSeries = Logic.state.allSeries.filter(s => serieIds.includes(s.id));
            Render.publishers(Logic.state.allPublishers, id);
            Render.series(filteredSeries);
        } catch (e) { console.error("Filtro Codice fallito:", e); }
    },

    resetAllFilters: () => {
        Render.publishers(Logic.state.allPublishers, null);
        Render.series(Logic.state.allSeries);
        const mainRoot = document.getElementById('ui-main-root');
        if(mainRoot) mainRoot.innerHTML = '';
    },

    selectSerie: async (id) => {
        try {
            const { data, error } = await supabase
                .from('issue')
                .select(`*, serie:serie_id(nome), testata:testata_id(nome), annata:annata_id(nome)`)
                .eq('serie_id', id)
                .order('data_pubblicazione', { ascending: true })
                .order('numero', { ascending: true });
            if (error) throw error;
            Render.issues(data);
        } catch (e) { console.error("Errore griglia albi:", e); }
    },

    openIssueDetail: async (id) => {
        try {
            const { data: issue } = await supabase
                .from('issue')
                .select(`*, serie:serie_id(*), testata:testata_id(*), annata:annata_id(*), editore:editore_id(*, codice_editore:codice_editore_id(*)), tipo:tipo_pubblicazione_id(*)`)
                .eq('id', id).single();

            const { data: storieRel } = await supabase
                .from('storia_in_issue')
                .select(`posizione, storia:storia_id (id, nome, personaggi:personaggio_storia (personaggio:personaggio_id (nome, immagine_url))))`)
                .eq('issue_id', id).order('posizione');

            const storiesFormatted = (storieRel || []).map(s => ({
                posizione: s.posizione,
                nome: s.storia.nome,
                personaggi: s.storia.personaggi.map(p => p.personaggio)
            }));

            let supplementoStr = null;
            if (issue.supplemento_id) {
                const { data: supp } = await supabase.from('issue').select('numero, serie:serie_id(nome)').eq('id', issue.supplemento_id).single();
                if (supp) supplementoStr = `${supp.serie.nome} n°${supp.numero}`;
            }
            Render.modal(issue, storiesFormatted, supplementoStr);
        } catch (e) { console.error("Dettaglio fallito:", e); }
    },

    openEditForm: async (id) => {
        await Logic.refreshLookups();
        const { data: issue } = await supabase.from('issue').select('*').eq('id', id).single();
        const { data: storieRel } = await supabase
            .from('storia_in_issue')
            .select(`posizione, storia:storia_id (nome)`)
            .eq('issue_id', id).order('posizione');

        Render.form("Modifica Albo", issue, {
            series: Logic.state.allSeries,
            ...Logic.state.lookups
        }, storieRel || []);
    },

    openNewForm: async () => {
        await Logic.refreshLookups();
        Render.form("Nuovo Albo", null, {
            series: Logic.state.allSeries,
            ...Logic.state.lookups
        }, []);
    },

    saveIssue: async (id = null) => {
        try {
            const getValue = (id) => {
                const val = document.getElementById(id).value;
                return val === "" ? null : val;
            };

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
                possesso: document.getElementById('f-possesso').value,
                valore: parseFloat(document.getElementById('f-valore').value) || 0,
                condizione: parseInt(document.getElementById('f-condizione').value) || 5
            };

            const { error } = id 
                ? await supabase.from('issue').update(payload).eq('id', id)
                : await supabase.from('issue').insert([payload]);

            if (error) throw error;
            UI.MODAL_CLOSE();
            if (payload.serie_id) Logic.selectSerie(payload.serie_id);
        } catch (e) { 
            console.error("Errore Supabase:", e);
            alert("Errore durante il salvataggio. Controlla la console per i dettagli."); 
        }
    }
};
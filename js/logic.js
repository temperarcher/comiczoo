/**
 * VERSION: 1.5.0
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
                albi: (alb.data || []).map(x => ({ id: x.id, nome: `${x.serie?.nome} n°${x.numero}` })),
                editori: ed.data || []
            };
        } catch (e) { console.error("Errore lookup:", e); }
    },

    fetchAllData: async () => {
        try {
            const [s, p] = await Promise.all([
                supabase.from('serie').select('*').order('nome'),
                supabase.from('editore').select('*, codice_editore:codice_editore_id(nome)').order('nome')
            ]);
            Logic.state.allSeries = s.data || [];
            Logic.state.allPublishers = p.data || [];
            Render.publishers(Logic.state.allPublishers);
            Render.series(Logic.state.allSeries);
        } catch (e) { console.error("Errore fetch:", e); }
    },

    filterByPublisher: (publisherId) => {
        const filtered = publisherId 
            ? Logic.state.allSeries.filter(s => s.editore_id === publisherId)
            : Logic.state.allSeries;
        Render.series(filtered);
        Render.publishers(Logic.state.allPublishers, publisherId);
    },

    selectSerie: async (serieId) => {
        const { data, error } = await supabase
            .from('issue')
            .select('*, serie:serie_id(nome), testata:testata_id(nome), annata:annata_id(nome), tipo:tipo_pubblicazione_id(nome), editore:editore_id(nome, immagine_url, codice_editore:codice_editore_id(nome))')
            .eq('serie_id', serieId)
            .order('data_pubblicazione', { ascending: true })
            .order('numero', { ascending: true });
        if (error) console.error(error);
        else Render.issues(data);
    },

    openIssueDetail: async (issueId) => {
        try {
            const { data: issue, error } = await supabase
                .from('issue')
                .select('*, serie:serie_id(nome), testata:testata_id(nome), annata:annata_id(nome), tipo:tipo_pubblicazione_id(nome), editore:editore_id(nome, immagine_url, codice_editore:codice_editore_id(nome))')
                .eq('id', issueId)
                .single();
            if (error) throw error;

            const { data: stories } = await supabase
                .from('storie_in_issue')
                .select('posizione, storia:storia_id(nome)')
                .eq('issue_id', issueId)
                .order('posizione');

            let supplementoStr = "";
            if (issue.supplemento_id) {
                const { data: supp } = await supabase
                    .from('issue')
                    .select('numero, serie:serie_id(nome)')
                    .eq('id', issue.supplemento_id)
                    .single();
                if (supp) supplementoStr = `Supplemento a ${supp.serie?.nome} n°${supp.numero}`;
            }

            Render.modal(issue, stories || [], supplementoStr);
        } catch (e) { console.error(e); }
    },

    openEditForm: async (issueId = null) => {
        await Logic.refreshLookups();
        let issueData = null;
        let stories = [];

        if (issueId) {
            const { data } = await supabase.from('issue').select('*').eq('id', issueId).single();
            issueData = data;
            const { data: st } = await supabase.from('storie_in_issue').select('posizione, storia:storia_id(nome)').eq('issue_id', issueId).order('posizione');
            stories = st || [];
        }

        const lookupData = {
            series: Logic.state.allSeries.map(s => ({ id: s.id, nome: s.nome })),
            testate: Logic.state.lookups.testate,
            annate: Logic.state.lookups.annate,
            tipi: Logic.state.lookups.tipi,
            editori: Logic.state.lookups.editori,
            albi: Logic.state.lookups.albi
        };

        Render.form(issueId ? "Modifica Albo" : "Nuovo Albo", issueData, lookupData, stories);
    },

    saveIssue: async (id = null) => {
        try {
            const getValue = (id) => {
                const val = document.getElementById(id).value;
                return val === "" ? null : val;
            };

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
            alert("Errore durante il salvataggio.");
        }
    }
};
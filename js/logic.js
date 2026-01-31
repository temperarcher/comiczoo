/**
 * VERSION: 1.4.2
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { supabase } from './supabase-client.js';
import { Render } from './render.js';

export const Logic = {
    state: { allSeries: [], allPublishers: [] },

    selectCodice: async (id) => {
        try {
            const { data: editori } = await supabase
                .from('editore')
                .select('id')
                .eq('codice_editore_id', id);
            
            if (!editori || editori.length === 0) return Render.series([]);
            const editoreIds = editori.map(e => e.id);

            const { data: issues } = await supabase
                .from('issue')
                .select('serie_id')
                .in('editore_id', editoreIds);

            const serieIds = [...new Set(issues.map(i => i.serie_id))];
            const filteredSeries = Logic.state.allSeries.filter(s => serieIds.includes(s.id));

            Render.publishers(Logic.state.allPublishers, id);
            Render.series(filteredSeries);
            const mainRoot = document.getElementById('ui-main-root');
            if(mainRoot) mainRoot.innerHTML = '';
        } catch (e) { console.error("Filtro Codice fallito:", e.message); }
    },

    resetAllFilters: () => {
        Render.publishers(Logic.state.allPublishers, null);
        Render.series(Logic.state.allSeries);
        const mainRoot = document.getElementById('ui-main-root');
        if(mainRoot) mainRoot.innerHTML = '';
    },

    selectSerie: async (id, nome) => {
        try {
            const { data, error } = await supabase
                .from('issue')
                .select(`
                    *,
                    serie:serie_id(nome),
                    testata:testata_id(nome),
                    annata:annata_id(nome)
                `)
                .eq('serie_id', id)
                .order('data_pubblicazione', { ascending: true, nullsFirst: false });

            if (error) throw error;
            Render.issues(data);
        } catch (e) { console.error("Errore griglia albi:", e.message); }
    },

    openIssueDetail: async (id) => {
        try {
            const { data: issue, error } = await supabase
                .from('issue')
                .select(`
                    *,
                    serie:serie_id(*),
                    testata:testata_id(*),
                    annata:annata_id(*),
                    editore:editore_id(*, codice_editore:codice_editore_id(*)),
                    tipo:tipo_pubblicazione_id(*)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            const { data: storieRel } = await supabase
                .from('storia_in_issue')
                .select(`
                    posizione,
                    storia:storia_id (
                        id, nome,
                        personaggi:personaggio_storia (
                            personaggio:personaggio_id (nome, immagine_url)
                        )
                    )
                `)
                .eq('issue_id', id)
                .order('posizione');

            const storiesFormatted = (storieRel || []).map(s => ({
                posizione: s.posizione,
                nome: s.storia.nome,
                personaggi: s.storia.personaggi.map(p => p.personaggio)
            }));

            let supplementoStr = null;
            if (issue.supplemento_id) {
                const { data: supp } = await supabase
                    .from('issue')
                    .select('numero, data_pubblicazione, serie:serie_id(nome)')
                    .eq('id', issue.supplemento_id)
                    .single();
                if (supp) {
                    supplementoStr = `${supp.serie.nome} n°${supp.numero} del ${new Date(supp.data_pubblicazione).toLocaleDateString('it-IT')}`;
                }
            }

            Render.modal(issue, storiesFormatted, supplementoStr);
        } catch (e) { console.error("Errore dettaglio modale:", e.message); }
    },

    openEditForm: async (id) => {
        try {
            const { data: issue } = await supabase.from('issue').select('*').eq('id', id).single();
            const lookup = {
                series: Logic.state.allSeries,
                publishers: Logic.state.allPublishers
            };
            Render.form("Modifica Albo", issue, lookup);
        } catch (e) { console.error("Errore apertura form edit:", e.message); }
    },

    openNewForm: () => {
        const lookup = {
            series: Logic.state.allSeries,
            publishers: Logic.state.allPublishers
        };
        Render.form("Nuovo Albo", null, lookup);
    },

    saveIssue: async (id = null) => {
        try {
            const payload = {
                serie_id: document.getElementById('f-serie').value,
                numero: parseInt(document.getElementById('f-numero').value),
                editore_id: document.getElementById('f-editore').value,
                possesso: document.getElementById('f-possesso').value,
                valore: parseFloat(document.getElementById('f-valore').value),
                condizione: parseInt(document.getElementById('f-condizione').value)
            };

            let res;
            if (id) {
                res = await supabase.from('issue').update(payload).eq('id', id);
            } else {
                res = await supabase.from('issue').insert([payload]);
            }

            if (res.error) throw res.error;
            
            UI.MODAL_CLOSE();
            if (payload.serie_id) Logic.selectSerie(payload.serie_id);
        } catch (e) { 
            alert("Errore durante il salvataggio: " + e.message);
            console.error("Salvataggio fallito:", e); 
        }
    }
};
/**
 * VERSION: 1.2.0
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
            if (mainRoot) mainRoot.innerHTML = '';
        } catch (e) {
            console.error("Errore filtro editori:", e);
        }
    },

    selectSerie: async (serieId) => {
        try {
            const { data: issues } = await supabase
                .from('issue')
                .select(`
                    id, numero, nome, immagine_url, valore, condizione, possesso, 
                    serie:serie_id(nome),
                    annata:annata_id(nome),
                    tipo:tipo_pubblicazione_id(nome)
                `)
                .eq('serie_id', serieId)
                .order('numero', { ascending: true });

            Render.issues(issues);
        } catch (e) {
            console.error("Errore carico albi:", e);
        }
    },

    getDetail: async (id) => {
        try {
            // 1. Dati Issue principali con join per il modale
            const { data: issue } = await supabase
                .from('issue')
                .select(`
                    *,
                    serie:serie_id(nome),
                    testata:testata_id(nome),
                    annata:annata_id(nome),
                    tipo:tipo_pubblicazione_id(nome),
                    editore:editore_id(nome, immagine_url, codice_editore:codice_editore_id(nome))
                `)
                .eq('id', id)
                .single();

            // 2. Query Storie relazionate
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

            // 3. Gestione Supplemento (Auto-join ricorsivo su issue)
            let supplementoStr = null;
            if (issue.supplemento_id) {
                const { data: supp } = await supabase
                    .from('issue')
                    .select('numero, data_pubblicazione, serie:serie_id(nome)')
                    .eq('id', issue.supplemento_id)
                    .single();
                if (supp) {
                    const suppDate = new Date(supp.data_pubblicazione).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
                    supplementoStr = `${supp.serie.nome} n°${supp.numero} del ${suppDate}`;
                }
            }

            Render.modal(issue, storiesFormatted, supplementoStr);
        } catch (e) {
            console.error("Errore dettaglio modale:", e);
        }
    }
};
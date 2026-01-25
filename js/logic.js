/**
 * VERSION: 1.1.8
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { supabase } from './supabase-client.js';
import { Render } from './render.js';

export const Logic = {
    state: { allSeries: [], allPublishers: [] },

    selectCodice: async (id) => {
        try {
            // 1. Recupero editori associati al codice_editore
            const { data: editori, error: errEd } = await supabase
                .from('editore')
                .select('id')
                .eq('codice_editore_id', id);
            
            if (errEd) throw errEd;
            if (!editori || editori.length === 0) return Render.series([]);

            const editoreIds = editori.map(e => e.id);

            // 2. Recupero serie_id univoci dalla tabella issue tramite editore_id
            const { data: issues, error: errIss } = await supabase
                .from('issue')
                .select('serie_id')
                .in('editore_id', editoreIds);

            if (errIss) throw errIss;

            const serieIds = [...new Set(issues.map(i => i.serie_id))];
            
            // 3. Filtro locale delle serie caricate all'avvio e re-render
            const filteredSeries = Logic.state.allSeries.filter(s => serieIds.includes(s.id));

            Render.publishers(Logic.state.allPublishers, id);
            Render.series(filteredSeries);
        } catch (e) {
            console.error("Errore nel filtraggio relazionale:", e.message);
        }
    },

    resetAllFilters: () => {
        Render.publishers(Logic.state.allPublishers, null);
        Render.series(Logic.state.allSeries);
    },

    selectSerie: (id, nome) => {
        console.log(`Serie selezionata: ${nome} (${id})`);
    }
};
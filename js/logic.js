/**
 * VERSION: 1.1.9
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
    }
};
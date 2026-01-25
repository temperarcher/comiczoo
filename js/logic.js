/**
 * VERSION: 1.1.9
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { supabase } from './supabase-client.js';
import { Render } from './render.js';

export const Logic = {
    // Stato locale per gestire i dati senza fetch inutili
    state: { allSeries: [], allPublishers: [] },

    /**
     * Seleziona un Codice Editore e filtra le serie correlate
     */
    selectCodice: async (id) => {
        try {
            // 1. Recupero editori associati al codice_editore (Percorso: codice_editore -> editore)
            const { data: editori, error: errEd } = await supabase
                .from('editore')
                .select('id')
                .eq('codice_editore_id', id);
            
            if (errEd) throw errEd;
            if (!editori || editori.length === 0) return Render.series([]);

            const editoreIds = editori.map(e => e.id);

            // 2. Recupero serie_id univoci dalla tabella issue (Percorso: editore -> issue -> serie)
            const { data: issues, error: errIss } = await supabase
                .from('issue')
                .select('serie_id')
                .in('editore_id', editoreIds);

            if (errIss) throw errIss;

            const serieIds = [...new Set(issues.map(i => i.serie_id))];
            
            // 3. Filtro locale delle serie caricate all'avvio e re-render dello showcase
            const filteredSeries = Logic.state.allSeries.filter(s => serieIds.includes(s.id));

            Render.publishers(Logic.state.allPublishers, id);
            Render.series(filteredSeries);
            
            // Pulizia del main root al cambio filtro editore
            const mainRoot = document.getElementById('ui-main-root');
            if(mainRoot) mainRoot.innerHTML = '';

        } catch (e) {
            console.error("Errore nel filtraggio relazionale:", e.message);
        }
    },

    /**
     * Ripristina la visualizzazione iniziale
     */
    resetAllFilters: () => {
        Render.publishers(Logic.state.allPublishers, null);
        Render.series(Logic.state.allSeries);
        const mainRoot = document.getElementById('ui-main-root');
        if(mainRoot) mainRoot.innerHTML = '';
    },

    /**
     * Carica e visualizza la griglia degli albi per una serie selezionata
     */
    selectSerie: async (id, nome) => {
        try {
            console.log(`Caricamento album figurine per serie: ${nome}`);
            
            // Query complessa con JOIN relazionali e ordinamento specifico
            const { data: issues, error } = await supabase
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

            // Renderizzazione della griglia nel MAIN_ROOT
            Render.issues(issues);

        } catch (e) {
            console.error("Errore caricamento griglia albi:", e.message);
        }
    }
};
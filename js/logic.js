/**
 * VERSION: 1.1.7
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { supabase } from './supabase-client.js';
import { Render } from './render.js';

export const Logic = {
    // Stato locale per gestire i dati senza fetch inutili
    state: { allSeries: [], allPublishers: [] },

    // Funzione per selezionare un Codice Editore
    selectCodice: async (id) => {
        try {
            // 1. Recupero ID serie univoche dalla tabella issue filtrate per codice_editore
            const { data: issues, error } = await supabase
                .from('issue')
                .select('serie_id')
                .eq('tipo_pubblicazione_id', id); // Assumendo che tipo_pubblicazione_id sia il legame col codice

            if (error) throw error;

            const serieIds = [...new Set(issues.map(i => i.serie_id))];
            
            // 2. Filtro le serie caricate all'avvio
            const filteredSeries = Logic.state.allSeries.filter(s => serieIds.includes(s.id));

            // 3. Renderizzo con stato attivo
            Render.publishers(Logic.state.allPublishers, id);
            Render.series(filteredSeries);
        } catch (e) {
            console.error("Errore filtro codice:", e.message);
        }
    },

    // Reset totale filtri
    resetAllFilters: () => {
        Render.publishers(Logic.state.allPublishers, null);
        Render.series(Logic.state.allSeries);
    },

    // Selezione Serie (per sviluppo futuro griglia albi)
    selectSerie: (id, nome) => {
        console.log(`Serie selezionata: ${nome} (${id})`);
        // Qui andrà la logica per caricare la griglia degli albi
    }
};
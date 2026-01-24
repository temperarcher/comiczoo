/**
 * VERSION: 8.5.0
 * SCOPO: Gestione salvataggio Codice Editore
 */

const ISSUE_DETAILS_QUERY = `
    *,
    annata (id, nome),
    testata (id, nome),
    tipo_pubblicazione (id, nome),
    editore (
        id, nome, immagine_url, 
        codice_editore (id, nome, immagine_url)
    ),
    storia_in_issue (
        posizione,
        storia (
            id, nome,
            personaggio_storia (
                personaggio (id, nome, nome_originale, immagine_url)
            )
        )
    )
`;

export const api = {
    async getIssuesBySerie(serieId) {
        if (!serieId) return [];
        const { data, error } = await window.supabaseClient
            .from('issue')
            .select(ISSUE_DETAILS_QUERY)
            .eq('serie_id', serieId)
            .order('numero', { ascending: true });

        if (error) {
            console.error("ERRORE API:", error.message);
            throw error;
        }
        return data;
    },

    async saveIssue(issueData) {
        const payload = { ...issueData };
        delete payload.editore;
        delete payload.annata;
        delete payload.testata;
        delete payload.tipo_pubblicazione;
        delete payload.storia_in_issue;
        delete payload.codice_editore_id;

        Object.keys(payload).forEach(key => {
            if (payload[key] === "") payload[key] = null;
        });

        if (payload.valore !== null) payload.valore = parseFloat(payload.valore);
        if (payload.condizione !== null) payload.condizione = parseInt(payload.condizione);
        if (!payload.id) delete payload.id;

        const { data, error } = await window.supabaseClient.from('issue').upsert(payload).select();
        if (error) throw error;
        return data;
    },

    async saveCodiceEditore(codiceData) {
        const payload = { ...codiceData };
        if (payload.id === "" || payload.id === null) delete payload.id;
        
        const { data, error } = await window.supabaseClient
            .from('codice_editore')
            .upsert(payload)
            .select();

        if (error) throw error;
        return data;
    }
};
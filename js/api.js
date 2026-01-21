/**
 * VERSION: 8.1.0
 * ARCHITETTURA: Singolare Consolidato
 * RELAZIONI: issue -> storia_in_issue -> storia -> personaggio_storia -> personaggio
 */

const ISSUE_DETAILS_QUERY = `
    *,
    annata (id, nome),
    testata (id, nome),
    tipo_pubblicazione (id, nome),
    editore (
        id, 
        nome, 
        immagine_url, 
        codice_editore (id, nome, immagine_url)
    ),
    storia_in_issue (
        posizione,
        storia (
            id,
            nome,
            personaggio_storia (
                personaggio (id, nome, nome_originale, immagine_url)
            )
        )
    )
`;

export const api = {
    /**
     * Recupera gli albi di una serie con tutti i join
     */
    async getIssuesBySerie(serieId) {
        if (!serieId) return [];
        
        const { data, error } = await window.supabaseClient
            .from('issue')
            .select(ISSUE_DETAILS_QUERY)
            .eq('serie_id', serieId)
            .order('numero', { ascending: true });

        if (error) {
            console.error("ERRORE API (getIssuesBySerie):", error.message, error.details);
            throw error;
        }
        return data;
    },

    /**
     * Recupera dettagli singolo albo
     */
    async getIssueById(issueId) {
        const { data, error } = await window.supabaseClient
            .from('issue')
            .select(ISSUE_DETAILS_QUERY)
            .eq('id', issueId)
            .single();

        if (error) {
            console.error("ERRORE API (getIssueById):", error.message);
            throw error;
        }
        return data;
    },

    /**
     * Ricerca serie
     */
    async searchSerie(searchTerm) {
        const { data, error } = await window.supabaseClient
            .from('serie')
            .select('id, nome, immagine_url')
            .ilike('nome', `%${searchTerm}%`)
            .limit(10);

        if (error) return [];
        return data;
    }
};
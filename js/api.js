/**
 * VINCOLO: Nessun riferimento al DOM. Restituisce solo oggetti strutturati.
 * Gestisce la gerarchia: Issue -> Storie -> Personaggi
 */

// Definizione della query principale con tutti i JOIN necessari
const ISSUE_DETAILS_QUERY = `
    *,
    annata (id, nome),
    testata (id, nome),
    tipo_pubblicazione (id, nome)
`;
/*const ISSUE_DETAILS_QUERY = `
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
    storie_in_issue (
        posizione,
        storie (
            id,
            nome,
            personaggi_storie (
                personaggio (id, nome, nome_originale, immagine_url)
            )
        )
    )
`;
*/
export const api = {
    /**
     * Recupera tutti gli albi di una serie specifica
     */
    async getIssuesBySerie(serieId) {
        const { data, error } = await window.supabaseClient
            .from('issue')
            .select(ISSUE_DETAILS_QUERY)
            .eq('serie_id', serieId)
            .order('numero', { ascending: true }); // Ordinamento di base per numero

        if (error) {
            console.error("Errore API getIssuesBySerie:", error);
            throw error;
        }
        return data;
    },

    /**
     * Ricerca rapida serie per input suggerimenti
     */
    async searchSerie(searchTerm) {
        const { data, error } = await window.supabaseClient
            .from('serie')
            .select('id, nome, immagine_url')
            .ilike('nome', `%${searchTerm}%`)
            .limit(10);

        if (error) return [];
        return data;
    },

    /**
     * Recupera i dettagli di un singolo albo (incluso il supplemento se presente)
     */
    async getIssueById(issueId) {
        const { data, error } = await window.supabaseClient
            .from('issue')
            .select(ISSUE_DETAILS_QUERY)
            .eq('id', issueId)
            .single();

        if (error) throw error;
        return data;
    }
};
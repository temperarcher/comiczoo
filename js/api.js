/**
 * VERSION: 8.3.4
 * SCOPO: Query Supabase con relazioni corrette per Modale
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
    }
};
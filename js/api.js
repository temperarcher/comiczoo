/**
 * VERSION: 8.4.0 (Integrale - Aggiunta Salvataggio)
 * SCOPO: Query Supabase e persistenza dati
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

    /**
     * Salva o aggiorna un albo (Upsert)
     */
    async saveIssue(issueData) {
        const payload = { ...issueData };
        
        // Pulizia campi relazionali per evitare errori Supabase in scrittura
        delete payload.editore;
        delete payload.annata;
        delete payload.testata;
        delete payload.tipo_pubblicazione;
        delete payload.storia_in_issue;
        delete payload.codice_editore_id; // Campo virtuale del form

        // Conversione numerica per il valore
        if (payload.valore) payload.valore = parseFloat(payload.valore);
        if (payload.id === "") delete payload.id;

        const { data, error } = await window.supabaseClient
            .from('issue')
            .upsert(payload)
            .select();

        if (error) throw error;
        return data;
    }
};
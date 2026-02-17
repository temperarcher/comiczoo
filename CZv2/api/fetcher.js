// CZv2/api/fetcher.js
import { client } from '../core/supabase.js';

export const Fetcher = {
    // Recupera tutti gli editori principali
    async getCodiciEditori() {
        const { data, error } = await client
            .from('codice_editore')
            .select('id, nome, immagine_url')
            .order('nome');
        
        if (error) {
            console.error("Errore Fetcher (Codici Editori):", error);
            throw error;
        }
        return data;
    }
	async getSerieByCodiceEditore(codiceEditoreId) {
        // Prepariamo la query base
        let query = client
            .from('serie')
            .select(`
                id, 
                nome, 
                immagine_url,
                issue!inner (
                    editore!inner (
                        codice_editore_id
                    )
                )
            `);

        // Se non è "TUTTI", filtriamo per il codice selezionato
        if (codiceEditoreId && codiceEditoreId !== 'all') {
            query.eq('issue.editore.codice_editore_id', codiceEditoreId);
        }

        const { data, error } = await query.order('nome');
        
        if (error) throw error;

        // Deduplicazione: poiché una serie ha tante issue, la query restituisce 
        // la stessa serie più volte. La puliamo qui.
        const uniqueSerie = Array.from(new Map(data.map(item => [item.id, item])).values());
        
        return uniqueSerie;
    }
};
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
};
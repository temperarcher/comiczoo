/**
 * VERSION: 8.0.0
 * VINCOLO: Solo dati e configurazioni. Nessun metodo DOM.
 */
export const store = {
    // Stato dinamico
    state: {
        issues: [],          // Array degli albi caricati (completi di storie/personaggi)
        viewMode: 'grid',    // 'grid' | 'list'
        filter: 'all',       // 'all' | 'celo' | 'manca'
        searchQuery: '',
        selectedSerie: { id: null, nome: "" }
    },
    
    // Costanti e configurazioni
    config: {
        placeholders: {
            cover: 'https://placehold.co/300x450/1e293b/fbbf24?text=Copertina+Assente',
            avatar: 'https://placehold.co/100x100/1e293b/fbbf24?text=?',
            logo: 'https://placehold.co/50x50/1e293b/fbbf24?text=Logo'
        },
        badgeColors: {
            celo: 'bg-green-900 text-green-300 border-green-700',
            manca: 'bg-red-900 text-red-300 border-red-700'
        }
    }
};
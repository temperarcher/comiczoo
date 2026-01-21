/**
 * VERSION: 8.2.1
 */
export const store = {
    state: {
        selectedSerie: null,
        selectedBrand: null, // Memorizza il filtro editore attivo
        issues: [],
        filter: 'all',
        searchQuery: ''
    },
    config: {
        placeholders: {
            cover: 'https://via.placeholder.com/300x450/1e293b/cbd5e1?text=No+Cover',
            avatar: 'https://via.placeholder.com/100x100/1e293b/cbd5e1?text=?',
            logo: 'https://via.placeholder.com/200x50/1e293b/cbd5e1?text=Logo'
        },
        badgeColors: {
            celo: 'bg-green-500/20 text-green-400 border-green-500/50',
            manca: 'bg-red-500/20 text-red-400 border-red-500/50'
        }
    }
};
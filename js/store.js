/**
 * VERSION: 8.2.2
 * MODIFICHE: Sostituzione placeholder con SVG Base64 per evitare errori DNS (net::ERR_NAME_NOT_RESOLVED).
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
            // Placeholder per le copertine (300x450)
            cover: "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3e%3crect width='300' height='450' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' fill='%23cbd5e1' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' font-weight='bold'%3eNO COVER%3c/text%3e%3c/svg%3e",
            
            // Placeholder per avatar personaggi (100x100)
            avatar: "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3e%3crect width='100' height='100' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' fill='%23cbd5e1' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40'%3e?%3c/text%3e%3c/svg%3e",
            
            // Placeholder per loghi editori (200x50)
            logo: "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='200' height='50' viewBox='0 0 200 50'%3e%3crect width='200' height='50' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' fill='%23cbd5e1' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='bold'%3eLOGO%3c/text%3e%3c/svg%3e"
        },
        badgeColors: {
            celo: 'bg-green-500/20 text-green-400 border-green-500/50',
            manca: 'bg-red-500/20 text-red-400 border-red-500/50'
        }
    }
};
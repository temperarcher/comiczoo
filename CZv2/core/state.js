// CZv2/core/state.js
export const AppState = {
    current: {
        codice_editore_id: 'all',
        serie_id: null,
        issue_id: null,
        search_query: ''
    },
    
    set(key, value) {
        this.current[key] = value;
        // Logica di reset a cascata
        if (key === 'codice_editore_id') this.current.serie_id = null;
        
        console.log(`[State Update] ${key}:`, value);
    }
};
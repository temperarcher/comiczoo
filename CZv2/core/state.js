// CZv2/core/state.js
export const AppState = {
    current: {
        codice_editore_id: 'all', // Non più editore_id
        serie_id: null,
        search_query: ''
    },
    set(key, value) {
        this.current[key] = value;
        if (key === 'codice_editore_id') this.current.serie_id = null;
    }
};
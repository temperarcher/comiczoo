/**
 * VERSION: 8.0.0
 * VINCOLO: Unico modulo autorizzato a usare document.getElementById o querySelector.
 */
import { api } from './api.js';
import { store } from './store.js';
import { components } from './components.js';

export const render = {
    /**
     * Sincronizza lo stato locale con il DB e aggiorna la vista
     */
    async refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;

        // 1. Mostra loader
        container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Caricamento in corso...</div>`;

        try {
            // 2. Recupera dati aggiornati (se abbiamo una serie selezionata)
            if (store.state.selectedSerie.id) {
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
            }

            // 3. Filtra i dati basandosi sullo stato dello store
            const filteredData = store.state.issues.filter(issue => {
                const matchFilter = store.state.filter === 'all' || issue.possesso === store.state.filter;
                const matchSearch = issue.nome.toLowerCase().includes(store.state.searchQuery.toLowerCase()) || 
                                   issue.numero.includes(store.state.searchQuery);
                return matchFilter && matchSearch;
            });

            // 4. Renderizza
            if (filteredData.length === 0) {
                container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Nessun albo trovato.</div>`;
                return;
            }

            container.innerHTML = filteredData.map(issue => components.issueCard(issue)).join('');

            // 5. Attacca eventi ai click sulle card per aprire il modale
            this.attachCardEvents();

        } catch (error) {
    console.error("DETTAGLIO ERRORE:", error); // <-- AGGIUNGI QUESTO
    container.innerHTML = `<div class="col-span-full text-center py-10 text-red-500">Errore: ${error.message}</div>`;
}
    },

    /**
     * Gestisce l'apertura del modale dettagliato
     */
    async openIssueModal(issueId) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        
        // Trova l'issue nello store
        const issue = store.state.issues.find(i => i.id === issueId);
        if (!issue) return;

        // Mostra modale
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Renderizza il corpo del modale (Dati Albo + Storie)
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <img src="${issue.immagine_url || store.config.placeholders.cover}" class="w-full rounded-lg shadow-2xl">
                </div>
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <img src="${issue.editore?.codice_editore?.immagine_url || store.config.placeholders.logo}" class="h-6">
                        <span class="text-slate-400 text-xs">${issue.editore?.nome || ''}</span>
                    </div>
                    <h2 class="text-2xl font-black text-white mb-1">${issue.nome}</h2>
                    <p class="text-yellow-500 font-mono mb-4">#${issue.numero} - ${issue.annata?.nome}</p>
                    
                    <div class="bg-slate-900 p-4 rounded-lg mb-6 border border-slate-700">
                        <h3 class="text-xs uppercase font-bold text-slate-500 mb-4 tracking-widest">Sommario Storie</h3>
                        ${issue.storie_in_issue && issue.storie_in_issue.length > 0 
                            ? issue.storie_in_issue
                                .sort((a, b) => a.posizione - b.posizione)
                                .map(si => components.storyItem(si)).join('')
                            : '<p class="text-slate-600 text-sm italic">Nessuna storia registrata</p>'}
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-800 p-3 rounded">
                            <span class="block text-[10px] text-slate-500 uppercase">Condizione</span>
                            <span class="text-sm text-white">${issue.condizione || 'N/D'}</span>
                        </div>
                        <div class="bg-slate-800 p-3 rounded">
                            <span class="block text-[10px] text-slate-500 uppercase">Valore</span>
                            <span class="text-sm text-green-400">${issue.valore ? issue.valore + ' €' : 'N/D'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(card => {
            card.onclick = () => this.openIssueModal(card.dataset.id);
        });
    }
};
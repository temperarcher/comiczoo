/**
 * VERSION: 8.1.1
 * FIX: Gestione valori NULL nel filtraggio (toLowerCase)
 * LOGICA: Rendering griglia e gestione Modale Dettagli
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
            // 2. Recupera dati aggiornati se abbiamo una serie selezionata
            if (store.state.selectedSerie && store.state.selectedSerie.id) {
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
            }

            // 3. Filtra i dati basandosi sullo stato dello store (con fix per NULL)
            const filteredData = store.state.issues.filter(issue => {
                const matchFilter = store.state.filter === 'all' || issue.possesso === store.state.filter;
                
                // Fix: se nome o numero sono null, usiamo una stringa vuota per evitare errori
                const nomeAlbo = (issue.nome || "").toLowerCase();
                const numeroAlbo = (issue.numero || "").toString();
                const query = (store.state.searchQuery || "").toLowerCase();

                const matchSearch = nomeAlbo.includes(query) || numeroAlbo.includes(query);
                
                return matchFilter && matchSearch;
            });

            // 4. Renderizzazione
            if (filteredData.length === 0) {
                container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500">Nessun albo trovato.</div>`;
                return;
            }

            container.innerHTML = filteredData.map(issue => components.issueCard(issue)).join('');

            // 5. Attacca eventi ai click sulle card
            this.attachCardEvents();

        } catch (error) {
            console.error("DETTAGLIO ERRORE RENDER:", error);
            container.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-red-500 font-bold">Errore nel caricamento dei dati</p>
                    <p class="text-slate-500 text-xs mt-2 italic">${error.message || ''}</p>
                </div>`;
        }
    },

    /**
     * Gestisce l'apertura del modale dettagliato
     */
    async openIssueModal(issueId) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        
        // Trova l'issue nello store (già caricata con tutti i join da api.js)
        const issue = store.state.issues.find(i => i.id === issueId);
        if (!issue) return;

        // Mostra modale
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Renderizza il corpo del modale
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-4">
                    <img src="${issue.immagine_url || store.config.placeholders.cover}" 
                         class="w-full rounded-xl shadow-2xl border border-slate-700 object-cover">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span class="block text-[10px] text-slate-500 uppercase tracking-widest">Condizione</span>
                            <span class="text-sm text-white font-medium">${issue.condizione || 'N/D'}</span>
                        </div>
                        <div class="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span class="block text-[10px] text-slate-500 uppercase tracking-widest">Valore Est.</span>
                            <span class="text-sm text-green-400 font-bold">${issue.valore ? issue.valore + ' €' : 'N/D'}</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col">
                    <div class="flex items-center gap-3 mb-4">
                        <img src="${issue.editore?.codice_editore?.immagine_url || store.config.placeholders.logo}" class="h-8 w-auto grayscale brightness-200">
                        <div class="h-4 w-[1px] bg-slate-700"></div>
                        <span class="text-slate-400 text-xs uppercase tracking-tighter">${issue.testata?.nome || ''}</span>
                    </div>

                    <h2 class="text-3xl font-black text-white leading-none mb-1">${issue.nome || 'Senza Titolo'}</h2>
                    <p class="text-yellow-500 font-mono text-lg mb-6">#${issue.numero} — ${issue.annata?.nome || 'Anno N/D'}</p>
                    
                    <div class="space-y-4">
                        <h3 class="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] border-b border-slate-800 pb-2">Sommario Albo</h3>
                        <div class="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            ${issue.storia_in_issue && issue.storia_in_issue.length > 0 
                                ? issue.storia_in_issue
                                    .sort((a, b) => a.posizione - b.posizione)
                                    .map(si => components.storyItem(si)).join('')
                                : '<p class="text-slate-600 text-sm italic py-4">Nessuna storia o personaggio censito per questo volume.</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Collega l'evento click a ogni card
     */
    attachCardEvents() {
        const cards = document.querySelectorAll('[data-id]');
        cards.forEach(card => {
            card.onclick = () => this.openIssueModal(card.dataset.id);
        });
    }
};
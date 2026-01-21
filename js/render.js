/**
 * VERSION: 8.2.0
 * LOGICA: Rendering Showcase + Griglia con fix Null Check
 */
import { api } from './api.js';
import { store } from './store.js';
import { components } from './components.js';

export const render = {
    // Rendering degli showcase orizzontali (Editori e Serie)
    async refreshShowcases() {
        const pubContainer = document.getElementById('publisher-showcase');
        const serieContainer = document.getElementById('serie-showcase');

        try {
            const { data: publishers } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
            const { data: series } = await window.supabaseClient.from('serie').select('*').order('nome');

            if (pubContainer && publishers) {
                pubContainer.innerHTML = publishers.map(p => components.publisherPill(p)).join('');
            }
            
            if (serieContainer && series) {
                serieContainer.innerHTML = series.map(s => components.serieShowcaseItem(s)).join('');
                serieContainer.querySelectorAll('[data-serie-id]').forEach(el => {
                    el.onclick = () => {
                        store.state.selectedSerie = { id: el.dataset.serieId };
                        this.refreshGrid();
                    };
                });
            }
        } catch (e) { console.error("Showcase error:", e); }
    },

    // Rendering griglia principale
    async refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;
        container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 italic">Caricamento albi...</div>`;

        try {
            if (store.state.selectedSerie?.id) {
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
            }

            const filtered = store.state.issues.filter(i => {
                const mF = store.state.filter === 'all' || i.possesso === store.state.filter;
                // Fix per campi NULL
                const nome = (i.nome || "").toLowerCase();
                const num = (i.numero || "").toString();
                const query = (store.state.searchQuery || "").toLowerCase();
                return mF && (nome.includes(query) || num.includes(query));
            });

            container.innerHTML = filtered.length ? filtered.map(i => components.issueCard(i)).join('') : `<div class="col-span-full text-center py-10 text-slate-500">Nessun albo trovato.</div>`;
            this.attachCardEvents();
        } catch (e) { 
            console.error("Render Grid Error:", e);
            container.innerHTML = `<div class="text-red-500 text-center py-10">Errore: ${e.message}</div>`; 
        }
    },

    // Modale Storie e Personaggi
    async openIssueModal(id) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        const issue = store.state.issues.find(i => i.id === id);
        if (!issue) return;

        modal.classList.replace('hidden', 'flex');
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src="${issue.immagine_url || store.config.placeholders.cover}" class="w-full rounded-xl shadow-2xl border border-slate-700">
                    <div class="grid grid-cols-2 gap-4 mt-4 text-center">
                        <div class="bg-slate-800/50 p-2 rounded border border-slate-700"><span class="block text-[8px] text-slate-500 uppercase">Condizione</span><span class="text-xs text-white">${issue.condizione || 'N/D'}</span></div>
                        <div class="bg-slate-800/50 p-2 rounded border border-slate-700"><span class="block text-[8px] text-slate-500 uppercase">Valore</span><span class="text-xs text-green-400 font-bold">${issue.valore || '0'} €</span></div>
                    </div>
                </div>
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <img src="${issue.editore?.codice_editore?.immagine_url || ''}" class="h-6 w-auto brightness-200">
                        <span class="text-slate-500 text-[10px] uppercase tracking-tighter">${issue.testata?.nome || ''}</span>
                    </div>
                    <h2 class="text-2xl font-black text-white leading-tight">${issue.nome || 'Senza Titolo'}</h2>
                    <p class="text-yellow-500 font-mono mb-6">#${issue.numero} — ${issue.annata?.nome || ''}</p>
                    <div class="space-y-2">
                        <h3 class="text-[9px] uppercase font-bold text-slate-500 border-b border-slate-800 pb-1">Sommario Albo</h3>
                        <div class="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            ${(issue.storia_in_issue || []).sort((a,b)=>a.posizione-b.posizione).map(si => components.storyItem(si)).join('') || '<p class="text-slate-600 text-xs italic">Nessun dettaglio storie presente.</p>'}
                        </div>
                    </div>
                </div>
            </div>`;
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => c.onclick = () => this.openIssueModal(c.dataset.id));
    }
};
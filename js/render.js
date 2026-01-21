/**
 * VERSION: 8.3.3
 */
import { api } from './api.js';
import { store } from './store.js';
import { components } from './components.js';

export const render = {
    async refreshShowcases() {
        const pubContainer = document.getElementById('publisher-showcase');
        const serieContainer = document.getElementById('serie-showcase');

        try {
            const { data: publishers } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
            if (pubContainer && publishers) {
                const pillsHtml = publishers.map(p => components.publisherPill(p)).join('');
                // Inseriamo il tasto reset e le pillole
                pubContainer.innerHTML = `
                    <div class="flex-none border ${!store.state.selectedBrand ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-slate-800 bg-slate-900/40 text-slate-500'} rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 cursor-pointer text-[10px] font-black uppercase tracking-tighter" id="reset-brand-filter">Tutti</div>
                    ${pillsHtml}
                `;

                document.getElementById('reset-brand-filter').onclick = async () => {
                    store.state.selectedBrand = null;
                    store.state.selectedSerie = null;
                    await this.refreshShowcases();
                    await this.refreshGrid();
                };

                pubContainer.querySelectorAll('[data-brand-id]').forEach(el => {
                    el.onclick = async () => {
                        store.state.selectedBrand = el.dataset.brandId;
                        store.state.selectedSerie = null;
                        await this.refreshShowcases();
                        await this.refreshGrid();
                    };
                });
            }

            let query = window.supabaseClient.from('serie').select(`id, nome, immagine_url, issue!inner ( editore!inner ( codice_editore_id ) )`);
            if (store.state.selectedBrand) query = query.eq('issue.editore.codice_editore_id', store.state.selectedBrand);

            const { data: series } = await query.order('nome');
            if (serieContainer && series) {
                const uniqueSeries = Array.from(new Set(series.map(s => s.id))).map(id => series.find(s => s.id === id));
                serieContainer.innerHTML = uniqueSeries.map(s => components.serieShowcaseItem(s)).join('');
                serieContainer.querySelectorAll('[data-serie-id]').forEach(el => {
                    el.onclick = () => { store.state.selectedSerie = { id: el.dataset.serieId }; this.refreshGrid(); };
                });
            }
        } catch (e) { console.error("Showcase error:", e); }
    },

    async refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;
        container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 italic">Seleziona una serie...</div>`;

        try {
            if (store.state.selectedSerie?.id) {
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
            } else {
                return; // Non caricare nulla se non c'è una serie
            }

            const filtered = store.state.issues.filter(i => {
                const mF = store.state.filter === 'all' || i.possesso === store.state.filter;
                const searchQuery = (store.state.searchQuery || "").toLowerCase();
                const mS = (i.nome || "").toLowerCase().includes(searchQuery) || (i.numero || "").toString().includes(searchQuery);
                return mF && mS;
            });

            container.innerHTML = filtered.length ? filtered.map(i => components.issueCard(i)).join('') : `<div class="col-span-full text-center py-10 text-slate-500">Nessun albo trovato.</div>`;
            this.attachCardEvents();
        } catch (e) { container.innerHTML = `<div class="text-red-500 text-center py-10">Errore: ${e.message}</div>`; }
    },

    async openIssueModal(id) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        const issue = store.state.issues.find(i => i.id == id);
        
        if (!issue) return;

        content.innerHTML = components.renderModalContent(issue);
        modal.classList.replace('hidden', 'flex');
        
        // Gestione chiusura modale (se non già gestita in main.js)
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.replace('flex', 'hidden');
        }
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => {
            c.onclick = () => this.openIssueModal(c.dataset.id);
        });
    }
};
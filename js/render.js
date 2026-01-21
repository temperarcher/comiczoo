/**
 * VERSION: 8.3.5
 * SCOPO: Gestione Render e Eventi - FIX MODAL CALL
 */
import { api } from './api.js';
import { store } from './store.js';
import { components } from './components.js';

export const render = {
    async refreshShowcases() {
        const pubContainer = document.getElementById('publisher-showcase');
        const serieContainer = document.getElementById('serie-showcase');
        if (!pubContainer || !serieContainer) return;

        try {
            const { data: publishers } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
            if (publishers) {
                const isActiveReset = !store.state.selectedBrand;
                const resetHtml = `<div class="flex-none border ${isActiveReset ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-slate-800 bg-slate-900/40 text-slate-500'} rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all duration-300 cursor-pointer text-[10px] font-black uppercase tracking-tighter" id="reset-brand-filter">Tutti</div>`;
                
                pubContainer.innerHTML = resetHtml + publishers.map(p => components.publisherPill(p)).join('');

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
            if (series) {
                const uniqueSeries = Array.from(new Set(series.map(s => s.id))).map(id => series.find(s => s.id === id));
                serieContainer.innerHTML = uniqueSeries.map(s => components.serieShowcaseItem(s)).join('');
                serieContainer.querySelectorAll('[data-serie-id]').forEach(el => {
                    el.onclick = () => {
                        store.state.selectedSerie = { id: el.dataset.serieId };
                        this.refreshGrid();
                    };
                });
            }
        } catch (e) { console.error("Showcase error:", e); }
    },

    async refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;
        if (!store.state.selectedSerie) {
            container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 italic">Seleziona una serie per visualizzare gli albi.</div>`;
            return;
        }

        try {
            store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
            const filtered = store.state.issues.filter(i => {
                const mF = store.state.filter === 'all' || i.possesso === store.state.filter;
                const sQ = (store.state.searchQuery || "").toLowerCase();
                return mF && ((i.nome || "").toLowerCase().includes(sQ) || (i.numero || "").toString().includes(sQ));
            });

            container.innerHTML = filtered.length ? filtered.map(i => components.issueCard(i)).join('') : `<div class="col-span-full text-center py-10 text-slate-500">Nessun albo trovato.</div>`;
            this.attachCardEvents();
        } catch (e) { console.error("Grid error:", e); }
    },

    async openIssueModal(id) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        const issue = store.state.issues.find(i => i.id == id);
        
        if (!issue) return;

        // Controllo di sicurezza prima della chiamata
        if (typeof components.renderModalContent === 'function') {
            content.innerHTML = components.renderModalContent(issue);
            modal.classList.replace('hidden', 'flex');
        } else {
            console.error("ERRORE: components.renderModalContent non è definita!");
        }
        
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) closeBtn.onclick = () => modal.classList.replace('flex', 'hidden');
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => {
            c.onclick = (e) => {
                e.preventDefault();
                this.openIssueModal(c.dataset.id);
            };
        });
    }
};
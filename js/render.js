/**
 * VERSION: 8.3.2
 */
import { api } from './api.js';
import { store } from './store.js';
import { components } from './components.js';
import { UI } from './ui.js';

export const render = {
    async refreshShowcases() {
        const pubContainer = document.getElementById('publisher-showcase');
        const serieContainer = document.getElementById('serie-showcase');

        try {
            // 1. Showcase Editori
            const { data: publishers } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
            if (pubContainer && publishers) {
                const allBtnHtml = UI.ALL_PUBLISHERS_BUTTON(!store.state.selectedBrand);
                const pillsHtml = publishers.map(p => components.publisherPill(p)).join('');
                
                pubContainer.innerHTML = allBtnHtml + pillsHtml;

                // Evento Reset (Tutti)
                const resetBtn = document.getElementById('reset-brand-filter');
                if (resetBtn) {
                    resetBtn.onclick = async () => {
                        store.state.selectedBrand = null;
                        store.state.selectedSerie = null; // Reset anche serie se cambio editore
                        await this.refreshShowcases();
                        await this.refreshGrid();
                    };
                }

                // Eventi Pillole Brand
                pubContainer.querySelectorAll('[data-brand-id]').forEach(el => {
                    el.onclick = async () => {
                        const brandId = el.dataset.brandId;
                        store.state.selectedBrand = (store.state.selectedBrand == brandId) ? null : brandId;
                        store.state.selectedSerie = null;
                        await this.refreshShowcases();
                    };
                });
            }

            // 2. Showcase Serie
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
        container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 italic">Caricamento albi...</div>`;

        try {
            if (store.state.selectedSerie?.id) {
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
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
        const issue = store.state.issues.find(i => i.id === id);
        if (!issue) return;
        modal.classList.replace('hidden', 'flex');
        content.innerHTML = components.renderModalContent(issue);
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => c.onclick = () => this.openIssueModal(c.dataset.id));
    }
};
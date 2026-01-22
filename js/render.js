/**
 * VERSION: 8.4.5
 * SCOPO: Gestione Render con Showcase Serie v7.5 (h-16 + object-contain)
 */
import { api } from './api.js';
import { store } from './store.js';
import { components } from './components.js';
import { UI } from './ui.js';

export const render = {
    initLayout() {
        document.getElementById('ui-header').innerHTML = UI.HEADER();
        document.getElementById('ui-main-content').innerHTML = UI.MAIN_GRID_CONTAINER();
        document.getElementById('ui-modal-layer').innerHTML = UI.MODAL_WRAPPER();
        this.attachHeaderEvents();
    },

    async refreshShowcases() {
        const pubSlot = document.getElementById('ui-publisher-bar');
        const serieSlot = document.getElementById('ui-serie-section');

        try {
            // 1. Editori
            const { data: publishers } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
            if (publishers && pubSlot) {
                const pills = publishers.map(p => components.publisherPill(p)).join('');
                const allBtn = UI.ALL_PUBLISHERS_BUTTON(!store.state.selectedBrand);
                pubSlot.innerHTML = UI.PUBLISHER_SECTION(allBtn + pills);
                this.attachPublisherEvents();
            }

            // 2. Serie (v7.5)
            let query = window.supabaseClient.from('serie').select(`id, nome, immagine_url, issue!inner ( editore!inner ( codice_editore_id ) )`);
            if (store.state.selectedBrand) query = query.eq('issue.editore.codice_editore_id', store.state.selectedBrand);

            const { data: series } = await query.order('nome');
            if (series && serieSlot) {
                const uniqueSeries = Array.from(new Set(series.map(s => s.id))).map(id => series.find(s => s.id === id));
                const items = uniqueSeries.map(s => components.serieShowcaseItem(s)).join('');
                serieSlot.innerHTML = UI.SERIE_SECTION(items);
                this.attachSerieEvents();
            }
        } catch (e) { console.error("Showcase error:", e); }
    },

    attachHeaderEvents() {
        const logo = document.getElementById('logo-reset');
        if (logo) logo.onclick = () => location.reload();

        const searchInput = document.getElementById('serie-search');
        if (searchInput) {
            searchInput.oninput = (e) => {
                store.state.searchQuery = e.target.value;
                this.refreshGrid();
            };
        }

        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('[data-filter]').forEach(b => {
                    b.classList.remove('active', 'bg-yellow-500', 'text-black');
                    b.classList.add('bg-slate-800');
                });
                btn.classList.add('active', 'bg-yellow-500', 'text-black');
                btn.classList.remove('bg-slate-800');
                store.state.filter = btn.dataset.filter;
                this.refreshGrid();
            };
        });
    },

    attachPublisherEvents() {
        const resetBtn = document.getElementById('reset-brand-filter');
        if (resetBtn) resetBtn.onclick = async () => {
            store.state.selectedBrand = null;
            store.state.selectedSerie = null;
            await this.refreshShowcases();
            await this.refreshGrid();
        };

        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => {
                const bId = el.dataset.brandId;
                store.state.selectedBrand = (store.state.selectedBrand == bId) ? null : bId;
                store.state.selectedSerie = null;
                await this.refreshShowcases();
                await this.refreshGrid();
            };
        });
    },

    attachSerieEvents() {
        // Selezione Serie
        document.querySelectorAll('[data-serie-id]').forEach(el => {
            el.onclick = (e) => {
                // Se clicco l'edit non seleziono la serie
                if (e.target.closest('.btn-edit-serie')) return;
                store.state.selectedSerie = { id: el.dataset.serieId };
                this.refreshGrid();
            };
        });

        // Tasto Edit Serie (✏️)
        document.querySelectorAll('.btn-edit-serie').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                alert("Edit Serie ID: " + btn.dataset.editId);
            };
        });
    },

    async refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;
        if (!store.state.selectedSerie) {
            container.innerHTML = `<div class="col-span-full text-center py-20 text-slate-600 italic uppercase text-[10px] tracking-widest">Seleziona una serie per visualizzare gli albi</div>`;
            return;
        }

        try {
            store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
            const filtered = store.state.issues.filter(i => {
                const mF = store.state.filter === 'all' || i.possesso === store.state.filter;
                const sQ = (store.state.searchQuery || "").toLowerCase();
                return mF && ((i.nome || "").toLowerCase().includes(sQ) || (i.numero || "").toString().includes(sQ));
            });

            container.innerHTML = filtered.length ? filtered.map(i => components.issueCard(i)).join('') : `<div class="col-span-full text-center py-10 text-slate-500 uppercase text-[10px]">Nessun albo trovato.</div>`;
            this.attachCardEvents();
        } catch (e) { console.error("Grid error:", e); }
    },

    async openIssueModal(id) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        const issue = store.state.issues.find(i => i.id == id);
        if (!issue) return;
        content.innerHTML = components.renderModalContent(issue);
        modal.classList.replace('hidden', 'flex');
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) closeBtn.onclick = () => modal.classList.replace('flex', 'hidden');
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => c.onclick = () => this.openIssueModal(c.dataset.id));
    }
};
/**
 * VERSION: 8.4.7
 * FIX: Ripristino logica filtri Celo/Manca e caricamento albi per serie.
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
            // 1. Showcase Editori
            const { data: publishers } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
            if (publishers && pubSlot) {
                const pills = publishers.map(p => components.publisherPill(p)).join('');
                const allBtn = UI.ALL_PUBLISHERS_BUTTON(!store.state.selectedBrand);
                pubSlot.innerHTML = UI.PUBLISHER_SECTION(allBtn + pills);
                this.attachPublisherEvents();
            }

            // 2. Showcase Serie
            let query = window.supabaseClient.from('serie').select(`id, nome, immagine_url, issue!inner ( editore!inner ( codice_editore_id ) )`);
            if (store.state.selectedBrand) {
                query = query.eq('issue.editore.codice_editore_id', store.state.selectedBrand);
            }

            const { data: series } = await query.order('nome');
            if (series && serieSlot) {
                // Rimuovo duplicati derivanti dalla join con issue
                const uniqueSeries = Array.from(new Set(series.map(s => s.id))).map(id => series.find(s => s.id === id));
                const items = uniqueSeries.map(s => components.serieShowcaseItem(s)).join('');
                serieSlot.innerHTML = UI.SERIE_SECTION(items);
                this.attachSerieEvents();
            }
        } catch (e) { console.error("Errore Showcase:", e); }
    },

    attachHeaderEvents() {
        const logo = document.getElementById('logo-reset');
        if (logo) logo.onclick = () => location.reload();

        // Cerca Serie (Filtro testuale sulla griglia)
        const searchInput = document.getElementById('serie-search');
        if (searchInput) {
            searchInput.oninput = (e) => {
                store.state.searchQuery = e.target.value;
                this.refreshGrid(); // Riesegue il filtro sui dati in memoria
            };
        }

        // Gestione Filtri Celo/Manca/Tutti
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                // UI Update
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active', 'bg-yellow-500', 'text-black');
                    b.classList.add('text-slate-400'); // Stato inattivo
                });
                btn.classList.add('active', 'bg-yellow-500', 'text-black');
                btn.classList.remove('text-slate-400');

                // State Update & Render
                store.state.filter = btn.dataset.filter;
                this.refreshGrid();
            };
        });

        const addBtn = document.getElementById('btn-add-albo');
        if (addBtn) addBtn.onclick = () => this.openFormModal();
    },

    attachPublisherEvents() {
        const resetBtn = document.getElementById('reset-brand-filter');
        if (resetBtn) resetBtn.onclick = async () => {
            store.state.selectedBrand = null;
            store.state.selectedSerie = null; // Reset serie quando cambio editore
            await this.refreshShowcases();
            await this.refreshGrid();
        };

        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => {
                const bId = el.dataset.brandId;
                store.state.selectedBrand = (store.state.selectedBrand == bId) ? null : bId;
                store.state.selectedSerie = null; // Reset serie quando cambio editore
                await this.refreshShowcases();
                await this.refreshGrid();
            };
        });
    },

    attachSerieEvents() {
        document.querySelectorAll('[data-serie-id]').forEach(el => {
            el.onclick = async (e) => {
                if (e.target.closest('.btn-edit-serie')) return;
                
                // Evidenzia visivamente la serie selezionata (opzionale, ma utile)
                document.querySelectorAll('.serie-showcase-item').forEach(s => s.classList.remove('ring-2', 'ring-yellow-500'));
                el.classList.add('ring-2', 'ring-yellow-500');

                store.state.selectedSerie = { id: el.dataset.serieId };
                await this.refreshGrid(); // Carica gli albi della serie
            };
        });
    },

    async refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;

        // Se nessuna serie è selezionata, mostra messaggio placeholder
        if (!store.state.selectedSerie) {
            container.innerHTML = `<div class="col-span-full text-center py-20 text-slate-600 italic uppercase text-[10px] tracking-widest">Seleziona una serie per visualizzare gli albi</div>`;
            return;
        }

        try {
            // Fetch dati se non presenti o se la serie è cambiata
            // Nota: per semplicità ricarichiamo sempre al click della serie
            store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);

            // Logica di Filtraggio (Filtro + Search)
            const filtered = store.state.issues.filter(i => {
                const matchesFilter = store.state.filter === 'all' || i.possesso === store.state.filter;
                const matchesSearch = i.nome.toLowerCase().includes((store.state.searchQuery || "").toLowerCase()) || 
                                      i.numero.toString().includes(store.state.searchQuery || "");
                return matchesFilter && matchesSearch;
            });

            if (filtered.length === 0) {
                container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 uppercase text-[10px]">Nessun albo trovato con questi filtri.</div>`;
            } else {
                container.innerHTML = filtered.map(i => components.issueCard(i)).join('');
                this.attachCardEvents();
            }
        } catch (e) { 
            console.error("Errore caricamento griglia:", e);
            container.innerHTML = `<div class="col-span-full text-center text-red-500">Errore nel caricamento degli albi.</div>`;
        }
    },

    // ... (restanti metodi openIssueModal, openFormModal, attachCardEvents rimangono invariati)
    async openIssueModal(id) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        const issue = store.state.issues.find(i => i.id == id);
        if (!issue) return;
        content.innerHTML = components.renderModalContent(issue);
        modal.classList.replace('hidden', 'flex');
        const editBtn = document.getElementById('edit-this-issue');
        if (editBtn) editBtn.onclick = () => this.openFormModal(issue);
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) closeBtn.onclick = () => modal.classList.replace('flex', 'hidden');
    },

    openFormModal(issue = null) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        content.innerHTML = UI.ISSUE_FORM(issue || {});
        modal.classList.replace('hidden', 'flex');
        const cancelBtn = document.getElementById('cancel-form');
        if (cancelBtn) cancelBtn.onclick = () => modal.classList.replace('flex', 'hidden');
        const form = document.getElementById('form-albo');
        form.onsubmit = async (e) => {
            e.preventDefault();
            alert("Salvataggio... implementare api.saveIssue");
            modal.classList.replace('flex', 'hidden');
            await this.refreshGrid();
        };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => {
            c.onclick = () => this.openIssueModal(c.dataset.id);
        });
    }
};
/**
 * VERSION: 8.4.8
 * FIX: Logica di filtraggio blindata e caricamento forzato griglia.
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
            const { data: publishers } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
            if (publishers && pubSlot) {
                const pills = publishers.map(p => components.publisherPill(p)).join('');
                const allBtn = UI.ALL_PUBLISHERS_BUTTON(!store.state.selectedBrand);
                pubSlot.innerHTML = UI.PUBLISHER_SECTION(allBtn + pills);
                this.attachPublisherEvents();
            }

            let query = window.supabaseClient.from('serie').select(`id, nome, immagine_url, issue!inner ( editore!inner ( codice_editore_id ) )`);
            if (store.state.selectedBrand) query = query.eq('issue.editore.codice_editore_id', store.state.selectedBrand);

            const { data: series } = await query.order('nome');
            if (series && serieSlot) {
                const uniqueSeries = Array.from(new Set(series.map(s => s.id))).map(id => series.find(s => s.id === id));
                const items = uniqueSeries.map(s => components.serieShowcaseItem(s)).join('');
                serieSlot.innerHTML = UI.SERIE_SECTION(items);
                this.attachSerieEvents();
            }
        } catch (e) { console.error("Errore Showcase:", e); }
    },

    attachHeaderEvents() {
        const searchInput = document.getElementById('serie-search');
        if (searchInput) {
            searchInput.oninput = (e) => {
                store.state.searchQuery = e.target.value;
                this.refreshGrid(); // Riesegue il filtro sui dati
            };
        }

        // Selezione filtri Celo/Manca
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'bg-yellow-500', 'text-black'));
                btn.classList.add('active', 'bg-yellow-500', 'text-black');
                store.state.filter = btn.dataset.filter;
                console.log("Filtro impostato a:", store.state.filter);
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
            store.state.selectedSerie = null;
            await this.refreshShowcases();
            await this.refreshGrid();
        };

        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => {
                store.state.selectedBrand = el.dataset.brandId;
                store.state.selectedSerie = null;
                await this.refreshShowcases();
                await this.refreshGrid();
            };
        });
    },

    attachSerieEvents() {
        document.querySelectorAll('[data-serie-id]').forEach(el => {
            el.onclick = async (e) => {
                if (e.target.closest('.btn-edit-serie')) return;
                
                // Feedback visivo selezione
                document.querySelectorAll('.serie-showcase-item').forEach(i => i.classList.remove('ring-2', 'ring-yellow-500'));
                el.classList.add('ring-2', 'ring-yellow-500');

                store.state.selectedSerie = { id: el.dataset.serieId };
                console.log("Serie selezionata:", store.state.selectedSerie.id);
                
                // Carico i dati e forzo il render
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
                this.refreshGrid();
            };
        });
    },

    refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;

        if (!store.state.selectedSerie) {
            container.innerHTML = `<div class="col-span-full text-center py-20 text-slate-600 italic uppercase text-[10px] tracking-widest">Seleziona una serie per visualizzare gli albi</div>`;
            return;
        }

        // 1. Prendo i dati correnti dallo store
        const allIssues = store.state.issues || [];
        
        // 2. Applico i filtri in cascata
        const filtered = allIssues.filter(issue => {
            // Filtro Celo/Manca
            const matchStatus = store.state.filter === 'all' || issue.possesso === store.state.filter;
            
            // Filtro Ricerca (Nome o Numero)
            const searchStr = (store.state.searchQuery || "").toLowerCase();
            const matchSearch = issue.nome.toLowerCase().includes(searchStr) || 
                                issue.numero.toString().includes(searchStr);
            
            return matchStatus && matchSearch;
        });

        console.log(`Grid Refresh: ${filtered.length} albi trovati su ${allIssues.length}`);

        // 3. Render
        if (filtered.length === 0) {
            container.innerHTML = `<div class="col-span-full text-center py-10 text-slate-500 uppercase text-[10px]">Nessun albo trovato.</div>`;
        } else {
            container.innerHTML = filtered.map(i => components.issueCard(i)).join('');
            this.attachCardEvents();
        }
    },

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
        
        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        
        const form = document.getElementById('form-albo');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log("Dati inviati:", data);
            alert("Salvataggio simulato!");
            modal.classList.replace('flex', 'hidden');
        };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => {
            c.onclick = () => this.openIssueModal(c.dataset.id);
        });
    }
};
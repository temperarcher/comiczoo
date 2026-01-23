/**
 * VERSION: 8.5.8 (Integrale - Fetch dati grezzi per popolamento Edit)
 * NOTA: Recupera l'issue dal DB tramite ID per avere gli ID numerici delle FK.
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

    // ... (Metodi refreshShowcases, attachHeaderEvents, ecc. invariati ...)
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
        } catch (e) { console.error(e); }
    },

    attachHeaderEvents() {
        const logo = document.getElementById('logo-reset');
        if (logo) logo.onclick = () => location.reload();
        const searchInput = document.getElementById('serie-search');
        if (searchInput) searchInput.oninput = (e) => { store.state.searchQuery = e.target.value; this.refreshGrid(); };
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.replace('bg-yellow-500', 'text-slate-400'));
                btn.classList.replace('text-slate-400', 'bg-yellow-500');
                store.state.filter = btn.dataset.filter;
                this.refreshGrid();
            };
        });
        document.getElementById('btn-add-albo').onclick = () => this.openFormModal();
    },

    attachPublisherEvents() {
        const resetBtn = document.getElementById('reset-brand-filter');
        if (resetBtn) resetBtn.onclick = async () => { store.state.selectedBrand = null; await this.refreshShowcases(); this.refreshGrid(); };
        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => { store.state.selectedBrand = el.dataset.brandId; await this.refreshShowcases(); this.refreshGrid(); };
        });
    },

    attachSerieEvents() {
        document.querySelectorAll('[data-serie-id]').forEach(el => {
            el.onclick = async (e) => {
                if (e.target.closest('.btn-edit-serie')) return;
                store.state.selectedSerie = { id: el.dataset.serieId };
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
                this.refreshGrid();
            };
        });
    },

    refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container || !store.state.selectedSerie) return;
        const filtered = (store.state.issues || []).filter(i => (store.state.filter === 'all' || i.possesso === store.state.filter));
        container.innerHTML = filtered.map(i => components.issueCard(i)).join('');
        this.attachCardEvents();
    },

    async openIssueModal(id) {
        const modal = document.getElementById('issue-modal');
        const issue = store.state.issues.find(i => i.id == id);
        if (!issue) return;
        document.getElementById('modal-body').innerHTML = components.renderModalContent(issue);
        modal.classList.replace('hidden', 'flex');
        document.getElementById('edit-this-issue').onclick = () => this.openFormModal(issue);
        document.getElementById('close-modal').onclick = () => modal.classList.replace('flex', 'hidden');
    },

    // --- SEZIONE MODALE EDIT/NUOVO (CORRETTA) ---
    async openFormModal(issueData = null) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        
        // 1. Carichiamo i dropdown e, se siamo in Edit, il record VERO dal DB
        const promises = [
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome')
        ];

        // Se abbiamo issueData, carichiamo il record grezzo per avere gli ID (FK)
        if (issueData && issueData.id) {
            promises.push(window.supabaseClient.from('issue').select('*, editore(*)').eq('id', issueData.id).single());
        }

        const results = await Promise.all(promises);
        const dropdowns = {
            codici: results[0].data, editori: results[1].data,
            serie: results[2].data, tipi: results[3].data, testate: results[4].data
        };
        
        // Il record reale con gli ID numerici (editore_id, ecc.)
        const issue = (issueData && results[5]) ? results[5].data : (issueData || {});

        // 2. Rendering del form
        content.innerHTML = UI.ISSUE_FORM(issue, dropdowns);
        modal.classList.replace('hidden', 'flex');

        const selectCodice = document.getElementById('select-codice-editore');
        const selectEditore = document.getElementById('select-editore-name');
        const previewEditoreImg = document.querySelector('#preview-editore img');

        // 3. Logica di Sincronizzazione
        const syncEditori = (codiceId, targetEditoreId = null) => {
            Array.from(selectEditore.options).forEach(opt => {
                const parent = opt.dataset.parent;
                if (!parent) return;
                const isMatch = (parent == codiceId);
                opt.hidden = !isMatch;
                opt.disabled = !isMatch;
            });
            
            if (targetEditoreId) {
                selectEditore.value = targetEditoreId;
            } else {
                selectEditore.value = "";
            }
            selectEditore.dispatchEvent(new Event('change'));
        };

        selectCodice.onchange = () => syncEditori(selectCodice.value);
        selectEditore.onchange = () => {
            const opt = selectEditore.options[selectEditore.selectedIndex];
            const img = opt?.dataset.img;
            if (img) {
                previewEditoreImg.src = img;
                previewEditoreImg.classList.remove('hidden');
            } else {
                previewEditoreImg.classList.add('hidden');
            }
        };

        // 4. POPOLAMENTO IMMEDIATO (CASO EDIT)
        if (issue.id) {
            // Recuperiamo l'ID del codice editore dalla tabella editore collegata
            const cId = issue.editore?.codice_editore_id || issue.codice_editore_id;
            const eId = issue.editore_id;

            if (cId) {
                selectCodice.value = cId;
                syncEditori(cId, eId);
            }
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = (e) => { e.preventDefault(); console.log("Salvataggio..."); };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
/**
 * VERSION: 8.5.7 (Integrale - Fix Lookup ID per popolamento Edit)
 * NOTA: Risolve il problema dei campi vuoti in Edit cercando gli ID dai nomi se necessario.
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

    // --- SEZIONE SHOWCASE (v7.5) ---
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
        } catch (e) { console.error("Errore Showcases:", e); }
    },

    // --- SEZIONE EVENTI HEADER ---
    attachHeaderEvents() {
        const logo = document.getElementById('logo-reset');
        if (logo) logo.onclick = () => location.reload();
        const searchInput = document.getElementById('serie-search');
        if (searchInput) searchInput.oninput = (e) => { store.state.searchQuery = e.target.value; this.refreshGrid(); };
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active', 'bg-yellow-500', 'text-black');
                    b.classList.add('text-slate-400');
                });
                btn.classList.add('active', 'bg-yellow-500', 'text-black');
                btn.classList.remove('text-slate-400');
                store.state.filter = btn.dataset.filter;
                this.refreshGrid();
            };
        });
        const addBtn = document.getElementById('btn-add-albo');
        if (addBtn) addBtn.onclick = () => this.openFormModal();
    },

    // --- SEZIONE EVENTI PUBLISHER ---
    attachPublisherEvents() {
        const resetBtn = document.getElementById('reset-brand-filter');
        if (resetBtn) resetBtn.onclick = async () => {
            store.state.selectedBrand = null; store.state.selectedSerie = null;
            await this.refreshShowcases(); await this.refreshGrid();
        };
        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => {
                store.state.selectedBrand = el.dataset.brandId; store.state.selectedSerie = null;
                await this.refreshShowcases(); await this.refreshGrid();
            };
        });
    },

    // --- SEZIONE EVENTI SERIE ---
    attachSerieEvents() {
        document.querySelectorAll('[data-serie-id]').forEach(el => {
            el.onclick = async (e) => {
                if (e.target.closest('.btn-edit-serie')) return;
                document.querySelectorAll('.serie-showcase-item').forEach(i => i.classList.remove('ring-2', 'ring-yellow-500'));
                el.classList.add('ring-2', 'ring-yellow-500');
                store.state.selectedSerie = { id: el.dataset.serieId };
                store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
                this.refreshGrid();
            };
        });
    },

    // --- SEZIONE RENDER GRIGLIA ---
    refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container) return;
        if (!store.state.selectedSerie) {
            container.innerHTML = `<div class="col-span-full text-center py-20 text-slate-600 italic uppercase text-[10px] tracking-widest">Seleziona una serie per visualizzare gli albi</div>`;
            return;
        }
        const filtered = (store.state.issues || []).filter(issue => {
            const matchStatus = store.state.filter === 'all' || issue.possesso === store.state.filter;
            const matchSearch = (issue.nome || "").toLowerCase().includes((store.state.searchQuery || "").toLowerCase()) || 
                               (issue.numero || "").toString().toLowerCase().includes((store.state.searchQuery || "").toLowerCase());
            return matchStatus && matchSearch;
        });
        container.innerHTML = filtered.length === 0 ? `<div class="col-span-full text-center py-10 text-slate-500 uppercase text-[10px]">Nessun albo trovato.</div>` : filtered.map(i => components.issueCard(i)).join('');
        this.attachCardEvents();
    },

    // --- SEZIONE MODALE VISUALIZZAZIONE ---
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

    // --- SEZIONE MODALE EDIT/NUOVO ---
    async openFormModal(issue = null) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');

        // 1. Caricamento massivo dei dati per i dropdown
        const [resCodici, resEditori, resSerie, resTipi, resTestate] = await Promise.all([
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome')
        ]);

        const dropdowns = {
            codici: resCodici.data || [], 
            editori: resEditori.data || [],
            serie: resSerie.data || [], 
            tipi: resTipi.data || [], 
            testate: resTestate.data || []
        };

        // 2. Rendering del form
        content.innerHTML = UI.ISSUE_FORM(issue || {}, dropdowns);
        modal.classList.replace('hidden', 'flex');

        const selectCodice = document.getElementById('select-codice-editore');
        const selectEditore = document.getElementById('select-editore-name');
        const previewEditoreImg = document.querySelector('#preview-editore img');

        // 3. Funzione di filtraggio e selezione
        const syncEditori = (codiceId, targetEditoreId = null) => {
            let firstMatchId = null;
            Array.from(selectEditore.options).forEach(opt => {
                if (!opt.dataset.parent) return; 
                if (opt.dataset.parent == codiceId) {
                    opt.hidden = false;
                    opt.disabled = false;
                    if (!firstMatchId) firstMatchId = opt.value;
                } else {
                    opt.hidden = true;
                    opt.disabled = true;
                }
            });
            // Seleziona l'ID fornito, altrimenti il primo disponibile, altrimenti vuoto
            selectEditore.value = targetEditoreId || firstMatchId || "";
            selectEditore.dispatchEvent(new Event('change'));
        };

        // 4. Gestione Eventi
        selectCodice.onchange = () => syncEditori(selectCodice.value);
        selectEditore.onchange = () => {
            const opt = selectEditore.options[selectEditore.selectedIndex];
            const img = opt ? opt.dataset.img : '';
            if (img && img !== 'undefined') {
                previewEditoreImg.src = img;
                previewEditoreImg.classList.remove('hidden');
            } else {
                previewEditoreImg.classList.add('hidden');
            }
        };

        // 5. LOGICA CHIRURGICA PER EDIT
        if (issue && issue.id) {
            console.log("Dati Issue ricevuti:", issue);

            // Trova l'ID Codice Editore se non presente (tramite nome editore o join)
            let cId = issue.codice_editore_id;
            let eId = issue.editore_id;

            // Se mancano gli ID ma abbiamo l'oggetto editore correlato (tipico di Supabase join)
            if (!cId && issue.editore) cId = issue.editore.codice_editore_id;
            if (!eId && issue.editore_id_linked) eId = issue.editore_id_linked;

            // Fallback estremo: cerca l'ID corrispondente al nome testata/editore nei dropdown
            if (!cId) {
                const foundCodice = dropdowns.codici.find(c => c.nome === issue.codice_editore);
                if (foundCodice) cId = foundCodice.id;
            }
            if (!eId) {
                const foundEditore = dropdowns.editori.find(e => e.nome === issue.testata || e.nome === issue.editore);
                if (foundEditore) eId = foundEditore.id;
            }

            // Applica le selezioni
            if (cId) {
                selectCodice.value = cId;
                syncEditori(cId, eId);
            }
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = (e) => { 
            e.preventDefault(); 
            alert("Pronto al salvataggio!"); 
        };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
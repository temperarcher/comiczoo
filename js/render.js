/**
 * VERSION: 8.5.6 (Integrale - Fix Definitivo Edit e Sincronizzazione Immagine)
 * NOTA: Mantenere i commenti di sezione. Risoluzione ID editore forzata.
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

        // Caricamento Dati
        const [resCodici, resEditori, resSerie, resTipi, resTestate] = await Promise.all([
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome')
        ]);

        const dropdowns = {
            codici: resCodici.data || [], editori: resEditori.data || [],
            serie: resSerie.data || [], tipi: resTipi.data || [], testate: resTestate.data || []
        };

        content.innerHTML = UI.ISSUE_FORM(issue || {}, dropdowns);
        modal.classList.replace('hidden', 'flex');

        const selectCodice = document.getElementById('select-codice-editore');
        const selectEditore = document.getElementById('select-editore-name');
        const previewEditoreImg = document.querySelector('#preview-editore img');

        /**
         * FILTRAGGIO DINAMICO EDITORIE
         */
        const filterEditori = (codiceId, preselectEditoreId = null) => {
            let optionsFound = 0;
            Array.from(selectEditore.options).forEach(opt => {
                const parent = opt.dataset.parent;
                if (!parent) return; // Salta il placeholder

                if (parent == codiceId) {
                    opt.hidden = false;
                    opt.disabled = false;
                    optionsFound++;
                } else {
                    opt.hidden = true;
                    opt.disabled = true;
                }
            });

            // Se stiamo editando, forziamo il valore
            if (preselectEditoreId) {
                selectEditore.value = preselectEditoreId;
            } else {
                selectEditore.value = "";
            }
            
            // Forza l'aggiornamento dell'immagine
            selectEditore.dispatchEvent(new Event('change'));
        };

        // EVENTI
        selectCodice.onchange = () => filterEditori(selectCodice.value);
        
        selectEditore.onchange = () => {
            const opt = selectEditore.options[selectEditore.selectedIndex];
            const url = opt ? opt.dataset.img : null;
            if (url && url !== "undefined") {
                previewEditoreImg.src = url;
                previewEditoreImg.classList.remove('hidden');
            } else {
                previewEditoreImg.classList.add('hidden');
            }
        };

        // --- FIX EDIT: POPOLAMENTO DATI ---
        if (issue && issue.id) {
            // Se l'issue non ha gli ID diretti, proviamo a cercarli tramite le relazioni salvate nello store
            // (Assumiamo che issue.codice_editore_id e issue.editore_id siano presenti nell'oggetto issue)
            
            if (issue.codice_editore_id) {
                selectCodice.value = issue.codice_editore_id;
                // Aspettiamo un attimo per assicurarci che il DOM abbia recepito il valore del primo select
                setTimeout(() => {
                    filterEditori(issue.codice_editore_id, issue.editore_id);
                }, 10);
            }
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = (e) => { e.preventDefault(); alert("Salvataggio in arrivo..."); };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
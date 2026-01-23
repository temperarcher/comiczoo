/**
 * VERSION: 8.6.0 (Integrale - Filtro Serie -> Annata & Testata + Popolamento Edit)
 * NOTA: Gestisce la dipendenza gerarchica completa per la coerenza dei dati.
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

    // ... (refreshShowcases, attachHeaderEvents, attachPublisherEvents, attachSerieEvents, refreshGrid, openIssueModal invariati)
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

    // --- SEZIONE MODALE FORM (NUOVO/EDIT) ---
    async openFormModal(issueData = null) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        
        // 1. Fetch Dati Completo
        const promises = [
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome'),
            window.supabaseClient.from('annata').select('*').order('nome')
        ];

        if (issueData && issueData.id) {
            promises.push(window.supabaseClient.from('issue').select('*, editore(*)').eq('id', issueData.id).single());
        }

        const results = await Promise.all(promises);
        const dropdowns = {
            codici: results[0].data, editori: results[1].data, serie: results[2].data,
            tipi: results[3].data, testate: results[4].data, annate: results[5].data
        };
        
        const issue = (issueData && results[6]) ? results[6].data : (issueData || {});

        // 2. Rendering HTML e Iniezione Selettori Dinamici
        content.innerHTML = UI.ISSUE_FORM(issue, dropdowns);
        
        // Preparazione Select Dinamiche (Annata e Testata)
        const annataWrapper = content.querySelector('input[name="annata"]').parentElement;
        const testataWrapper = content.querySelector('select[name="testata_id"]').parentElement;

        annataWrapper.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annata</label>
            <select name="annata_id" id="select-annata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Annata...</option>
                ${dropdowns.annate.map(a => `<option value="${a.id}" data-serie="${a.serie_id}">${a.nome}</option>`).join('')}
            </select>`;

        testataWrapper.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Testata</label>
            <select name="testata_id" id="select-testata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Testata...</option>
                ${dropdowns.testate.map(t => `<option value="${t.id}" data-serie="${t.serie_id}">${t.nome}</option>`).join('')}
            </select>`;

        modal.classList.replace('hidden', 'flex');

        // 3. Selettori DOM
        const selectCodice = document.getElementById('select-codice-editore');
        const selectEditore = document.getElementById('select-editore-name');
        const selectSerie = document.getElementById('select-serie');
        const selectAnnata = document.getElementById('select-annata');
        const selectTestata = document.getElementById('select-testata');
        const previewEditoreImg = document.querySelector('#preview-editore img');

        // 4. Logica Filtraggio Editori
        const syncEditori = (codiceId, targetEditoreId = null) => {
            Array.from(selectEditore.options).forEach(opt => {
                if (!opt.dataset.parent) return;
                const match = (opt.dataset.parent == codiceId);
                opt.hidden = !match; opt.disabled = !match;
            });
            selectEditore.value = targetEditoreId || "";
            selectEditore.dispatchEvent(new Event('change'));
        };

        // 5. Logica Filtraggio Dipendenti da Serie (Annata & Testata)
        const syncSerieDependents = (serieId, targetAnnataId = null, targetTestataId = null) => {
            // Filtro Annate
            Array.from(selectAnnata.options).forEach(opt => {
                if (!opt.dataset.serie) return;
                const match = (opt.dataset.serie == serieId);
                opt.hidden = !match; opt.disabled = !match;
            });
            selectAnnata.value = targetAnnataId || "";

            // Filtro Testate
            Array.from(selectTestata.options).forEach(opt => {
                if (!opt.dataset.serie) return;
                const match = (opt.dataset.serie == serieId);
                opt.hidden = !match; opt.disabled = !match;
            });
            selectTestata.value = targetTestataId || "";
        };

        // 6. Eventi
        selectCodice.onchange = () => syncEditori(selectCodice.value);
        selectEditore.onchange = () => {
            const opt = selectEditore.options[selectEditore.selectedIndex];
            if (opt?.dataset.img) {
                previewEditoreImg.src = opt.dataset.img;
                previewEditoreImg.classList.remove('hidden');
            } else { previewEditoreImg.classList.add('hidden'); }
        };
        selectSerie.onchange = () => syncSerieDependents(selectSerie.value);

        // 7. POPOLAMENTO EDIT (Sincronizzazione finale)
        if (issue.id) {
            // 7a. Editore / Codice
            const cId = issue.editore?.codice_editore_id || issue.codice_editore_id;
            if (cId) {
                selectCodice.value = cId;
                syncEditori(cId, issue.editore_id);
            }
            // 7b. Serie / Annata / Testata
            if (issue.serie_id) {
                selectSerie.value = issue.serie_id;
                syncSerieDependents(issue.serie_id, issue.annata_id, issue.testata_id);
            }
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = (e) => { 
            e.preventDefault(); 
            const formData = new FormData(e.target);
            console.log("Dati pronti per il salvataggio:", Object.fromEntries(formData));
            alert("Salvato correttamente (Simulazione)");
        };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
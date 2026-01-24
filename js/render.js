/**
 * VERSION: 8.8.0 (Integrale - Fix Syntax & Salvataggio DB)
 * NOTA: Rispetta la logica consolidata e implementa l'invio dati a Supabase.
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

    async openFormModal(issue = {}) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');

        const [resC, resE, resS, resA, resT, resSup] = await Promise.all([
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('annata').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome'),
            window.supabaseClient.from('supplemento').select('*').order('nome')
        ]);

        const dropdowns = { codici: resC.data, editori: resE.data, serie: resS.data, annate: resA.data, testate: resT.data, supplementi: resSup.data };
        content.innerHTML = UI.ISSUE_FORM(issue, dropdowns);
        modal.classList.replace('hidden', 'flex');

        const wrapper = document.getElementById('condizione-wrapper');
        if (wrapper) wrapper.innerHTML = `<select name="condizione" id="select-condizione" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500 appearance-none"><option value="">Voto...</option>${[1,2,3,4,5].map(v => `<option value="${v}">${v}</option>`).join('')}</select>`;

        const selectCodice = document.getElementById('select-codice-editore');
        const selectEditore = document.getElementById('select-editore-name');
        const selectSupplemento = document.getElementById('select-supplemento');
        const selectSerie = document.getElementById('select-serie');
        const selectAnnata = document.getElementById('select-annata');
        const selectTestata = document.getElementById('select-testata');
        const selectCondizione = document.getElementById('select-condizione');
        const inputCover = document.getElementById('input-cover-url');
        const previewCover = document.getElementById('preview-cover');
        const placeholderCover = document.getElementById('cover-placeholder');
        const imgLogo = document.getElementById('preview-editore-logo');
        const placeholderLogo = document.getElementById('placeholder-editore-logo');

        const updateCoverPreview = (url) => {
            if (url) { previewCover.src = url; previewCover.classList.remove('hidden'); placeholderCover.classList.add('hidden'); }
            else { previewCover.classList.add('hidden'); placeholderCover.classList.remove('hidden'); }
        };

        const updateEditorePreview = (sel) => {
            const opt = sel.options[sel.selectedIndex];
            const img = opt?.dataset.img;
            if (img && img !== "null") { imgLogo.src = img; imgLogo.classList.remove('hidden'); placeholderLogo.classList.add('hidden'); }
            else { imgLogo.classList.add('hidden'); placeholderLogo.classList.remove('hidden'); }
        };

        inputCover.oninput = (e) => updateCoverPreview(e.target.value);

        const syncEditoriESupplementi = (codiceId, targetEditoreId = null) => {
            Array.from(selectEditore.options).forEach(opt => {
                const match = !opt.value || opt.dataset.parent == codiceId;
                opt.hidden = !match; opt.disabled = !match;
            });
            Array.from(selectSupplemento.options).forEach(opt => {
                const match = !opt.value || opt.dataset.parent == codiceId;
                opt.hidden = !match; opt.disabled = !match;
            });
            if (targetEditoreId) selectEditore.value = targetEditoreId;
            else if (selectEditore.options[selectEditore.selectedIndex].hidden) selectEditore.value = "";
            updateEditorePreview(selectEditore);
        };

        const syncSerieDependents = (serieId, targetAnnataId = null, targetTestataId = null) => {
            const firstAnnata = Array.from(selectAnnata.options).find(opt => opt.dataset.parent == serieId);
            const firstTestata = Array.from(selectTestata.options).find(opt => opt.dataset.parent == serieId);
            selectAnnata.value = targetAnnataId || firstAnnata?.value || "";
            selectTestata.value = targetTestataId || firstTestata?.value || "";
        };

        selectCodice.onchange = () => syncEditoriESupplementi(selectCodice.value);
        selectEditore.onchange = () => updateEditorePreview(selectEditore);
        selectSerie.onchange = () => syncSerieDependents(selectSerie.value);

        if (issue.id) {
            const cId = issue.editore?.codice_editore_id || issue.codice_editore_id;
            if (cId) {
                selectCodice.value = cId;
                syncEditoriESupplementi(cId, issue.editore_id);
            }
            if (issue.serie_id) {
                selectSerie.value = issue.serie_id;
                syncSerieDependents(issue.serie_id, issue.annata_id, issue.testata_id);
            }
            if (issue.supplemento_id) selectSupplemento.value = issue.supplemento_id;
            if (issue.condizione && selectCondizione) selectCondizione.value = issue.condizione.toString();
            updateCoverPreview(issue.immagine_url);
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        
        document.getElementById('form-albo').onsubmit = async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            try {
                btn.disabled = true;
                btn.innerText = "SALVATAGGIO...";
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                await api.saveIssue(data);
                modal.classList.replace('flex', 'hidden');
                if (store.state.selectedSerie) {
                    store.state.issues = await api.getIssuesBySerie(store.state.selectedSerie.id);
                    this.refreshGrid();
                }
            } catch (err) {
                alert("Errore: " + err.message);
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
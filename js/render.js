/**
 * VERSION: 8.6.3 (Integrale - Ripristino Struttura Consolidata + Fix Supplemento & Annata)
 * NOTA: Mantenere i commenti di sezione. Risolto bug this.attachHeaderEvents.
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
        render.attachHeaderEvents();
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
                render.attachPublisherEvents();
            }

            let query = window.supabaseClient.from('serie').select(`id, nome, immagine_url, issue!inner ( editore!inner ( codice_editore_id ) )`);
            if (store.state.selectedBrand) query = query.eq('issue.editore.codice_editore_id', store.state.selectedBrand);

            const { data: series } = await query.order('nome');
            if (series && serieSlot) {
                const uniqueSeries = Array.from(new Set(series.map(s => s.id))).map(id => series.find(s => s.id === id));
                const items = uniqueSeries.map(s => components.serieShowcaseItem(s)).join('');
                serieSlot.innerHTML = UI.SERIE_SECTION(items);
                render.attachSerieEvents();
            }
        } catch (e) { console.error("Errore Showcases:", e); }
    },

    // --- SEZIONE EVENTI HEADER ---
    attachHeaderEvents() {
        const logo = document.getElementById('logo-reset');
        if (logo) logo.onclick = () => location.reload();
        const searchInput = document.getElementById('serie-search');
        if (searchInput) searchInput.oninput = (e) => { store.state.searchQuery = e.target.value; render.refreshGrid(); };
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active', 'bg-yellow-500', 'text-black');
                    b.classList.add('text-slate-400');
                });
                btn.classList.add('active', 'bg-yellow-500', 'text-black');
                btn.classList.remove('text-slate-400');
                store.state.filter = btn.dataset.filter;
                render.refreshGrid();
            };
        });
        const addBtn = document.getElementById('btn-add-albo');
        if (addBtn) addBtn.onclick = () => render.openFormModal();
    },

    // --- SEZIONE EVENTI PUBLISHER ---
    attachPublisherEvents() {
        const resetBtn = document.getElementById('reset-brand-filter');
        if (resetBtn) resetBtn.onclick = async () => {
            store.state.selectedBrand = null; store.state.selectedSerie = null;
            await render.refreshShowcases(); await render.refreshGrid();
        };
        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => {
                store.state.selectedBrand = el.dataset.brandId; store.state.selectedSerie = null;
                await render.refreshShowcases(); await render.refreshGrid();
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
                render.refreshGrid();
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
        render.attachCardEvents();
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
        if (editBtn) editBtn.onclick = () => render.openFormModal(issue);
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) closeBtn.onclick = () => modal.classList.replace('flex', 'hidden');
    },

    // --- SEZIONE MODALE FORM (NUOVO/EDIT) ---
    async openFormModal(issueData = null) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        
        const promises = [
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome'),
            window.supabaseClient.from('annata').select('*').order('nome'),
            window.supabaseClient.from('issue').select(`id, numero, data_pubblicazione, serie(nome), testata(nome), annata(nome)`).order('numero')
        ];

        if (issueData && issueData.id) {
            promises.push(window.supabaseClient.from('issue').select('*, editore(*)').eq('id', issueData.id).single());
        }

        const results = await Promise.all(promises);
        const dropdowns = {
            codici: results[0].data, editori: results[1].data, serie: results[2].data,
            tipi: results[3].data, testate: results[4].data, annate: results[5].data,
            albiPerSupplemento: results[6].data
        };
        
        const issue = (issueData && results[7]) ? results[7].data : (issueData || {});

        content.innerHTML = UI.ISSUE_FORM(issue, dropdowns);

        // -- INIEZIONE CAMPI DINAMICI --
        const formatSupplementoLabel = (albo) => {
            const s = albo.serie?.nome ? `${albo.serie.nome} ` : '';
            const t = albo.testata?.nome ? `${albo.testata.nome} ` : '';
            const a = albo.annata?.nome ? `${albo.annata.nome} ` : '';
            const n = albo.numero ? `#${albo.numero} ` : '';
            const d = albo.data_pubblicazione ? `del ${albo.data_pubblicazione}` : '';
            return (s + t + a + n + d).trim();
        };

        const suppWrap = content.querySelector('input[name="supplemento"]').parentElement;
        suppWrap.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Supplemento a...</label>
            <select name="supplemento_id" id="select-supplemento" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Nessuno (Albo autonomo)</option>
                ${dropdowns.albiPerSupplemento.filter(a => a.id !== issue.id).map(a => `<option value="${a.id}">${formatSupplementoLabel(a)}</option>`).join('')}
            </select>`;

        const annataWrap = content.querySelector('input[name="annata"]').parentElement;
        annataWrap.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annata</label>
            <select name="annata_id" id="select-annata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Annata...</option>
                ${dropdowns.annate.map(a => `<option value="${a.id}" data-serie="${a.serie_id}">${a.nome}</option>`).join('')}
            </select>`;

        const testataWrap = content.querySelector('select[name="testata_id"]').parentElement;
        testataWrap.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Testata</label>
            <select name="testata_id" id="select-testata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Testata...</option>
                ${dropdowns.testate.map(t => `<option value="${t.id}" data-serie="${t.serie_id}">${t.nome}</option>`).join('')}
            </select>`;

        modal.classList.replace('hidden', 'flex');

        // -- LOGICA SYNC --
        const selCodice = document.getElementById('select-codice-editore');
        const selEditore = document.getElementById('select-editore-name');
        const selSerie = document.getElementById('select-serie');
        const selAnnata = document.getElementById('select-annata');
        const selTestata = document.getElementById('select-testata');
        const selSupp = document.getElementById('select-supplemento');

        const syncSerieDeps = (serieId, targetAnnataId = null, targetTestataId = null) => {
            [selAnnata, selTestata].forEach(sel => {
                Array.from(sel.options).forEach(opt => {
                    if (!opt.dataset.serie) return;
                    const match = opt.dataset.serie == serieId;
                    opt.hidden = !match; opt.disabled = !match;
                });
            });
            selAnnata.value = targetAnnataId || "";
            selTestata.value = targetTestataId || "";
        };

        selSerie.onchange = () => syncSerieDeps(selSerie.value);
        selCodice.onchange = () => {
            Array.from(selEditore.options).forEach(o => {
                if (!o.dataset.parent) return;
                o.hidden = o.dataset.parent != selCodice.value;
                o.disabled = o.dataset.parent != selCodice.value;
            });
            selEditore.value = "";
        };

        if (issue.id) {
            const cId = issue.editore?.codice_editore_id || issue.codice_editore_id;
            if (cId) { selCodice.value = cId; selCodice.dispatchEvent(new Event('change')); selEditore.value = issue.editore_id || ""; }
            if (issue.serie_id) { selSerie.value = issue.serie_id; syncSerieDeps(issue.serie_id, issue.annata_id, issue.testata_id); }
            if (issue.supplemento_id) selSupp.value = issue.supplemento_id;
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = (e) => { e.preventDefault(); console.log("Salvataggio..."); };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => render.openIssueModal(c.dataset.id); });
    }
};
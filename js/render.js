/**
 * VERSION: 8.7.0 (Integrale - Ripristino logica completa + Stelle + Supplementi A-Z)
 * NOTA: Gestisce la dipendenza gerarchica completa e il recupero albi per supplemento.
 * MODIFICHE CHIRURGICHE: Copiare e incollare le parti non modificate.
 * MANTENERE I COMMENTI SEZIONALI: Presenti e aggiornati.
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
            store.state.selectedBrand = null; 
            store.state.selectedSerie = null;
            await this.refreshShowcases(); 
            this.refreshGrid(); 
        };
        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => { 
                store.state.selectedBrand = el.dataset.brandId; 
                store.state.selectedSerie = null;
                await this.refreshShowcases(); 
                this.refreshGrid(); 
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
            window.supabaseClient.from('issue').select(`id, numero, data_pubblicazione, serie(nome), testata(nome), annata(nome), editore!inner(codice_editore_id)`)
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

        // --- INIEZIONI CHIRURGICHE ---
        
        // 1. Supplemento (Ordinato A-Z)
        const formatSuppLabel = (a) => `${a.serie?.nome || ''} ${a.testata?.nome || ''} ${a.annata?.nome || ''} #${a.numero || ''} ${a.data_pubblicazione || ''}`.trim();
        const suppList = dropdowns.albiPerSupplemento
            .map(a => ({ id: a.id, cod: a.editore?.codice_editore_id, label: formatSuppLabel(a) }))
            .sort((a, b) => a.label.localeCompare(b.label));

        const suppWrap = content.querySelector('input[name="supplemento"]').parentElement;
        suppWrap.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Supplemento a...</label>
            <select name="supplemento_id" id="select-supplemento" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Nessuno (Albo autonomo)</option>
                ${suppList.map(a => `<option value="${a.id}" data-codice="${a.cod}">${a.label}</option>`).join('')}
            </select>`;

        // 2. Condizione a Stelle
        const labelStati = ["Lettura", "Discreto", "Buono", "Ottimo", "Edicola"];
        const condWrap = content.querySelector('input[name="condizione"]').parentElement;
        condWrap.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Condizione</label>
            <div class="flex flex-col gap-2">
                <div id="star-rating" class="flex gap-1 text-2xl cursor-pointer">
                    ${[1,2,3,4,5].map(v => `<span class="star text-slate-600" data-value="${v}">★</span>`).join('')}
                </div>
                <div id="star-label" class="text-[10px] uppercase tracking-widest text-slate-400 italic h-4">Nessuna selezione</div>
                <input type="hidden" name="condizione" id="input-condizione" value="${issue.condizione || ''}">
            </div>`;

        // 3. Annata & Testata
        const annWrap = content.querySelector('input[name="annata"]').parentElement;
        annWrap.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annata</label>
            <select name="annata_id" id="select-annata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Annata...</option>
                ${dropdowns.annate.map(a => `<option value="${a.id}" data-serie="${a.serie_id}">${a.nome}</option>`).join('')}
            </select>`;

        const testWrap = content.querySelector('select[name="testata_id"]').parentElement;
        testWrap.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Testata</label>
            <select name="testata_id" id="select-testata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Testata...</option>
                ${dropdowns.testate.map(t => `<option value="${t.id}" data-serie="${t.serie_id}">${t.nome}</option>`).join('')}
            </select>`;

        modal.classList.replace('hidden', 'flex');

        // --- SELETTORI E LOGICA EVENTI ---
        const selCodice = document.getElementById('select-codice-editore');
        const selEditore = document.getElementById('select-editore-name');
        const selSerie = document.getElementById('select-serie');
        const selAnnata = document.getElementById('select-annata');
        const selTestata = document.getElementById('select-testata');
        const selSupp = document.getElementById('select-supplemento');
        const previewImg = document.querySelector('#preview-editore img');
        const stars = document.querySelectorAll('#star-rating .star');
        const starLabel = document.getElementById('star-label');
        const inputCondizione = document.getElementById('input-condizione');

        const updateStars = (val) => {
            inputCondizione.value = val || "";
            stars.forEach(s => s.classList.toggle('text-yellow-500', val && parseInt(s.dataset.value) <= val));
            starLabel.innerText = val ? labelStati[val - 1] : "Nessuna selezione";
        };

        stars.forEach(s => s.onclick = () => updateStars(inputCondizione.value == s.dataset.value ? null : s.dataset.value));

        const syncAll = () => {
            const cId = selCodice.value;
            const sId = selSerie.value;
            // Sync Editori
            Array.from(selEditore.options).forEach(o => { o.hidden = o.dataset.parent != cId; o.disabled = o.dataset.parent != cId; });
            // Sync Supplementi
            Array.from(selSupp.options).forEach(o => { o.hidden = o.dataset.codice && o.dataset.codice != cId; o.disabled = o.dataset.codice && o.dataset.codice != cId; });
            // Sync Serie Dependents
            [selAnnata, selTestata].forEach(sel => Array.from(sel.options).forEach(o => { o.hidden = o.dataset.serie && o.dataset.serie != sId; o.disabled = o.dataset.serie && o.dataset.serie != sId; }));
        };

        selCodice.onchange = () => { syncAll(); selEditore.value = ""; previewImg.classList.add('hidden'); };
        selSerie.onchange = syncAll;
        selEditore.onchange = () => {
            const opt = selEditore.options[selEditore.selectedIndex];
            if (opt?.dataset.img) { previewImg.src = opt.dataset.img; previewImg.classList.remove('hidden'); }
            else { previewImg.classList.add('hidden'); }
        };

        if (issue.id) {
            selCodice.value = issue.editore?.codice_editore_id || "";
            selSerie.value = issue.serie_id || "";
            syncAll();
            selEditore.value = issue.editore_id || "";
            selAnnata.value = issue.annata_id || "";
            selTestata.value = issue.testata_id || "";
            selSupp.value = issue.supplemento_id || "";
            if (issue.condizione) updateStars(issue.condizione);
            selEditore.dispatchEvent(new Event('change'));
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            console.log("Salvataggio:", data);
            alert("Dati pronti per Supabase!");
        };
    },

    // --- SEZIONE EVENTI CARD ---
    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
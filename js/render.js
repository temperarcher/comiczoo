/**
 * VERSION: 8.6.8 (Chirurgica - Menu Condizione 1-5 e recupero valore)
 * NOTA: Gestisce la dipendenza gerarchica completa e il recupero albi per supplemento.
 * MODIFICHE CHIRURGICHE: Sostituzione input condizione con select e recupero valore in Edit.
 * MANTENERE I COMMENTI SEZIONALI: Aggiornarli se necessario ma lasciarli sempre presenti.
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
        } catch (e) { console.error(e); }
    },

    // --- SEZIONE EVENTI HEADER ---
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

    // --- SEZIONE EVENTI PUBLISHER ---
    attachPublisherEvents() {
        const resetBtn = document.getElementById('reset-brand-filter');
        if (resetBtn) resetBtn.onclick = async () => { store.state.selectedBrand = null; await this.refreshShowcases(); this.refreshGrid(); };
        document.querySelectorAll('[data-brand-id]').forEach(el => {
            el.onclick = async () => { store.state.selectedBrand = el.dataset.brandId; await this.refreshShowcases(); this.refreshGrid(); };
        });
    },

    // --- SEZIONE EVENTI SERIE ---
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

    // --- SEZIONE RENDER GRIGLIA ---
    refreshGrid() {
        const container = document.getElementById('main-grid');
        if (!container || !store.state.selectedSerie) return;
        const filtered = (store.state.issues || []).filter(i => (store.state.filter === 'all' || i.possesso === store.state.filter));
        container.innerHTML = filtered.map(i => components.issueCard(i)).join('');
        this.attachCardEvents();
    },

    // --- SEZIONE MODALE VISUALIZZAZIONE ---
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
        
        const promises = [
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome'),
            window.supabaseClient.from('annata').select('*').order('nome'),
            window.supabaseClient.from('issue').select(`
                id, numero, data_pubblicazione, 
                serie(nome), testata(nome), annata(nome),
                editore!inner(codice_editore_id)
            `)
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
        
        // --- HELPER STRINGA E INIEZIONE SUPPLEMENTO ---
        const formatSupplementoLabel = (albo) => {
            const s = albo.serie?.nome ? `${albo.serie.nome} ` : '';
            const t = albo.testata?.nome ? `${albo.testata.nome} ` : '';
            const a = albo.annata?.nome ? `${albo.annata.nome} ` : '';
            const n = albo.numero ? `#${albo.numero} ` : '';
            const d = albo.data_pubblicazione ? `del ${albo.data_pubblicazione}` : '';
            return (s + t + a + n + d).trim();
        };

        const supplementoWrapper = content.querySelector('input[name="supplemento"]').parentElement;
        
        // Mappatura con etichetta e ordinamento alfabetico reale
        const listaOrdinata = dropdowns.albiPerSupplemento
            .map(a => ({ id: a.id, codice: a.editore?.codice_editore_id, label: formatSupplementoLabel(a) }))
            .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

        supplementoWrapper.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Supplemento a...</label>
            <select name="supplemento_id" id="select-supplemento" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Nessuno (Albo autonomo)</option>
                ${listaOrdinata.map(a => `<option value="${a.id}" data-codice="${a.codice}">${a.label}</option>`).join('')}
            </select>`;

        // --- INIEZIONE CONDIZIONE ---
        const condWrapper = content.querySelector('input[name="condizione"]').parentElement;
        const labelStati = ["Lettura", "Discreto", "Buono", "Ottimo", "Edicola"];
        condWrapper.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Condizione</label>
            <select name="condizione" id="select-condizione" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Nessuna (null)</option>
                ${labelStati.map((s, idx) => `<option value="${idx + 1}">${s}</option>`).join('')}
            </select>`;

        // Iniezione Annata e Testata
        const annataWrapper = content.querySelector('input[name="annata"]').parentElement;
        annataWrapper.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annata</label>
            <select name="annata_id" id="select-annata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Annata...</option>
                ${dropdowns.annate.map(a => `<option value="${a.id}" data-serie="${a.serie_id}">${a.nome}</option>`).join('')}
            </select>`;

        const testataWrapper = content.querySelector('select[name="testata_id"]').parentElement;
        testataWrapper.innerHTML = `<label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Testata</label>
            <select name="testata_id" id="select-testata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Testata...</option>
                ${dropdowns.testate.map(t => `<option value="${t.id}" data-serie="${t.serie_id}">${t.nome}</option>`).join('')}
            </select>`;

        modal.classList.replace('hidden', 'flex');

        const selectCodice = document.getElementById('select-codice-editore');
        const selectEditore = document.getElementById('select-editore-name');
        const selectSerie = document.getElementById('select-serie');
        const selectAnnata = document.getElementById('select-annata');
        const selectTestata = document.getElementById('select-testata');
        const selectSupplemento = document.getElementById('select-supplemento');
        const selectCondizione = document.getElementById('select-condizione');

        // --- LOGICA FILTRAGGIO DINAMICO ---
        const syncEditoriESupplementi = (codiceId, targetEditoreId = null) => {
            Array.from(selectEditore.options).forEach(opt => {
                if (!opt.dataset.parent) return;
                const match = (opt.dataset.parent == codiceId);
                opt.hidden = !match; opt.disabled = !match;
            });
            selectEditore.value = targetEditoreId || "";
            
            Array.from(selectSupplemento.options).forEach(opt => {
                if (!opt.dataset.codice) return;
                const match = (opt.dataset.codice == codiceId);
                opt.hidden = !match; opt.disabled = !match;
            });
            if (selectSupplemento.options[selectSupplemento.selectedIndex]?.hidden) selectSupplemento.value = "";
        };

        const syncSerieDependents = (serieId, targetAnnataId = null, targetTestataId = null) => {
            [selectAnnata, selectTestata].forEach(sel => {
                Array.from(sel.options).forEach(opt => {
                    if (!opt.dataset.serie) return;
                    const match = (opt.dataset.serie == serieId);
                    opt.hidden = !match; opt.disabled = !match;
                });
            });
            selectAnnata.value = targetAnnataId || "";
            selectTestata.value = targetTestataId || "";
        };

        selectCodice.onchange = () => syncEditoriESupplementi(selectCodice.value);
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
            // Recupero valore condizione
            if (issue.condizione) selectCondizione.value = issue.condizione;
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = (e) => { e.preventDefault(); console.log("Salvataggio..."); };
    },

    // --- SEZIONE EVENTI CARD ---
    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
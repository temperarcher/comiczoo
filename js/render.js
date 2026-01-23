/**
 * VERSION: 8.6.2 (Integrale - Fix Stringa Supplemento: Serie + Testata + Annata + Numero + Data)
 * NOTA: La stringa ora include l'Annata come richiesto per una precisione assoluta.
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

    async openFormModal(issueData = null) {
        const modal = document.getElementById('issue-modal');
        const content = document.getElementById('modal-body');
        
        // 1. Fetch Dati (Incluso Join per Annata nella stringa supplemento)
        const promises = [
            window.supabaseClient.from('codice_editore').select('*').order('nome'),
            window.supabaseClient.from('editore').select('*').order('nome'),
            window.supabaseClient.from('serie').select('*').order('nome'),
            window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome'),
            window.supabaseClient.from('testata').select('*').order('nome'),
            window.supabaseClient.from('annata').select('*').order('nome'),
            // Query per supplemento: recuperiamo gli oggetti relazionati per costruire la stringa
            window.supabaseClient.from('issue').select(`
                id, numero, data_pubblicazione, 
                serie(nome), testata(nome), annata(nome)
            `).order('numero')
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

        // 2. Rendering e Iniezione campi dinamici
        content.innerHTML = UI.ISSUE_FORM(issue, dropdowns);
        
        /**
         * COSTRUZIONE STRINGA SUPPLEMENTO (FIX: Serie + Testata + Annata + Numero + Data)
         */
        const formatSupplementoLabel = (albo) => {
            const s = albo.serie?.nome ? `${albo.serie.nome} ` : '';
            const t = albo.testata?.nome ? `${albo.testata.nome} ` : '';
            const a = albo.annata?.nome ? `${albo.annata.nome} ` : '';
            const n = albo.numero ? `#${albo.numero} ` : '';
            const d = albo.data_pubblicazione ? `del ${albo.data_pubblicazione}` : '';
            return (s + t + a + n + d).trim();
        };

        // Sostituzione campo Supplemento
        const supplementoWrapper = content.querySelector('input[name="supplemento"]').parentElement;
        supplementoWrapper.innerHTML = `
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Supplemento a...</label>
            <select name="supplemento_id" id="select-supplemento" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Nessuno (Albo autonomo)</option>
                ${dropdowns.albiPerSupplemento.filter(a => a.id !== issue.id).map(a => `
                    <option value="${a.id}">${formatSupplementoLabel(a)}</option>
                `).join('')}
            </select>`;

        // Sostituzione Annata e Testata
        const annataWrapper = content.querySelector('input[name="annata"]').parentElement;
        const testataWrapper = content.querySelector('select[name="testata_id"]').parentElement;

        annataWrapper.innerHTML = `
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annata</label>
            <select name="annata_id" id="select-annata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Annata...</option>
                ${dropdowns.annate.map(a => `<option value="${a.id}" data-serie="${a.serie_id}">${a.nome}</option>`).join('')}
            </select>`;

        testataWrapper.innerHTML = `
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Testata</label>
            <select name="testata_id" id="select-testata" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                <option value="">Seleziona Testata...</option>
                ${dropdowns.testate.map(t => `<option value="${t.id}" data-serie="${t.serie_id}">${t.nome}</option>`).join('')}
            </select>`;

        modal.classList.replace('hidden', 'flex');

        // 3. Selettori e Sincronizzazione
        const selectCodice = document.getElementById('select-codice-editore');
        const selectEditore = document.getElementById('select-editore-name');
        const selectSerie = document.getElementById('select-serie');
        const selectAnnata = document.getElementById('select-annata');
        const selectTestata = document.getElementById('select-testata');
        const selectSupplemento = document.getElementById('select-supplemento');

        const syncSerieDependents = (serieId, targetAnnataId = null, targetTestataId = null) => {
            [selectAnnata, selectTestata].forEach(sel => {
                Array.from(sel.options).forEach(opt => {
                    if (!opt.dataset.serie) return;
                    const match = opt.dataset.serie == serieId;
                    opt.hidden = !match; opt.disabled = !match;
                });
            });
            selectAnnata.value = targetAnnataId || "";
            selectTestata.value = targetTestataId || "";
        };

        selectSerie.onchange = () => syncSerieDependents(selectSerie.value);
        
        // 4. POPOLAMENTO EDIT
        if (issue.id) {
            // Editore
            const cId = issue.editore?.codice_editore_id || issue.codice_editore_id;
            if (cId) {
                selectCodice.value = cId;
                // Sincronizziamo manualmente gli editori per il codice selezionato
                Array.from(selectEditore.options).forEach(o => {
                    if (!o.dataset.parent) return;
                    o.hidden = o.dataset.parent != cId;
                    o.disabled = o.dataset.parent != cId;
                });
                selectEditore.value = issue.editore_id || "";
            }
            
            // Serie / Annata / Testata
            if (issue.serie_id) {
                selectSerie.value = issue.serie_id;
                syncSerieDependents(issue.serie_id, issue.annata_id, issue.testata_id);
            }
            
            // Supplemento
            if (issue.supplemento_id) {
                selectSupplemento.value = issue.supplemento_id;
            }
        }

        document.getElementById('cancel-form').onclick = () => modal.classList.replace('flex', 'hidden');
        document.getElementById('form-albo').onsubmit = (e) => { e.preventDefault(); console.log("Salvataggio..."); };
    },

    attachCardEvents() {
        document.querySelectorAll('[data-id]').forEach(c => { c.onclick = () => this.openIssueModal(c.dataset.id); });
    }
};
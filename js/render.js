/**
 * VERSION: 1.4.6
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { UI } from './ui.js';
import { Logic } from './logic.js';

export const Render = {
    initLayout: () => {
        window.UI = UI; window.Logic = Logic;
        UI.ROOTS.APPLY_BODY_STYLE();
        document.body.innerHTML = UI.ROOTS.HEADER_SLOT() + UI.ROOTS.PUBLISHER_SLOT() + UI.ROOTS.SERIES_SLOT() + UI.ROOTS.MAIN_ROOT();
        const headerContainer = document.getElementById('ui-header-slot');
        if (headerContainer) headerContainer.innerHTML = UI.HEADER();
    },

    publishers: (data, activeId = null) => {
        const target = document.getElementById('ui-publisher-slot');
        if (!target) return;
        const content = UI.ALL_PUBLISHERS_BUTTON(!activeId) + data.map(p => UI.PUBLISHER_PILL(p)).join('');
        target.innerHTML = UI.PUBLISHER_SECTION(content);
        if(activeId) {
            document.querySelectorAll('.codice-item').forEach(el => el.classList.remove('active', 'border-yellow-500'));
            const activeEl = document.getElementById(`codice-${activeId}`);
            if(activeEl) activeEl.classList.add('active', 'border-yellow-500');
        }
    },

    series: (data) => {
        const target = document.getElementById('ui-series-slot');
        if (!target) return;
        const content = data.map(s => UI.SERIES_CARD(s)).join('');
        target.innerHTML = UI.SERIES_SECTION(content);
    },

    issues: (data) => {
        const target = document.getElementById('ui-main-root');
        if (!target) return;
        if (!data || data.length === 0) {
            target.innerHTML = '<div class="p-10 text-center text-slate-500">Nessun albo trovato.</div>';
            return;
        }
        const content = data.map(i => UI.ISSUES_CARD(i)).join('');
        target.innerHTML = UI.ISSUES_SECTION(content);
        target.scrollIntoView({ behavior: 'smooth' });
    },

    modal: (issue, stories, supplementoStr) => {
        const storiesHtml = stories.map(s => UI.MODAL_STORY_ITEM(s)).join('');
        const formatDate = (dateStr) => { if (!dateStr) return 'N/D'; return new Date(dateStr).toLocaleDateString('it-IT'); };
        const header = {
            titolo: `${issue.serie?.nome || ''} ${issue.testata?.nome ? '- ' + issue.testata.nome : ''}`,
            infoUscita: `${issue.annata?.nome || ''} n°${issue.numero} del ${formatDate(issue.data_pubblicazione)}`,
            infoSupplemento: supplementoStr ? supplementoStr : null
        };
        const rows = [
            UI.MODAL_DETAIL_ROW("Editore", issue.editore?.nome, issue.editore?.immagine_url, `<span class="text-[10px] font-mono text-slate-500">${issue.editore?.codice_editore?.nome || ''}</span>`),
            UI.MODAL_DETAIL_ROW("Tipo Pubblicazione", issue.tipo?.nome || "Regolare", null, `<span class="text-xs font-black text-yellow-500">€ ${issue.valore?.toFixed(2) || '0.00'}</span>`),
            UI.MODAL_DETAIL_ROW("Stato Conservazione", `<div class="flex gap-1.5 mt-1">${UI.STARS(issue.condizione, 'w-8 h-8')}</div>`, null, `<span class="px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider ${issue.possesso === 'manca' ? 'bg-red-900/40 text-red-500 border border-red-900/50' : 'bg-green-600 text-white shadow-lg'}">${issue.possesso === 'celo' ? 'posseduto' : 'mancante'}</span>`)
        ].join('');
        const content = UI.MODAL_LEFT_COL(issue, storiesHtml) + UI.MODAL_RIGHT_COL(header, rows);
        let container = document.getElementById('modal-root');
        if (!container) { container = document.createElement('div'); container.id = 'modal-root'; document.body.appendChild(container); }
        container.innerHTML = UI.MODAL_WRAPPER(content, issue.id);
    },

    form: (title, data, lookup, stories = []) => {
        const storiesHtml = stories.length > 0 
            ? stories.map(s => UI.MODAL_FORM_STORY_ROW(s.posizione, s.storia.nome)).join('')
            : '<p class="text-[10px] text-slate-600 uppercase font-black p-4 text-center border border-dashed border-slate-800 rounded-lg">Nessuna storia caricata</p>';

        const fields = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    ${UI.MODAL_FORM_PREVIEW(data?.immagine_url)}
                    ${UI.MODAL_FORM_FIELD("URL Immagine", UI.MODAL_FORM_INPUT("f-immagine", "text", data?.immagine_url || '', "https://...", "UI.UPDATE_PREVIEW(this.value)"))}
                    <div class="mt-6">
                        <label class="text-[10px] font-black uppercase text-yellow-500 tracking-widest mb-3 block">Storie Contenute</label>
                        <div class="space-y-2 max-h-[250px] overflow-y-auto pr-2 modal-scroll-dark">${storiesHtml}</div>
                    </div>
                </div>
                <div class="space-y-4">
                    ${UI.MODAL_FORM_FIELD("Serie", UI.MODAL_FORM_SELECT("f-serie", lookup.series, data?.serie_id))}
                    ${UI.MODAL_FORM_FIELD("Testata", UI.MODAL_FORM_SELECT("f-testata", lookup.testate, data?.testata_id))}
                    <div class="grid grid-cols-2 gap-4">
                        ${UI.MODAL_FORM_FIELD("Numero", UI.MODAL_FORM_INPUT("f-numero", "number", data?.numero || ''))}
                        ${UI.MODAL_FORM_FIELD("Annata", UI.MODAL_FORM_SELECT("f-annata", lookup.annate, data?.annata_id))}
                    </div>
                    ${UI.MODAL_FORM_FIELD("Titolo Albo", UI.MODAL_FORM_INPUT("f-nome", "text", data?.nome || ''))}
                    ${UI.MODAL_FORM_FIELD("Editore", UI.MODAL_FORM_SELECT("f-editore", lookup.editori, data?.editore_id))}
                    ${UI.MODAL_FORM_FIELD("Tipo Pubblicazione", UI.MODAL_FORM_SELECT("f-tipo", lookup.tipi, data?.tipo_pubblicazione_id))}
                    ${UI.MODAL_FORM_FIELD("Data Pubblicazione", UI.MODAL_FORM_INPUT("f-data", "date", data?.data_pubblicazione || ''))}
                    ${UI.MODAL_FORM_FIELD("Supplemento a", UI.MODAL_FORM_SELECT("f-supplemento", lookup.albi, data?.supplemento_id))}
                    <div class="grid grid-cols-3 gap-4">
                        ${UI.MODAL_FORM_FIELD("Possesso", UI.MODAL_FORM_SELECT("f-possesso", [{id:'celo', nome:'CELO'}, {id:'manca', nome:'MANCA'}], data?.possesso))}
                        ${UI.MODAL_FORM_FIELD("Valore (€)", UI.MODAL_FORM_INPUT("f-valore", "number", data?.valore || '0.00'))}
                        ${UI.MODAL_FORM_FIELD("Stato", UI.MODAL_FORM_INPUT("f-condizione", "number", data?.condizione || '5'))}
                    </div>
                </div>
            </div>
        `;
        let container = document.getElementById('modal-root');
        if (!container) { container = document.createElement('div'); container.id = 'modal-root'; document.body.appendChild(container); }
        container.innerHTML = UI.MODAL_FORM_WRAPPER(title, fields);
        const saveBtn = document.getElementById('save-issue-btn');
        if (saveBtn) saveBtn.onclick = () => Logic.saveIssue(data?.id || null);
    }
};
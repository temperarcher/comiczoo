/**
 * VERSION: 1.2.2
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { UI } from './ui.js';

export const Render = {
    initLayout: () => {
        UI.ROOTS.APPLY_BODY_STYLE();
        document.body.innerHTML = 
            UI.ROOTS.HEADER_SLOT() + 
            UI.ROOTS.PUBLISHER_SLOT() + 
            UI.ROOTS.SERIES_SLOT() + 
            UI.ROOTS.MAIN_ROOT();
        
        const headerContainer = document.getElementById('ui-header-slot');
        if (headerContainer) headerContainer.innerHTML = UI.HEADER();
    },

    publishers: (data, activeId = null) => {
        const target = document.getElementById('ui-publisher-slot');
        if (!target) return;
        const content = UI.ALL_PUBLISHERS_BUTTON(!activeId) + 
                        data.map(p => UI.PUBLISHER_PILL(p)).join('');
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
        const storiesHtml = stories.map(s => UI.MODAL_STORY_ITEM(s)).join('') || 
                           '<p class="text-slate-600 text-[10px] italic p-2">Nessuna storia registrata.</p>';
        
        const isManca = issue.possesso === 'manca';
        const statusBadge = `<span class="px-2 py-1 rounded text-[10px] font-black uppercase ${isManca ? 'bg-slate-700 text-slate-400' : 'bg-green-600 text-white shadow-lg shadow-green-900/20'}">${issue.possesso || 'manca'}</span>`;

        // Costruzione righe con LOGHI e STELLINE
        const rows = [
            UI.MODAL_DETAIL_ROW("Editore", issue.editore?.nome, issue.editore?.immagine_url, `<span class="text-[10px] text-slate-500 font-mono">${issue.editore?.codice_editore?.nome || ''}</span>`),
            UI.MODAL_DETAIL_ROW("Serie e Testata", issue.serie?.nome, null, `<span class="text-xs font-bold text-yellow-500">n°${issue.numero || 'N/D'}</span>`),
            UI.MODAL_DETAIL_ROW("Data Pubblicazione", issue.data_pubblicazione ? new Date(issue.data_pubblicazione).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Data N/D'),
            UI.MODAL_DETAIL_ROW("Valore stimato", `€ ${issue.valore?.toFixed(2) || '0.00'}`, null, `<span class="text-[10px] text-slate-500 uppercase tracking-widest">Euro</span>`),
            UI.MODAL_DETAIL_ROW("Condizione Albo", "Valutazione", null, UI.STARS(issue.condizione)),
            UI.MODAL_DETAIL_ROW("Stato Collezione", "Disponibilità", null, statusBadge),
            UI.MODAL_DETAIL_ROW("Note Supplemento", supplementoStr || "Nessun supplemento registrato")
        ].join('');

        const content = UI.MODAL_LEFT_COL(issue, storiesHtml) + UI.MODAL_RIGHT_COL(rows);
        
        let container = document.getElementById('modal-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'modal-root';
            document.body.appendChild(container);
        }
        container.innerHTML = UI.MODAL_WRAPPER(content);
    }
};
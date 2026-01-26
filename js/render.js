/**
 * VERSION: 1.2.1
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
        
        // Calcolo Badge Possesso
        const isManca = issue.possesso === 'manca';
        const statusBadge = `<span class="px-2 py-1 rounded text-[9px] font-bold uppercase ${isManca ? 'bg-slate-700 text-slate-400' : 'bg-yellow-500 text-slate-900'}">${issue.possesso || 'manca'}</span>`;

        const rows = [
            UI.MODAL_DETAIL_ROW("Editore", issue.editore?.codice_editore?.nome, issue.editore?.immagine_url, `<span class="text-xs text-slate-400">${issue.editore?.nome || ''}</span>`),
            UI.MODAL_DETAIL_ROW("Pubblicazione", `${issue.serie?.nome} / ${issue.testata?.nome}`, null, `<span class="text-xs font-mono text-yellow-500">#${issue.numero}</span>`),
            UI.MODAL_DETAIL_ROW("Data e Valore", issue.data_pubblicazione ? new Date(issue.data_pubblicazione).toLocaleDateString('it-IT') : 'N/D', null, `<span class="text-xs text-slate-200">€ ${issue.valore?.toFixed(2) || '0.00'}</span>`),
            UI.MODAL_DETAIL_ROW("Condizione", "Valutazione Stato", null, UI.STARS(issue.condizione)),
            UI.MODAL_DETAIL_ROW("Stato Collezione", "Disponibilità", null, statusBadge),
            UI.MODAL_DETAIL_ROW("Supplemento", supplementoStr || "Nessun supplemento")
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
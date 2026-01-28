/**
 * VERSION: 1.3.4
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
        const storiesHtml = stories.map(s => UI.MODAL_STORY_ITEM(s)).join('');
        
        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/D';
            return new Date(dateStr).toLocaleDateString('it-IT');
        };

        const header = {
            titolo: `${issue.serie?.nome || ''} ${issue.testata?.nome ? '- ' + issue.testata.nome : ''}`,
            infoUscita: `${issue.annata?.nome || ''} n°${issue.numero} del ${formatDate(issue.data_pubblicazione)}`,
            infoSupplemento: supplementoStr ? supplementoStr : null
        };

        // 2. Badge Celo/Manca
        const isManca = issue.possesso === 'manca';
        const statusBadge = `<span class="px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider ${isManca ? 'bg-red-900/40 text-red-500 border border-red-900/50' : 'bg-green-600 text-white shadow-lg'}">${issue.possesso === 'celo' ? 'posseduto' : 'mancante'}</span>`;

        // Modifica richiesta: Label separate per Tipo e Valore
        const valSubValue = `
            <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Valore</span>
            <span class="text-xl font-light text-white leading-none">€ ${issue.valore?.toFixed(2) || '0.00'}</span>
        `;

        const rows = [
            UI.MODAL_DETAIL_ROW("Editore", issue.editore?.nome, issue.editore?.immagine_url, `<span class="text-[10px] font-mono text-slate-500">${issue.editore?.codice_editore?.nome || ''}</span>`),
            UI.MODAL_DETAIL_ROW("Tipo Pubblicazione", issue.tipo?.nome || "Regolare", null, valSubValue),
            UI.MODAL_DETAIL_ROW("Stato Conservazione", `<div class="flex gap-1.5 mt-1">${UI.STARS(issue.condizione, 'w-8 h-8')}</div>`, null, statusBadge)
        ].join('');

        const content = UI.MODAL_LEFT_COL(issue, storiesHtml) + UI.MODAL_RIGHT_COL(header, rows);
        
        let container = document.getElementById('modal-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'modal-root';
            document.body.appendChild(container);
        }
        container.innerHTML = UI.MODAL_WRAPPER(content);
    }
};
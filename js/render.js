/**
 * VERSION: 1.2.0
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
            target.innerHTML = '<div class="p-10 text-center text-slate-500">Nessun albo trovato per questa serie.</div>';
            return;
        }
        const content = data.map(i => UI.ISSUES_CARD(i)).join('');
        target.innerHTML = UI.ISSUES_SECTION(content);
        target.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Renderizza il modale dettaglio con la struttura a due colonne
     */
    modal: (issue, stories, supplementoStr) => {
        const storiesHtml = stories.map(s => UI.MODAL_STORY_ITEM(s)).join('') || 
                           '<p class="text-slate-600 text-xs italic">Nessuna storia registrata.</p>';
        
        const rows = [
            UI.MODAL_DETAIL_ROW("Editore", `${issue.editore?.codice_editore?.nome || ''} - ${issue.editore?.nome || ''}`, issue.editore?.immagine_url),
            UI.MODAL_DETAIL_ROW("Serie e Testata", [issue.serie?.nome, issue.testata?.nome].filter(Boolean).join(' / ')),
            UI.MODAL_DETAIL_ROW("Dati Pubblicazione", `${issue.annata?.nome || ''} n°${issue.numero || ''} ${issue.nome ? '- ' + issue.nome : ''} del ${issue.data_pubblicazione ? new Date(issue.data_pubblicazione).toLocaleDateString('it-IT') : 'Data non disponibile'}`),
            UI.MODAL_DETAIL_ROW("Supplemento a", supplementoStr),
            UI.MODAL_DETAIL_ROW("Tipo e Valore", `${issue.tipo?.nome || 'Standard'} - € ${issue.valore ? issue.valore.toFixed(2) : '0.00'}`),
            UI.MODAL_DETAIL_ROW("Stato Collezione", `Condizione: ${issue.condizione || 'N/D'}/5 - Possesso: ${(issue.possesso || 'manca').toUpperCase()}`)
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
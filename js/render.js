/**
 * VERSION: 1.1.0 
 */
import { UI } from './ui.js';

export const Render = {
    // 1. Inizializzazione Layout Base
    initLayout: () => {
        const body = document.body;
        body.insertAdjacentHTML('afterbegin', UI.HEADER());
        body.insertAdjacentHTML('beforeend', UI.MODAL_WRAPPER());
    },

    // 2. Render Sezione Editori
    publishers: (publishers, activeId = null) => {
        const container = document.getElementById('ui-publisher-bar');
        if (!container) return;
        const allBtn = UI.ALL_PUBLISHERS_BUTTON(!activeId);
        const pills = publishers.map(pub => UI.PUBLISHER_PILL(pub, pub.id === activeId)).join('');
        container.innerHTML = allBtn + pills;
    },

    // 3. Render Showcase Serie
    series: (series) => {
        const sectionContainer = document.getElementById('serie-section-wrapper');
        if (!sectionContainer) return;
        const itemsHtml = series.map(s => UI.SERIE_ITEM(s)).join('');
        sectionContainer.innerHTML = UI.SERIE_SECTION(itemsHtml);
    },

    // 4. Render Griglia Albi
    grid: (issues) => {
        const mainContainer = document.getElementById('main-content-area');
        if (!document.getElementById('main-grid')) {
            mainContainer.innerHTML = UI.MAIN_GRID_CONTAINER();
        }
        const grid = document.getElementById('main-grid');
        grid.innerHTML = ''; 
        issues.forEach(issue => {
            const badgeStyle = issue.possesso === 'celo' 
                ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                : 'bg-red-500/20 text-red-500 border-red-500/30';
            grid.insertAdjacentHTML('beforeend', UI.ISSUE_CARD(issue, badgeStyle));
        });
    },

    // 5. Render Dettagli Modale
    modalDetails: (issue, stories) => {
        const modalBody = document.getElementById('modal-body');
        const storiesHtml = stories.map(s => {
            const charsHtml = (s.personaggi || []).map(c => UI.CHARACTER_TAG(c)).join('');
            return UI.STORY_ROW(s, s.info_collegamento, charsHtml);
        }).join('');
        modalBody.innerHTML = UI.MODAL_LAYOUT(issue, storiesHtml);
    },

    // 6. Render Form Editing
    modalForm: (issue, dropdowns) => {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = UI.ISSUE_FORM(issue, dropdowns);
    }
};
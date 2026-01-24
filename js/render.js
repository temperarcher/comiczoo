/**
 * VERSION: 1.1.0 
 */
import { UI } from './ui.js';

export const Render = {
    // Inizializza Header e Wrapper Modale
    initLayout: () => {
        const body = document.body;
        body.insertAdjacentHTML('afterbegin', UI.HEADER());
        body.insertAdjacentHTML('beforeend', UI.MODAL_WRAPPER());
    },

    // Renderizza la griglia principale (Livello 4)
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

    // Renderizza il form nel modale (Livello 6)
    modalForm: (issue, dropdowns) => {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = UI.ISSUE_FORM(issue, dropdowns);
    },

    // Renderizza i dettagli nel modale (Livello 5 & 7)
    modalDetails: (issue, stories) => {
        const modalBody = document.getElementById('modal-body');
        const storiesHtml = stories.map(s => {
            const charsHtml = (s.personaggi || []).map(c => UI.CHARACTER_TAG(c)).join('');
            return UI.STORY_ROW(s, s.info_collegamento, charsHtml);
        }).join('');
        modalBody.innerHTML = UI.MODAL_LAYOUT(issue, storiesHtml);
    }
};
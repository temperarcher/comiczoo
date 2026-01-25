/**
 * VERSION: 1.1.0 
 */
import { UI } from './ui.js';

export const Render = {
    initLayout: () => {
        const body = document.body;
        body.innerHTML = ''; 
        body.insertAdjacentHTML('beforeend', UI.HEADER());
        body.insertAdjacentHTML('beforeend', UI.ROOTS.ROOT_MAIN());
        body.insertAdjacentHTML('beforeend', UI.MODAL_WRAPPER());

        const main = document.getElementById('ui-main-root');
        main.insertAdjacentHTML('beforeend', UI.ROOTS.PUBLISHER_ROOT());
        main.insertAdjacentHTML('beforeend', UI.ROOTS.SERIES_ROOT());
        main.insertAdjacentHTML('beforeend', UI.ROOTS.GRID_ROOT());
    },

    publishers: (data, activeId = null) => {
        const target = document.getElementById('publisher-section');
        if (!target) return;
        const content = UI.ALL_PUBLISHERS_BUTTON(!activeId) + 
                        data.map(p => UI.PUBLISHER_PILL(p, p.id === activeId)).join('');
        target.innerHTML = UI.PUBLISHER_SECTION(content);
    },

    series: (data) => {
        const target = document.getElementById('series-section');
        if (!target) return;
        const content = data.map(s => UI.SERIE_ITEM(s)).join('');
        target.innerHTML = UI.SERIE_SECTION(content);
    },

    grid: (issues) => {
        const target = document.getElementById('grid-section');
        if (!target) return;
        const cardsHtml = issues.map(issue => {
            const style = issue.possesso === 'celo' 
                ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                : 'bg-red-500/20 text-red-500 border-red-500/30';
            return UI.ISSUE_CARD(issue, style);
        }).join('');
        target.innerHTML = UI.MAIN_GRID_CONTAINER(cardsHtml);
    },

    modalDetails: (issue, stories) => {
        const modalBody = document.getElementById('modal-body');
        if (!modalBody) return;
        const storiesHtml = stories.map(s => {
            const charsHtml = (s.personaggi || []).map(c => UI.CHARACTER_TAG(c)).join('');
            return UI.STORY_ROW(s, s.info_collegamento, charsHtml);
        }).join('');
        modalBody.innerHTML = UI.MODAL_LAYOUT(issue, storiesHtml);
    }
};
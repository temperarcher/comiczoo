/**
 * VERSION: 1.1.0 
 */
import { UI } from './ui.js';

export const Render = {
    // 1. Inizializzazione Struttura Base
    initLayout: () => {
        document.getElementById('ui-header-root').innerHTML = UI.HEADER();
        document.getElementById('ui-modal-root').innerHTML = UI.MODAL_WRAPPER();
    },

    // 2. Render Sezione Editori (Container + Items)
    publishers: (publishersData, activeId = null) => {
        const root = document.getElementById('ui-main-root');
        const allBtn = UI.ALL_PUBLISHERS_BUTTON(!activeId);
        const pills = publishersData.map(pub => UI.PUBLISHER_PILL(pub, pub.id === activeId)).join('');
        
        // Creiamo il div contenitore se non esiste o aggiorniamolo
        let section = document.getElementById('publisher-section');
        if (!section) {
            root.insertAdjacentHTML('afterbegin', '<div id="publisher-section"></div>');
            section = document.getElementById('publisher-section');
        }
        section.innerHTML = UI.PUBLISHER_SECTION(allBtn + pills);
    },

    // 3. Render Showcase Serie (Container + Items)
    series: (seriesData) => {
        const root = document.getElementById('ui-main-root');
        let section = document.getElementById('series-section');
        if (!section) {
            // Lo inseriamo dopo gli editori
            const pubSection = document.getElementById('publisher-section');
            pubSection.insertAdjacentHTML('afterend', '<div id="series-section"></div>');
            section = document.getElementById('series-section');
        }
        const itemsHtml = seriesData.map(s => UI.SERIE_ITEM(s)).join('');
        section.innerHTML = UI.SERIE_SECTION(itemsHtml);
    },

    // 4. Render Griglia Principale
    grid: (issues) => {
        const root = document.getElementById('ui-main-root');
        let section = document.getElementById('grid-section');
        if (!section) {
            root.insertAdjacentHTML('beforeend', '<div id="grid-section"></div>');
            section = document.getElementById('grid-section');
        }

        const cardsHtml = issues.map(issue => {
            const style = issue.possesso === 'celo' 
                ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                : 'bg-red-500/20 text-red-500 border-red-500/30';
            return UI.ISSUE_CARD(issue, style);
        }).join('');

        section.innerHTML = UI.MAIN_GRID_CONTAINER(cardsHtml);
    },

    // 5. Modale
    modalDetails: (issue, stories) => {
        const modalBody = document.getElementById('modal-body');
        const storiesHtml = stories.map(s => {
            const charsHtml = (s.personaggi || []).map(c => UI.CHARACTER_TAG(c)).join('');
            return UI.STORY_ROW(s, s.info_collegamento, charsHtml);
        }).join('');
        modalBody.innerHTML = UI.MODAL_LAYOUT(issue, storiesHtml);
    }
};
import { renderHeader } from './components/header.js';
import { renderSearchEditor } from './components/search-editor.js';
import { renderSeriesSelector } from './components/series-selector.js';
import { renderGrid } from './components/grid.js';
import { openIssueModal } from './modals/issue-modal.js';

const app = document.getElementById('app');

async function init() {
    // 1. Iniezione Atomica dello Scheletro (Tutto in una volta)
    app.innerHTML = `
        <header id="header-container"></header>
        <section id="search-editor-container"></section>
        <section id="series-selector-container"></section>
        <main id="grid-container"></main>
        <div id="modal-container"></div> 
    `;

    // 2. Registrazione Eventi Globali (Blindati)
    window.addEventListener('comiczoo:open-modal', (e) => {
        openIssueModal(e.detail);
    });

    // 3. Montaggio componenti
    renderHeader();
    await renderSearchEditor();
    await renderSeriesSelector();
    await renderGrid();
}

init();
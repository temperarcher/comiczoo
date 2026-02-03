import { renderHeader } from './components/header.js';
import { renderSearchEditor } from './components/search-editor.js';
import { renderSeriesSelector } from './components/series-selector.js';
import { renderGrid } from './components/grid.js';

const app = document.getElementById('app');

async function init() {
    app.innerHTML = `
        <header id="header"></header>
        <section id="search-editor"></section>
        <section id="series-selector"></section>
        <main id="grid-container" class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2"></main>
    `;

    renderHeader();
    renderSearchEditor();
    renderSeriesSelector();
    renderGrid(); // Caricamento iniziale
}

init();
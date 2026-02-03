import { renderHeader } from './components/header.js';
import { renderSearchEditor } from './components/search-editor.js';
import { renderSeriesSelector } from './components/series-selector.js';

const app = document.getElementById('app');

async function init() {
    // Costruzione dinamica dello scheletro
    app.innerHTML = `
        <header id="header-container"></header>
        <section id="search-editor-container"></section>
        <section id="series-selector-container"></section>
        <main id="grid-container" class="container mx-auto p-6"></main>
    `;

    // Montaggio Atomi
    renderHeader();
    await renderSearchEditor();
    await renderSeriesSelector();
    
    console.log('COMICZOO: Pipeline filtri completata.');
}

init();
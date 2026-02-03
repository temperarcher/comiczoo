import { renderHeader } from './components/header.js';
import { renderSearchEditor } from './components/search-editor.js';
import { renderSeriesSelector } from './components/series-selector.js';
import { renderGrid } from './components/grid.js';

const app = document.getElementById('app');

async function init() {
    app.innerHTML = `
        <header id="header-container"></header>
        <section id="search-editor-container"></section>
        <section id="series-selector-container"></section>
        <main id="grid-container"></main>
    `;

    renderHeader();
    await renderSearchEditor();
    await renderSeriesSelector();
    await renderGrid(); // Inizialmente carica tutto
    
    console.log('COMICZOO: Interfaccia completa caricata.');
}

init();
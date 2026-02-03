import { renderHeader } from './components/header.js';

const app = document.getElementById('app');

async function init() {
    // 1. Costruzione atomica del layout base
    app.innerHTML = `
        <header id="header-container"></header>
        <section id="search-editor-container"></section>
        <section id="series-selector-container"></section>
        <main id="grid-container" class="container mx-auto p-6"></main>
        <div id="modal-container"></div>
    `;

    // 2. Iniezione dell'atomo Header
    renderHeader();
    
    console.log('COMICZOO: Layout e Header inizializzati.');
}

init();
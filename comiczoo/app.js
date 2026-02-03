import { renderHeader } from './components/header.js';
import { renderSearchEditor } from './components/search-editor.js'; // Importa l'atomo

const app = document.getElementById('app');

async function init() {
    app.innerHTML = `
        <header id="header-container"></header>
        <section id="search-editor-container"></section>
        <section id="series-selector-container"></section>
        <main id="grid-container" class="container mx-auto p-6"></main>
    `;

    // Caricamento sequenziale degli atomi
    renderHeader();
    await renderSearchEditor(); // Chiamata asincrona perché legge dal DB
    
    console.log('COMICZOO: Header e SearchEditor pronti.');
}

init();
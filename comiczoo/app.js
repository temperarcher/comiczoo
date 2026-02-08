import { renderHeader } from './components/header.js';
import { renderSearchEditor } from './components/search-editor.js';
import { renderSeriesSelector } from './components/series-selector.js';
import { renderGrid } from './components/grid.js';
import { openIssueModal } from './modals/issue-modal.js';
// Importiamo il cervello dell'editing
import { initEditSystem } from './core/edit-handler.js'; 

const app = document.getElementById('app');

async function init() {
    // 1. Iniezione Atomica dello Scheletro
    app.innerHTML = `
        <header id="header-container"></header>
        <section id="search-editor-container"></section>
        <section id="series-selector-container"></section>
        <main id="grid-container"></main>
        <div id="modal-container"></div> 
    `;

    // 2. Registrazione Eventi Globali (Blindati)
    
    // Gestione apertura Modale
    window.addEventListener('comiczoo:open-modal', (e) => {
        openIssueModal(e.detail);
    });

    // Inizializzazione Sistema di Editing (Hybrid)
    initEditSystem();

    // 3. Montaggio componenti
    // Carichiamo prima l'interfaccia statica
    renderHeader();
    await renderSearchEditor();
    
    // Poi i dati dinamici
    await renderSeriesSelector();
    await renderGrid();
}

init();
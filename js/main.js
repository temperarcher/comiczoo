/**
 * VERSION: 1.1.1
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { Render } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    Render.initLayout();

    // DATI DI TEST PER FORZARE LA COMPARSA DELLA SEZIONE
    const testData = [
        { id: '1', nome: 'ALP', immagine_url: 'https://i.imgur.com/kxXO0Oh.jpg' },
        { id: '2', nome: 'BCM', immagine_url: 'https://i.imgur.com/PY1VsKj.jpg' }
    ];
    
    Render.publishers(testData);

    console.log("Sistema Inizializzato - Versione 1.1.1");
});
/**
 * VERSION: 8.4.0
 
 */
import { render } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Monta lo scheletro grafico
    render.initLayout();
    
    // 2. Carica i dati negli showcase
    await render.refreshShowcases();
});
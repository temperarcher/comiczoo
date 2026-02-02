/**
 * VERSION: 1.0.0
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE.
 * QUESTO FILE INIZIALIZZA L'APPLICAZIONE DOPO IL CARICAMENTO DEL DOM.
 */
import { Layout } from './ui/layout.js';

async function bootstrap() {
    // Avvia la costruzione dello scheletro dell'applicazione
    Layout.assemble();
}

// Attende che il DOM sia pronto prima di iniettare la struttura
document.addEventListener('DOMContentLoaded', bootstrap);
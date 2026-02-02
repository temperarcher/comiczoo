/**
 * VERSION: 1.1.0
 * PROTOCOLLO DI INTEGRITÀ: VIETATA LA SEMPLIFICAZIONE.
 */
import { Layout } from './ui/layout-engine.js';
import { Api } from './logic/api-orchestrator.js';
import { State } from './logic/state.js';

async function bootstrap() {
    // 1. Inizializza il DOM (Crea i container vuoti)
    Layout.init();

    // 2. Carica i dati necessari all'avvio
    try {
        const [series, publishers] = await Promise.all([
            Api.Series.getAll(),
            Api.Publishers.getAll()
        ]);

        State.allSeries = series;
        State.allPublishers = publishers;

        // 3. Renderizza i componenti base
        Layout.renderPublishers(State.allPublishers);
        Layout.renderSeries(State.allSeries);
        
    } catch (error) {
        console.error("Bootstrap Failure:", error);
    }
}

document.addEventListener('DOMContentLoaded', bootstrap);
/**
 * VERSION: 1.0.1
 * PROTOCOLLO DI INTEGRITÀ: VIETATA LA SEMPLIFICAZIONE.
 */
import { Layout } from './ui/layout-engine.js';
import { Api } from './logic/api-orchestrator.js';
import { State } from './logic/state.js';

async function bootstrap() {
    // 1. Costruisce l'HTML di base nel body
    Layout.buildBaseStructure();

    // 2. Recupera i dati iniziali
    const [series, publishers] = await Promise.all([
        Api.Series.getAll(),
        Api.Publishers.getAll()
    ]);

    // 3. Popola lo stato
    State.allSeries = series;
    State.allPublishers = publishers;

    // 4. Renderizza i componenti iniziali
    Layout.renderPublishers(publishers);
    Layout.renderSeries(series);
}

document.addEventListener('DOMContentLoaded', bootstrap);
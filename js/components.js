/**
 * VERSION: 8.3.1
 * SCOPO: Logica di preparazione dati per UI.js
 */
import { store } from './store.js';
import { UI } from './ui.js';

export const components = {
    publisherPill(pub) {
        return UI.PUBLISHER_PILL({
            id: pub.id,
            nome: pub.nome,
            immagine_url: pub.immagine_url || store.config.placeholders.logo
        }, store.state.selectedBrand == pub.id);
    },

    serieShowcaseItem(serie) {
        return UI.SERIE_ITEM({
            id: serie.id,
            nome: serie.nome,
            immagine_url: serie.immagine_url || store.config.placeholders.cover
        });
    },

    issueCard(issue) {
        const badgeStyle = store.config.badgeColors[issue.possesso] || '';
        return UI.ISSUE_CARD({
            id: issue.id,
            nome: issue.nome || 'Senza Titolo',
            numero: issue.numero,
            immagine_url: issue.immagine_url || store.config.placeholders.cover,
            testata: issue.testata?.nome || '',
            annata: issue.annata?.nome || '',
            possesso: issue.possesso?.toUpperCase() || ''
        }, badgeStyle);
    },

    storyItem(si) {
        // Estrazione sicura dei personaggi
        const personaggiRel = si.storia?.personaggio_storia || [];
        const charsHtml = personaggiRel.map(p => UI.CHARACTER_TAG({
            nome: p.personaggio?.nome || '',
            immagine_url: p.personaggio?.immagine_url || store.config.placeholders.avatar
        })).join('');

        return UI.STORY_ROW(si.storia || { nome: 'Senza Titolo' }, si, charsHtml);
    },

    renderModalContent(issue) {
        // 1. Genera l'HTML delle storie usando la funzione interna storyItem
        const storiesHtml = (issue.storia_in_issue || [])
            .sort((a, b) => a.posizione - b.posizione)
            .map(si => this.storyItem(si))
            .join('') || '<p class="text-slate-600 text-xs italic p-4">Nessun dettaglio storie presente.</p>';

        // 2. Prepara i dati piatti per il layout del modale
        const data = {
            nome: issue.nome || 'Senza Titolo',
            numero: issue.numero || 'N/D',
            immagine_url: issue.immagine_url || store.config.placeholders.cover,
            condizione: issue.condizione || 'N/D',
            valore: issue.valore || '0',
            testata: issue.testata?.nome || '',
            annata: issue.annata?.nome || '',
            brand_logo: issue.editore?.codice_editore?.immagine_url || ''
        };

        return UI.MODAL_LAYOUT(data, storiesHtml);
    }
};
/**
 * VERSION: 8.3.3
 * SCOPO: Preparazione dati per UI.js - FIX EXPORT
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
        if (!si || !si.storia) return '';
        const personaggiRel = si.storia.personaggio_storia || [];
        const charsHtml = personaggiRel.map(p => UI.CHARACTER_TAG({
            nome: p.personaggio?.nome || 'Ignoto',
            immagine_url: p.personaggio?.immagine_url || store.config.placeholders.avatar
        })).join('');

        return UI.STORY_ROW(si.storia, si, charsHtml);
    },

    // QUESTA È LA FUNZIONE CHE MANCAVA O NON VENIVA RILEVATA
    renderModalContent(issue) {
        const storiesHtml = (issue.storia_in_issue || [])
            .sort((a, b) => a.posizione - b.posizione)
            .map(si => this.storyItem(si))
            .join('') || '<p class="text-slate-500 text-xs italic p-4">Nessun dettaglio storie presente.</p>';

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
/**
 * VERSION: 8.3.0 (IA-Friendly Logic)
 * FILE: js/components.js
 * SCOPO: Estrarre i dati e invocare i template UI.
 */
import { store } from './store.js';
import { UI } from './ui.js';

export const components = {
    publisherPill(pub) {
        const isActive = store.state.selectedBrand == pub.id;
        const data = {
            id: pub.id,
            nome: pub.nome,
            immagine_url: pub.immagine_url || store.config.placeholders.logo
        };
        return UI.PUBLISHER_PILL(data, isActive);
    },

    serieShowcaseItem(serie) {
        const data = {
            id: serie.id,
            nome: serie.nome,
            immagine_url: serie.immagine_url || store.config.placeholders.cover
        };
        return UI.SERIE_ITEM(data);
    },

    issueCard(issue) {
        const data = {
            id: issue.id,
            nome: issue.nome || 'Senza Titolo',
            numero: issue.numero,
            immagine_url: issue.immagine_url || store.config.placeholders.cover,
            testata: issue.testata?.nome || '',
            annata: issue.annata?.nome || '',
            possesso: issue.possesso?.toUpperCase() || ''
        };
        const badgeStyle = store.config.badgeColors[issue.possesso] || '';
        return UI.ISSUE_CARD(data, badgeStyle);
    },

    storyItem(si) {
        const storia = si.storia;
        const personaggiRel = storia?.personaggio_storia || [];
        
        const charsHtml = personaggiRel.map(p => UI.CHARACTER_TAG({
            nome: p.personaggio?.nome || '',
            immagine_url: p.personaggio?.immagine_url || store.config.placeholders.avatar
        })).join('');

        return UI.STORY_ROW(storia, si, charsHtml);
    }
};
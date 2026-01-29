/**
 * VERSION: 1.3.6
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { sections } from './ui/layout/sections.js';
import { header } from './ui/layout/header.js';
import { publishers } from './ui/layout/publishers.js';
import { series } from './ui/layout/series.js';
import { issues } from './ui/layout/issues.js';
import { modal } from './ui/layout/modal.js';

export const UI = {
    ROOTS: sections,
    HEADER: header,
    PUBLISHER_SECTION: publishers.SECTION,
    PUBLISHER_PILL: publishers.PILL,
    ALL_PUBLISHERS_BUTTON: publishers.ALL_BUTTON,
    SERIES_SECTION: series.SECTION,
    SERIES_CARD: series.CARD,
    ISSUES_SECTION: issues.SECTION,
    ISSUES_CARD: issues.CARD,
    STARS: issues.STARS, 
    MODAL_WRAPPER: modal.WRAPPER,
    MODAL_LEFT_COL: modal.LEFT_COL,
    MODAL_RIGHT_COL: modal.RIGHT_COL,
    MODAL_STORY_ITEM: modal.STORY_ITEM,
    MODAL_DETAIL_ROW: modal.DETAIL_ROW,
    MODAL_CLOSE: (e) => {
        if(e) e.stopPropagation();
        const modalRoot = document.getElementById('modal-root');
        if(modalRoot) modalRoot.remove();
    }
};
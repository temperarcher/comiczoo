/**
 * VERSION: 1.1.9
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { sections } from './ui/layout/sections.js';
import { header } from './ui/layout/header.js';
import { publishers } from './ui/layout/publishers.js';
import { series } from './ui/layout/series.js';
import { issues } from './ui/layout/issues.js';

export const UI = {
    ROOTS: sections,
    HEADER: header,
    PUBLISHER_SECTION: publishers.SECTION,
    PUBLISHER_PILL: publishers.PILL,
    ALL_PUBLISHERS_BUTTON: publishers.ALL_BUTTON,
    SERIES_SECTION: series.SECTION,
    SERIES_CARD: series.CARD,
    // Registrazione atomi Issues per l'HUB
    ISSUES_SECTION: issues.SECTION,
    ISSUES_CARD: issues.CARD
};
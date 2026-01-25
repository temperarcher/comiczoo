/**
 * VERSION: 1.0.0  
 */
import { header } from './ui/layout/header.js';
import { publishers } from './ui/layout/publishers.js';
import { series } from './ui/layout/series.js';
import { sections } from './ui/layout/sections.js'; // Nuovo
import { container } from './ui/grid/container.js';
import { card } from './ui/grid/card.js';
import { base } from './ui/modal/base.js';
import { stories } from './ui/modal/stories.js';
import { form } from './ui/modal/form.js';

export const UI = {
    HEADER: header,
    ROOTS: sections, // Aggiunto
    PUBLISHER_SECTION: publishers.SECTION,
    PUBLISHER_PILL: publishers.PILL,
    ALL_PUBLISHERS_BUTTON: publishers.ALL_BUTTON,
    SERIE_SECTION: series.SECTION,
    SERIE_ITEM: series.ITEM,
    MAIN_GRID_CONTAINER: container,
    ISSUE_CARD: card,
    MODAL_WRAPPER: base.WRAPPER,
    MODAL_LAYOUT: base.LAYOUT,
    ISSUE_FORM: form,
    STORY_ROW: stories.ROW,
    CHARACTER_TAG: stories.CHARACTER
};
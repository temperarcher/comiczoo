/**
 * VERSION: 1.4.8
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { sections } from './ui/layout/sections.js';
import { header } from './ui/layout/header.js';
import { publishers } from './ui/layout/publishers.js';
import { series } from './ui/layout/series.js';
import { issues } from './ui/layout/issues.js';
import { modal } from './ui/layout/modal.js';
import { form } from './ui/layout/form.js';

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
        if (e && e.stopPropagation) e.stopPropagation();
        const m = document.getElementById('modal-root');
        if (m) m.innerHTML = '';
    },
    // ATOMI FORM
    MODAL_FORM_WRAPPER: form.WRAPPER,
    MODAL_FORM_FIELD: form.FIELD_GROUP,
    MODAL_FORM_INPUT: form.INPUT,
    MODAL_FORM_SELECT: form.SELECT,
    MODAL_FORM_PREVIEW: form.PREVIEW,
    MODAL_FORM_STORY_ROW: form.STORY_ROW,
    MODAL_FORM_STARS: form.STARS_PICKER,

    SET_FORM_STARS: (rating) => {
        const input = document.getElementById('f-condizione');
        if (input) input.value = rating === 0 ? "" : rating;
        
        document.querySelectorAll('[data-star]').forEach(star => {
            const val = parseInt(star.getAttribute('data-star'));
            if (val <= rating && rating > 0) {
                star.classList.remove('text-slate-800', 'text-slate-600');
                star.classList.add('text-yellow-500');
            } else {
                star.classList.remove('text-yellow-500');
                star.classList.add('text-slate-800');
            }
        });
    },

    UPDATE_PREVIEW: (url) => {
        const img = document.getElementById('form-preview-img');
        const placeholder = document.getElementById('preview-placeholder');
        if (img && placeholder) {
            if (url) {
                img.src = url;
                img.classList.remove('hidden');
                placeholder.classList.add('hidden');
            } else {
                img.classList.add('hidden');
                placeholder.classList.remove('hidden');
            }
        }
    },

    HANDLE_POSSESSO_CHANGE: (val) => {
        const starsContainer = document.getElementById('stars-picker-container');
        if (starsContainer) {
            if (val === 'manca') {
                starsContainer.classList.add('pointer-events-none', 'opacity-20', 'grayscale');
                UI.SET_FORM_STARS(0);
            } else {
                starsContainer.classList.remove('pointer-events-none', 'opacity-20', 'grayscale');
                UI.SET_FORM_STARS(5);
            }
        }
    }
};
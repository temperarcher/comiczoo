/**
 * VERSION: 1.4.1
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const modal = {
    // ATOMO: Gestione pulsanti d'azione
    ACTIONS: (issueId) => `
        <div class="absolute top-4 right-4 flex gap-2">
            <button onclick="Logic.openEditForm('${issueId}')" class="bg-slate-800/80 hover:bg-yellow-500 hover:text-black text-white p-2 rounded-lg transition-all shadow-lg border border-slate-700" title="Modifica Albo">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
            </button>
            <button id="modal-close-btn" onclick="UI.MODAL_CLOSE(event)" class="bg-slate-800/80 hover:bg-red-600 text-white p-2 rounded-lg transition-all shadow-lg border border-slate-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>`,

    // ATOMO: Immagine copertina con proporzioni bloccate (2/3)
    COVER: (url) => `
        <div class="aspect-[2/3] w-full rounded-lg overflow-hidden border border-slate-800 shadow-2xl shrink-0">
            <img src="${url}" class="w-full h-full object-cover">
        </div>`,

    WRAPPER: (content, issueId) => `
        <style>
            .modal-scroll-dark { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
            .modal-scroll-dark::-webkit-scrollbar { width: 6px; }
            .modal-scroll-dark::-webkit-scrollbar-track { background: #0f172a; }
            .modal-scroll-dark::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
        </style>
        <div id="modal-overlay" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onclick="UI.MODAL_CLOSE(event)">
            <div class="relative bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row" onclick="event.stopPropagation()">
                ${content}
                ${modal.ACTIONS(issueId)}
            </div>
        </div>`,

    LEFT_COL: (issue, storiesHtml) => `
        <div class="w-full md:w-2/5 bg-slate-950 p-6 flex flex-col gap-6 border-r border-slate-800 overflow-y-auto modal-scroll-dark">
            ${modal.COVER(issue.immagine_url)}
            <div>
                <h3 class="text-[10px] font-black uppercase text-yellow-500 tracking-[0.2em] mb-4">Indice Storie</h3>
                <div class="flex flex-col gap-3">
                    ${storiesHtml}
                </div>
            </div>
        </div>`,

    RIGHT_COL: (header, rowsHtml) => `
        <div class="w-full md:w-3/5 p-8 bg-slate-900 flex flex-col overflow-y-auto modal-scroll-dark">
            <div class="mb-8 border-b border-slate-800 pb-6">
                <h2 class="text-2xl font-black text-white leading-tight uppercase tracking-tight">${header.titolo}</h2>
                <p class="text-yellow-500 font-bold text-lg mt-1">${header.infoUscita}</p>
                ${header.infoSupplemento ? `<p class="text-slate-500 text-[11px] mt-2 italic uppercase tracking-wider">Supplemento a: ${header.infoSupplemento}</p>` : ''}
            </div>
            <div class="flex flex-col gap-6">
                ${rowsHtml}
            </div>
        </div>`,

    STORY_ITEM: (story) => `
        <div class="flex gap-3 items-start group">
            <span class="text-slate-700 font-mono text-[10px] mt-1">${story.posizione.toString().padStart(2, '0')}</span>
            <div class="flex flex-col gap-2 flex-grow">
                <span class="text-slate-200 text-xs font-bold leading-tight group-hover:text-yellow-500 transition-colors">${story.nome}</span>
                <div class="flex -space-x-2">
                    ${story.personaggi.map(p => `
                        <div class="w-6 h-6 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-800" title="${p.nome}">
                            <img src="${p.immagine_url}" class="w-full h-full object-cover">
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`,

    DETAIL_ROW: (label, value, img = null, subValue = null) => `
        <div class="flex items-center gap-4">
            ${img ? `
                <div class="h-12 w-12 bg-white rounded flex items-center justify-center p-1 flex-shrink-0">
                    <img src="${img}" class="max-w-full max-h-full object-contain">
                </div>
            ` : ''}
            <div class="flex flex-col flex-grow">
                <div class="flex justify-between items-end mb-1">
                    <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest">${label}</span>
                    ${subValue ? `<div class="text-right">${subValue}</div>` : ''}
                </div>
                <div class="text-white font-medium">${value}</div>
            </div>
        </div>`
};
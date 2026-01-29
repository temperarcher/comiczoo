/**
 * VERSION: 1.3.6
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const modal = {
    WRAPPER: (content) => `
        <style>
            .modal-scroll-dark { scrollbar-width: thin; scrollbar-color: #334155 #0f172a; }
            .modal-scroll-dark::-webkit-scrollbar { width: 6px; }
            .modal-scroll-dark::-webkit-scrollbar-track { background: #0f172a; }
            .modal-scroll-dark::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
        </style>
        <div id="modal-overlay" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onclick="UI.MODAL_CLOSE(event)">
            <div class="relative bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row" onclick="event.stopPropagation()">
                ${content}
                <button id="modal-close-btn" onclick="UI.MODAL_CLOSE(null)" class="absolute top-4 right-4 text-slate-400 hover:text-white text-4xl z-[110] leading-none">&times;</button>
            </div>
        </div>`,

    LEFT_COL: (issue, storiesHtml) => `
        <div class="w-full md:w-2/5 p-6 border-r border-slate-800 overflow-y-auto bg-slate-950 modal-scroll-dark">
            <img src="${issue.immagine_url}" class="w-full aspect-[2/3] object-cover rounded shadow-2xl mb-6 border border-slate-800" alt="Copertina">
            <div class="space-y-4">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 italic">Sommario Storie</h3>
                <div class="flex flex-col gap-2">
                    ${storiesHtml}
                </div>
            </div>
        </div>`,

    STORY_ITEM: (storia) => `
        <div class="p-3 bg-slate-900 rounded border border-slate-800">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[9px] font-mono text-slate-500">POS. ${storia.posizione}</span>
                <span class="text-xs font-bold text-slate-300">${storia.nome}</span>
            </div>
            <div class="flex -space-x-2">
                ${storia.personaggi.map(p => `
                    <img src="${p.immagine_url}" title="${p.nome}" class="h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover bg-slate-800">
                `).join('')}
            </div>
        </div>`,

    RIGHT_COL: (header, rowsHtml) => `
        <div id="modal-right-col" class="w-full md:w-3/5 p-8 overflow-y-auto bg-slate-900 flex flex-col modal-scroll-dark">
            <div class="mb-8 border-b border-slate-800 pb-6">
                <h2 class="text-2xl font-black text-white leading-tight uppercase tracking-tight">${header.titolo}</h2>
                <p class="text-yellow-500 font-bold text-lg mt-1">${header.infoUscita}</p>
                ${header.infoSupplemento ? `<p class="text-slate-500 text-[11px] mt-2 italic uppercase tracking-wider">Supplemento a: ${header.infoSupplemento}</p>` : ''}
            </div>
            <div class="flex flex-col gap-6">
                ${rowsHtml}
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
                <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">${label}</span>
                <div class="flex justify-between items-end">
                    <div class="text-slate-200 font-semibold text-lg leading-none">${value || 'N/D'}</div>
                    ${subValue ? `<div class="ml-4 flex flex-col items-end">${subValue}</div>` : ''}
                </div>
            </div>
        </div>`
};
/**
 * VERSION: 1.2.1
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const modal = {
    WRAPPER: (content) => `
        <style>
            #modal-right-col::-webkit-scrollbar { width: 6px; }
            #modal-right-col::-webkit-scrollbar-track { background: #0f172a; }
            #modal-right-col::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            #modal-right-col::-webkit-scrollbar-thumb:hover { background: #475569; }
        </style>
        <div id="modal-overlay" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onclick="UI.MODAL_CLOSE(event)">
            <div class="relative bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row" onclick="event.stopPropagation()">
                ${content}
                <button onclick="UI.MODAL_CLOSE(null)" class="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl z-20 bg-slate-800/50 w-10 h-10 rounded-full">&times;</button>
            </div>
        </div>`,

    LEFT_COL: (issue, storiesHtml) => `
        <div class="w-full md:w-2/5 p-6 border-r border-slate-800 overflow-y-auto bg-slate-900">
            <img src="${issue.immagine_url}" class="w-full aspect-[2/3] object-cover rounded shadow-lg border border-slate-700 mb-6" alt="Copertina">
            <div class="space-y-4">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-yellow-500 border-b border-slate-800 pb-2 italic">Sommario Storie</h3>
                <div class="flex flex-col gap-3">
                    ${storiesHtml}
                </div>
            </div>
        </div>`,

    STORY_ITEM: (storia) => `
        <div class="flex flex-col gap-2 p-3 bg-slate-800/40 rounded border border-slate-700/50">
            <div class="flex justify-between items-start gap-2">
                <span class="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">POS. ${storia.posizione}</span>
                <span class="text-xs font-bold text-slate-200 flex-grow">${storia.nome}</span>
            </div>
            <div class="flex -space-x-2 overflow-hidden py-1">
                ${storia.personaggi.map(p => `
                    <img src="${p.immagine_url}" title="${p.nome}" class="inline-block h-7 w-7 rounded-full ring-2 ring-slate-800 object-cover bg-slate-700">
                `).join('')}
            </div>
        </div>`,

    RIGHT_COL: (rowsHtml) => `
        <div id="modal-right-col" class="w-full md:w-3/5 p-8 overflow-y-auto flex flex-col gap-4 bg-gradient-to-br from-slate-900 to-slate-800/50">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Dettagli Tecnici</h3>
            ${rowsHtml}
        </div>`,

    DETAIL_ROW: (label, value, img = null, subValue = null) => `
        <div class="group flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/60 transition-colors">
            ${img ? `
                <div class="h-12 w-12 flex-shrink-0 bg-white rounded-md p-1.5 shadow-inner">
                    <img src="${img}" class="w-full h-full object-contain">
                </div>
            ` : ''}
            <div class="flex flex-col flex-grow">
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">${label}</span>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-100 font-bold">${value || 'N/D'}</span>
                    ${subValue ? `<div class="ml-auto">${subValue}</div>` : ''}
                </div>
            </div>
        </div>`
};
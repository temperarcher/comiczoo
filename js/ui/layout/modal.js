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
            <button onclick="UI.MODAL_CLOSE()" class="bg-slate-800/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all shadow-lg border border-slate-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>`,

    WRAPPER: (content) => `
        <div id="modal-overlay" class="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-0 md:p-6" onclick="UI.MODAL_CLOSE(event)">
            <div id="modal-container" class="bg-slate-900 w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] md:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300" onclick="event.stopPropagation()">
                ${content}
            </div>
        </div>`,

    LEFT_COL: (img, isManca) => `
        <div class="w-full md:w-1/2 h-[40vh] md:h-[70vh] relative bg-slate-800 group">
            <img src="${img}" class="w-full h-full object-cover ${isManca ? 'grayscale opacity-50' : ''}">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
        </div>`,

    RIGHT_COL: (content) => `
        <div class="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto custom-scrollbar flex flex-col gap-8 bg-slate-900/50 backdrop-blur-xl">
            ${content}
        </div>`,

    STORY_ITEM: (story) => {
        const pos = String(story.posizione).padStart(2, '0');
        return `
        <div class="flex items-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 group hover:bg-slate-800 transition-all">
            <span class="text-lg font-black text-slate-600 group-hover:text-yellow-500/50 transition-colors">${pos}</span>
            <div class="flex flex-col gap-2 flex-grow">
                <span class="text-slate-200 text-xs font-bold leading-tight group-hover:text-yellow-500 transition-colors">${story.nome}</span>
                <div class="flex -space-x-2">
                    ${(story.personaggi || []).map(p => `
                        <div class="w-6 h-6 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-800" title="${p.nome}">
                            <img src="${p.immagine_url}" class="w-full h-full object-cover">
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    },

    DETAIL_ROW: (label, value, img = null, subValue = null) => `
        <div class="flex items-center gap-4">
            ${img ? `
                <div class="h-12 w-12 bg-white rounded flex items-center justify-center p-1 flex-shrink-0">
                    <img src="${img}" class="max-w-full max-h-full object-contain">
                </div>
            ` : ''}
            <div class="flex flex-col flex-grow">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest">${label}</span>
                    ${subValue ? `<div class="flex gap-1">${subValue}</div>` : ''}
                </div>
                <span class="text-sm font-bold text-slate-200">${value || '---'}</span>
            </div>
        </div>`
};
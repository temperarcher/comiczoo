/**
 * VERSION: 1.2.0
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const modal = {
    // Struttura portante del modale
    WRAPPER: (content) => `
        <div id="modal-overlay" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onclick="UI.MODAL_CLOSE(event)">
            <div class="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row" onclick="event.stopPropagation()">
                ${content}
                <button onclick="UI.MODAL_CLOSE(null)" class="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
        </div>`,

    // Colonna Sinistra: Immagine e Storie
    LEFT_COL: (issue, stories) => `
        <div class="w-full md:w-2/5 p-6 border-r border-slate-800 overflow-y-auto">
            <img src="${issue.immagine_url}" class="w-full aspect-[2/3] object-cover rounded shadow-lg border border-slate-700 mb-6" alt="Copertina">
            <div class="space-y-4">
                <h3 class="text-xs font-black uppercase tracking-widest text-yellow-500 border-b border-slate-800 pb-2">Sommario Storie</h3>
                ${stories}
            </div>
        </div>`,

    // Atomo Storia singola
    STORY_ITEM: (storia) => `
        <div class="flex flex-col gap-2 p-2 bg-slate-800/50 rounded border border-slate-700">
            <div class="flex justify-between items-start">
                <span class="text-[10px] font-mono text-slate-500">POS. ${storia.posizione}</span>
                <span class="text-xs font-bold text-slate-200">${storia.nome}</span>
            </div>
            <div class="flex -space-x-2 overflow-hidden">
                ${storia.personaggi.map(p => `
                    <img src="${p.immagine_url}" title="${p.nome}" class="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800 object-cover bg-slate-700">
                `).join('')}
            </div>
        </div>`,

    // Colonna Destra: Info Dettagliate
    RIGHT_COL: (rows) => `
        <div class="w-full md:w-3/5 p-8 overflow-y-auto flex flex-col gap-6 bg-slate-900/50">
            ${rows}
        </div>`,

    // Riga Dettaglio
    DETAIL_ROW: (label, value, img = null) => `
        <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black uppercase tracking-tighter text-slate-500">${label}</span>
            <div class="flex items-center gap-3">
                ${img ? `<img src="${img}" class="h-8 w-8 rounded bg-white p-0.5 object-contain">` : ''}
                <span class="text-sm text-slate-100 font-medium">${value || '---'}</span>
            </div>
        </div>`
};
/**
 * VERSION: 1.4.1
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const form = {
    WRAPPER: (title, content) => `
        <div id="modal-overlay" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onclick="UI.MODAL_CLOSE(event)">
            <div class="relative bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-xl shadow-2xl flex flex-col" onclick="event.stopPropagation()">
                <div class="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 class="text-xl font-black text-white uppercase tracking-tight">${title}</h2>
                    <button onclick="UI.MODAL_CLOSE()" class="text-slate-500 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto modal-scroll-dark">
                    <form id="issue-form" onsubmit="return false;">
                        ${content}
                    </form>
                </div>
                <div class="p-6 border-t border-slate-800 flex justify-end gap-3">
                    <button onclick="UI.MODAL_CLOSE()" class="px-6 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold uppercase text-xs hover:bg-slate-700">Annulla</button>
                    <button id="save-issue-btn" class="px-6 py-2 rounded-lg bg-yellow-500 text-black font-black uppercase text-xs hover:bg-yellow-400 shadow-lg">Salva Albo</button>
                </div>
            </div>
        </div>`,

    FIELD_GROUP: (label, input) => `
        <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest">${label}</label>
            ${input}
        </div>`,

    SELECT: (id, options, selectedId = '') => `
        <select id="${id}" class="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 outline-none transition-all">
            <option value="">Seleziona...</option>
            ${options.map(o => `<option value="${o.id}" ${o.id === selectedId ? 'selected' : ''}>${o.nome}</option>`).join('')}
        </select>`,

    INPUT: (id, type, value = '', placeholder = '', oninput = '') => `
        <input type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" oninput="${oninput}" class="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 outline-none transition-all">`,

    PREVIEW: (url) => `
        <div class="aspect-[2/3] w-full bg-slate-950 rounded-lg border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
            <img id="form-preview-img" src="${url || ''}" class="w-full h-full object-cover ${!url ? 'hidden' : ''}">
            ${!url ? '<span id="preview-placeholder" class="text-slate-700 font-black uppercase text-[10px] tracking-widest">Nessuna Immagine</span>' : ''}
        </div>`
};
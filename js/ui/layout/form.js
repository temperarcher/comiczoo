/**
 * VERSION: 1.4.8
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const form = {
    WRAPPER: (title, content) => `
        <div id="modal-overlay" class="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onclick="UI.MODAL_CLOSE(event)">
            <div class="relative bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-xl shadow-2xl flex flex-col" onclick="event.stopPropagation()">
                <div class="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h2 class="text-xl font-black text-white uppercase tracking-tight">${title}</h2>
                    <button onclick="UI.MODAL_CLOSE()" class="text-slate-500 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-8 modal-scroll-dark bg-slate-900/30">
                    ${content}
                </div>
                <div class="p-6 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-4">
                    <button onclick="UI.MODAL_CLOSE()" class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Annulla</button>
                    <button id="save-issue-btn" class="px-8 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-yellow-500/10 transition-all transform active:scale-95">Salva Albo</button>
                </div>
            </div>
        </div>`,

    FIELD_GROUP: (label, input) => `
        <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">${label}</label>
            ${input}
        </div>`,

    SELECT: (id, options, selectedId = '', onchange = '') => `
        <select id="${id}" onchange="${onchange}" class="bg-slate-800/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 outline-none transition-all appearance-none cursor-pointer">
            <option value="">Seleziona...</option>
            ${options.map(o => `<option value="${o.id}" ${o.id === selectedId ? 'selected' : ''}>${o.nome}</option>`).join('')}
        </select>`,

    INPUT: (id, type, value = '', placeholder = '', oninput = '') => `
        <input type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" oninput="${oninput}" class="bg-slate-800/50 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 outline-none transition-all">`,

    PREVIEW: (url) => `
        <div class="aspect-[2/3] w-full bg-slate-950 rounded-lg border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group relative">
            <img id="form-preview-img" src="${url || ''}" class="w-full h-full object-cover ${!url ? 'hidden' : ''}">
            <div id="preview-placeholder" class="flex flex-col items-center gap-2 ${url ? 'hidden' : ''}">
                <svg class="w-12 h-12 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span class="text-slate-700 font-black uppercase text-[10px] tracking-widest">Anteprima Copertina</span>
            </div>
        </div>`,

    STORY_ROW: (pos, nome) => `
        <div class="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group">
            <span class="text-[10px] font-black text-slate-500 bg-slate-900 w-6 h-6 flex items-center justify-center rounded border border-slate-800">${pos}</span>
            <span class="text-xs font-bold text-slate-300 group-hover:text-yellow-500 transition-colors truncate">${nome}</span>
        </div>`,

    STARS_PICKER: (val) => {
        const rating = val || 0;
        return `
        <div id="stars-picker-container" class="flex gap-1.5 mt-1 items-center">
            <input type="hidden" id="f-condizione" value="${rating}">
            ${[1, 2, 3, 4, 5].map(i => `
                <svg onclick="UI.SET_FORM_STARS(${i})" 
                     data-star="${i}"
                     class="w-8 h-8 cursor-pointer transition-all transform hover:scale-110 ${i <= rating ? 'text-yellow-500' : 'text-slate-800 hover:text-slate-600'}" 
                     fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
            `).join('')}
        </div>`;
    }
};
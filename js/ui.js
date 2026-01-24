/**
 * VERSION: 7.4.1 (RIGID BASE - NO MODIFICATION TO LEVELS 1-3)
 * NOTA: I livelli 1, 2 e 3 sono una copia esatta del file sorgente fornito dall'utente.
 * AGGIORNAMENTO: Solo Livelli 5 e 6 per gestione Brand e Storie.
 */
export const UI = {
    // LIVELLO 1: HEADER (COPIA INTEGRALE - BLOCCATO)
    HEADER: () => `
        <header class="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-50 shadow-2xl">
            <div class="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
                <h1 id="logo-reset" class="text-3xl font-black text-yellow-500 tracking-tighter uppercase italic cursor-pointer select-none shrink-0">Comic Archive</h1>
                <div class="flex flex-col md:flex-row w-full gap-4 items-center">
                    <div class="relative w-full">
                        <input type="text" id="serie-search" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-full pl-12 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="Cerca una serie...">
                        <span class="absolute left-4 top-3.5 opacity-40">🔍</span>
                    </div>
                    <div class="flex gap-3 items-center shrink-0">
                        <button id="btn-add-albo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-6 py-3 rounded-full uppercase text-xs tracking-widest transition-all shadow-lg shadow-yellow-500/20 active:scale-95">Aggiungi Albo</button>
                    </div>
                </div>
            </div>
        </header>`,

    // LIVELLO 2: EDITORIE (COPIA INTEGRALE - BLOCCATO)
    PUBLISHER_SECTION: (content) => `
        <div class="bg-slate-800/50 border-b border-slate-700/50 py-4 overflow-x-auto no-scrollbar">
            <div id="ui-publisher-bar" class="container mx-auto flex gap-3 px-6 items-center">
                ${content}
            </div>
        </div>`,

    PUBLISHER_PILL: (pub, active) => `
        <button data-brand-id="${pub.id}" class="flex-none flex items-center gap-3 px-4 py-2 rounded-full border transition-all shrink-0 ${active ? 'bg-yellow-500 border-yellow-500 text-slate-900 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}">
            <img src="${pub.immagine_url}" class="w-5 h-5 object-contain rounded-sm">
            <span class="text-xs uppercase tracking-wider">${pub.nome}</span>
        </button>`,

    ALL_PUBLISHERS_BUTTON: (active) => `
        <button id="reset-brand-filter" class="px-5 py-2 rounded-full border text-xs uppercase font-bold tracking-widest transition-all shrink-0 ${active ? 'bg-white border-white text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}">Tutti</button>`,

    // LIVELLO 3: SERIE (COPIA INTEGRALE - BLOCCATO)
    SERIE_SECTION: (content) => `
        <div class="container mx-auto px-6 py-8">
            <h2 class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Le tue Serie</h2>
            <div id="ui-serie-section" class="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                ${content}
            </div>
        </div>`,

    SERIE_ITEM: (serie) => `
        <div data-serie-id="${serie.id}" class="flex-none group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-500/50 transition-all cursor-pointer shadow-lg">
            <img src="${serie.immagine_url}" class="h-40 md:h-48 w-auto object-cover transition-all duration-500 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p class="text-white font-bold text-[10px] uppercase tracking-tighter drop-shadow-md">${serie.nome}</p>
            </div>
        </div>`,

    // LIVELLO 4: MAIN GRID (Invariato per coerenza)
    MAIN_GRID_CONTAINER: () => `
        <div class="container mx-auto px-6 pb-20">
            <div class="flex items-center gap-4 mb-8">
                <div class="h-px flex-1 bg-slate-800"></div>
                <div class="flex gap-2">
                    <button data-filter="all" class="filter-btn bg-yellow-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20">Tutti</button>
                    <button data-filter="celo" class="filter-btn text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Celo</button>
                    <button data-filter="manca" class="filter-btn text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Manca</button>
                </div>
            </div>
            <div id="main-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"></div>
        </div>`,

    ISSUE_CARD: (issue, badgeStyle) => `
        <div data-id="${issue.id}" class="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-yellow-500/50 transition-all cursor-pointer shadow-xl">
            <div class="relative aspect-[3/4] overflow-hidden">
                <img src="${issue.immagine_url}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-700">
                <div class="absolute top-3 right-3">
                    <span class="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border backdrop-blur-md ${badgeStyle}">${issue.possesso}</span>
                </div>
            </div>
            <div class="p-4">
                <div class="flex flex-col gap-1">
                    <span class="text-yellow-500 font-black text-[10px] uppercase tracking-widest">${issue.testata}</span>
                    <h3 class="text-white font-bold text-sm truncate uppercase leading-tight">${issue.nome}</h3>
                    <div class="flex justify-between items-center mt-2 pt-2 border-t border-slate-700/50">
                        <span class="text-slate-500 font-bold text-xs italic">Anno ${issue.annata}</span>
                        <span class="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-black">#${issue.numero}</span>
                    </div>
                </div>
            </div>
        </div>`,

    // LIVELLO 5: MODALE DETTAGLI (Aggiornato per visualizzare Storie)
    MODAL_WRAPPER: () => `
        <div id="issue-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
            <div id="modal-body" class="w-full max-w-5xl my-auto"></div>
        </div>`,

    MODAL_LAYOUT: (data, storiesHtml) => `
        <div class="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative">
            <button id="close-modal" class="absolute top-6 right-6 z-10 w-10 h-10 bg-slate-950/50 hover:bg-yellow-500 hover:text-slate-900 text-white rounded-full transition-all flex items-center justify-center font-bold">✕</button>
            <div class="grid grid-cols-1 lg:grid-cols-12">
                <div class="lg:col-span-4 relative aspect-[3/4] lg:aspect-auto">
                    <img src="${data.immagine_url}" class="w-full h-full object-cover shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>
                <div class="lg:col-span-8 p-8 lg:p-12">
                    <div class="mb-6">
                        <span class="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-yellow-500/20">${data.testata}</span>
                        <h2 class="text-4xl font-black text-white leading-none uppercase tracking-tighter">${data.nome}</h2>
                        <p class="text-slate-400 mt-2 font-bold italic">Edizione ${data.annata} - Albo #${data.numero}</p>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Condizione</span>
                            <span class="text-white font-bold">${data.condizione}</span>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Valore</span>
                            <span class="text-yellow-500 font-black">€ ${data.valore}</span>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Stato</span>
                            <span class="text-white font-bold uppercase text-xs">${data.possesso}</span>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-3">
                            Contenuto Albo <span class="h-px flex-1 bg-slate-800"></span>
                        </h3>
                        <div class="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            ${storiesHtml}
                        </div>
                    </div>
                    <div class="mt-10 pt-8 border-t border-slate-800 flex gap-4">
                        <button id="edit-this-issue" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-widest transition-all">Modifica Albo</button>
                    </div>
                </div>
            </div>
        </div>`,

    // LIVELLO 6: FORM (Aggiornato per gestione Codici Editore)
    ISSUE_FORM: (issue, dropdowns) => `
        <div class="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden max-w-4xl w-full">
            <form id="form-albo" class="p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                <input type="hidden" name="id" value="${issue.id || ''}">
                <div class="md:col-span-4">
                    <div class="aspect-[3/4] bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 overflow-hidden relative mb-4">
                        <img id="preview-cover" src="${issue.immagine_url || ''}" class="w-full h-full object-cover ${issue.immagine_url ? '' : 'hidden'}">
                    </div>
                    <label class="text-[10px] font-black text-slate-500 uppercase">URL Immagine</label>
                    <input type="text" name="immagine_url" id="input-cover-url" value="${issue.immagine_url || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-xs">
                </div>
                <div class="md:col-span-8 grid grid-cols-2 gap-4">
                    <div class="col-span-full">
                        <label class="text-[10px] font-black text-slate-500 uppercase">Titolo</label>
                        <input type="text" name="nome" value="${issue.nome || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white" required>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase">Brand (Codice Editore)</label>
                        <select name="codice_editore_id" id="select-codice-editore" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white appearance-none">
                            <option value="">Seleziona Brand...</option>
                            ${dropdowns.codici.map(c => `<option value="${c.id}" ${issue.codice_editore_id == c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase">Serie</label>
                        <select name="serie_id" id="select-serie" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white" required>
                            <option value="">Seleziona Serie...</option>
                            ${dropdowns.serie.map(s => `<option value="${s.id}" ${issue.serie_id == s.id ? 'selected' : ''}>${s.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase">Numero</label>
                        <input type="text" name="numero" value="${issue.numero || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase">Valore (€)</label>
                        <input type="number" step="0.01" name="valore" value="${issue.valore || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                    </div>
                    <div class="col-span-full flex gap-4 pt-4 border-t border-slate-800">
                        <button type="submit" class="flex-1 bg-yellow-500 text-slate-900 font-black py-4 rounded-xl uppercase text-xs">Salva Albo</button>
                        <button type="button" id="cancel-form" class="px-8 bg-slate-700 text-white font-bold rounded-xl uppercase text-xs">Annulla</button>
                    </div>
                </div>
            </form>
        </div>`,

    STORY_ROW: (storia, si, charsHtml) => `
        <div class="py-3 border-l-2 border-yellow-600 pl-4 mb-3 bg-slate-800/30 rounded-r-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[9px] text-yellow-600 font-bold uppercase">Pos. ${si.posizione}</span>
                <h4 class="text-white font-bold flex-1 ml-3 text-sm">${storia.nome}</h4>
            </div>
            <div class="flex wrap gap-1.5">${charsHtml}</div>
        </div>`,

    CHARACTER_TAG: (char) => `
        <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded-md">
            <img src="${char.immagine_url}" class="w-4 h-4 rounded-full object-cover">
            <span class="text-[9px] text-slate-300 font-bold uppercase truncate max-w-[80px]">${char.nome}</span>
        </div>`
};
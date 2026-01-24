/**
 * VERSION: 1.8.6  (Integrale - Fix Attributo Immagine Editore)
 * NOTA: Non rimuovere i commenti identificativi delle sezioni.
 */
export const UI = {
    // LIVELLO 1: HEADER (Invariato)
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

    // LIVELLO 2: SHOWCASE (Invariato)
    PUBLISHER_SECTION: (content) => `
        <div class="bg-slate-800/50 border-b border-slate-700/50 py-4 overflow-x-auto no-scrollbar">
            <div id="ui-publisher-bar" class="container mx-auto flex gap-3 px-6 items-center">
                ${content}
            </div>
        </div>`,

    PUBLISHER_PILL: (pub, active) => `
        <button data-brand-id="${pub.id}" class="flex items-center gap-3 px-4 py-2 rounded-full border transition-all shrink-0 ${active ? 'bg-yellow-500 border-yellow-500 text-slate-900 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}">
            <img src="${pub.immagine_url}" class="w-5 h-5 object-contain rounded-sm">
            <span class="text-xs uppercase tracking-wider">${pub.nome}</span>
        </button>`,

    ALL_PUBLISHERS_BUTTON: (active) => `
        <button id="reset-brand-filter" class="px-5 py-2 rounded-full border text-xs uppercase font-bold tracking-widest transition-all shrink-0 ${active ? 'bg-white border-white text-slate-900' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}">Tutti</button>`,

    SERIE_SECTION: (content) => `
        <div class="container mx-auto px-6 py-8">
            <h2 class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Le tue Serie</h2>
            <div id="ui-serie-section" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                ${content}
            </div>
        </div>`,

    SERIE_ITEM: (serie) => `
        <div data-serie-id="${serie.id}" class="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-500/50 transition-all cursor-pointer aspect-[3/4] shadow-lg">
            <img src="${serie.immagine_url}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-3 w-full">
                <p class="text-white font-bold text-xs leading-tight uppercase tracking-tighter drop-shadow-md">${serie.nome}</p>
            </div>
        </div>`,

    // LIVELLO 3: GRIGLIA E CARD (Invariato)
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

    // LIVELLO 4: MODALE DETTAGLI (Storie Personaggi)
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
                    <div class="flex items-start justify-between mb-6">
                        <div>
                            <span class="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-yellow-500/20">${data.testata}</span>
                            <h2 class="text-4xl font-black text-white leading-none uppercase tracking-tighter">${data.nome}</h2>
                            <p class="text-slate-400 mt-2 font-bold italic">Edizione ${data.annata} - Albo #${data.numero}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Condizione</span>
                            <span class="text-white font-bold">${data.condizione}</span>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Valore</span>
                            <span class="text-yellow-500 font-black">€ ${data.valore || '0.00'}</span>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Stato</span>
                            <span class="text-white font-bold uppercase text-xs">${data.possesso}</span>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">ID DB</span>
                            <span class="text-slate-500 font-mono text-[10px]">#${data.id}</span>
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

    // LIVELLO 5: FORM DI EDIT/ADD (Completo)
    ISSUE_FORM: (issue, dropdowns) => `
        <div class="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
            <div class="bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
                <h2 class="text-xl font-black text-white uppercase tracking-tighter">${issue.id ? 'Modifica' : 'Nuovo'} Albo</h2>
            </div>
            <form id="form-albo" class="p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                <input type="hidden" name="id" value="${issue.id || ''}">
                <div class="md:col-span-4 space-y-4">
                    <div class="aspect-[3/4] bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 overflow-hidden relative group">
                        <img id="preview-cover" src="${issue.immagine_url || ''}" class="w-full h-full object-cover ${issue.immagine_url ? '' : 'hidden'}">
                        <div id="cover-placeholder" class="absolute inset-0 flex flex-col items-center justify-center text-slate-700 ${issue.immagine_url ? 'hidden' : ''}">
                            <span class="text-4xl mb-2">🖼️</span>
                            <span class="text-[10px] font-black uppercase tracking-widest">Anteprima Cover</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">URL Immagine Cover</label>
                        <input type="text" name="immagine_url" id="input-cover-url" value="${issue.immagine_url || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500 transition-all shadow-inner" placeholder="https://...">
                    </div>
                </div>

                <div class="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="col-span-full">
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Titolo Albo</label>
                        <input type="text" name="nome" value="${issue.nome || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500 transition-all" required>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Brand</label>
                        <select name="codice_editore_id" id="select-codice-editore" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500 appearance-none">
                            <option value="">Seleziona Brand...</option>
                            ${dropdowns.codici.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                        </select>
                    </div>

                    <div class="relative">
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2 italic">Editore Nome (Logo)</label>
                        <div class="flex gap-3 items-center">
                            <div class="w-12 h-12 bg-slate-950 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                <img id="preview-editore-logo" src="" class="w-full h-full object-contain hidden">
                                <span id="placeholder-editore-logo" class="text-xs">?</span>
                            </div>
                            <select name="editore_id" id="select-editore-name" class="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500 appearance-none">
                                <option value="">Seleziona Editore...</option>
                                ${dropdowns.editori.map(e => `<option value="${e.id}" data-parent="${e.codice_editore_id}" data-img="${e.immagine_url}">${e.nome}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="col-span-full h-px bg-slate-800 my-2"></div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Serie</label>
                        <select name="serie_id" id="select-serie" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500" required>
                            <option value="">Seleziona Serie...</option>
                            ${dropdowns.serie.map(s => `<option value="${s.id}">${s.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Numero</label>
                        <input type="text" name="numero" value="${issue.numero || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500">
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Annata (Auto)</label>
                        <select name="annata_id" id="select-annata" class="w-full bg-slate-700 border border-slate-700 p-3 rounded-xl text-sm text-slate-400 outline-none cursor-not-allowed" disabled>
                            <option value="">Automatico...</option>
                            ${dropdowns.annate.map(a => `<option value="${a.id}" data-parent="${a.serie_id}">${a.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Testata (Auto)</label>
                        <select name="testata_id" id="select-testata" class="w-full bg-slate-700 border border-slate-700 p-3 rounded-xl text-sm text-slate-400 outline-none cursor-not-allowed" disabled>
                            <option value="">Automatico...</option>
                            ${dropdowns.testate.map(t => `<option value="${t.id}" data-parent="${t.serie_id}">${t.nome}</option>`).join('')}
                        </select>
                    </div>

                    <div class="col-span-full h-px bg-slate-800 my-2"></div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2 italic">Supplemento (Opzionale)</label>
                        <select name="supplemento_id" id="select-supplemento" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500">
                            <option value="">Nessuno</option>
                            ${dropdowns.supplementi.map(s => `<option value="${s.id}" data-parent="${s.codice_editore_id}">${s.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Condizione (1-5)</label>
                        <div id="condizione-wrapper">
                            <input type="number" name="condizione" value="${issue.condizione || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Valore (€)</label>
                        <input type="number" step="0.01" name="valore" value="${issue.valore || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none focus:border-yellow-500 shadow-inner">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase mb-2">Possesso</label>
                        <div class="flex gap-2">
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="possesso" value="celo" class="hidden peer" ${issue.possesso === 'celo' ? 'checked' : ''} required>
                                <div class="text-center p-3 rounded-xl border border-slate-700 text-slate-500 peer-checked:bg-green-500/20 peer-checked:border-green-500 peer-checked:text-green-500 font-bold text-xs uppercase transition-all">Celo</div>
                            </label>
                            <label class="flex-1 cursor-pointer">
                                <input type="radio" name="possesso" value="manca" class="hidden peer" ${issue.possesso === 'manca' ? 'checked' : ''}>
                                <div class="text-center p-3 rounded-xl border border-slate-700 text-slate-500 peer-checked:bg-red-500/20 peer-checked:border-red-500 peer-checked:text-red-500 font-bold text-xs uppercase transition-all">Manca</div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="col-span-full flex gap-4 pt-6 border-t border-slate-800">
                    <button type="submit" class="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-yellow-500/20 transition-all">Salva Albo</button>
                    <button type="button" id="cancel-form" class="px-8 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl uppercase text-xs transition-all">Annulla</button>
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
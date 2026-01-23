/**
 * VERSION: 1.8.3 (Integrale - Dipendenza dinamica Codice/Editore + Anteprima da Tabella Editore)
 * NOTA: Non rimuovere i commenti identificativi delle sezioni.
 */
export const UI = {
    // LIVELLO 1: HEADER (v7.4)
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
                        <button id="btn-add-albo" class="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-5 py-2.5 rounded-full uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-yellow-500/20">
                            + Nuovo Albo
                        </button>
                        
                        <div class="flex bg-slate-900 p-1 rounded-full border border-slate-700 mr-1">
                            <button id="view-grid" class="view-btn active px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </button>
                            <button id="view-list" class="view-btn px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>

                        <div class="flex bg-slate-900 p-1 rounded-full border border-slate-700">
                            <button data-filter="all" class="filter-btn active px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all">Tutti</button>
                            <button data-filter="celo" class="filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all text-slate-400">Celo</button>
                            <button data-filter="manca" class="filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all text-slate-400">Manca</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>`,

    // LIVELLO 2: SEZIONE CODICI BAR (v7.5)
    PUBLISHER_SECTION: (contentHtml) => `
        <section class="bg-slate-800/30 border-b border-slate-800 py-3">
            <div class="container mx-auto px-6">
                <div id="codici-bar" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                    ${contentHtml}
                </div>
            </div>
        </section>`,

    PUBLISHER_PILL: (data, isActive) => {
        const activeState = isActive ? 'border-yellow-500 grayscale-0 ring-2 ring-yellow-500/20' : 'border-slate-700 grayscale hover:grayscale-0';
        return `
            <div id="codice-${data.id}" data-brand-id="${data.id}" 
                 class="codice-item flex-none w-14 h-14 md:w-16 md:h-16 bg-slate-800 border ${activeState} rounded-lg overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300">
                 <img src="${data.immagine_url}" alt="${data.nome}" title="${data.nome}" class="w-full h-full object-cover">
            </div>`;
    },

    ALL_PUBLISHERS_BUTTON: (isActive) => {
        const activeClass = isActive ? 'border-yellow-500 bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'border-slate-700 bg-slate-900/40 text-slate-500 hover:text-white hover:border-slate-600';
        return `<div id="reset-brand-filter" class="flex-none w-14 h-14 md:w-16 md:h-16 border ${activeClass} rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer text-[10px] font-black uppercase tracking-tighter">Tutti</div>`;
    },

    // LIVELLO 3: SEZIONE SERIE (v7.5)
    SERIE_SECTION: (contentHtml) => `
        <section class="bg-slate-900/50 border-b border-slate-800 py-4 overflow-hidden">
            <div class="container mx-auto px-6">
                <div id="serie-showcase" class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar items-center">
                    ${contentHtml}
                </div>
            </div>
        </section>`,

    SERIE_ITEM: (serie) => `
        <div class="serie-showcase-item shrink-0 h-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden cursor-pointer shadow-lg relative group" data-serie-id="${serie.id}">
            <div class="h-full">
                <img src="${serie.immagine_url}" title="${serie.nome}" class="h-full w-auto object-contain transition-transform group-hover:scale-105">
            </div>
            <button class="btn-edit-serie absolute top-1 right-1 bg-yellow-500 text-slate-900 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-[10px] z-10" data-edit-id="${serie.id}">
                ✏️
            </button>
        </div>`,

    // CONTENITORI PRINCIPALI
    MAIN_GRID_CONTAINER: () => `
        <main class="max-w-7xl mx-auto p-4 md:p-6">
            <div id="main-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"></div>
        </main>`,

    ISSUE_CARD: (issue, badgeStyle) => `
        <div class="flex flex-col bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-yellow-500 transition-all cursor-pointer" data-id="${issue.id}">
            <img src="${issue.immagine_url}" class="w-full h-auto aspect-[2/3] object-cover" loading="lazy">
            <div class="p-3 flex-1">
                <div class="flex justify-between items-start">
                    <span class="text-[9px] uppercase font-bold text-slate-500">${issue.testata || 'N/D'}</span>
                    <span class="px-2 py-0.5 text-[8px] rounded-full border ${badgeStyle}">${issue.possesso}</span>
                </div>
                <h3 class="font-bold text-yellow-500 text-sm leading-tight mt-1 line-clamp-2">${issue.nome || 'Senza Titolo'}</h3>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-white font-mono">#${issue.numero || '0'}</span>
                    <span class="text-[10px] text-slate-400">${issue.annata || ''}</span>
                </div>
            </div>
        </div>`,

    MODAL_WRAPPER: () => `
        <div id="issue-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div class="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative custom-scrollbar">
                <button id="close-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white z-20 transition-all hover:rotate-90">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div id="modal-body" class="p-6"></div>
            </div>
        </div>`,

    // MODALE VISUALIZZAZIONE
    MODAL_LAYOUT: (issue, storiesHtml) => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <button id="edit-this-issue" data-id="${issue.id}" class="absolute top-0 left-0 bg-yellow-500 text-slate-900 p-2 rounded-full shadow-xl hover:scale-110 transition-transform z-10" title="Modifica Albo">✏️</button>
            <div>
                <img src="${issue.immagine_url}" class="w-full rounded-xl shadow-2xl border border-slate-700">
                <div class="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div class="bg-slate-800/50 p-2 rounded border border-slate-700"><span class="block text-[8px] text-slate-500 uppercase">Condizione</span><span class="text-xs text-white">${issue.condizione || 'N/D'}</span></div>
                    <div class="bg-slate-800/50 p-2 rounded border border-slate-700"><span class="block text-[8px] text-slate-500 uppercase">Valore</span><span class="text-xs text-green-400 font-bold">${issue.valore || '0'} €</span></div>
                </div>
            </div>
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <img src="${issue.brand_logo}" class="h-6 w-auto brightness-200">
                    <span class="text-slate-500 text-[10px] uppercase tracking-tighter">${issue.testata}</span>
                </div>
                <h2 class="text-2xl font-black text-white leading-tight">${issue.nome}</h2>
                <p class="text-yellow-500 font-mono mb-6">#${issue.numero} — ${issue.annata}</p>
                <div class="space-y-2">
                    <h3 class="text-[9px] uppercase font-bold text-slate-500 border-b border-slate-800 pb-1">Sommario Albo</h3>
                    <div class="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">${storiesHtml}</div>
                </div>
            </div>
        </div>`,

    // MODALE EDIT AVANZATO
    ISSUE_FORM: (issue, dropdowns) => `
        <div class="p-2">
            <h2 class="text-xl font-black text-white uppercase mb-6 tracking-tighter flex items-center gap-2">
                ${issue.id ? '✏️ Modifica Albo' : '➕ Nuovo Albo'}
            </h2>
            <form id="form-albo" class="grid grid-cols-1 md:grid-cols-12 gap-8">
                <input type="hidden" name="id" value="${issue.id || ''}">
                
                <div class="md:col-span-4 space-y-4">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase">Immagine Albo</label>
                    <div class="aspect-[2/3] w-full bg-slate-800 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                        <img id="preview-cover" src="${issue.immagine_url || ''}" class="w-full h-full object-cover ${!issue.immagine_url ? 'hidden' : ''}">
                        <div id="placeholder-cover" class="text-slate-600 text-4xl ${issue.immagine_url ? 'hidden' : ''}">🖼️</div>
                    </div>
                    <input type="url" name="immagine_url" id="input-cover-url" value="${issue.immagine_url || ''}" placeholder="URL Immagine" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-[11px] text-white outline-none focus:border-yellow-500">
                </div>

                <div class="md:col-span-8 space-y-4">
                    
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div class="md:col-span-5">
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Codice Editore</label>
                            <select id="select-codice-editore" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                                <option value="">Seleziona...</option>
                                ${dropdowns.codici.map(c => `<option value="${c.id}" ${issue.codice_editore_id === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                            </select>
                        </div>
                        <div class="md:col-span-5">
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Editore</label>
                            <select name="editore_id_linked" id="select-editore-name" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                                <option value="">-- Seleziona Codice --</option>
                                ${dropdowns.editori.map(e => `<option value="${e.id}" data-parent="${e.codice_editore_id}" data-img="${e.immagine_url}" ${issue.codice_editore_id === e.codice_editore_id ? '' : 'class="hidden"'}>${e.nome}</option>`).join('')}
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <div id="preview-editore" class="w-full h-[42px] bg-slate-900 rounded border border-slate-700 flex items-center justify-center overflow-hidden">
                                <img src="${issue.brand_logo || ''}" class="w-full h-full object-contain ${!issue.brand_logo ? 'hidden' : ''}">
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Serie</label>
                        <select name="serie_id" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                            <option value="">Seleziona Serie...</option>
                            ${dropdowns.serie.map(s => `<option value="${s.id}" ${issue.serie_id === s.id ? 'selected' : ''}>${s.nome}</option>`).join('')}
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Numero</label>
                            <input type="text" name="numero" value="${issue.numero || ''}" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Annata</label>
                            <input type="text" name="annata" value="${issue.annata || ''}" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Titolo Albo (Nome)</label>
                        <input type="text" name="nome" value="${issue.nome || ''}" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Testata</label>
                        <select name="testata_id" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                             <option value="">Seleziona Testata...</option>
                             ${dropdowns.testate.map(t => `<option value="${t.id}" ${issue.testata_id === t.id ? 'selected' : ''}>${t.nome}</option>`).join('')}
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data Pubblicazione</label>
                            <input type="text" name="data_pubblicazione" value="${issue.data_pubblicazione || ''}" placeholder="es: Gennaio 1970" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Supplemento</label>
                            <input type="text" name="supplemento" value="${issue.supplemento || ''}" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo Pubblicazione</label>
                        <select name="tipo_pubblicazione_id" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                            <option value="">Seleziona Tipo...</option>
                            ${dropdowns.tipi.map(t => `<option value="${t.id}" ${issue.tipo_pubblicazione_id === t.id ? 'selected' : ''}>${t.nome}</option>`).join('')}
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Valore (€)</label>
                            <input type="number" step="0.01" name="valore" value="${issue.valore || ''}" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white font-mono outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Condizione</label>
                            <select name="condizione" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none">
                                <option value="Ottimo" ${issue.condizione === 'Ottimo' ? 'selected' : ''}>Ottimo</option>
                                <option value="Buono" ${issue.condizione === 'Buono' ? 'selected' : ''}>Buono</option>
                                <option value="Discreto" ${issue.condizione === 'Discreto' ? 'selected' : ''}>Discreto</option>
                                <option value="Scarso" ${issue.condizione === 'Scarso' ? 'selected' : ''}>Scarso</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-2">Stato Possesso</label>
                        <div class="flex bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                            <label class="flex-1 text-center cursor-pointer">
                                <input type="radio" name="possesso" value="celo" class="hidden peer" ${issue.possesso === 'celo' ? 'checked' : ''}>
                                <div class="text-[10px] uppercase font-black py-2 rounded-md peer-checked:bg-green-600 peer-checked:text-white text-slate-500 transition-all">Celo</div>
                            </label>
                            <label class="flex-1 text-center cursor-pointer">
                                <input type="radio" name="possesso" value="manca" class="hidden peer" ${issue.possesso !== 'celo' ? 'checked' : ''}>
                                <div class="text-[10px] uppercase font-black py-2 rounded-md peer-checked:bg-red-600 peer-checked:text-white text-slate-500 transition-all">Manca</div>
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

    // LIVELLO 4: GESTIONE STORIE (v7.0)
    STORY_ROW: (storia, si, charsHtml) => `
        <div class="py-3 border-l-2 border-yellow-600 pl-4 mb-3 bg-slate-800/30 rounded-r-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[9px] text-yellow-600 font-bold uppercase">Pos. ${si.posizione}</span>
                <h4 class="text-white font-bold flex-1 ml-3 text-sm">${storia.nome}</h4>
            </div>
            <div class="flex wrap gap-1.5">${charsHtml}</div>
        </div>`,

    CHARACTER_TAG: (p) => `
        <div class="flex items-center gap-1 bg-slate-950 rounded-full pr-2 border border-slate-800">
            <img src="${p.immagine_url}" class="w-5 h-5 rounded-full object-cover">
            <span class="text-[9px] text-slate-400">${p.nome}</span>
        </div>`
};
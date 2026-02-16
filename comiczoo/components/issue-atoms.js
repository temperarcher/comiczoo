export const UI = {
    // HEADER AGGIORNATO: Ora accetta ID e ha i trigger per l'edit
HEADER: (testataNome, serieNome, testataId, serieId, issueId) => `
    <div class="flex flex-col mb-8" data-issue-id="${issueId || ''}">
        <div class="flex items-center gap-3 group/h h-4">
            <span class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                ${testataNome || 'Testata non definita'}
            </span>
            <button data-field="testata_id" data-id="${testataId || ''}" 
                    onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {field: 'testata_id'}}))" 
                    class="opacity-0 group-hover/h:opacity-100 text-[9px] text-yellow-500 font-bold uppercase transition-opacity">Edit</button>
        </div>
        <div class="flex items-center gap-4 group/s mt-1">
            <h2 class="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                ${serieNome || 'Nuova Serie'}
            </h2>
            <button data-field="serie_id" data-id="${serieId || ''}" 
                    onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {field: 'serie_id'}}))" 
                    class="opacity-0 group-hover/s:opacity-100 text-[9px] text-yellow-500 font-bold uppercase mt-2 transition-opacity">Edit</button>
        </div>
    </div>`,
// Il campo atomizzato: Label, Valore, Azioni Edit/New
    FIELD: (label, value, field, table, codiceId) => `
        <div class="flex flex-col gap-1 border-l-2 border-slate-800 pl-4 py-1 hover:border-yellow-500 transition-colors group">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">${label}</span>
            <div class="flex flex-col">
                <span class="text-[14px] font-bold text-slate-200 truncate">${value || 'NON DEFINITO'}</span>
                <div class="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button data-field="${field}" data-codice="${codiceId || ''}" 
                            onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {table: '${table}', field: '${field}'}}))" 
                            class="text-[9px] font-black text-yellow-500 uppercase tracking-tighter hover:underline">Edit</button>
                    <button onclick="window.dispatchEvent(new CustomEvent('comiczoo:new-record', {detail: {table: '${table}', field: '${field}'}}))"
                            class="text-[9px] font-black text-slate-600 uppercase tracking-tighter hover:text-white">New</button>
                </div>
            </div>
        </div>`,

    // NUOVO ATOMO: Toggle per il possesso (Celo/Manca)
    FIELD_TOGGLE: (label, value, field, issueId) => {
        const isCelo = value === 'celo';
        return `
        <div class="flex flex-col gap-2 border-l-2 border-slate-800 pl-4 py-1 transition-colors">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">${label}</span>
            <div 
                onclick="window.dispatchEvent(new CustomEvent('comiczoo:toggle-possesso', {detail: {field: '${field}', current: '${value}', id: '${issueId}'}}))"
                class="relative w-20 h-6 bg-slate-800 rounded-full cursor-pointer p-1 transition-all duration-300 ${isCelo ? 'bg-green-900/30' : 'bg-red-900/30'}"
            >
                <div class="absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${isCelo ? 'translate-x-14 bg-green-500' : 'bg-red-500'}">
                </div>
                <span class="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase tracking-tighter ${isCelo ? 'pr-6 text-green-500' : 'pl-6 text-red-500'}">
                    ${value}
                </span>
            </div>
        </div>`;
    },

// Nuovo Atomo: Campo con Thumbnail (per Editore, Serie, ecc.)
FIELD_WITH_ICON: (label, value, field, table, imgUrl, codiceId) => `
    <div class="flex items-center gap-4 group">
        <div class="shrink-0 w-12 h-12 bg-slate-800 border border-slate-700 rounded overflow-hidden flex items-center justify-center p-1 shadow-lg group-hover:border-yellow-500 transition-colors">
            <img src="${imgUrl || ''}" class="w-full h-full object-contain" onerror="this.style.display='none'">
        </div>
        <div class="flex-1" data-codice-container="${codiceId || ''}">
            ${UI.FIELD(label, value, field, table, codiceId)}
        </div>
    </div>`,
		// Atomo per la Condizione (Stelle Oro/Slate)
    FIELD_RATING: (label, rating, field, table) => {
        const maxStars = 5;
        const starIcon = (filled) => `
            <span class="${filled ? 'text-yellow-500' : 'text-slate-700'} text-sm">
                ★
            </span>`;
        
        let starsHtml = '';
        for (let i = 1; i <= maxStars; i++) {
            starsHtml += starIcon(i <= rating);
        }

        return `
            <div class="flex flex-col gap-1 border-l-2 border-slate-800 pl-4 py-1 hover:border-yellow-500 transition-colors group">
                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">${label}</span>
                <div class="flex flex-col">
                    <div class="flex items-center gap-0.5 h-[21px]"> ${starsHtml}
                        <span class="text-[10px] font-bold text-slate-500 ml-2 italic">${rating}/5</span>
                    </div>
                    <div class="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {table: '${table}', field: '${field}'}}))" 
                                class="text-[9px] font-black text-yellow-500 uppercase tracking-tighter hover:underline">Edit</button>
                    </div>
                </div>
            </div>`;
    },
    // L'atomo della storia (che era sparito)
    STORY_ITEM: (s) => `
        <div class="group bg-slate-800/40 border border-slate-800 p-4 rounded flex justify-between items-center transition-all hover:border-slate-700">
            <div>
                <div class="text-[11px] font-black text-slate-200 uppercase tracking-tight">${s.storia_nome}</div>
                <div class="text-[10px] text-slate-500 italic mt-0.5">${s.personaggi ? s.personaggi.join(' • ') : 'Nessun personaggio'}</div>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-[9px] font-black text-yellow-500 uppercase">Edit</button>
                <button class="text-[9px] font-black text-red-500 uppercase">Delete</button>
            </div>
        </div>`,
    // Atomo per la scelta dei campi relazionali (Overlay)
    SELECTOR_OVERLAY: (title, options, onSelect) => {
        // Genera la lista delle opzioni con gestione sicura dei nomi nulli
        const itemsHtml = options.map(opt => {
            const safeLabel = (opt.display_label || opt.nome || '').replace(/'/g, "\\'");
            const displayTitle = opt.display_label || opt.nome || `ALBO #${opt.id.substring(0,4)}`;

            return `
                <div onclick="window.dispatchEvent(new CustomEvent('comiczoo:apply-edit', {detail: {id: '${opt.id}', label: '${safeLabel}'}}))"
                     class="flex items-center gap-4 p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 group/opt transition-all">
                    ${opt.immagine_url ? `<img src="${opt.immagine_url}" class="w-8 h-8 object-contain bg-slate-900 p-1 rounded">` : ''}
                    <span class="text-[11px] font-bold text-slate-300 group-hover/opt:text-yellow-500 uppercase tracking-wider">${displayTitle}</span>
                </div>
            `;
        }).join('');

        return `
            <div id="selector-overlay" class="absolute inset-0 bg-slate-900/95 z-[110] flex flex-col p-12 backdrop-blur-sm animate-in fade-in duration-200">
                <div class="flex justify-between items-center mb-8">
                    <h3 class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">${title}</h3>
                    <button onclick="document.getElementById('selector-overlay').remove()" class="text-slate-500 hover:text-white text-3xl font-light">&times;</button>
                </div>
                
                <input type="text" placeholder="Cerca..." 
                       class="bg-slate-950 border border-slate-800 p-4 mb-6 text-white text-xs uppercase tracking-widest focus:border-yellow-500 outline-none transition-all"
                       onkeyup="const val = this.value.toLowerCase(); document.querySelectorAll('.group\\/opt').forEach(el => el.style.display = el.innerText.toLowerCase().includes(val) ? 'flex' : 'none')">

                <div class="flex-1 overflow-y-auto custom-scrollbar border border-slate-800 bg-slate-950/50 rounded">
                    ${itemsHtml || '<div class="p-8 text-center text-[10px] text-slate-600 uppercase">Nessuna opzione trovata</div>'}
                </div>
            </div>`;
    },

    // MODALE PER CREAZIONE NUOVA SERIE
    MODAL_NEW_SERIE: () => `
        <div id="submodal-backdrop" class="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden shadow-yellow-500/10">
                <div class="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                    <h3 class="text-xl font-black text-white uppercase tracking-tighter italic">Crea Nuova Serie</h3>
                    <button onclick="document.getElementById('submodal-container').innerHTML=''" class="text-slate-500 hover:text-white text-3xl font-light">&times;</button>
                </div>
                
                <div class="p-6 space-y-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome Serie</label>
                        <input type="text" id="new-serie-nome" class="w-full bg-slate-950 border border-slate-800 p-3 rounded text-white focus:ring-1 focus:ring-yellow-500 outline-none transition-all" placeholder="Esempio: Topolino">
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">URL Immagine Copertina</label>
                        <input type="text" id="new-serie-url" 
                            oninput="document.getElementById('preview-new-serie').src = this.value" 
                            class="w-full bg-slate-950 border border-slate-800 p-3 rounded text-white focus:ring-1 focus:ring-yellow-500 outline-none transition-all" 
                            placeholder="https://...">
                    </div>

                    <div class="flex flex-col items-center gap-2">
                        <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Anteprima</span>
                        <div class="w-32 h-44 bg-slate-950 border border-slate-800 rounded flex items-center justify-center overflow-hidden shadow-inner">
                            <img id="preview-new-serie" src="https://placehold.co/400x600/0f172a/e2e8f0?text=Preview" 
                                 class="w-full h-full object-contain" 
                                 onerror="this.src='https://placehold.co/400x600/0f172a/e2e8f0?text=No+Image'">
                        </div>
                    </div>

                    <button id="btn-save-new-serie" class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase py-4 rounded transition-all shadow-lg text-xs tracking-[0.2em] mt-2">
                        Salva Serie
                    </button>
                </div>
            </div>
        </div>`
};
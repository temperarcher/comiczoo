export const UI = {
    // Header: Testata (piccola) sopra, Serie (grande) sotto
    HEADER: (testata, serie) => `
        <div class="flex flex-col mb-8">
            <span class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">${testata || 'TESTATA NON DEFINITA'}</span>
            <h2 class="text-4xl font-black text-white italic uppercase tracking-tighter leading-[0.8]">${serie || 'SERIE'}</h2>
        </div>`,

    // Il campo atomizzato: Label, Valore, Azioni Edit/New
    FIELD: (label, value, field, table) => `
        <div class="flex flex-col gap-1 border-l-2 border-slate-800 pl-4 py-1 hover:border-yellow-500 transition-colors group">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">${label}</span>
            <div class="flex flex-col">
                <span class="text-[14px] font-bold text-slate-200 truncate">${value || 'NON DEFINITO'}</span>
                <div class="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {table: '${table}', field: '${field}'}}))" 
                            class="text-[9px] font-black text-yellow-500 uppercase tracking-tighter hover:underline">Edit</button>
                    <button class="text-[9px] font-black text-slate-600 uppercase tracking-tighter hover:text-white">New</button>
                </div>
            </div>
        </div>`,
// Nuovo Atomo: Campo con Thumbnail (per Editore, Serie, ecc.)
    FIELD_WITH_ICON: (label, value, field, table, imgUrl) => `
        <div class="flex items-center gap-4 group">
            <div class="shrink-0 w-12 h-12 bg-slate-800 border border-slate-700 rounded overflow-hidden flex items-center justify-center p-1 shadow-lg group-hover:border-yellow-500 transition-colors">
                <img src="${imgUrl || ''}" class="w-full h-full object-contain" onerror="this.style.display='none'">
            </div>
            <div class="flex-1">
                ${UI.FIELD(label, value, field, table)}
            </div>
        </div>`,
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
        </div>`
};
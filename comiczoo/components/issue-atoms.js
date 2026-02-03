export const UI = {
    // Il contenitore del campo: Label sopra, Valore sotto, Azioni in riga separata
    FIELD: (label, value, field, table) => `
        <div class="flex flex-col gap-1 border-l-2 border-slate-800 pl-4 py-1 hover:border-yellow-500 transition-colors group">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">${label}</span>
            <div class="flex flex-col">
                <span class="text-[14px] font-bold text-slate-200 truncate">${value || '---'}</span>
                <div class="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="window.dispatchEvent(new CustomEvent('comiczoo:edit-field', {detail: {table: '${table}', field: '${field}'}}))" 
                            class="text-[9px] font-black text-yellow-500 uppercase tracking-tighter hover:underline">Edit</button>
                    <button class="text-[9px] font-black text-slate-600 uppercase tracking-tighter hover:text-white">New</button>
                </div>
            </div>
        </div>`,

    // L'atomo della storia nella lista contenuti
    STORY_ITEM: (s) => `
        <div class="group bg-slate-800/40 border border-slate-800 p-4 rounded flex justify-between items-center">
            <div>
                <div class="text-[11px] font-black text-slate-200 uppercase">${s.storia_nome}</div>
                <div class="text-[10px] text-slate-500 italic mt-0.5">${s.personaggi ? s.personaggi.join(' • ') : 'Nessun personaggio'}</div>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-[9px] font-black text-yellow-500 uppercase">Edit</button>
                <button class="text-[9px] font-black text-red-500 uppercase">Delete</button>
            </div>
        </div>`
};
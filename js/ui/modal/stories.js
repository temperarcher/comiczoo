/**
 * VERSION: 1.0.0 

 */
export const stories = {
    ROW: (storia, si, charsHtml) => `
        <div class="py-3 border-l-2 border-yellow-600 pl-4 mb-3 bg-slate-800/30 rounded-r-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[9px] text-yellow-600 font-bold uppercase">Pos. ${si.posizione}</span>
                <h4 class="text-white font-bold flex-1 ml-3 text-sm">${storia.nome}</h4>
            </div>
            <div class="flex wrap gap-1.5">${charsHtml}</div>
        </div>`,

    CHARACTER: (char) => `
        <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded-md">
            <img src="${char.immagine_url}" class="w-4 h-4 rounded-full object-cover">
            <span class="text-[9px] text-slate-300 font-bold uppercase truncate max-w-[80px]">${char.nome}</span>
        </div>`
};
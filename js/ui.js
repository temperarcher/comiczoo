/**
 * VERSION: 1.1.0 (Ripristino Estetica v7.4)
 * FILE: js/ui.js
 * MODIFICA: Rimozione testi a vista e larghezza fissa nelle serie.
 */

export const UI = {
    // Template per i Brand: Solo Logo, senza testo
    PUBLISHER_PILL: (data, isActive) => {
        const activeClass = isActive 
            ? 'border-yellow-500 bg-yellow-500/20 ring-1 ring-yellow-500 opacity-100 grayscale-0' 
            : 'border-slate-800 bg-slate-900/50 grayscale opacity-60';
        
        return `
            <div class="flex-none ${activeClass} border rounded-full px-4 py-3 flex items-center justify-center hover:border-yellow-500 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" data-brand-id="${data.id}" title="${data.nome}">
                <img src="${data.immagine_url}" class="h-6 w-auto object-contain">
            </div>`;
    },

    // Template per le Serie: Solo Immagine, larghezza variabile (v7.4 style)
    SERIE_ITEM: (serie) => `
        <div class="flex-none group cursor-pointer" data-serie-id="${serie.id}" title="${serie.nome}">
            <div class="relative overflow-hidden rounded-lg border border-slate-800 group-hover:border-yellow-500 transition-all shadow-lg">
                <img src="${serie.immagine_url}" 
                     class="h-40 md:h-48 w-auto object-cover transition-transform group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p class="text-[8px] font-bold text-white truncate uppercase tracking-widest">${serie.nome}</p>
                </div>
            </div>
        </div>`,

    // Gli altri template (ISSUE_CARD, STORY_ROW, etc.) rimangono invariati per mantenere il consolidamento
    ISSUE_CARD: (issue, badgeStyle) => `
        <div class="flex flex-col bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-yellow-500 transition-all cursor-pointer" data-id="${issue.id}">
            <img src="${issue.immagine_url}" class="w-full h-auto aspect-[2/3] object-cover" loading="lazy">
            <div class="p-3 flex-1">
                <div class="flex justify-between items-start">
                    <span class="text-[9px] uppercase font-bold text-slate-500">${issue.testata}</span>
                    <span class="px-2 py-0.5 text-[8px] rounded-full border ${badgeStyle}">${issue.possesso}</span>
                </div>
                <h3 class="font-bold text-yellow-500 text-sm leading-tight mt-1 line-clamp-2">${issue.nome}</h3>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-white font-mono">#${issue.numero}</span>
                    <span class="text-[10px] text-slate-400">${issue.annata}</span>
                </div>
            </div>
        </div>`,

    CHARACTER_TAG: (p) => `
        <div class="flex items-center gap-1 bg-slate-950 rounded-full pr-2 border border-slate-800">
            <img src="${p.immagine_url}" class="w-5 h-5 rounded-full object-cover">
            <span class="text-[9px] text-slate-400">${p.nome}</span>
        </div>`,

    STORY_ROW: (storia, si, charsHtml) => `
        <div class="py-3 border-l-2 border-yellow-600 pl-4 mb-3 bg-slate-800/30 rounded-r-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[9px] text-yellow-600 font-bold uppercase">Pos. ${si.posizione}</span>
                <h4 class="text-white font-bold flex-1 ml-3 text-sm">${storia.nome}</h4>
            </div>
            <div class="flex wrap gap-1.5">${charsHtml}</div>
        </div>`,

    MODAL_LAYOUT: (issue, storiesHtml) => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <img src="${issue.immagine_url}" class="w-full rounded-xl shadow-2xl border border-slate-700">
                <div class="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div class="bg-slate-800/50 p-2 rounded border border-slate-700">
                        <span class="block text-[8px] text-slate-500 uppercase">Condizione</span>
                        <span class="text-xs text-white">${issue.condizione}</span>
                    </div>
                    <div class="bg-slate-800/50 p-2 rounded border border-slate-700">
                        <span class="block text-[8px] text-slate-500 uppercase">Valore</span>
                        <span class="text-xs text-green-400 font-bold">${issue.valore} €</span>
                    </div>
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
                    <div class="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        ${storiesHtml}
                    </div>
                </div>
            </div>
        </div>`
};
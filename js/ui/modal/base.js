/**
 * VERSION: 1.0.0 

 */
export const base = {
    WRAPPER: () => `
        <div id="issue-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
            <div id="modal-body" class="w-full max-w-5xl my-auto"></div>
        </div>`,
    
    LAYOUT: (data, storiesHtml) => `
        <div class="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative">
            <button id="close-modal" class="absolute top-6 right-6 z-10 w-10 h-10 bg-slate-950/50 hover:bg-yellow-500 hover:text-slate-900 text-white rounded-full flex items-center justify-center font-bold transition-all">✕</button>
            <div class="grid grid-cols-1 lg:grid-cols-12">
                <div class="lg:col-span-4 relative aspect-[3/4] lg:aspect-auto">
                    <img src="${data.immagine_url}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>
                <div class="lg:col-span-8 p-8 lg:p-12">
                    <div class="mb-6">
                        <span class="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-yellow-500/20">${data.testata}</span>
                        <h2 class="text-4xl font-black text-white leading-none uppercase tracking-tighter">${data.nome}</h2>
                        <p class="text-slate-400 mt-2 font-bold italic text-sm">Edizione ${data.annata} - Albo #${data.numero}</p>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mb-10">
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Valore</span>
                            <span class="text-yellow-500 font-black italic">€ ${data.valore}</span>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center">
                            <span class="block text-[9px] font-black text-slate-500 uppercase mb-1">Condizione</span>
                            <span class="text-white font-bold uppercase text-xs">${data.condizione}</span>
                        </div>
                        <div class="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center">
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
                    <button id="edit-this-issue" class="mt-10 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-widest transition-all">Modifica Albo</button>
                </div>
            </div>
        </div>`
};
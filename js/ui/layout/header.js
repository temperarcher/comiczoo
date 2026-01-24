/**
 * VERSION: 1.0.0 

 */
export const header = () => `
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
    </header>`;
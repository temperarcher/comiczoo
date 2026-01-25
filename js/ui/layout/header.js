/**
 * VERSION: 1.0.0
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const header = () => `
    <header class="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-50 shadow-2xl">
        <div class="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
            <h1 class="text-3xl font-black text-yellow-500 tracking-tighter uppercase italic cursor-pointer select-none shrink-0" onclick="resetAllFilters()">Comic Archive</h1>
            
            <div class="flex flex-col md:flex-row w-full gap-4 items-center">
                <div class="relative w-full">
                    <input type="text" id="serie-search" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-full pl-12 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="Cerca una serie...">
                    <span class="absolute left-4 top-3.5 opacity-40">🔍</span>
                    <div id="serie-results" class="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl hidden shadow-2xl max-h-60 overflow-y-auto custom-scrollbar z-50"></div>
                </div>

                <div class="flex gap-3 items-center shrink-0">
                    <button onclick="openAddModal()" class="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-5 py-2.5 rounded-full uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-yellow-500/20">
                        + Nuovo Albo
                    </button>
                    <div class="flex bg-slate-900 p-1 rounded-full border border-slate-700 mr-1">
                        <button onclick="setView('grid')" id="view-grid" class="view-btn active px-3 py-1.5 rounded-full transition-all" title="Vista Griglia">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </button>
                        <button onclick="setView('list')" id="view-list" class="view-btn px-3 py-1.5 rounded-full transition-all" title="Vista Lista">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                    <div class="flex bg-slate-900 p-1 rounded-full border border-slate-700">
                        <button onclick="setFilter('all')" id="btn-all" class="filter-btn active px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all">Tutti</button>
                        <button onclick="setFilter('celo')" id="btn-celo" class="filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all">Celo</button>
                        <button onclick="setFilter('manca')" id="btn-manca" class="filter-btn px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all">Manca</button>
                    </div>
                </div>
            </div>
        </div>
    </header>`;
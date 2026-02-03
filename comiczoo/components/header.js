import { client } from '../core/supabase.js';

export function renderHeader() {
    const headerContainer = document.getElementById('header');

    headerContainer.innerHTML = `
    <header class="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-50 shadow-2xl">
        <div class="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
            <h1 id="logo" class="text-3xl font-black text-yellow-500 tracking-tighter uppercase italic cursor-pointer select-none shrink-0">Comic Archive</h1>
            
            <div class="flex flex-col md:flex-row w-full gap-4 items-center">
                <div class="relative w-full">
                    <input type="text" id="serie-search" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-full pl-12 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="Cerca una serie...">
                    <span class="absolute left-4 top-3.5 opacity-40">🔍</span>
                    <div id="serie-results" class="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl hidden z-[100] max-h-64 overflow-y-auto"></div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                    <button id="btn-new-issue" class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg group">
                        <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        <span class="text-xs font-black uppercase tracking-widest">Nuovo Albo</span>
                    </button>

                    <div class="flex bg-slate-900 p-1 rounded-full border border-slate-700">
                        <button data-view="grid" class="view-btn px-3 py-1.5 rounded-full transition-all bg-yellow-500 text-black shadow-inner">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </button>
                        <button data-view="list" class="view-btn px-3 py-1.5 rounded-full transition-all text-slate-400 hover:text-white">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>`;

    attachHeaderEvents();
}

function attachHeaderEvents() {
    // 1. Reset al click sul logo
    document.getElementById('logo').addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('comiczoo:reset'));
    });

    // 2. Logica di ricerca (Debounced)
    const searchInput = document.getElementById('serie-search');
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length < 2) return hideResults();
        
        const { data } = await client
            .from('serie')
            .select('*')
            .ilike('nome', `%${query}%`)
            .limit(5);
        
        showResults(data);
    });

    // 3. Nuovo Albo
    document.getElementById('btn-new-issue').addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('comiczoo:open-new-form'));
    });

    // 4. Switcher Vista
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            window.dispatchEvent(new CustomEvent('comiczoo:change-view', { detail: view }));
            // Aggiorna UI pulsanti (atomico locale)
            updateViewButtons(e.currentTarget);
        });
    });
}

function showResults(data) {
    const res = document.getElementById('serie-results');
    res.classList.remove('hidden');
    res.innerHTML = data.map(s => `
        <div class="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-0" 
             onclick="window.dispatchEvent(new CustomEvent('comiczoo:filter-serie', {detail: '${s.id}'}))">
            ${s.nome}
        </div>
    `).join('');
}

function hideResults() {
    document.getElementById('serie-results').classList.add('hidden');
}

function updateViewButtons(activeBtn) {
    document.querySelectorAll('.view-btn').forEach(b => {
        b.classList.remove('bg-yellow-500', 'text-black');
        b.classList.add('text-slate-400');
    });
    activeBtn.classList.add('bg-yellow-500', 'text-black');
    activeBtn.classList.remove('text-slate-400');
}
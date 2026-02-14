import { client } from '../core/supabase.js';

export function renderHeader() {
    const container = document.getElementById('header-container');

    container.innerHTML = `
    <header class="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-50 shadow-2xl">
        <div class="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
            <h1 id="logo" class="text-3xl font-black text-yellow-500 tracking-tighter uppercase italic cursor-pointer select-none">Comic Archive</h1>
            
            <div class="flex flex-col md:flex-row w-full gap-4 items-center">
                <div class="relative w-full">
                    <input type="text" id="serie-search" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-full pl-12 focus:ring-2 focus:ring-yellow-500 outline-none transition-all text-white" placeholder="Cerca una serie...">
                    <span class="absolute left-4 top-3.5 opacity-40">🔍</span>
                    <div id="serie-results" class="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl hidden z-[100] max-h-64 overflow-y-auto"></div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                    <button id="btn-new-issue" class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg group">
                        <svg class="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        <span class="text-xs font-black uppercase tracking-widest">Nuovo Albo</span>
                    </button>
                </div>
            </div>
        </div>
    </header>`;

    // Eventi delegati
    document.getElementById('logo').onclick = () => location.reload();

    // CHIRURGICO: Gestione creazione nuovo albo
    document.getElementById('btn-new-issue').onclick = async () => {
        const { data, error } = await client
            .from('issue')
            .insert([{ nome: 'NUOVO ALBO' }])
            .select()
            .single();

        if (!error && data) {
            window.dispatchEvent(new CustomEvent('comiczoo:open-modal', { detail: data.id }));
        } else {
            console.error("Errore creazione albo:", error);
        }
    };
    
    const searchInput = document.getElementById('serie-search');
    const resultsDiv = document.getElementById('serie-results');

    searchInput.oninput = async (e) => {
        const query = e.target.value;
        if (query.length < 2) return resultsDiv.classList.add('hidden');
        
        const { data } = await client.from('serie').select('id, nome').ilike('nome', `%${query}%`).limit(5);
        
        resultsDiv.classList.remove('hidden');
        resultsDiv.innerHTML = data.map(s => `
            <div class="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-0" onclick="window.location.hash = 'serie/${s.id}'">
                <span class="text-white font-bold">${s.nome}</span>
            </div>
        `).join('') || '<div class="p-3 text-slate-500">Nessun risultato</div>';
    };
}
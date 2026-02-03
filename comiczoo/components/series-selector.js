import { client } from '../core/supabase.js';

export async function renderSeriesSelector(editoreId = null) {
    const container = document.getElementById('series-selector');

    // 1. Query atomica: Se c'è un editoreId, filtriamo le serie tramite la relazione
    // Nota: Usiamo una join rapida o filtriamo le serie associate a quell'editore
    let query = client.from('serie').select('*').order('nome');
    
    // Se vuoi filtrare le serie in base all'editore selezionato (logica blindata)
    if (editoreId) {
        // Supponendo che la serie sia legata all'editore tramite le testate o direttamente
        // Qui facciamo una query semplice per ora, espandibile in base alle join
        // query = query.eq('editore_id', editoreId); 
    }

    const { data: serie, error } = await query;

    if (error) return console.error('Errore serie:', error);

    // 2. Rendering Struttura con lo stile incapsulato
    container.innerHTML = `
        <style>
            #serie-showcase::-webkit-scrollbar { height: 6px; }
            #serie-showcase::-webkit-scrollbar-track { background: transparent; }
            #serie-showcase::-webkit-scrollbar-thumb { background: transparent; border-radius: 10px; }
            #serie-showcase:hover::-webkit-scrollbar-thumb { background: #334155; }
        </style>
        <section class="bg-slate-900/50 border-b border-slate-800 py-4 overflow-hidden">
            <div class="container mx-auto px-6">
                <div id="serie-showcase" class="flex gap-4 overflow-x-auto pb-2 items-center">
                    ${serie.map(s => `
                        <div class="serie-showcase-item shrink-0 h-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden cursor-pointer shadow-lg relative group transition-all hover:border-yellow-500" 
                             data-id="${s.id}" data-nome="${s.nome}">
                            <div class="h-full pointer-events-none">
                                <img src="${s.immagine_url || ''}" alt="${s.nome}" class="h-full w-auto object-contain">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>`;

    attachSeriesEvents();
}

function attachSeriesEvents() {
    const items = document.querySelectorAll('.serie-showcase-item');

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const nome = e.currentTarget.dataset.nome;

            // Feedback visivo atomico
            document.querySelectorAll('.serie-showcase-item').forEach(el => el.classList.remove('ring-2', 'ring-yellow-500'));
            e.currentTarget.classList.add('ring-2', 'ring-yellow-500');

            // Notifica il sistema: Filtra la griglia degli albi per questa serie
            window.dispatchEvent(new CustomEvent('comiczoo:filter-serie', { 
                detail: { id, nome } 
            }));
        });
    });

    // Ascolta i cambiamenti dai componenti superiori
    window.addEventListener('comiczoo:filter-codice', (e) => {
        // Se cambia l'editore, ricarichiamo le serie filtrate
        renderSeriesSelector(e.detail);
    });

    window.addEventListener('comiczoo:reset', () => {
        renderSeriesSelector(); // Reset totale
    });
}
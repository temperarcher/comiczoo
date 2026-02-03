import { client } from '../core/supabase.js';

export async function renderSeriesSelector(codiceEditoreId = null) {
    const container = document.getElementById('series-selector-container');

    // 1. Query atomica: Recupero serie filtrate o totali
    let query = client.from('serie').select('*').order('nome');
    
    // Se è stato selezionato un codice editore, filtriamo le serie
    // Nota: assumendo che la tabella serie abbia una relazione o che filtriamo lato DB
    if (codiceEditoreId && codiceEditoreId !== 'all') {
        // Logica di filtro specifica (es. tramite join se necessario)
        // query = query.eq('codice_editore_id', codiceEditoreId); 
    }

    const { data: serie, error } = await query;

    if (error) {
        console.error('Errore caricamento serie:', error);
        return;
    }

    // 2. Struttura Atomizzata con Style incapsulato
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
                        <div class="serie-item shrink-0 h-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden cursor-pointer shadow-lg relative group transition-all hover:border-yellow-500" 
                             data-id="${s.id}" data-nome="${s.nome}">
                            <div class="h-full pointer-events-none">
                                <img src="${s.immagine_url || ''}" alt="${s.nome}" class="h-full w-auto object-contain">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;

    attachSeriesEvents();
}

function attachSeriesEvents() {
    const items = document.querySelectorAll('.serie-item');

    items.forEach(item => {
        item.onclick = (e) => {
            const id = e.currentTarget.dataset.id;
            
            // UI Feedback atomico
            items.forEach(el => el.classList.remove('ring-2', 'ring-yellow-500', 'border-yellow-500'));
            e.currentTarget.classList.add('ring-2', 'ring-yellow-500', 'border-yellow-500');

            // Notifica il sistema del cambio serie
            window.dispatchEvent(new CustomEvent('comiczoo:filter-serie', { detail: id }));
        };
    });

    // Ascolto eventi globali per reattività atomica
    window.addEventListener('comiczoo:filter-codice', (e) => {
        renderSeriesSelector(e.detail);
    });

    window.addEventListener('comiczoo:reset-filters', () => {
        renderSeriesSelector();
    });
}
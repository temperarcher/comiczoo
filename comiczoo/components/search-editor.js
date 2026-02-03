import { client } from '../core/supabase.js';

export async function renderSearchEditor() {
    const container = document.getElementById('search-editor-container');

    // 1. Recupero dati atomico dal DB
    const { data: codici, error } = await client
        .from('codice_editore')
        .select('id, nome, immagine_url')
        .order('nome');

    if (error) {
        console.error('Errore caricamento codici editori:', error);
        return;
    }

    // 2. Definizione del Template Atomizzato
    container.innerHTML = `
        <section class="bg-slate-800/30 border-b border-slate-800 py-3">
            <div class="container mx-auto px-6">
                <div id="codici-bar" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                    
                    <button id="codice-tutti" data-id="all" 
                        class="codice-item active shrink-0 h-9 px-6 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-yellow-500 transition-all hover:bg-slate-700">
                        TUTTI
                    </button>

                    ${codici.map(pub => `
                        <button id="codice-${pub.id}" data-id="${pub.id}" title="${pub.nome}" 
                            class="codice-item shrink-0 w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center p-0 hover:border-yellow-500 transition-all group">
                             <img src="${pub.immagine_url || ''}" alt="${pub.nome}" 
                                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all">
                        </button>
                    `).join('')}

                </div>
            </div>
        </section>
    `;

    attachCodiceEvents();
}

function attachCodiceEvents() {
    const buttons = document.querySelectorAll('.codice-item');

    buttons.forEach(btn => {
        btn.onclick = (e) => {
            const id = e.currentTarget.dataset.id;

            // Logica Visiva Atomica: Gestione dello stato attivo
            buttons.forEach(b => {
                b.classList.remove('active', 'border-yellow-500', 'ring-1', 'ring-yellow-500');
                const img = b.querySelector('img');
                if (img) img.classList.add('grayscale');
            });

            e.currentTarget.classList.add('active', 'border-yellow-500', 'ring-1', 'ring-yellow-500');
            const activeImg = e.currentTarget.querySelector('img');
            if (activeImg) activeImg.classList.remove('grayscale');

            // Logica di Comunicazione: Notifica il sistema
            if (id === 'all') {
                window.dispatchEvent(new CustomEvent('comiczoo:reset-filters'));
            } else {
                window.dispatchEvent(new CustomEvent('comiczoo:filter-codice', { detail: id }));
            }
        };
    });
}
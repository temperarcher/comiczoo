import { client } from '../core/supabase.js';

export async function renderSearchEditor() {
    const container = document.getElementById('search-editor');
    
    // 1. Recupero dati atomico
    const { data: codici, error } = await client
        .from('codice_editore')
        .select('*')
        .order('nome');

    if (error) return console.error('Errore caricamento codici:', error);

    // 2. Rendering Struttura
    container.innerHTML = `
        <section class="bg-slate-800/30 border-b border-slate-800 py-3">
            <div class="container mx-auto px-6">
                <div id="codici-bar" class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                    <button id="codice-tutti" data-id="all" class="codice-item active shrink-0 h-9 px-6 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-yellow-500 transition-all hover:bg-slate-700">
                        TUTTI
                    </button>
                    ${codici.map(pub => `
                        <button id="codice-${pub.id}" data-id="${pub.id}" title="${pub.nome}" class="codice-item shrink-0 w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center p-0 hover:border-yellow-500 transition-all group">
                             <img src="${pub.immagine_url || ''}" alt="${pub.nome}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all">
                        </button>
                    `).join('')}
                </div>
            </div>
        </section>`;

    attachCodiceEvents();
}

function attachCodiceEvents() {
    const buttons = document.querySelectorAll('.codice-item');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;

            // Logica Visiva Blindata (Single Responsibility)
            updateActiveState(e.currentTarget);

            // Logica di Business: Notifica il sistema del cambio filtro
            if (id === 'all') {
                window.dispatchEvent(new CustomEvent('comiczoo:reset-filters'));
            } else {
                window.dispatchEvent(new CustomEvent('comiczoo:filter-codice', { detail: id }));
            }
        });
    });

    // Ascolta se altri componenti resettano i filtri (es. Logo nell'Header)
    window.addEventListener('comiczoo:reset', () => {
        updateActiveState(document.getElementById('codice-tutti'));
    });
}

function updateActiveState(activeElem) {
    document.querySelectorAll('.codice-item').forEach(el => {
        el.classList.remove('active', 'border-yellow-500', 'ring-1', 'ring-yellow-500');
        // Reset opacità immagini se necessario
        const img = el.querySelector('img');
        if (img) img.classList.add('grayscale');
    });

    activeElem.classList.add('active', 'border-yellow-500', 'ring-1', 'ring-yellow-500');
    const activeImg = activeElem.querySelector('img');
    if (activeImg) activeImg.classList.remove('grayscale');
}
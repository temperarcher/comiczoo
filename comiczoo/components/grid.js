import { client } from '../core/supabase.js';
import { openIssueModal } from '../modals/issue-modal.js';

export async function renderGrid(filters = {}) {
    const container = document.getElementById('grid-container');
    container.innerHTML = `<div class="col-span-full py-20 text-center text-slate-500 animate-pulse uppercase tracking-widest text-xs">Caricamento Archivio...</div>`;

    // 1. Query con ordinamento specifico
    let query = client
        .from('v_collezione_profonda')
        .select('*')
        // Ordine per data: ASC (ascendente) e nullsFirst: false (mette i NULL in fondo)
        .order('data_pubblicazione', { ascending: true, nullsFirst: false });

    if (filters.serie_id) query = query.eq('serie_id', filters.serie_id);
    if (filters.codice_editore_id) query = query.eq('codice_editore_id', filters.codice_editore_id);

    const { data: albi, error } = await query;

    if (error) {
        container.innerHTML = `<div class="col-span-full text-red-500 text-xs uppercase p-6 border border-red-900/50 bg-red-950/20 rounded">Errore: ${error.message}</div>`;
        return;
    }

    // 2. Rendering della Sezione Griglia (ricalcando la tua SECTION)
    container.innerHTML = `
        <section class="p-6">
            <div id="issues-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                ${albi.map(albo => renderCard(albo)).join('')}
            </div>
        </section>
    `;

    attachGridEvents();
}

// 3. Funzione interna per ricalcare la tua CARD
function renderCard(albo) {
    const isManca = albo.possesso === 'manca';
    const imgClass = isManca ? 'grayscale opacity-60' : '';
    
    // Costruzione righe di testo come da tua logica
    const row1 = [albo.serie_nome, albo.testata_nome].filter(Boolean).join(' - ');
    const row2 = [albo.annata_nome, albo.numero ? `n°${albo.numero}` : null, albo.issue_nome].filter(Boolean).join(' ');

    return `
        <div class="issue-card flex flex-col gap-1 group cursor-pointer" data-id="${albo.issue_id}">
            <div class="aspect-[2/3] w-full bg-slate-800 rounded overflow-hidden border border-slate-700 shadow-sm transition-transform group-hover:scale-105">
                <img src="${albo.immagine_url || ''}" alt="${albo.issue_nome || 'Copertina'}" 
                     class="w-full h-full object-cover ${imgClass}" loading="lazy">
            </div>
            <div class="flex flex-col text-[10px] leading-tight">
                <span class="text-slate-400 truncate font-medium">${row1}</span>
                <span class="text-slate-200 truncate font-bold">${row2}</span>
                <div class="flex gap-0.5 mt-0.5">${renderStars(albo.condizione)}</div>
            </div>
        </div>`;
}

// 4. Funzione atomica per le stelle (STARS)
function renderStars(val, size = "w-2.5 h-2.5") {
    if (!val) return '';
    let color = 'text-slate-600';
    if (val <= 2) color = 'text-red-500';
    else if (val <= 4) color = 'text-white';
    else if (val === 5) color = 'text-yellow-500';

    return Array(5).fill(0).map((_, i) => `
        <svg class="${size} ${i < val ? color : 'text-slate-800'}" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.303-.921 1.602 0l1.088 3.35a1 1 0 00.95.69h3.523c.969 0 1.371 1.24.588 1.81l-2.85 2.07a1 1 0 00-.364 1.118l1.088 3.35c.3.921-.755 1.688-1.54 1.118l-2.85-2.07a1 1 0 00-1.175 0l-2.85 2.07c-.784.57-1.838-.197-1.539-1.118l1.088-3.35a1 1 0 00-.364-1.118L2.05 8.777c-.783-.57-.38-1.81.588-1.81h3.523a1 1 0 00.95-.69l1.088-3.35z"/>
        </svg>
    `).join('');
}

function attachGridEvents() {
    document.querySelectorAll('.issue-card').forEach(card => {
        card.onclick = () => {
            window.dispatchEvent(new CustomEvent('comiczoo:open-modal', { detail: card.dataset.id }));
        };
    });

    // Reattività ai filtri
    window.addEventListener('comiczoo:filter-serie', (e) => {
        renderGrid({ serie_id: e.detail });
    });

    window.addEventListener('comiczoo:filter-codice', (e) => {
        renderGrid({ codice_editore_id: e.detail });
    });

    window.addEventListener('comiczoo:reset-filters', () => {
        renderGrid();
    });
    window.addEventListener('comiczoo:open-modal', (e) => {
        openIssueModal(e.detail);
    });
}
// CONFIGURAZIONE E ELEMENTI UI
const searchInput = document.getElementById('serie-search');
const resultsDiv = document.getElementById('serie-results');
const grid = document.getElementById('comic-grid');
const statsCount = document.getElementById('stats-count');
const showcase = document.getElementById('serie-showcase');
const codiciBar = document.getElementById('codici-bar');
const placeholderImg = 'https://placehold.co/300x450/1e293b/fbbf24?text=No+Cover';
const placeholderLogo = 'https://placehold.co/200x200/1e293b/fbbf24?text=Codice';
const placeholderAvatar = 'https://placehold.co/100x100/1e293b/fbbf24?text=IMG';

let currentFilter = 'all';
let currentSerieId = null;
let currentSerieFullNome = "";
let currentCodiceId = null;
let currentView = 'grid';
let currentData = [];

const FULL_QUERY = `*, annata(id, nome), serie(id, nome, immagine_url, collana(id, nome)), editore(id, nome), testata(id, nome), tipo_pubblicazione(id, nome), supplemento_a:issue!supplemento_id(id, nome, numero)`;

function getSerieDisplayName(s) {
    if (!s) return "Serie Sconosciuta";
    return s.collana?.nome ? `${s.nome} (${s.collana.nome})` : s.nome;
}

// INIZIALIZZAZIONE
async function init() {
    try {
        await loadCodiciBar();
        await loadSerieShowcase();
        await loadRecent();
    } catch (err) {
        console.error("Errore inizializzazione:", err);
        document.getElementById('view-title').innerText = "Errore Caricamento";
    }
}

// CARICAMENTO DATI
async function loadSerieShowcase() {
    const { data } = await window.supabaseClient.from('serie').select('id, nome, immagine_url, collana(nome)').order('nome').limit(25);
    showcase.innerHTML = (data || []).map(s => `
        <div onclick="selectSerie('${s.id}', '${getSerieDisplayName(s)}')" class="serie-showcase-item shrink-0 w-32 cursor-pointer group">
            <div class="aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700 mb-2 shadow-lg group-hover:border-yellow-500 transition-all">
                <img src="${s.immagine_url || placeholderImg}" class="w-full h-full object-cover">
            </div>
            <p class="text-[9px] font-black text-center uppercase tracking-tighter truncate text-slate-400 group-hover:text-yellow-500">${s.nome}</p>
        </div>
    `).join('');
}

async function loadCodiciBar() {
    const { data } = await window.supabaseClient.from('codice_editore').select('id, nome, immagine_url').order('nome');
    let html = `<button onclick="resetAllFilters()" class="codice-item ${!currentCodiceId ? 'active' : ''} shrink-0 h-12 px-6 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-black uppercase text-yellow-500">TUTTI</button>`;
    html += (data || []).map(cod => `
        <div onclick="selectCodice('${cod.id}')" class="codice-item codice-item-square ${currentCodiceId === cod.id ? 'active' : ''} bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="${cod.immagine_url || placeholderLogo}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all">
        </div>
    `).join('');
    codiciBar.innerHTML = html;
}

async function loadRecent() {
    let query = window.supabaseClient.from('issue').select(FULL_QUERY).order('created_at', { ascending: false }).limit(25);
    if (currentFilter !== 'all') query = query.eq('possesso', currentFilter);
    const { data } = await query;
    renderGrid(data || [], "Ultimi Arrivi", "Le ultime novità inserite");
}

// RENDERING
function renderGrid(data, title, subtitle) {
    currentData = data;
    document.getElementById('view-title').innerText = title;
    document.getElementById('view-subtitle').innerText = subtitle;
    statsCount.innerText = `${data.length} ALBI`;
    
    grid.className = currentView === 'list' ? "list-view-container grid gap-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8";
    
    grid.innerHTML = data.map(comic => `
        <div class="comic-card bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-yellow-500/50 transition-all group cursor-pointer ${currentView === 'list' ? 'list-view-item' : ''}" onclick="openEditModal('${comic.id}')">
            <div class="relative ${currentView === 'list' ? '' : 'aspect-[2/3]'} overflow-hidden bg-slate-900">
                <img src="${comic.immagine_url || placeholderImg}" class="comic-image w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-all">
                <div class="absolute bottom-3 right-3">
                    <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase ${comic.possesso === 'celo' ? 'bg-emerald-500 text-slate-900' : 'bg-red-500 text-white'}">${comic.possesso}</span>
                </div>
            </div>
            <div class="p-4">
                <p class="text-[10px] font-bold text-yellow-500 uppercase truncate">${comic.serie ? getSerieDisplayName(comic.serie) : 'Serie'}</p>
                <h3 class="${currentView === 'list' ? 'text-lg' : 'text-sm'} font-black text-white leading-tight uppercase italic line-clamp-2">${comic.nome || 'Senza Titolo'}</h3>
                <div class="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                    <span class="text-xl font-black text-white italic">#${comic.numero || '0'}</span>
                    <div class="flex gap-1">
                        ${Array(5).fill(0).map((_, i) => `<span class="text-[10px] ${i < (comic.condizione || 0) ? 'text-yellow-500' : 'text-slate-600'}">★</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// FILTRI
async function selectSerie(id, fullNome) {
    currentSerieId = id; currentSerieFullNome = fullNome;
    let query = window.supabaseClient.from('issue').select(FULL_QUERY).eq('serie_id', id).order('numero', { ascending: true });
    if (currentFilter !== 'all') query = query.eq('possesso', currentFilter);
    const { data } = await query;
    renderGrid(data || [], fullNome, "Tutti gli albi della serie");
}

async function selectCodice(id) {
    currentCodiceId = id; currentSerieId = null;
    const { data: serieIds } = await window.supabaseClient.from('serie').select('id').eq('codice_editore_id', id);
    const ids = (serieIds || []).map(s => s.id);
    let query = window.supabaseClient.from('issue').select(FULL_QUERY).in('serie_id', ids).order('created_at', { ascending: false });
    if (currentFilter !== 'all') query = query.eq('possesso', currentFilter);
    const { data } = await query;
    renderGrid(data || [], "Filtro Codice", "Albi per codice");
}

function setFilter(f) {
    currentFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${f}`).classList.add('active');
    if (currentSerieId) selectSerie(currentSerieId, currentSerieFullNome);
    else if (currentCodiceId) selectCodice(currentCodiceId);
    else loadRecent();
}

function setView(v) {
    currentView = v;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`view-${v}`).classList.add('active');
    renderGrid(currentData, document.getElementById('view-title').innerText, document.getElementById('view-subtitle').innerText);
}

function resetAllFilters() { currentCodiceId = null; currentSerieId = null; loadRecent(); loadCodiciBar(); }

// MODALI
function closeModal() { document.getElementById('edit-modal').classList.add('hidden'); }
function closeStorieModal() { document.getElementById('storie-modal').classList.add('hidden'); }

async function openEditModal(id = null) {
    document.getElementById('edit-form').reset();
    document.getElementById('edit-id').value = id || "";
    document.getElementById('modal-title').innerText = id ? "Modifica Albo" : "Nuovo Albo";
    document.getElementById('edit-preview').src = placeholderImg;
    document.getElementById('issue-stories-list').innerHTML = "";
    
    await populateAllSelects();

    if (id) {
        const { data: comic } = await window.supabaseClient.from('issue').select(FULL_QUERY).eq('id', id).single();
        if (comic) {
            document.getElementById('edit-nome').value = comic.nome || "";
            document.getElementById('edit-numero').value = comic.numero || "";
            document.getElementById('edit-valore').value = comic.valore || "";
            document.getElementById('edit-condizione').value = comic.condizione || "";
            document.getElementById('edit-possesso').value = comic.possesso;
            document.getElementById('edit-immagine_url').value = comic.immagine_url || "";
            document.getElementById('edit-preview').src = comic.immagine_url || placeholderImg;
            document.getElementById('edit-data_pubblicazione').value = comic.data_pubblicazione || "";
            if (comic.serie_id) {
                document.getElementById('edit-serie_id').value = comic.serie_id;
                handleSerieChange(comic.serie_id);
            }
            document.getElementById('edit-editore_id').value = comic.editore_id || "";
            document.getElementById('edit-testata_id').value = comic.testata_id || "";
            document.getElementById('edit-annata_id').value = comic.annata_id || "";
            document.getElementById('edit-tipo_pubblicazione_id').value = comic.tipo_pubblicazione_id || "";
            document.getElementById('edit-supplemento_id').value = comic.supplemento_id || "";
            loadIssueStories(id);
        }
    }
    document.getElementById('edit-modal').classList.remove('hidden');
}

async function populateAllSelects() {
    const [s, e, t, a, p, sup] = await Promise.all([
        window.supabaseClient.from('serie').select('id, nome, collana(nome)').order('nome'),
        window.supabaseClient.from('editore').select('id, nome').order('nome'),
        window.supabaseClient.from('testata').select('id, nome').order('nome'),
        window.supabaseClient.from('annata').select('id, nome').order('nome'),
        window.supabaseClient.from('tipo_pubblicazione').select('id, nome').order('nome'),
        window.supabaseClient.from('issue').select('id, nome, numero').order('nome')
    ]);

    document.getElementById('edit-serie_id').innerHTML = '<option value="">-- Seleziona Serie --</option>' + (s.data || []).map(x => `<option value="${x.id}">${getSerieDisplayName(x)}</option>`).join('');
    document.getElementById('edit-editore_id').innerHTML = '<option value="">-- Seleziona Editore --</option>' + (e.data || []).map(x => `<option value="${x.id}">${x.nome}</option>`).join('');
    document.getElementById('edit-testata_id').innerHTML = '<option value="">-- Seleziona Testata --</option>' + (t.data || []).map(x => `<option value="${x.id}">${x.nome}</option>`).join('');
    document.getElementById('edit-annata_id').innerHTML = '<option value="">-- Seleziona Annata --</option>' + (a.data || []).map(x => `<option value="${x.id}">${x.nome}</option>`).join('');
    document.getElementById('edit-tipo_pubblicazione_id').innerHTML = '<option value="">-- Seleziona Tipo --</option>' + (p.data || []).map(x => `<option value="${x.id}">${x.nome}</option>`).join('');
    document.getElementById('edit-supplemento_id').innerHTML = '<option value="">-- Nessuno --</option>' + (sup.data || []).map(x => `<option value="${x.id}">${x.nome} #${x.numero}</option>`).join('');
}

async function handleSerieChange(serieId) {
    const btnEdit = document.getElementById('btn-edit-context');
    if (!serieId || !btnEdit) return;
    btnEdit.disabled = false;
    const { data: serie } = await window.supabaseClient.from('serie').select('collana_id, collana(nome)').eq('id', serieId).single();
    if (serie && serie.collana_id) {
        document.getElementById('edit-collana_id').innerHTML = `<option value="${serie.collana_id}">${serie.collana.nome}</option>`;
    }
}

// STORIE E PERSONAGGI
async function loadIssueStories(issueId) {
    const list = document.getElementById('issue-stories-list');
    const { data } = await window.supabaseClient.from('storie_in_issue').select('posizione, storia:storia_id(id, nome)').eq('issue_id', issueId).order('posizione');
    list.innerHTML = (data || []).map(item => `
        <div class="flex items-center justify-between bg-slate-900/80 p-2 rounded border border-slate-700 hover:border-yellow-500/50 transition-all group">
            <div class="flex items-center gap-2 overflow-hidden">
                <span class="text-[10px] font-black text-yellow-500 italic shrink-0">#${item.posizione || '?'}</span>
                <span class="text-[10px] font-bold text-slate-200 uppercase truncate">${item.storia?.nome || '???'}</span>
            </div>
            <button type="button" onclick="openStorieModal({id:'${item.storia?.id}', nome:'${item.storia?.nome.replace(/'/g, "\\'")}', issue_id:'${issueId}', posizione:'${item.posizione}'})" class="text-[9px] text-yellow-500 font-black opacity-0 group-hover:opacity-100 transition-all">EDIT</button>
        </div>
    `).join('');
    if (!data?.length) list.innerHTML = '<p class="text-[9px] text-slate-600 uppercase italic">Nessuna storia</p>';
}

async function openStorieModal(storia = null) {
    document.getElementById('storie-form').reset();
    const sid = storia?.id || "";
    document.getElementById('storie-id').value = sid;
    document.getElementById('storie-nome').value = storia?.nome || "";
    
    const currentIssueId = document.getElementById('edit-id').value;
    const selectIssue = document.getElementById('storie-issue-id');
    const { data: issues } = await window.supabaseClient.from('issue').select('id, nome, numero').order('nome');
    selectIssue.innerHTML = (issues || []).map(i => `<option value="${i.id}" ${i.id === currentIssueId ? 'selected' : ''}>${i.nome} #${i.numero}</option>`).join('');
    
    if (storia?.posizione) document.getElementById('storie-posizione').value = storia.posizione;
    const { data: tutte } = await window.supabaseClient.from('storia').select('nome');
    document.getElementById('storie-esistenti').innerHTML = [...new Set((tutte || []).map(t => t.nome))].map(n => `<option value="${n}">`).join('');

    if (sid) loadPersonaggiStoria(sid);
    else document.getElementById('lista-personaggi-storia').innerHTML = "";
    
    document.getElementById('storie-modal').classList.remove('hidden');
}

async function loadPersonaggiStoria(storiaId) {
    const container = document.getElementById('lista-personaggi-storia');
    const { data } = await window.supabaseClient.from('personaggi_in_storia').select('personaggio:personaggio_id(*)').eq('storia_id', storiaId);
    container.innerHTML = (data || []).map(p => `
        <div class="flex items-center gap-3 bg-slate-900/50 p-2 rounded border border-slate-700">
            <img src="${p.personaggio?.immagine_url || placeholderAvatar}" class="w-8 h-8 rounded-full object-cover border border-slate-600">
            <span class="text-[10px] font-black uppercase text-slate-300 truncate">${p.personaggio?.nome}</span>
        </div>
    `).join('');
}

// LISTENERS
searchInput.addEventListener('input', async (e) => {
    const queryText = e.target.value.trim(); if (queryText.length < 2) { resultsDiv.classList.add('hidden'); return; }
    const { data } = await window.supabaseClient.from('serie').select('id, nome, collana(nome)').ilike('nome', `%${queryText}%`).limit(10);
    if (data && data.length > 0) {
        resultsDiv.innerHTML = data.map(s => `<div onclick="selectSerie('${s.id}', '${getSerieDisplayName(s)}')" class="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 text-sm font-bold">${getSerieDisplayName(s)}</div>`).join('');
        resultsDiv.classList.remove('hidden');
    } else { resultsDiv.classList.add('hidden'); }
});

document.addEventListener('click', (e) => { if (!searchInput.contains(e.target)) resultsDiv.classList.add('hidden'); });

// AVVIO
init();
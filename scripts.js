const searchInput = document.getElementById('serie-search');
const resultsDiv = document.getElementById('serie-results');
const grid = document.getElementById('comic-grid');
const statsCount = document.getElementById('stats-count');
const showcase = document.getElementById('serie-showcase');
const codiciBar = document.getElementById('codici-bar');
const placeholderImg = 'https://placehold.co/300x450/1e293b/fbbf24?text=No+Cover';
const placeholderLogo = 'https://placehold.co/200x200/1e293b/fbbf24?text=Codice';
const placeholderAvatar = 'https://placehold.co/100x100/1e293b/fbbf24?text=?';

let currentFilter = 'all'; 
let currentSerieId = null;
let currentSerieFullNome = ""; 
let currentCodiceId = null;
let currentView = 'grid'; 
let currentData = [];

const FULL_QUERY = `*, annata(id, nome), serie(id, nome, immagine_url, collana_id, collana(nome)), tipo_pubblicazione(nome)`;

function setView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`view-${view}`).classList.add('active');
    renderGrid(currentData, currentSerieFullNome);
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${filter}`).classList.add('active');
    
    if (currentCodiceId) loadByCodice(currentCodiceId);
    else if (currentSerieId) selectSerie(currentSerieId, currentSerieFullNome);
    else loadRecent();
}

function resetAllFilters() {
    currentFilter = 'all';
    currentSerieId = null;
    currentSerieFullNome = "";
    currentCodiceId = null;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-all').classList.add('active');
    document.querySelectorAll('.codice-item').forEach(c => c.classList.remove('active'));
    loadRecent();
}

async function loadCodiciBar() {
    const { data } = await window.supabaseClient.from('codice_editore').select('*').order('nome');
    if (data) {
        codiciBar.innerHTML = data.map(c => `
            <div onclick="loadByCodice('${c.id}')" id="codice-${c.id}" class="codice-item bg-slate-800 p-2 rounded-xl border border-slate-700 flex items-center gap-3 min-w-[140px]">
                <div class="codice-item-square bg-slate-900 rounded-lg overflow-hidden">
                    <img src="${c.immagine_url || placeholderLogo}" class="w-full h-full object-contain grayscale">
                </div>
                <span class="text-[10px] font-black uppercase tracking-tighter truncate">${c.nome}</span>
            </div>
        `).join('');
    }
}

async function loadSerieShowcase() {
    const { data } = await window.supabaseClient.from('serie').select('*, collana(nome)').order('nome');
    if (data) {
        showcase.innerHTML = data.map(s => {
            const displayName = getSerieDisplayName(s);
            return `
            <div onclick="selectSerie('${s.id}', '${displayName}')" class="serie-showcase-item shrink-0 cursor-pointer group">
                <div class="h-20 bg-slate-800 rounded-2xl p-3 border border-slate-700 group-hover:border-yellow-500 transition-all flex items-center gap-4 shadow-lg">
                    <img src="${s.immagine_url || placeholderLogo}" class="h-full object-contain group-hover:scale-110 transition-transform">
                    <div class="pr-4">
                        <div class="text-[10px] font-black text-yellow-500 uppercase tracking-tighter leading-none mb-1">${s.collana?.nome || 'Serie'}</div>
                        <div class="text-xs font-black text-white uppercase whitespace-nowrap">${s.nome}</div>
                    </div>
                </div>
            </div>
        `}).join('');
    }
}

async function loadRecent() {
    currentSerieId = null;
    currentCodiceId = null;
    currentSerieFullNome = "Ultimi Arrivi";
    document.querySelectorAll('.codice-item').forEach(c => c.classList.remove('active'));
    
    let query = window.supabaseClient.from('issue').select(FULL_QUERY);
    if (currentFilter === 'celo') query = query.eq('possesso', 'celo');
    if (currentFilter === 'manca') query = query.eq('possesso', 'manca');
    
    // Ordine cronologico crescente
    const { data } = await query.order('data_pubblicazione', { ascending: true, nullsFirst: false }).limit(24);
    currentData = data || [];
    renderGrid(currentData, "Ultimi Arrivi");
}

async function selectSerie(id, fullNome) {
    currentSerieId = id;
    currentCodiceId = null;
    currentSerieFullNome = fullNome;
    resultsDiv.classList.add('hidden');
    searchInput.value = '';
    document.querySelectorAll('.codice-item').forEach(c => c.classList.remove('active'));
    
    let query = window.supabaseClient.from('issue').select(FULL_QUERY).eq('serie_id', id);
    if (currentFilter === 'celo') query = query.eq('possesso', 'celo');
    if (currentFilter === 'manca') query = query.eq('possesso', 'manca');
    
    // Ordine cronologico crescente
    const { data } = await query.order('data_pubblicazione', { ascending: true, nullsFirst: false });
    currentData = data || [];
    renderGrid(currentData, fullNome);
}

async function loadByCodice(codId) {
    currentCodiceId = codId;
    currentSerieId = null;
    document.querySelectorAll('.codice-item').forEach(c => c.classList.remove('active'));
    document.getElementById(`codice-${codId}`)?.classList.add('active');
    
    const { data: codData } = await window.supabaseClient.from('codice_editore').select('nome').eq('id', codId).single();
    currentSerieFullNome = codData ? `Codice: ${codData.nome}` : "Filtro Codice";

    let query = window.supabaseClient.from('issue').select(FULL_QUERY).eq('serie.collana.codice_id', codId);
    if (currentFilter === 'celo') query = query.eq('possesso', 'celo');
    if (currentFilter === 'manca') query = query.eq('possesso', 'manca');
    
    // Ordine cronologico crescente
    const { data } = await query.order('data_pubblicazione', { ascending: true, nullsFirst: false });
    currentData = data || [];
    renderGrid(currentData, currentSerieFullNome);
}

function renderGrid(data, title) {
    document.getElementById('view-title').innerText = title;
    statsCount.innerText = `${data.length} fumetti`;
    
    if (currentView === 'list') {
        grid.className = "flex flex-col gap-4";
        grid.innerHTML = data.map(item => `
            <div class="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-6 hover:border-yellow-500/50 transition-all group">
                <div class="w-16 h-24 bg-slate-900 rounded-lg overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    <img src="${item.immagine_url || placeholderImg}" class="w-full h-full object-cover ${item.possesso === 'manca' ? 'grayscale opacity-50' : ''}">
                </div>
                <div class="flex-grow">
                    <div class="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">${item.serie?.nome}</div>
                    <div class="text-lg font-black text-white uppercase italic">#${item.numero} - ${item.nome || 'Senza Titolo'}</div>
                    <div class="flex gap-4 mt-2">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Annata: ${item.annata?.nome || '-'}</span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tipo: ${item.tipo_pubblicazione?.nome || '-'}</span>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button onclick='openEditModal(${JSON.stringify(item).replace(/'/g, "&apos;")})' class="bg-slate-700 hover:bg-yellow-500 hover:text-slate-900 p-3 rounded-xl transition-all">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    <button onclick="deleteIssue('${item.id}')" class="bg-slate-700 hover:bg-red-500 p-3 rounded-xl transition-all group-hover:opacity-100 opacity-30">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        grid.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8";
        grid.innerHTML = data.map(item => `
            <div class="comic-card group">
                <div class="relative aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-slate-800 group-hover:border-yellow-500 transition-all bg-slate-800" onclick='openEditModal(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                    <img src="${item.immagine_url || placeholderImg}" class="comic-image w-full h-full object-cover ${item.possesso === 'manca' ? 'grayscale opacity-40' : ''}">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                    <div class="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700">
                        <span class="text-xs font-black text-yellow-500">#${item.numero}</span>
                    </div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <div class="text-[9px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-1 truncate">${item.serie?.nome}</div>
                        <div class="text-sm font-black text-white uppercase italic leading-tight line-clamp-2">${item.nome || 'Senza Titolo'}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function getSerieDisplayName(s) {
    const collName = s.collana?.nome || '';
    return collName ? `${collName} - ${s.nome}` : s.nome;
}

// GESTIONE MODALI E TABELLE SECONDARIE
const MODAL_CONFIG = {
    annata: { table: 'annata', fields: [{ id: 'nome', label: 'Anno (es. 1995)', type: 'text' }] },
    tipo_pubblicazione: { table: 'tipo_pubblicazione', fields: [{ id: 'nome', label: 'Nome Tipo', type: 'text' }] },
    collana: { table: 'collana', fields: [{ id: 'nome', label: 'Nome Collana', type: 'text' }, { id: 'codice_id', label: 'Codice Editore', type: 'select', table: 'codice_editore' }] },
    personaggio: { table: 'personaggi', fields: [{ id: 'nome', label: 'Nome Personaggio', type: 'text' }, { id: 'immagine_url', label: 'Avatar URL', type: 'text' }] }
};

async function openSimpleModal(type, existingId = null) {
    const config = MODAL_CONFIG[type];
    const modal = document.getElementById('simple-modal');
    const title = document.getElementById('simple-modal-title');
    const fieldsDiv = document.getElementById('simple-form-fields');
    const prevCont = document.getElementById('simple-preview-container');
    const prevImg = document.getElementById('simple-preview-img');

    title.innerText = existingId ? `Modifica ${type}` : `Nuovo ${type}`;
    document.getElementById('simple-id').value = existingId || '';
    fieldsDiv.innerHTML = '';
    prevCont.classList.add('hidden');

    let existingData = {};
    if (existingId) {
        const { data } = await window.supabaseClient.from(config.table).select('*').eq('id', existingId).single();
        existingData = data || {};
    }

    for (const f of config.fields) {
        if (f.type === 'select') {
            const { data: options } = await window.supabaseClient.from(f.table).select('*').order('nome');
            fieldsDiv.innerHTML += `
                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest">${f.label}</label>
                <select id="simple-${f.id}" class="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl mb-4 text-white">
                    ${options.map(opt => `<option value="${opt.id}" ${existingData[f.id] === opt.id ? 'selected' : ''}>${opt.nome}</option>`).join('')}
                </select>
            `;
        } else {
            fieldsDiv.innerHTML += `
                <label class="text-[10px] font-black uppercase text-slate-500 tracking-widest">${f.label}</label>
                <input type="${f.type}" id="simple-${f.id}" value="${existingData[f.id] || ''}" class="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl mb-4 text-white">
            `;
            if (f.id === 'immagine_url') {
                prevCont.classList.remove('hidden');
                prevImg.src = existingData[f.id] || '';
                document.getElementById(`simple-${f.id}`).oninput = (e) => prevImg.src = e.target.value;
            }
        }
    }
    modal.classList.remove('hidden');
}

function closeSimpleModal() { document.getElementById('simple-modal').classList.add('hidden'); }

document.getElementById('simple-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('simple-id').value;
    const type = document.getElementById('simple-modal-title').innerText.split(' ').pop().toLowerCase();
    const config = MODAL_CONFIG[type];
    const payload = {};
    config.fields.forEach(f => payload[f.id] = document.getElementById(`simple-${f.id}`).value);

    const { error } = id ? await window.supabaseClient.from(config.table).update(payload).eq('id', id) : await window.supabaseClient.from(config.table).insert([payload]);
    if (error) alert(error.message); else { closeSimpleModal(); populateSelects(); loadCodiciBar(); }
};

// MODALE SERIE
async function openSerieModal(id = null) {
    const { data: collane } = await window.supabaseClient.from('collana').select('*').order('nome');
    const select = document.getElementById('new-serie-collana');
    select.innerHTML = collane.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
    
    if (id) {
        const { data } = await window.supabaseClient.from('serie').select('*').eq('id', id).single();
        document.getElementById('new-serie-id').value = data.id;
        document.getElementById('new-serie-nome').value = data.nome;
        document.getElementById('new-serie-immagine').value = data.immagine_url || '';
        document.getElementById('new-serie-preview').src = data.immagine_url || '';
        select.value = data.collana_id;
        document.getElementById('btn-edit-collana-serie').disabled = false;
    } else {
        document.getElementById('serie-form').reset();
        document.getElementById('new-serie-id').value = '';
        document.getElementById('new-serie-preview').src = '';
        document.getElementById('btn-edit-collana-serie').disabled = true;
    }
    document.getElementById('serie-modal').classList.remove('hidden');
}

function closeSerieModal() { document.getElementById('serie-modal').classList.add('hidden'); }

document.getElementById('serie-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('new-serie-id').value;
    const payload = {
        nome: document.getElementById('new-serie-nome').value,
        immagine_url: document.getElementById('new-serie-immagine').value,
        collana_id: document.getElementById('new-serie-collana').value
    };
    const { error } = id ? await window.supabaseClient.from('serie').update(payload).eq('id', id) : await window.supabaseClient.from('serie').insert([payload]);
    if (error) alert(error.message); else { closeSerieModal(); populateSelects(); loadSerieShowcase(); }
};

// MODALE ISSUE PRINCIPALE
async function openAddModal() {
    document.getElementById('edit-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('modal-title').innerText = "Nuovo Albo";
    document.getElementById('edit-preview').src = placeholderImg;
    document.getElementById('issue-stories-list').innerHTML = '';
    document.getElementById('btn-edit-serie-context').disabled = true;
    document.getElementById('btn-edit-annata-issue').disabled = true;
    await populateSelects();
    document.getElementById('edit-modal').classList.remove('hidden');
}

async function openEditModal(item) {
    await populateSelects();
    document.getElementById('edit-id').value = item.id;
    document.getElementById('modal-title').innerText = "Modifica Albo";
    document.getElementById('edit-serie_id').value = item.serie_id;
    document.getElementById('edit-nome').value = item.nome || '';
    document.getElementById('edit-numero').value = item.numero;
    document.getElementById('edit-possesso').value = item.possesso;
    document.getElementById('edit-condizione').value = item.condizione || '';
    document.getElementById('edit-valore').value = item.valore || '';
    document.getElementById('edit-data_pubblicazione').value = item.data_pubblicazione || '';
    document.getElementById('edit-immagine_url').value = item.immagine_url || '';
    document.getElementById('edit-preview').src = item.immagine_url || placeholderImg;
    document.getElementById('edit-annata_id').value = item.annata_id || '';
    document.getElementById('edit-tipo_pubblicazione_id').value = item.tipo_pubblicazione_id || '';
    
    document.getElementById('btn-edit-serie-context').disabled = false;
    document.getElementById('btn-edit-annata-issue').disabled = !item.annata_id;
    
    handleSerieChange(item.serie_id);
    loadIssueStories(item.id);
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('edit-modal').classList.add('hidden'); }

async function populateSelects() {
    const { data: serie } = await window.supabaseClient.from('serie').select('id, nome, collana(nome)').order('nome');
    const { data: annate } = await window.supabaseClient.from('annata').select('*').order('nome', { ascending: false });
    const { data: tipi } = await window.supabaseClient.from('tipo_pubblicazione').select('*').order('nome');

    document.getElementById('edit-serie_id').innerHTML = serie.map(s => `<option value="${s.id}">${getSerieDisplayName(s)}</option>`).join('');
    document.getElementById('edit-annata_id').innerHTML = '<option value="">-</option>' + annate.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
    document.getElementById('edit-tipo_pubblicazione_id').innerHTML = tipi.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
}

async function handleSerieChange(serieId) {
    const { data } = await window.supabaseClient.from('serie').select('collana(id, nome)').eq('id', serieId).single();
    const colSelect = document.getElementById('edit-collana_id');
    colSelect.innerHTML = `<option value="${data.collana.id}">${data.collana.nome}</option>`;
    document.getElementById('btn-edit-collana-issue').disabled = false;
    document.getElementById('btn-edit-serie-context').disabled = false;
}

// LOGICA STORIE E PERSONAGGI
async function loadIssueStories(issueId) {
    const container = document.getElementById('issue-stories-list');
    const { data, error } = await window.supabaseClient
        .from('storie_in_issue')
        .select(`posizione, storia_id, storie(nome)`)
        .eq('issue_id', issueId)
        .order('posizione');

    if (data && data.length > 0) {
        container.innerHTML = data.map(s => `
            <div class="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group" onclick="openStorieModal('${s.storia_id}', '${issueId}')">
                <div class="flex items-center gap-3">
                    <span class="text-blue-500 font-black italic text-xs">#${s.posizione || '?'}</span>
                    <span class="text-[11px] font-bold text-slate-200 uppercase truncate max-w-[140px]">${s.storie.nome}</span>
                </div>
                <button onclick="event.stopPropagation(); removeStoriaFromIssue('${s.storia_id}', '${issueId}')" class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all">&times;</button>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-[10px] text-slate-600 text-center py-4 font-bold uppercase italic">Nessuna storia collegata</p>';
    }
}

async function openStorieModal(storiaId = null, issueId = null) {
    const modal = document.getElementById('storie-modal');
    const form = document.getElementById('storie-form');
    const listPers = document.getElementById('lista-personaggi-storia');
    form.reset();
    listPers.innerHTML = '';
    
    const { data: issues } = await window.supabaseClient.from('issue').select('id, numero, serie(nome)').order('numero');
    const issueSelect = document.getElementById('storie-issue-id');
    issueSelect.innerHTML = '<option value="">- Seleziona Albo -</option>' + issues.map(i => `<option value="${i.id}">#${i.numero} (${i.serie.nome})</option>`).join('');
    
    const { data: tutteStorie } = await window.supabaseClient.from('storie').select('nome');
    document.getElementById('storie-esistenti').innerHTML = tutteStorie.map(s => `<option value="${s.nome}">`).join('');

    if (storiaId) {
        const { data: storia } = await window.supabaseClient.from('storie').select('*').eq('id', storiaId).single();
        document.getElementById('storie-id').value = storia.id;
        document.getElementById('old-storia-id').value = storia.id;
        document.getElementById('storie-nome').value = storia.nome;
        
        if (issueId) {
            const { data: rel } = await window.supabaseClient.from('storie_in_issue').select('*').eq('storia_id', storiaId).eq('issue_id', issueId).single();
            issueSelect.value = issueId;
            document.getElementById('storie-posizione').value = rel.posizione || '';
            document.getElementById('storie-posizione-container').classList.remove('hidden');
        }
        loadPersonaggiStoria(storiaId);
    } else {
        document.getElementById('storie-id').value = '';
        document.getElementById('old-storia-id').value = '';
        if (issueId) {
            issueSelect.value = issueId;
            document.getElementById('storie-posizione-container').classList.remove('hidden');
        }
    }
    modal.classList.remove('hidden');
}

async function loadPersonaggiStoria(storiaId) {
    const container = document.getElementById('lista-personaggi-storia');
    const { data } = await window.supabaseClient.from('personaggi_storia').select('personaggio_id, personaggi(nome, immagine_url)').eq('storia_id', storiaId);
    
    if (data && data.length > 0) {
        container.innerHTML = data.map(p => `
            <div class="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex items-center gap-3 group relative">
                <img src="${p.personaggi.immagine_url || placeholderAvatar}" class="w-10 h-10 rounded-full object-cover border-2 border-slate-900">
                <span class="text-[10px] font-black uppercase text-white truncate">${p.personaggi.nome}</span>
                <button type="button" onclick="removePersonaggioFromStoria('${p.personaggio_id}', '${storiaId}')" class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all shadow-lg">&times;</button>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<div class="col-span-full py-8 text-center text-slate-600 text-[10px] font-black uppercase italic">Nessun personaggio collegato</div>';
    }
}

async function openAddPersonaggioStoriaModal() {
    const storiaId = document.getElementById('storie-id').value;
    if (!storiaId) return alert("Salva prima la storia!");
    
    const { data: tuttiPers } = await window.supabaseClient.from('personaggi').select('*').order('nome');
    const pSelect = document.getElementById('ps-personaggio-id');
    pSelect.innerHTML = tuttiPers.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    
    const sSelect = document.getElementById('ps-storia-id');
    const currentName = document.getElementById('storie-nome').value;
    sSelect.innerHTML = `<option value="${storiaId}">${currentName}</option>`;
    
    document.getElementById('personaggio-storia-modal').classList.remove('hidden');
}

// SALVATAGGIO STORIE
document.getElementById('storie-form').onsubmit = async (e) => {
    e.preventDefault();
    const nome = document.getElementById('storie-nome').value;
    const issueId = document.getElementById('storie-issue-id').value;
    const posizione = document.getElementById('storie-posizione').value;
    let storiaId = document.getElementById('storie-id').value;

    let { data: storiaEsistente } = await window.supabaseClient.from('storie').select('id').eq('nome', nome).maybeSingle();
    
    if (storiaEsistente) {
        storiaId = storiaEsistente.id;
    } else {
        const { data: nuovaStoria } = await window.supabaseClient.from('storie').insert([{ nome }]).select().single();
        storiaId = nuovaStoria.id;
    }

    if (issueId) {
        const payloadRel = { issue_id: issueId, storia_id: storiaId, posizione: posizione ? parseInt(posizione) : null };
        const oldId = document.getElementById('old-storia-id').value;
        if (oldId && oldId !== storiaId) await window.supabaseClient.from('storie_in_issue').delete().eq('storia_id', oldId).eq('issue_id', issueId);
        await window.supabaseClient.from('storie_in_issue').upsert([payloadRel]);
    }

    alert("Storia salvata!");
    closeStorieModal();
    if (document.getElementById('edit-id').value) loadIssueStories(document.getElementById('edit-id').value);
};

// SALVATAGGIO PERSONAGGIO_STORIA
document.getElementById('personaggio-storia-form').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        personaggio_id: document.getElementById('ps-personaggio-id').value,
        storia_id: document.getElementById('ps-storia-id').value
    };
    const { error } = await window.supabaseClient.from('personaggi_storia').upsert([payload]);
    if (error) alert(error.message); else { closeAddPersonaggioStoriaModal(); loadPersonaggiStoria(payload.storia_id); }
};

// AZIONI RAPIDE E UTILITY
async function removeStoriaFromIssue(sId, iId) {
    if (confirm("Rimuovere la storia da questo albo?")) {
        await window.supabaseClient.from('storie_in_issue').delete().eq('storia_id', sId).eq('issue_id', iId);
        loadIssueStories(iId);
    }
}

async function removePersonaggioFromStoria(pId, sId) {
    if (confirm("Scollegare il personaggio?")) {
        await window.supabaseClient.from('personaggi_storia').delete().eq('personaggio_id', pId).eq('storia_id', sId);
        loadPersonaggiStoria(sId);
    }
}

async function deleteIssue(id) {
    if (confirm("Eliminare definitivamente questo albo?")) {
        const { error } = await window.supabaseClient.from('issue').delete().eq('id', id);
        if (error) alert(error.message); else if (currentSerieId) selectSerie(currentSerieId, currentSerieFullNome); else loadRecent();
    }
}

function togglePosizioneField(val) {
    document.getElementById('storie-posizione-container').classList.toggle('hidden', !val);
}

function closeStorieModal() { document.getElementById('storie-modal').classList.add('hidden'); }
function closeAddPersonaggioStoriaModal() { document.getElementById('personaggio-storia-modal').classList.add('hidden'); }

function openEditSerieFromContext() { openSerieModal(document.getElementById('edit-serie_id').value); }
function openEditAnnataFromIssue() { openSimpleModal('annata', document.getElementById('edit-annata_id').value); }
function openEditCollanaFromIssue() { openSimpleModal('collana', document.getElementById('edit-collana_id').value); }
function openEditCollanaFromSerie() { openSimpleModal('collana', document.getElementById('new-serie-collana').value); }

function openAnnataModal() { openSimpleModal('annata'); }
function openCollanaModal() { openSimpleModal('collana'); }

// SALVATAGGIO FINALE ALBO
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const payload = {
        serie_id: document.getElementById('edit-serie_id').value,
        nome: document.getElementById('edit-nome').value,
        numero: document.getElementById('edit-numero').value,
        possesso: document.getElementById('edit-possesso').value,
        condizione: parseInt(document.getElementById('edit-condizione').value) || null,
        annata_id: document.getElementById('edit-annata_id').value || null,
        tipo_pubblicazione_id: document.getElementById('edit-tipo_pubblicazione_id').value || null,
        valore: document.getElementById('edit-valore').value === "" ? null : parseFloat(document.getElementById('edit-valore').value),
        data_pubblicazione: document.getElementById('edit-data_pubblicazione').value || null,
        immagine_url: document.getElementById('edit-immagine_url').value
    };
    const { error } = id ? await window.supabaseClient.from('issue').update(payload).eq('id', id) : await window.supabaseClient.from('issue').insert([payload]);
    if (error) alert(error.message); else { closeModal(); if (currentSerieId) selectSerie(currentSerieId, currentSerieFullNome); else loadRecent(); }
});

searchInput.addEventListener('input', async (e) => {
    const queryText = e.target.value.trim(); if (queryText.length < 2) { resultsDiv.classList.add('hidden'); return; }
    const { data } = await window.supabaseClient.from('serie').select('id, nome, collana(nome)').ilike('nome', `%${queryText}%`).limit(10);
    if (data && data.length > 0) {
        resultsDiv.innerHTML = data.map(s => { const full = getSerieDisplayName(s); return `<div onclick="selectSerie('${s.id}', '${full}')" class="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-0 text-sm font-bold">${full}</div>`; }).join('');
        resultsDiv.classList.remove('hidden');
    } else { resultsDiv.classList.add('hidden'); }
});

loadCodiciBar(); loadSerieShowcase(); loadRecent();
document.addEventListener('click', (e) => { if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) resultsDiv.classList.add('hidden'); });
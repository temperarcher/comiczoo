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
    if (currentSerieId) selectSerie(currentSerieId, currentSerieFullNome);
    else loadRecent();
}

async function resetAllFilters() {
    currentCodiceId = null; currentSerieId = null; searchInput.value = "";
    await loadCodiciBar(); await loadSerieShowcase(); await loadRecent();
}

async function loadCodiciBar() {
    const { data: codici } = await window.supabaseClient.from('codice_editore').select('id, nome, immagine_url').order('nome');
    let html = `<button id="codice-tutti" onclick="resetAllFilters()" class="codice-item ${!currentCodiceId ? 'active' : ''} shrink-0 h-12 px-6 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[11px] font-black uppercase tracking-widest text-yellow-500">TUTTI</button>`;
    if (codici) {
        html += codici.map(cod => `
            <div id="codice-${cod.id}" onclick="selectCodice('${cod.id}')" class="codice-item codice-item-square ${currentCodiceId === cod.id ? 'active' : ''} bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex items-center justify-center p-0">
                 <img src="${cod.immagine_url || placeholderLogo}" alt="${cod.nome}" title="${cod.nome}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all">
            </div>
        `).join('');
    }
    codiciBar.innerHTML = html;
}

async function selectCodice(codiceId) {
    currentCodiceId = codiceId;
    document.querySelectorAll('.codice-item').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(`codice-${codiceId}`);
    if(el) el.classList.add('active');
    const { data: editori } = await window.supabaseClient.from('editore').select('id').eq('codice_editore_id', codiceId);
    const editoriIds = (editori || []).map(e => e.id);
    if (editoriIds.length === 0) { showcase.innerHTML = `<p class="text-slate-500 text-xs uppercase px-4 italic">Nessuna serie associata</p>`; return; }
    const { data: issues } = await window.supabaseClient.from('issue').select('serie_id').in('editore_id', editoriIds);
    const serieIds = [...new Set((issues || []).map(i => i.serie_id))];
    await loadSerieShowcase(serieIds);
}

async function loadSerieShowcase(filterSerieIds = null) {
    let query = window.supabaseClient.from('serie').select('id, nome, immagine_url, collana(nome)').order('nome');
    if (filterSerieIds) query = query.in('id', filterSerieIds);
    const { data: series } = await query;
    if (series) {
        showcase.innerHTML = series.map(serie => {
            const display = getSerieDisplayName(serie);
            return `<div class="serie-showcase-item shrink-0 h-16 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden cursor-pointer shadow-lg relative group">
                <div onclick="selectSerie('${serie.id}', '${display}')" class="h-full"><img src="${serie.immagine_url || placeholderImg}" class="h-full w-auto object-contain"></div>
                <button onclick="openSerieModal('${serie.id}')" class="absolute top-1 right-1 bg-yellow-500 text-slate-900 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-[10px] z-10">✏️</button>
            </div>`;
        }).join('');
    }
}

function getStarsHTML(valore) {
    const num = parseInt(valore);
    if (isNaN(num)) return '<span class="text-[10px] text-slate-600 italic">N.D.</span>';
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) starsHTML += `<span class="text-xs ${i <= num ? 'text-yellow-500 opacity-100' : 'text-slate-500 opacity-20'}">★</span>`;
    return `<div class="flex gap-0.5">${starsHTML}</div>`;
}

function getSerieDisplayName(serie) { if (!serie) return ""; const nomeCollana = serie.collana?.nome; return nomeCollana ? `${serie.nome} (${nomeCollana})` : serie.nome; }

// AGGIORNAMENTO 7.5: Ordinamento per data_pubblicazione
async function selectSerie(serieId, fullSerieNome) {
    currentSerieId = serieId; currentSerieFullNome = fullSerieNome; searchInput.value = fullSerieNome; resultsDiv.classList.add('hidden');
    document.getElementById('view-title').innerText = fullSerieNome;
    let query = window.supabaseClient.from('issue').select(FULL_QUERY).eq('serie_id', serieId);
    if (currentFilter !== 'all') query = query.eq('possesso', currentFilter);
    const { data } = await query
        .order('data_pubblicazione', { ascending: true, nullsFirst: false })
        .order('numero', { ascending: true });
    currentData = data || []; renderGrid(currentData, fullSerieNome);
}

// AGGIORNAMENTO 7.5: Ordinamento per data_pubblicazione
async function loadRecent() {
    currentSerieId = null; document.getElementById('view-title').innerText = "Ultimi Arrivi";
    let query = window.supabaseClient.from('issue').select(FULL_QUERY);
    if (currentFilter !== 'all') query = query.eq('possesso', currentFilter);
    const { data } = await query
        .order('data_pubblicazione', { ascending: true, nullsFirst: false })
        .limit(20);
    currentData = data || []; renderGrid(currentData);
}

function renderGrid(items, fallbackSerie = "") {
    statsCount.innerText = `${items?.length || 0} fumetti`;
    if (currentView === 'list') grid.classList.add('list-view-container'); else grid.classList.remove('list-view-container');
    grid.innerHTML = (items || []).map(comic => {
        const isOwned = comic.possesso === 'celo';
        const comicData = encodeURIComponent(JSON.stringify(comic));
        const annataLabel = comic.annata?.nome ? `<span class="text-slate-400 font-normal mr-1">${comic.annata.nome}</span>` : "";
        return `<div class="comic-card group bg-slate-800 rounded-xl overflow-hidden border ${isOwned ? 'border-slate-700 shadow-xl' : 'border-slate-800 opacity-80'} transition-all relative ${currentView === 'list' ? 'list-view-item' : ''}">
            <button onclick="openEditModal('${comicData}')" class="absolute top-2 right-2 z-40 bg-yellow-500 text-slate-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">✏️</button>
            <div class="relative ${currentView === 'list' ? 'h-full' : 'h-72'} bg-slate-950 overflow-hidden shrink-0"><img src="${comic.immagine_url || placeholderImg}" class="comic-image w-full h-full object-cover ${isOwned ? '' : 'grayscale opacity-40'}"></div>
            <div class="p-4 flex-grow"><p class="text-[10px] text-yellow-500 font-bold uppercase truncate mb-1">${fallbackSerie || getSerieDisplayName(comic.serie)}</p><h4 class="${currentView === 'list' ? 'text-xl' : 'text-lg'} font-bold leading-tight truncate">${annataLabel}#${comic.numero || '?'} ${comic.nome || ''}</h4><div class="mt-4 flex items-center justify-between border-t border-slate-700 pt-3">${getStarsHTML(comic.condizione)}<span class="text-[9px] text-slate-500 font-bold uppercase">${comic.tipo_pubblicazione?.nome || ''}</span></div></div></div>`;
    }).join('');
}

// LOGICA STORIE E PERSONAGGI V7.4
async function loadStorieEsistenti() {
    const { data } = await window.supabaseClient.from('storie').select('id, nome').order('nome');
    const datalist = document.getElementById('storie-esistenti');
    if (data) datalist.innerHTML = data.map(s => `<option value="${s.nome}" data-id="${s.id}"></option>`).join('');
}

async function loadPersonaggiStoria(storiaId) {
    const lista = document.getElementById('lista-personaggi-storia');
    if (!storiaId) { 
        lista.innerHTML = `<p class="text-[10px] text-slate-500 italic uppercase">Salva la storia per aggiungere personaggi</p>`;
        return; 
    }
    lista.innerHTML = `<p class="text-[10px] text-slate-500 italic uppercase">Ricerca personaggi...</p>`;
    
    const { data, error } = await window.supabaseClient
        .from('personaggi_storie')
        .select(`personaggio_id, personaggio:personaggio_id ( id, nome, immagine_url )`)
        .eq('storia_id', storiaId);

    if (error || !data || data.length === 0) {
        lista.innerHTML = `<p class="text-[10px] text-slate-400 italic uppercase">Nessun personaggio associato</p>`;
        return;
    }

    lista.innerHTML = data.map(p => `
        <div class="flex items-center justify-between bg-slate-900/40 p-2 rounded-lg border border-slate-700/50 group">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full overflow-hidden border border-yellow-500/30 shrink-0">
                    <img src="${p.personaggio?.immagine_url || placeholderAvatar}" class="w-full h-full object-cover" onerror="this.src='${placeholderAvatar}'">
                </div>
                <span class="text-[11px] font-black text-slate-200 uppercase truncate tracking-tight">${p.personaggio?.nome || 'Ignoto'}</span>
            </div>
            <button type="button" onclick="removePersonaggioDaStoria('${p.personaggio_id}', '${storiaId}')" class="text-[9px] text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-all hover:underline uppercase">Rimuovi</button>
        </div>
    `).join('');
}

async function removePersonaggioDaStoria(personaggioId, storiaId) {
    if(!confirm("Vuoi rimuovere questo personaggio dalla storia?")) return;
    const { error } = await window.supabaseClient.from('personaggi_storie').delete().match({ personaggio_id: personaggioId, storia_id: storiaId });
    if (error) alert(error.message); else loadPersonaggiStoria(storiaId);
}

async function openAddPersonaggioStoriaModal() {
    const storiaId = document.getElementById('storie-id').value;
    if (!storiaId) { alert("Devi prima salvare la storia per potervi associare personaggi."); return; }
    
    const selectPers = document.getElementById('ps-personaggio-id');
    const selectStor = document.getElementById('ps-storia-id');
    
    const { data: personaggi } = await window.supabaseClient.from('personaggio').select('id, nome').order('nome');
    selectPers.innerHTML = (personaggi || []).map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    
    const { data: storie } = await window.supabaseClient.from('storie').select('id, nome').order('nome');
    selectStor.innerHTML = (storie || []).map(s => `<option value="${s.id}" ${s.id === storiaId ? 'selected' : ''}>${s.nome}</option>`).join('');
    
    document.getElementById('personaggio-storia-modal').classList.remove('hidden');
}

function closeAddPersonaggioStoriaModal() { document.getElementById('personaggio-storia-modal').classList.add('hidden'); }

document.getElementById('personaggio-storia-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pId = document.getElementById('ps-personaggio-id').value;
    const sId = document.getElementById('ps-storia-id').value;
    const { error } = await window.supabaseClient.from('personaggi_storie').insert([{ personaggio_id: pId, storia_id: sId }]);
    if (error) { if(error.code === '23505') alert("Già associato."); else alert(error.message); } 
    else { closeAddPersonaggioStoriaModal(); if (document.getElementById('storie-id').value === sId) loadPersonaggiStoria(sId); }
});

async function loadIssueStories(issueId) {
    const list = document.getElementById('issue-stories-list');
    list.innerHTML = `<p class="text-[10px] text-slate-500 italic uppercase">Caricamento...</p>`;
    const { data: stories } = await window.supabaseClient.from('storie_in_issue').select(`posizione, storie ( id, nome )`).eq('issue_id', issueId).order('posizione', { ascending: true });
    if (!stories || stories.length === 0) { list.innerHTML = `<p class="text-[10px] text-slate-500 italic uppercase">Nessuna storia</p>`; return; }
    list.innerHTML = stories.map(s => {
        const storyPayload = encodeURIComponent(JSON.stringify({ id: s.storie?.id, nome: s.storie?.nome, issue_id: issueId, posizione: s.posizione }));
        return `<div class="bg-slate-900/50 p-2 rounded border border-slate-700/50 group">
            <div class="flex items-center justify-between mb-1"><span class="text-[9px] font-black text-yellow-500/50 uppercase">Pos. ${s.posizione || '?'}</span>
            <button type="button" onclick="openStorieModal('${storyPayload}')" class="text-[9px] text-blue-400 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity uppercase">Edit / Personaggi</button></div>
            <span class="text-[11px] font-bold text-slate-200 truncate uppercase tracking-tight block">${s.storie?.nome || 'Titolo non trovato'}</span></div>`;
    }).join('');
}

async function openStorieModal(dataStr = null) {
    const form = document.getElementById('storie-form'); form.reset();
    const issueSelect = document.getElementById('storie-issue-id');
    const posContainer = document.getElementById('storie-posizione-container');
    
    await loadStorieEsistenti();
    const { data: issues } = await window.supabaseClient.from('issue').select('id, numero, nome, annata(nome), serie(nome)').order('created_at', {ascending: false}).limit(100);
    issueSelect.innerHTML = `<option value="">-- Seleziona Albo --</option>` + (issues || []).map(i => `<option value="${i.id}">${i.serie?.nome || ''} #${i.numero || ''}</option>`).join('');

    if (dataStr) {
        const story = JSON.parse(decodeURIComponent(dataStr));
        document.getElementById('storie-modal-title').innerText = "Modifica Storia";
        document.getElementById('storie-id').value = story.id;
        document.getElementById('old-storia-id').value = story.id;
        document.getElementById('storie-nome').value = story.nome;
        document.getElementById('storie-issue-id').value = story.issue_id;
        document.getElementById('storie-posizione').value = story.posizione || "";
        posContainer.classList.remove('hidden');
        loadPersonaggiStoria(story.id); 
    } else {
        document.getElementById('storie-modal-title').innerText = "Nuova Storia";
        document.getElementById('storie-id').value = ""; document.getElementById('old-storia-id').value = "";
        const currentId = document.getElementById('edit-id').value;
        if (currentId) { document.getElementById('storie-issue-id').value = currentId; posContainer.classList.remove('hidden'); }
        else { posContainer.classList.add('hidden'); }
        loadPersonaggiStoria(null);
    }
    document.getElementById('storie-modal').classList.remove('hidden');
}

function closeStorieModal() { document.getElementById('storie-modal').classList.add('hidden'); }
function togglePosizioneField(val) { const container = document.getElementById('storie-posizione-container'); if(val) container.classList.remove('hidden'); else container.classList.add('hidden'); }

document.getElementById('storie-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nomeInviato = document.getElementById('storie-nome').value.trim();
    const issueId = document.getElementById('storie-issue-id').value;
    const posizione = document.getElementById('storie-posizione').value;
    const oldStoryId = document.getElementById('old-storia-id').value;

    try {
        const { data: storyExist } = await window.supabaseClient.from('storie').select('id').eq('nome', nomeInviato).maybeSingle();
        let targetStoryId;
        if (storyExist) { targetStoryId = storyExist.id; } 
        else {
            const { data: newStory } = await window.supabaseClient.from('storie').insert([{ nome: nomeInviato }]).select().single();
            targetStoryId = newStory.id;
        }

        if (issueId) {
            if (oldStoryId) {
                await window.supabaseClient.from('storie_in_issue').update({ storia_id: targetStoryId, posizione: posizione || null }).match({ issue_id: issueId, storia_id: oldStoryId });
            } else {
                await window.supabaseClient.from('storie_in_issue').insert([{ issue_id: issueId, storia_id: targetStoryId, posizione: posizione || null }]);
            }
        }
        document.getElementById('storie-id').value = targetStoryId;
        loadPersonaggiStoria(targetStoryId);
        const currentIssueId = document.getElementById('edit-id').value;
        if (currentIssueId) loadIssueStories(currentIssueId);
    } catch (err) { alert("Errore: " + err.message); }
});

// LOGICA COMUNE E ALTRI MODALI
async function loadSelectOptions(table, elementId, selectedId = null, orderBy = 'nome') {
    const { data } = await window.supabaseClient.from(table).select('*').order(orderBy);
    const select = document.getElementById(elementId);
    if (select) select.innerHTML = `<option value="">-- Seleziona --</option>` + (data || []).map(item => `<option value="${item.id}" ${item.id == selectedId ? 'selected' : ''}>${item.nome}</option>`).join('');
    return data;
}

async function loadSerieSelect(selectedId = null) {
    const { data } = await window.supabaseClient.from('serie').select('id, nome, collana(nome)').order('nome');
    const select = document.getElementById('edit-serie_id');
    select.innerHTML = `<option value="">-- Seleziona Serie --</option>` + (data || []).map(s => `<option value="${s.id}" ${s.id == selectedId ? 'selected' : ''}>${getSerieDisplayName(s)}</option>`).join('');
}

async function loadSupplementoSelect(selectedId = null) {
    const { data } = await window.supabaseClient.from('issue').select('id, numero, nome, serie(nome)').order('created_at', {ascending: false}).limit(100);
    const select = document.getElementById('edit-supplemento_id');
    select.innerHTML = `<option value="">Nessuno</option>` + (data || []).map(i => `<option value="${i.id}" ${i.id == selectedId ? 'selected' : ''}>${i.serie?.nome} #${i.numero}</option>`).join('');
}

async function handleSerieChange(serieId) {
    const btnEdit = document.getElementById('btn-edit-serie-context');
    const collanaSelect = document.getElementById('edit-collana_id');
    const btnCollana = document.getElementById('btn-edit-collana-issue');
    if (!serieId) { btnEdit.disabled = true; collanaSelect.value = ""; collanaSelect.disabled = true; btnCollana.disabled = true; return; }
    btnEdit.disabled = false;
    const { data: serie } = await window.supabaseClient.from('serie').select('collana_id').eq('id', serieId).single();
    if (serie && serie.collana_id) {
        await loadSelectOptions('collana', 'edit-collana_id', serie.collana_id);
        collanaSelect.disabled = false; btnCollana.disabled = false;
    } else { collanaSelect.value = ""; collanaSelect.disabled = true; btnCollana.disabled = true; }
}

async function openAddModal() {
    document.getElementById('modal-title').innerText = "Nuovo Albo"; document.getElementById('edit-form').reset();
    document.getElementById('edit-id').value = ""; document.getElementById('edit-preview').src = "";
    document.getElementById('issue-stories-list').innerHTML = "";
    ['serie-context', 'collana-issue', 'editore-issue', 'testata-issue', 'annata-issue'].forEach(id => { const el = document.getElementById(`btn-edit-${id}`); if(el) el.disabled = true; });
    await loadSerieSelect(); await loadSelectOptions('editore', 'edit-editore_id'); await loadSelectOptions('testata', 'edit-testata_id');
    await loadSelectOptions('annata', 'edit-annata_id'); await loadSelectOptions('tipo_pubblicazione', 'edit-tipo_pubblicazione_id');
    await loadSupplementoSelect(); document.getElementById('edit-modal').classList.remove('hidden');
}

async function openEditModal(comicData) {
    const comic = JSON.parse(decodeURIComponent(comicData));
    document.getElementById('modal-title').innerText = "Modifica Albo"; document.getElementById('edit-id').value = comic.id;
    document.getElementById('edit-nome').value = comic.nome || ""; document.getElementById('edit-numero').value = comic.numero || "";
    document.getElementById('edit-condizione').value = comic.condizione || ""; document.getElementById('edit-valore').value = comic.valore || "";
    document.getElementById('edit-possesso').value = comic.possesso || "celo"; document.getElementById('edit-data_pubblicazione').value = comic.data_pubblicazione || "";
    document.getElementById('edit-immagine_url').value = comic.immagine_url || ""; document.getElementById('edit-preview').src = comic.immagine_url || placeholderImg;
    loadIssueStories(comic.id);
    await loadSerieSelect(comic.serie_id); await loadSelectOptions('editore', 'edit-editore_id', comic.editore_id);
    await loadSelectOptions('testata', 'edit-testata_id', comic.testata_id); await loadSelectOptions('annata', 'edit-annata_id', comic.annata_id);
    await loadSelectOptions('tipo_pubblicazione', 'edit-tipo_pubblicazione_id', comic.tipo_pubblicazione_id); await loadSupplementoSelect(comic.supplemento_id);
    await handleSerieChange(comic.serie_id); document.getElementById('btn-edit-editore-issue').disabled = !comic.editore_id;
    document.getElementById('btn-edit-testata-issue').disabled = !comic.testata_id; document.getElementById('btn-edit-annata-issue').disabled = !comic.annata_id;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('edit-modal').classList.add('hidden'); }

async function openSerieModal(serieId = null) {
    document.getElementById('serie-modal-title').innerText = serieId ? "Modifica Serie" : "Nuova Serie";
    document.getElementById('serie-form').reset(); document.getElementById('new-serie-id').value = serieId || "";
    document.getElementById('new-serie-preview').src = ""; await loadSelectOptions('collana', 'new-serie-collana');
    if (serieId) {
        const { data } = await window.supabaseClient.from('serie').select('*').eq('id', serieId).single();
        if (data) {
            document.getElementById('new-serie-nome').value = data.nome; document.getElementById('new-serie-collana').value = data.collana_id || "";
            document.getElementById('new-serie-immagine').value = data.immagine_url || ""; document.getElementById('new-serie-preview').src = data.immagine_url || "";
            document.getElementById('btn-edit-collana-serie').disabled = !data.collana_id;
        }
    } else { document.getElementById('btn-edit-collana-serie').disabled = true; }
    document.getElementById('serie-modal').classList.remove('hidden');
}

function closeSerieModal() { document.getElementById('serie-modal').classList.add('hidden'); }

document.getElementById('serie-form').addEventListener('submit', async (e) => {
    e.preventDefault(); const id = document.getElementById('new-serie-id').value;
    const payload = { nome: document.getElementById('new-serie-nome').value, collana_id: document.getElementById('new-serie-collana').value || null, immagine_url: document.getElementById('new-serie-immagine').value };
    const { error } = id ? await window.supabaseClient.from('serie').update(payload).eq('id', id) : await window.supabaseClient.from('serie').insert([payload]);
    if (error) alert(error.message); else { closeSerieModal(); const currentSerie = document.getElementById('edit-serie_id').value; await loadSerieSelect(currentSerie || null); if (id && currentSerie == id) await handleSerieChange(id); await loadSerieShowcase(); }
});

function openSimpleModal(config) {
    document.getElementById('simple-modal-title').innerText = config.title; document.getElementById('simple-id').value = config.id || "";
    const previewContainer = document.getElementById('simple-preview-container'); const previewImg = document.getElementById('simple-preview-img');
    if (config.table === 'codice_editore' || config.table === 'editore') { previewContainer.classList.remove('hidden'); previewImg.src = config.img || ""; } else { previewContainer.classList.add('hidden'); }
    let html = `<div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome</label><input type="text" id="simple-nome" required value="${config.nome || ''}" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mt-1 text-sm font-bold text-white outline-none"></div>`;
    if (config.table === 'codice_editore' || config.table === 'editore') { html += `<div class="mt-4"><label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">URL Immagine / Logo</label><input type="text" id="simple-img" value="${config.img || ''}" oninput="document.getElementById('simple-preview-img').src = this.value" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mt-1 text-sm text-blue-400 outline-none"></div>`; }
    if (config.table === 'editore') { html += `<div class="mt-4"><div class="flex justify-between items-center"><label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Codice Editore</label><div class="flex gap-2"><button type="button" id="btn-edit-codice-editore" onclick="openEditCodiceFromEditore()" disabled class="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded hover:bg-blue-500/20 transition-all font-bold">✏️ EDIT</button><button type="button" onclick="openCodiceModal()" class="text-[9px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded hover:bg-yellow-500/20 transition-all font-bold">+ NUOVO</button></div></div><select id="simple-rel" onchange="document.getElementById('btn-edit-codice-editore').disabled = !this.value" class="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mt-1 text-sm font-bold text-white outline-none"></select></div>`; }
    document.getElementById('simple-form-fields').innerHTML = html;
    document.getElementById('simple-form').onsubmit = async (e) => {
        e.preventDefault(); const payload = { nome: document.getElementById('simple-nome').value }; if (document.getElementById('simple-img')) payload.immagine_url = document.getElementById('simple-img').value; if (document.getElementById('simple-rel')) payload.codice_editore_id = document.getElementById('simple-rel').value || null;
        const { error } = config.id ? await window.supabaseClient.from(config.table).update(payload).eq('id', config.id) : await window.supabaseClient.from(config.table).insert([payload]);
        if (error) alert(error.message); else { closeSimpleModal(); if (config.callback) config.callback(); }
    };
    if (config.table === 'editore') loadSelectOptions('codice_editore', 'simple-rel', config.relId).then(() => { if(config.relId) document.getElementById('btn-edit-codice-editore').disabled = false; });
    document.getElementById('simple-modal').classList.remove('hidden');
}
function closeSimpleModal() { document.getElementById('simple-modal').classList.add('hidden'); }
function openCodiceModal() { openSimpleModal({ title: "Nuovo Codice Editore", table: 'codice_editore', callback: () => { loadCodiciBar(); if(document.getElementById('simple-rel')) loadSelectOptions('codice_editore', 'simple-rel'); }}); }
async function openEditCodiceFromEditore() { const select = document.getElementById('simple-rel'); const id = select.value; if(!id) return; const { data } = await window.supabaseClient.from('codice_editore').select('*').eq('id', id).single(); openSimpleModal({ title: "Modifica Codice Editore", table: 'codice_editore', id, nome: data?.nome || "", img: data?.immagine_url || "", callback: () => { loadCodiciBar(); loadSelectOptions('codice_editore', 'simple-rel', id); } }); }
function openEditSerieFromContext() { openSerieModal(document.getElementById('edit-serie_id').value); }
function openCollanaModal() { openSimpleModal({ title: "Nuova Collana", table: 'collana', callback: () => { loadSelectOptions('collana', 'new-serie-collana'); loadSelectOptions('collana', 'edit-collana_id'); } }); }
function openEditCollanaFromIssue() { const id = document.getElementById('edit-collana_id').value; const nome = document.getElementById('edit-collana_id').options[document.getElementById('edit-collana_id').selectedIndex].text; openSimpleModal({ title: "Modifica Collana", table: 'collana', id, nome, callback: () => { loadSelectOptions('collana', 'edit-collana_id', id); } }); }
function openEditCollanaFromSerie() { const id = document.getElementById('new-serie-collana').value; const nome = document.getElementById('new-serie-collana').options[document.getElementById('new-serie-collana').selectedIndex].text; openSimpleModal({ title: "Modifica Collana", table: 'collana', id, nome, callback: () => { loadSelectOptions('collana', 'new-serie-collana', id); } }); }
function openEditoreModal() { openSimpleModal({ title: "Nuovo Editore", table: 'editore', callback: () => loadSelectOptions('editore', 'edit-editore_id') }); }
async function openEditEditoreFromIssue() { const select = document.getElementById('edit-editore_id'); const id = select.value; if(!id) return; const { data } = await window.supabaseClient.from('editore').select('*').eq('id', id).single(); openSimpleModal({ title: "Modifica Editore", table: 'editore', id, nome: data?.nome || "", img: data?.immagine_url || "", relId: data?.codice_editore_id || null, callback: () => loadSelectOptions('editore', 'edit-editore_id', id) }); }
function openTestataModal() { openSimpleModal({ title: "Nuova Testata", table: 'testata', callback: () => loadSelectOptions('testata', 'edit-testata_id') }); }
function openEditTestataFromIssue() { const select = document.getElementById('edit-testata_id'); const id = select.value; const nome = select.options[select.selectedIndex].text; openSimpleModal({ title: "Modifica Testata", table: 'testata', id, nome, callback: () => { loadSelectOptions('testata', 'edit-testata_id', id); } }); }
function openAnnataModal() { openSimpleModal({ title: "Nuova Annata", table: 'annata', callback: () => loadSelectOptions('annata', 'edit-annata_id') }); }
function openEditAnnataFromIssue() { const select = document.getElementById('edit-annata_id'); const id = select.value; const nome = select.options[select.selectedIndex].text; openSimpleModal({ title: "Modifica Annata", table: 'annata', id, nome, callback: () => { loadSelectOptions('annata', 'edit-annata_id', id); } }); }

document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault(); const id = document.getElementById('edit-id').value;
    const payload = { nome: document.getElementById('edit-nome').value, serie_id: document.getElementById('edit-serie_id').value, editore_id: document.getElementById('edit-editore_id').value || null, testata_id: document.getElementById('edit-testata_id').value || null, annata_id: document.getElementById('edit-annata_id').value || null, tipo_pubblicazione_id: document.getElementById('edit-tipo_pubblicazione_id').value || null, supplemento_id: document.getElementById('edit-supplemento_id').value || null, numero: document.getElementById('edit-numero').value, possesso: document.getElementById('edit-possesso').value, condizione: document.getElementById('edit-condizione').value === "" ? null : document.getElementById('edit-condizione').value, valore: document.getElementById('edit-valore').value === "" ? null : parseFloat(document.getElementById('edit-valore').value), data_pubblicazione: document.getElementById('edit-data_pubblicazione').value || null, immagine_url: document.getElementById('edit-immagine_url').value };
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
document.addEventListener('click', (e) => { if (!searchInput.contains(e.target)) resultsDiv.classList.add('hidden'); });
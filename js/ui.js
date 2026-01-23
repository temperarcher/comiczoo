/**
 * VERSION: 1.8.0 (Modale Edit Avanzato)
 */
export const UI = {
    // ... (HEADER e SHOWCASE rimangono invariati rispetto alla v1.7.0)

    ISSUE_FORM: (issue, dropdowns) => `
        <div class="p-2">
            <h2 class="text-xl font-black text-white uppercase mb-6 tracking-tighter flex items-center gap-2">
                ${issue.id ? '✏️ Modifica Albo' : '➕ Nuovo Albo'}
            </h2>
            <form id="form-albo" class="space-y-6">
                <input type="hidden" name="id" value="${issue.id || ''}">
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div class="md:col-span-1">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-2">Editore</label>
                        <div class="flex items-center gap-3">
                            <div id="preview-editore" class="w-12 h-12 bg-slate-900 rounded border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                <img src="${issue.brand_logo || ''}" class="w-full h-full object-contain ${!issue.brand_logo ? 'hidden' : ''}">
                            </div>
                            <select name="codice_editore_id" id="select-editore" class="w-full bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white outline-none">
                                <option value="">Seleziona...</option>
                                ${dropdowns.editori.map(e => `<option value="${e.id}" data-img="${e.immagine_url}" ${issue.codice_editore_id === e.id ? 'selected' : ''}>${e.nome}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Testata (Brand)</label>
                        <select name="editore_id" id="select-testata" class="w-full bg-slate-900 border border-slate-700 p-2 rounded text-xs text-white outline-none">
                             <option value="">Seleziona Testata...</option>
                             ${dropdowns.testate.map(t => `<option value="${t.id}" ${issue.editore_id === t.id ? 'selected' : ''}>${t.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-4">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase">Anteprima Copertina</label>
                        <div class="aspect-[2/3] w-full bg-slate-800 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group">
                            <img id="preview-cover" src="${issue.immagine_url || ''}" class="w-full h-full object-cover ${!issue.immagine_url ? 'hidden' : ''}">
                            <div id="placeholder-cover" class="text-slate-600 text-4xl ${issue.immagine_url ? 'hidden' : ''}">🖼️</div>
                        </div>
                        <input type="url" name="immagine_url" id="input-cover-url" value="${issue.immagine_url || ''}" placeholder="URL Immagine Copertina" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-xs text-white outline-none focus:border-yellow-500">
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Titolo Albo</label>
                            <input type="text" name="nome" value="${issue.nome || ''}" class="w-full bg-slate-800 border border-slate-700 p-2.5 rounded text-sm text-white outline-none focus:ring-1 focus:ring-yellow-500">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Numero</label>
                                <input type="text" name="numero" value="${issue.numero || ''}" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data Pubblicazione</label>
                                <input type="text" name="data_pubblicazione" value="${issue.data_pubblicazione || ''}" placeholder="es: Gennaio 1970" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white">
                            </div>
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Serie</label>
                            <select name="serie_id" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white">
                                ${dropdowns.serie.map(s => `<option value="${s.id}" ${issue.serie_id === s.id ? 'selected' : ''}>${s.nome}</option>`).join('')}
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo Pubblicazione</label>
                                <select name="tipo_pubblicazione_id" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white">
                                    ${dropdowns.tipi.map(t => `<option value="${t.id}" ${issue.tipo_pubblicazione_id === t.id ? 'selected' : ''}>${t.nome}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Supplemento</label>
                                <input type="text" name="supplemento" value="${issue.supplemento || ''}" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 pt-2">
                             <div>
                                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Valore (€)</label>
                                <input type="number" step="0.01" name="valore" value="${issue.valore || ''}" class="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-white font-mono">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stato</label>
                                <div class="flex bg-slate-900 p-1 rounded border border-slate-700">
                                    <label class="flex-1 text-center cursor-pointer">
                                        <input type="radio" name="possesso" value="celo" class="hidden peer" ${issue.possesso !== 'manca' ? 'checked' : ''}>
                                        <div class="text-[9px] uppercase font-bold p-1 rounded peer-checked:bg-green-600 peer-checked:text-white text-slate-500">Celo</div>
                                    </label>
                                    <label class="flex-1 text-center cursor-pointer">
                                        <input type="radio" name="possesso" value="manca" class="hidden peer" ${issue.possesso === 'manca' ? 'checked' : ''}>
                                        <div class="text-[9px] uppercase font-bold p-1 rounded peer-checked:bg-red-600 peer-checked:text-white text-slate-500">Manca</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4 pt-6 border-t border-slate-800">
                    <button type="submit" class="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-yellow-500/20 transition-all">Salva Modifiche</button>
                    <button type="button" id="cancel-form" class="px-8 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl uppercase text-xs transition-all">Annulla</button>
                </div>
            </form>
        </div>`
};
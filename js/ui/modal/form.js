/**
 * VERSION: 1.0.0 

 */
export const form = (issue, dropdowns) => `
    <div class="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden max-w-4xl w-full">
        <form id="form-albo" class="p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
            <input type="hidden" name="id" value="${issue.id || ''}">
            <div class="md:col-span-4">
                <div class="aspect-[3/4] bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 overflow-hidden relative mb-4">
                    <img id="preview-cover" src="${issue.immagine_url || ''}" class="w-full h-full object-cover ${issue.immagine_url ? '' : 'hidden'}">
                </div>
                <label class="text-[10px] font-black text-slate-500 uppercase">URL Immagine</label>
                <input type="text" name="immagine_url" id="input-cover-url" value="${issue.immagine_url || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white text-xs">
            </div>
            <div class="md:col-span-8 grid grid-cols-2 gap-4">
                <div class="col-span-full">
                    <label class="text-[10px] font-black text-slate-500 uppercase">Titolo</label>
                    <input type="text" name="nome" value="${issue.nome || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white" required>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-500 uppercase">Brand (Codice Editore)</label>
                    <select name="codice_editore_id" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                        <option value="">Seleziona Brand...</option>
                        ${dropdowns.codici.map(c => `<option value="${c.id}" ${issue.codice_editore_id == c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-500 uppercase">Serie</label>
                    <select name="serie_id" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white" required>
                        <option value="">Seleziona Serie...</option>
                        ${dropdowns.serie.map(s => `<option value="${s.id}" ${issue.serie_id == s.id ? 'selected' : ''}>${s.nome}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-500 uppercase">Numero</label>
                    <input type="text" name="numero" value="${issue.numero || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-500 uppercase">Valore (€)</label>
                    <input type="number" step="0.01" name="valore" value="${issue.valore || ''}" class="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white">
                </div>

                <div class="col-span-full mt-2">
                    <label class="text-[10px] font-black text-slate-500 uppercase block mb-3">Stato Possesso</label>
                    <div class="flex gap-4">
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="possesso" value="celo" class="hidden peer" ${issue.possesso === 'celo' ? 'checked' : ''}>
                            <div class="p-4 rounded-2xl border-2 border-slate-800 text-center transition-all peer-checked:border-green-500 peer-checked:bg-green-500/10">
                                <span class="text-xs font-black uppercase text-slate-500 peer-checked:text-green-500">Celo</span>
                            </div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="possesso" value="manca" class="hidden peer" ${issue.possesso === 'manca' ? 'checked' : ''}>
                            <div class="p-4 rounded-2xl border-2 border-slate-800 text-center transition-all peer-checked:border-red-500 peer-checked:bg-red-500/10">
                                <span class="text-xs font-black uppercase text-slate-500 peer-checked:text-red-500">Manca</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="col-span-full flex gap-4 pt-6 border-t border-slate-800 mt-4">
                    <button type="submit" class="flex-1 bg-yellow-500 text-slate-900 font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-yellow-500/20 transition-all">Salva Albo</button>
                    <button type="button" id="cancel-form" class="px-8 bg-slate-700 text-white font-bold rounded-xl uppercase text-xs transition-all">Annulla</button>
                </div>
            </div>
        </form>
    </div>`;
export async function openModal(id) {
    // Recupera i dati dalla vista
    const { data } = await client.from('v_collezione_profonda').select('*').eq('issue_id', id).single();
    
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50";
    modal.innerHTML = `
        <div class="bg-zinc-800 max-w-2xl w-full p-6 rounded-lg overflow-y-auto max-h-screen">
            <button onclick="this.parentElement.parentElement.remove()" class="float-right text-2xl">&times;</button>
            <div class="grid grid-cols-2 gap-4">
                <img src="${data.immagine_url}">
                <div>
                    <div class="field-atomo mb-4">
                        <label class="text-zinc-500 text-sm">Titolo</label>
                        <div class="flex justify-between border-b border-zinc-700">
                            <span>${data.issue_nome || 'N/A'}</span>
                            <button onclick="editField('${data.issue_id}', 'nome', 'text')" class="text-blue-400 text-xs">EDIT</button>
                        </div>
                    </div>
                    <div class="field-atomo">
                        <label class="text-zinc-500 text-sm">Contenuti</label>
                        ${data.contenuti_storie.map(s => `<p class="text-xs">${s.storia_nome}</p>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
// Esposto globalmente per semplicità nel prototipo atomico
window.editField = (id, field, type) => { /* Chiama edit-field-modal.js */ };
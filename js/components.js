/**
 * VERSION: 8.0.0
 * VINCOLO: Funzioni PURE. Ricevono un oggetto (es. issue) e restituiscono una stringa HTML.
 */
import { store } from './store.js';

export const components = {
    /**
     * Card dell'albo per la griglia o la lista
     */
    issueCard(issue) {
        const isList = store.state.viewMode === 'list';
        const badgeStyle = store.config.badgeColors[issue.possesso] || '';
        const cover = issue.immagine_url || store.config.placeholders.cover;
        
        // Layout adattivo basato su viewMode
        const wrapperClass = isList 
            ? "flex flex-row items-center gap-4 p-2 bg-slate-800 border-b border-slate-700 hover:bg-slate-700"
            : "flex flex-col bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-yellow-500 transition-all";

        const imgClass = isList ? "w-16 h-24 object-cover rounded" : "w-full h-auto aspect-[2/3] object-cover";

        return `
            <div class="${wrapperClass}" data-id="${issue.id}">
                <img src="${cover}" class="${imgClass}" loading="lazy">
                <div class="p-3 flex-1">
                    <div class="flex justify-between items-start">
                        <span class="text-[10px] uppercase font-bold text-slate-500">${issue.testata?.nome || ''}</span>
                        <span class="px-2 py-0.5 text-[9px] rounded-full border ${badgeStyle}">${issue.possesso.toUpperCase()}</span>
                    </div>
                    <h3 class="font-bold text-yellow-500 text-sm leading-tight mt-1 line-clamp-2">${issue.nome || 'Senza Titolo'}</h3>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-xs text-white font-mono">#${issue.numero}</span>
                        <span class="text-[10px] text-slate-400">${issue.annata?.nome || ''}</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Singola storia con i suoi personaggi (da usare nel modale)
     */
    storyItem(storyInIssue) {
        const story = storyInIssue.storie;
        const personaggi = story.personaggi_storie || [];
        
        const charactersHtml = personaggi.map(p => `
            <div class="flex items-center gap-1 bg-slate-900 rounded-full pr-2 border border-slate-700">
                <img src="${p.personaggio.immagine_url || store.config.placeholders.avatar}" class="w-6 h-6 rounded-full object-cover">
                <span class="text-[10px] text-slate-300">${p.personaggio.nome}</span>
            </div>
        `).join('');

        return `
            <div class="py-3 border-l-2 border-yellow-600 pl-4 mb-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-yellow-600 font-bold">POS. ${storyInIssue.posizione}</span>
                    <h4 class="text-white font-bold flex-1 ml-3">${story.nome}</h4>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${charactersHtml}
                </div>
            </div>
        `;
    }
};
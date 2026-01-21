/**
 * VERSION: 8.2.1
 * MODIFICA: Supporto stato attivo per Brand (Showcase)
 */
import { store } from './store.js';

export const components = {
    // Pillola Editore con stato attivo/inattivo
    publisherPill(pub) {
        const isActive = store.state.selectedBrand == pub.id;
        const activeClass = isActive 
            ? 'border-yellow-500 bg-yellow-500/20 ring-1 ring-yellow-500' 
            : 'border-slate-700 bg-slate-900/50 grayscale opacity-70';
        
        return `
            <div class="flex-none ${activeClass} border rounded-full px-4 py-2 flex items-center gap-3 hover:border-yellow-500 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer whitespace-nowrap" data-brand-id="${pub.id}">
                <img src="${pub.immagine_url || store.config.placeholders.logo}" class="h-5 w-auto object-contain">
                <span class="text-xs font-bold ${isActive ? 'text-yellow-500' : 'text-slate-400'}">${pub.nome}</span>
            </div>`;
    },

    serieShowcaseItem(serie) {
        return `
            <div class="flex-none group cursor-pointer" data-serie-id="${serie.id}">
                <div class="relative overflow-hidden rounded-lg border border-slate-800 group-hover:border-yellow-500 transition-all w-32 md:w-40">
                    <img src="${serie.immagine_url || store.config.placeholders.cover}" class="w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-2">
                        <p class="text-[10px] font-bold text-white truncate">${serie.nome}</p>
                    </div>
                </div>
            </div>`;
    },

    issueCard(issue) {
        const badgeStyle = store.config.badgeColors[issue.possesso] || 'bg-slate-700 text-slate-300';
        return `
            <div class="flex flex-col bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-yellow-500 transition-all cursor-pointer" data-id="${issue.id}">
                <img src="${issue.immagine_url || store.config.placeholders.cover}" class="w-full h-auto aspect-[2/3] object-cover" loading="lazy">
                <div class="p-3 flex-1">
                    <div class="flex justify-between items-start">
                        <span class="text-[9px] uppercase font-bold text-slate-500">${issue.testata?.nome || ''}</span>
                        <span class="px-2 py-0.5 text-[8px] rounded-full border ${badgeStyle}">${issue.possesso?.toUpperCase() || ''}</span>
                    </div>
                    <h3 class="font-bold text-yellow-500 text-sm leading-tight mt-1 line-clamp-2">${issue.nome || 'Senza Titolo'}</h3>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-xs text-white font-mono">#${issue.numero}</span>
                        <span class="text-[10px] text-slate-400">${issue.annata?.nome || ''}</span>
                    </div>
                </div>
            </div>`;
    },

    storyItem(si) {
        const storia = si.storia;
        const personaggiRel = storia?.personaggio_storia || [];
        const chars = personaggiRel.map(p => `
            <div class="flex items-center gap-1 bg-slate-950 rounded-full pr-2 border border-slate-800">
                <img src="${p.personaggio?.immagine_url || store.config.placeholders.avatar}" class="w-5 h-5 rounded-full object-cover">
                <span class="text-[9px] text-slate-400">${p.personaggio?.nome || ''}</span>
            </div>`).join('');
        return `
            <div class="py-3 border-l-2 border-yellow-600 pl-4 mb-3 bg-slate-800/30 rounded-r-lg">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[9px] text-yellow-600 font-bold uppercase">Pos. ${si.posizione}</span>
                    <h4 class="text-white font-bold flex-1 ml-3 text-sm">${storia?.nome || 'Storia senza titolo'}</h4>
                </div>
                <div class="flex flex-wrap gap-1.5">${chars}</div>
            </div>`;
    }
};
/**
 * VERSION: 1.1.9
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
export const issues = {
    SECTION: (content) => `
        <section class="p-6">
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                ${content}
            </div>
        </section>`,

    CARD: (issue) => {
        const isManca = issue.possesso === 'manca';
        const imgClass = isManca ? 'grayscale opacity-60' : '';
        
        // Didascalia 1: Serie + Testata
        const row1 = [issue.serie?.nome, issue.testata?.nome].filter(Boolean).join(' - ');
        
        // Didascalia 2: Annata + Numero + Nome
        const row2 = [issue.annata?.nome, issue.numero ? `n°${issue.numero}` : null, issue.nome]
            .filter(Boolean).join(' ');

        return `
            <div class="flex flex-col gap-1 group cursor-pointer">
                <div class="aspect-[2/3] bg-slate-800 rounded-sm overflow-hidden border border-slate-700 shadow-sm transition-transform group-hover:scale-105">
                    <img src="${issue.immagine_url}" alt="${issue.nome}" class="w-full h-full object-cover ${imgClass}">
                </div>
                <div class="flex flex-col text-[10px] leading-tight">
                    <span class="text-slate-400 truncate font-medium">${row1}</span>
                    <span class="text-slate-200 truncate font-bold">${row2}</span>
                    <div class="flex gap-0.5 mt-0.5">${issues.STARS(issue.condizione)}</div>
                </div>
            </div>`;
    },

    STARS: (val) => {
        if (!val) return '';
        let color = 'text-slate-600'; // Default
        if (val <= 2) color = 'text-red-500';
        else if (val <= 4) color = 'text-white';
        else if (val === 5) color = 'text-yellow-500';

        return Array(5).fill(0).map((_, i) => `
            <svg class="w-2.5 h-2.5 ${i < val ? color : 'text-slate-800'}" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        `).join('');
    }
};
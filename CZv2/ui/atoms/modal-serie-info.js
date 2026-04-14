// CZv2/ui/atoms/modal-issue-info.js
import { STAR_RATING } from './star-rating.js';

export const MODAL_ISSUE_INFO = {
    RENDER: (issue, isAdmin = false) => {
        // Helper per i blocchi di dati standard
        const renderBlock = (label, value, key, type) => `
            <div class="flex-1 bg-slate-800/30 p-3 rounded-lg border border-white/5 transition-colors hover:border-white/10">
                <p class="text-[8px] uppercase text-slate-500 font-black tracking-widest mb-1">${label}</p>
                ${isAdmin 
                    ? `<input type="${type}" id="edit-issue-${key}" class="bg-transparent text-white font-bold w-full focus:outline-none focus:text-yellow-500 transition-colors" value="${issue[key] || ''}">`
                    : `<p class="text-sm font-bold text-slate-200">${value || '-'}</p>`
                }
            </div>
        `;

        // Logica Supplemento
        let supplementoText = 'Nessuno';
        if (issue.supplemento) {
            const s = issue.supplemento;
            const annataStr = s.annata?.nome ? `${s.annata.nome} ` : '';
            const dataStr = s.data_pubblicazione 
                ? ` del ${new Date(s.data_pubblicazione).toLocaleDateString('it-IT')}` 
                : '';
            supplementoText = `${s.serie?.nome} ${annataStr}#${s.numero}${dataStr}`;
        }

        return `
            <div class="flex flex-col gap-4">
                
                <div class="flex gap-4">
                    ${renderBlock('Numero Albo', issue.numero, 'numero', 'number')}
                    ${renderBlock('Titolo Albo', issue.nome, 'nome', 'text')}
                </div>

                <div class="flex gap-4">
                    ${renderBlock('Testata', issue.testata?.nome, 'testata_id', 'select')}
                    ${renderBlock('Annata', issue.annata?.nome, 'annata_id', 'select')}
                </div>

                <div class="flex gap-4">
                    ${renderBlock('Data Pubblicazione', issue.data_pubblicazione, 'data_pubblicazione', 'date')}
                    ${renderBlock('Supplemento a', supplementoText, 'supplemento_id', 'select')}
                </div>

                <div class="flex gap-4">
                    ${renderBlock('Valore stimato', issue.valore ? issue.valore + ' €' : '0 €', 'valore', 'number')}
                    
                    <div class="flex-1 bg-slate-800/30 p-3 rounded-lg border border-white/5 transition-colors hover:border-white/10">
                        <p class="text-[8px] uppercase text-slate-500 font-black tracking-widest mb-1">Stato Conservazione</p>
                        ${STAR_RATING.RENDER(issue.condizione, isAdmin)}
                    </div>
                </div>

                <div class="flex gap-4">
                    ${renderBlock('Editore', issue.editore?.nome, 'editore_id', 'select')}
                    ${renderBlock('Tipo Pubblicazione', issue.tipo_pubblicazione?.nome, 'tipo_pubblicazione_id', 'select')}
                </div>

            </div>
        `;
    }
};
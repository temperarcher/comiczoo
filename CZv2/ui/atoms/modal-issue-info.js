// CZv2/ui/atoms/modal-issue-info.js
export const MODAL_ISSUE_INFO = {
    RENDER: (issue, isAdmin = false) => `
        <div class="grid grid-cols-2 gap-4">
            ${[
                { label: 'Valore', value: issue.valore + ' €', key: 'valore', type: 'number' },
                { label: 'Condizione', value: issue.condizione + ' / 5', key: 'condizione', type: 'select' },
                { label: 'Annata', value: issue.annata?.nome || '-', key: 'annata_id', type: 'select' },
                { label: 'Data', value: issue.data_pubblicazione || '-', key: 'data_pubblicazione', type: 'date' }
            ].map(item => `
                <div class="bg-slate-800/30 p-3 rounded-lg border border-white/5">
                    <p class="text-[8px] uppercase text-slate-500 font-bold mb-1">${item.label}</p>
                    ${isAdmin 
                        ? `<input type="${item.type}" class="bg-transparent text-white font-bold w-full focus:outline-none focus:text-yellow-500 transition-colors" value="${issue[item.key] || ''}">`
                        : `<p class="text-sm font-bold text-slate-200">${item.value}</p>`
                    }
                </div>
            `).join('')}
        </div>
    `
};
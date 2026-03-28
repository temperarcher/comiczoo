// CZv2/components/modal-controller.js
import { Fetcher } from '../api/fetcher.js';
import { MODAL_FRAME } from '../ui/atoms/modal-frame.js';
import { MODAL_HEADER } from '../ui/atoms/modal-header.js';
import { MODAL_ISSUE_INFO } from '../ui/atoms/modal-issue-info.js';
import { MODAL_SERIE_INFO } from '../ui/atoms/modal-serie-info.js';
import { MODAL_STORIES } from '../ui/atoms/modal-stories.js';

export const ModalController = {
    currentIssue: null,
    isAdminMode: false,

    async open(issueId) {
        this.isAdminMode = false; // Reset sempre in modalità visione
        
        // 1. Mostra caricamento immediato
        this.renderLoading();

        try {
            // 2. Recupero dati profondi (Storie -> Personaggi)
            // Nota: Useremo un metodo specifico del fetcher che fa il join delle tabelle
            this.currentIssue = await Fetcher.getIssueDetails(issueId);
            
            this.render();
        } catch (err) {
            console.error("Errore caricamento dettagli:", err);
            this.close();
        }
    },

    render() {
        const app = document.getElementById('app');
        const issue = this.currentIssue;

        // Composizione del contenuto del modale (Opzione A)
        const content = `
            ${MODAL_HEADER.RENDER(issue, this.isAdminMode)}
            
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    <div class="lg:col-span-4 flex flex-col gap-6">
                        <div class="relative group aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800">
                            <img src="${issue.immagine_url}" class="w-full h-full object-cover shadow-glow">
                            
                            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                <span class="text-[10px] font-black uppercase tracking-widest ${issue.possesso === 'celo' ? 'text-yellow-500' : 'text-slate-500'}">
                                    ${issue.possesso}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-8 flex flex-col gap-8">
                        ${MODAL_SERIE_INFO.RENDER(issue.serie, this.isAdminMode)}
                        ${MODAL_ISSUE_INFO.RENDER(issue, this.isAdminMode)}
                        ${MODAL_STORIES.RENDER(issue.storia_in_issue, this.isAdminMode)}
                    </div>

                </div>
            </div>

            ${this.isAdminMode ? `
                <div class="p-4 bg-yellow-500 flex justify-between items-center px-10">
                    <button id="btn-delete-issue" class="text-[10px] font-black text-black/50 hover:text-red-700 uppercase">Elimina Albo</button>
                    <button id="btn-save-issue" class="bg-black text-white px-8 py-2 rounded-lg font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Salva Modifiche</button>
                </div>
            ` : ''}
        `;

        // Iniezione nel Frame
        const modalHTML = MODAL_FRAME.RENDER(content);
        
        // Se il modale esiste già lo aggiorniamo, altrimenti lo creiamo
        let overlay = document.getElementById('modal-overlay');
        if (!overlay) {
            app.insertAdjacentHTML('beforeend', modalHTML);
        } else {
            overlay.outerHTML = modalHTML;
        }

        this.attachEvents();
    },

    attachEvents() {
        // Chiusura
        document.getElementById('close-modal').onclick = () => this.close();
        
        // Toggle Admin Mode
        const toggle = document.getElementById('admin-mode-toggle');
        if (toggle) {
            toggle.onchange = (e) => {
                this.isAdminMode = e.target.checked;
                this.render(); // Re-renderizza con i campi input
            };
        }

        // Click fuori dal modale per chiudere
        const overlay = document.getElementById('modal-overlay');
        overlay.onclick = (e) => {
            if (e.target.id === 'modal-overlay') this.close();
        };

        // Logica di salvataggio (Placeholder per ora)
        const saveBtn = document.getElementById('btn-save-issue');
        if (saveBtn) {
            saveBtn.onclick = () => this.handleSave();
        }
    },

    renderLoading() {
        const app = document.getElementById('app');
        const loadingContent = `
            <div class="flex flex-col items-center justify-center h-[60vh] text-yellow-500 gap-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <p class="text-[10px] font-black uppercase tracking-[0.4em]">Consultazione Vault...</p>
            </div>
        `;
        app.insertAdjacentHTML('beforeend', MODAL_FRAME.RENDER(loadingContent));
    },

    close() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) overlay.remove();
    },

    async handleSave() {
        console.log("Salvataggio dati su Supabase...");
        // Qui integreremo la chiamata a Editor.upsertIssue()
        this.isAdminMode = false;
        this.render();
    }
};
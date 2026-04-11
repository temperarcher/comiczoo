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
        this.isAdminMode = false;
        this.renderLoading();
        try {
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

        const content = `
            ${MODAL_HEADER.RENDER(issue, this.isAdminMode)}
            
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    <div class="lg:col-span-4 flex flex-col gap-6">
                        <div class="relative group aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800">
                            <img src="${issue.immagine_url}" class="w-full h-full object-cover shadow-glow transition-transform duration-700 group-hover:scale-105">
                        </div>
                    </div>

                    <div class="lg:col-span-8 flex flex-col gap-8">
                        ${MODAL_SERIE_INFO.RENDER(issue.serie, issue.possesso, this.isAdminMode)}
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

        const modalHTML = MODAL_FRAME.RENDER(content);
        let overlay = document.getElementById('modal-overlay');
        if (!overlay) {
            app.insertAdjacentHTML('beforeend', modalHTML);
        } else {
            overlay.outerHTML = modalHTML;
        }

        this.attachEvents();
    },

    attachEvents() {
        document.getElementById('close-modal').onclick = () => this.close();
        
        const toggle = document.getElementById('admin-mode-toggle');
        if (toggle) {
            toggle.onchange = (e) => {
                this.isAdminMode = e.target.checked;
                this.render();
            };
        }

        const overlay = document.getElementById('modal-overlay');
        overlay.onclick = (e) => { if (e.target.id === 'modal-overlay') this.close(); };

        const saveBtn = document.getElementById('btn-save-issue');
        if (saveBtn) saveBtn.onclick = () => this.handleSave();
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
        this.isAdminMode = false;
        this.render();
    }
};
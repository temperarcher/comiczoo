// CZv2/ui/atoms/modal-frame.js
export const MODAL_FRAME = {
    RENDER: (content) => `
        <div id="modal-overlay" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"></div>
            
            <div id="modal-content" class="relative bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                ${content}
            </div>
        </div>
    `
};
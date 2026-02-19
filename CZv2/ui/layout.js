// CZv2/ui/layout.js
export const LAYOUT = {
    MAIN_STRUCTURE: `
        <div class="min-h-screen bg-slate-950 text-white font-sans">
            <header class="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <h1 class="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">ComicZoo v2</h1>
                <button id="btn-logout" class="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest underline transition-colors">Logout</button>
            </header>

            <section id="topbar-container" class="border-b border-slate-800"></section>

            <section id="series-selector-container" class="bg-slate-900/20 border-b border-slate-900 py-4"></section>

            <main id="grid-container" class="p-6"></main>
        </div>
    `
};
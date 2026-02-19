// CZv2/ui/layout.js
export const LAYOUT = {
    MAIN_STRUCTURE: `
        <div class="min-h-screen bg-slate-950 text-white font-sans">
            <header class="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <h1 class="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter">ComicZoo v2</h1>
                <button id="btn-logout" class="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest underline transition-colors">Logout</button>
            </header>

            <section id="topbar-container" class="p-6 bg-slate-900/30 border-b border-slate-900"></section>

            <div class="flex p-6 gap-8">
                <aside id="series-selector-container" class="w-72 shrink-0 border border-slate-900 rounded-2xl p-4 bg-slate-900/10 min-h-[500px]">
                    <p class="text-[10px] text-slate-700 uppercase tracking-widest text-center py-20">Caricamento...</p>
                </aside>

                <main id="grid-container" class="flex-1 border border-slate-900 rounded-2xl p-4 bg-slate-900/5 min-h-[500px]">
                    <p class="text-[10px] text-slate-700 uppercase tracking-widest text-center py-20">Area Albi</p>
                </main>
            </div>
        </div>
    `
};
// CZv2/ui/auth-ui.js
export const AUTH_UI = {
    LOGIN_SCREEN: `
        <div id="login-screen" class="fixed inset-0 bg-slate-950 z-[1000] flex items-center justify-center p-6">
            <div class="w-full max-w-sm space-y-12 text-center">
                <div class="space-y-2">
                    <h1 class="text-5xl font-black text-yellow-500 italic tracking-tighter uppercase leading-none">
                        CZv2<br><span class="text-white not-italic text-3xl">Archive</span>
                    </h1>
                    <p class="text-slate-500 text-[10px] uppercase tracking-[0.4em]">Private Collection Access Only</p>
                </div>

                <button id="btn-google-login" 
                    class="group relative w-full flex items-center justify-center gap-4 bg-white hover:bg-yellow-500 text-black font-black py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="G">
                    <span class="uppercase tracking-widest text-xs">Accedi con Google</span>
                </button>

                <div id="auth-error" class="text-red-500 text-[9px] uppercase font-bold tracking-widest min-h-[1.2em]"></div>
            </div>
        </div>
    `
};
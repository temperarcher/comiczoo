// CZv2/ui/auth-ui.js
export const AUTH_UI = {
    LOGIN_FORM: `
        <div id="login-screen" class="fixed inset-0 bg-slate-950 z-[1000] flex items-center justify-center p-6">
            <div class="w-full max-w-sm space-y-8">
                <div class="text-center">
                    <h1 class="text-4xl font-black text-yellow-500 italic tracking-tighter uppercase">CZv2 Access</h1>
                    <p class="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-2">Private Collection Database</p>
                </div>
                <div class="space-y-4">
                    <input type="email" id="auth-email" placeholder="EMAIL" 
                        class="w-full bg-slate-900 border border-slate-800 p-4 rounded text-white outline-none focus:border-yellow-500 transition-all text-xs uppercase tracking-widest">
                    <input type="password" id="auth-password" placeholder="PASSWORD" 
                        class="w-full bg-slate-900 border border-slate-800 p-4 rounded text-white outline-none focus:border-yellow-500 transition-all text-xs uppercase tracking-widest">
                    <button id="btn-login" 
                        class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded uppercase tracking-widest text-xs transition-all">
                        Entra nell'Archivio
                    </button>
                </div>
                <div id="auth-error" class="text-red-500 text-[9px] uppercase text-center font-bold tracking-widest min-h-[1em]"></div>
            </div>
        </div>
    `
};
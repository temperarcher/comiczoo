// CZv2/ui/auth-ui.js
export const AUTH_UI = {
    LOGIN_FORM: `
        <div id="login-screen" class="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 font-sans">
            <div class="w-full max-w-sm">
                <div class="mb-10 text-center">
                    <h1 class="text-5xl font-black text-yellow-500 italic tracking-tighter uppercase leading-none">
                        CZv2<br><span class="text-white not-italic text-3xl">Archive</span>
                    </h1>
                    <p class="text-slate-600 text-[10px] uppercase tracking-[0.4em] mt-4 font-bold">Accesso Riservato</p>
                </div>
                
                <div class="space-y-3">
                    <input type="email" id="auth-email" placeholder="EMAIL" 
                        class="w-full bg-slate-900 border border-slate-800 p-4 rounded-lg text-white outline-none focus:border-yellow-500 transition-all text-xs tracking-widest uppercase">
                    
                    <input type="password" id="auth-password" placeholder="PASSWORD" 
                        class="w-full bg-slate-900 border border-slate-800 p-4 rounded-lg text-white outline-none focus:border-yellow-500 transition-all text-xs tracking-widest uppercase">
                    
                    <button id="btn-login" 
                        class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-lg uppercase tracking-widest text-xs transition-all mt-4">
                        Entra nel Database
                    </button>
                </div>
                
                <div id="auth-error" class="text-red-500 text-[10px] uppercase text-center font-bold tracking-widest mt-6 min-h-[1em]"></div>
            </div>
        </div>
    `
};
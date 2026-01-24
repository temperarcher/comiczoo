/**
 * VERSION: 1.0.0
 
 */
import { Render } from './render.js';
import { supabase } from './supabase-client.js';

// Stato globale dell'applicazione
let state = {
    issues: [],
    publishers: [],
    series: [],
    activePublisher: null
};

async function initApp() {
    try {
        // 1. Inizializza la struttura base (Header e Wrapper Modale)
        Render.initLayout();

        // 2. Carica i dati iniziali in parallelo per massima velocità
        const [resIssues, resPubs, resSeries] = await Promise.all([
            supabase.from('issue_view').select('*').order('numero', { ascending: true }),
            supabase.from('editore').select('*').order('nome'),
            supabase.from('serie').select('*').order('nome')
        ]);

        state.issues = resIssues.data || [];
        state.publishers = resPubs.data || [];
        state.series = resSeries.data || [];

        // 3. Renderizza i componenti atomizzati
        Render.publishers(state.publishers);
        Render.series(state.series);
        Render.grid(state.issues);

        // 4. Attiva i listener (Filtri, Ricerca, Modale)
        setupEventListeners();

        console.log("Sistema Atomizzato: Dati caricati e UI renderizzata.");
    } catch (error) {
        console.error("Errore fatale durante l'avvio:", error);
    }
}

function setupEventListeners() {
    // Listener per la ricerca
    document.getElementById('serie-search')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = state.issues.filter(i => 
            i.nome.toLowerCase().includes(term) || 
            i.testata.toLowerCase().includes(term)
        );
        Render.grid(filtered);
    });

    // Listener per apertura modale (Delegation)
    document.addEventListener('click', async (e) => {
        const card = e.target.closest('[data-id]');
        if (card) {
            const id = card.getAttribute('data-id');
            const issue = state.issues.find(i => i.id == id);
            
            // Recupero storie per il modale (Logica consolidata v7.0)
            const { data: storie } = await supabase
                .from('storie_in_issue')
                .select(`
                    posizione,
                    storia:storie(
                        nome,
                        personaggi:personaggi_in_storie(
                            char:personaggi(nome, immagine_url)
                        )
                    )
                `)
                .eq('issue_id', id);

            // Adattamento dati per l'atomo stories.js
            const formattedStories = storie.map(s => ({
                nome: s.storia.nome,
                info_collegamento: { posizione: s.posizione },
                personaggi: s.storia.personaggi.map(p => p.char)
            }));

            Render.modalDetails(issue, formattedStories);
            document.getElementById('issue-modal').classList.remove('hidden');
            document.getElementById('issue-modal').classList.add('flex');
        }

        // Chiusura modale
        if (e.target.id === 'close-modal' || e.target.id === 'issue-modal') {
            document.getElementById('issue-modal').classList.add('hidden');
            document.getElementById('issue-modal').classList.remove('flex');
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);
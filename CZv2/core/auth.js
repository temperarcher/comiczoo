// config.js
const SUPABASE_URL = 'https://ljylddlredinveheaagd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KkV7wImbPxzJfQkroc_ciA_HkbZiAKB';

// Inizializza il client
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Esportiamo una funzione o l'oggetto per usarlo altrove
window.supabaseClient = _supabase;

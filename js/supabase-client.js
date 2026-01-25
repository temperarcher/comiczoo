/**
 * VERSION: 1.1.0 - Modulo ES6 per Architettura Atomica
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ljylddlredinveheaagd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KkV7wImbPxzJfQkroc_ciA_HkbZiAKB';

// Esportiamo direttamente l'istanza con il nome corretto cercato da main.js
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
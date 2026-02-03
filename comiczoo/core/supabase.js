/**
 * VERSION: 1.3.6
 * PROTOCOLLO DI INTEGRITÀ: È FATTO DIVIETO DI OTTIMIZZARE O SEMPLIFICARE PARTI CONSOLIDATE.
 * IN CASO DI MODIFICHE NON INTERESSATE DAL TASK, COPIARE E INCOLLARE INTEGRALMENTE IL CODICE PRECEDENTE.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ljylddlredinveheaagd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KkV7wImbPxzJfQkroc_ciA_HkbZiAKB';

export const client = createClient(SUPABASE_URL, SUPABASE_KEY);
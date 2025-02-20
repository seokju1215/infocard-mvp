import { createClient } from "@supabase/supabase-js";

// Supabase에서 복사한 `Project URL` & `anon public API Key`
const SUPABASE_URL = "https://lpyhiwqtathursomrtbw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweWhpd3F0YXRodXJzb21ydGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzE1NjcsImV4cCI6MjA1NTAwNzU2N30.8mVa2_pRK17ZUIvgfcFKQR1IikWQtZGqx46TTS-r27A";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export { supabase };
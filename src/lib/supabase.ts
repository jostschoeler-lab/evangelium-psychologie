import { createClient } from "@supabase/supabase-js";

// Die Werte kommen aus deinen Environment-Variablen in Vercel
// (VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY müssen dort gesetzt sein)
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Falls die Variablen fehlen → Fehler werfen
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase-Umgebungsvariablen fehlen! Bitte in Vercel prüfen.");
}

// Den Supabase-Client erstellen
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

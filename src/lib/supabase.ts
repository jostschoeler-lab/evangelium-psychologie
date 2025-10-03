// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Diese Fehlermeldung hilft dir, wenn die ENV-Variablen fehlen.
  throw new Error(
    "Supabase ENV Variablen fehlen. Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY setzen."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

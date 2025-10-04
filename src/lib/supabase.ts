// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Trim + Slash entfernen
const SUPABASE_URL = rawUrl?.trim().replace(/\/+$/, "")
const SUPABASE_KEY = rawKey?.trim()

if (!SUPABASE_URL) {
  throw new Error("Fehler: VITE_SUPABASE_URL fehlt oder ist leer.")
}
if (!/^https:\/\/[a-z0-9.-]+\.supabase\.co$/.test(SUPABASE_URL)) {
  throw new Error(`Fehler: Supabase URL ungültig -> "${SUPABASE_URL}"`)
}
if (!SUPABASE_KEY) {
  throw new Error("Fehler: VITE_SUPABASE_ANON_KEY fehlt oder ist leer.")
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

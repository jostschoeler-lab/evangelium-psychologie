// src/lib/storage.ts
import { supabase } from "./supabase";

/**
 * Struktur entspricht deiner Tabelle `entries`.
 * Optional/nullable, weil Felder auch leer sein können.
 */
export type EntryRow = {
  id: string;
  created_at: string;
  bible_reference: string | null;
  theological_explanation: string | null;
  psychological_term: string | null;
  bridge_text: string | null;
  tags: string | null;
  visibility: string | null;
  notes: string | null;
  psychology_comment: string | null;
  theological_background: string | null;
  psychological_background: string | null;
};

export type EntryDraft = {
  bible_reference?: string;
  theological_explanation?: string;
  psychological_term?: string;
  bridge_text?: string;
  tags?: string;
  visibility?: string;
  notes?: string;
  psychology_comment?: string;
  theological_background?: string;
  psychological_background?: string;
};

/**
 * Speichert einen neuen Datensatz in `entries`.
 * Gibt die vollständige gespeicherte Zeile zurück (inkl. id/created_at).
 */
export async function saveEntry(draft: EntryDraft): Promise<EntryRow> {
  const payload = {
    bible_reference: draft.bible_reference ?? null,
    theological_explanation: draft.theological_explanation ?? null,
    psychological_term: draft.psychological_term ?? null,
    bridge_text: draft.bridge_text ?? null,
    tags: draft.tags ?? null,
    visibility: draft.visibility ?? null,
    notes: draft.notes ?? null,
    psychology_comment: draft.psychology_comment ?? null,
    theological_background: draft.theological_background ?? null,
    psychological_background: draft.psychological_background ?? null,
  };

  const { data, error } = await supabase
    .from("entries")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data as EntryRow;
}

/**
 * Lädt die zuletzt erstellte Zeile (neueste) aus `entries`.
 */
export async function loadLatestEntry(): Promise<EntryRow | null> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as EntryRow | null;
}

/**
 * Lädt eine bestimmte Zeile per id.
 */
export async function loadEntryById(id: string): Promise<EntryRow | null> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as EntryRow | null;
}

/**
 * Bequemer Wrapper: ohne Argument -> neueste laden,
 * mit Argument -> genau diese id laden.
 *
 * Das deckt beide Fälle ab und passt zu deinem `loadEntry()`-Aufruf in App.tsx.
 */
export async function loadEntry(id?: string): Promise<EntryRow | null> {
  if (id) return loadEntryById(id);
  return loadLatestEntry();
}

/**
 * Optional: Liste mit Paging – praktisch für ein späteres Archiv.
 */
export async function listEntries(limit = 20, offset = 0): Promise<EntryRow[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data ?? []) as EntryRow[];
}

import { supabase } from "./supabase";

// Definiere den Typ für deine Einträge
export interface Entry {
  id?: string; // wird automatisch von Supabase vergeben
  created_at?: string; // ebenfalls automatisch
  bible_reference: string;
  theological_explanation: string;
  psychological_term: string;
  bridge_text: string;
  tags: string;
  visibility: string;
  notes: string;
}

/**
 * Neuen Eintrag in die Tabelle "entries" speichern
 */
export async function saveEntry(entry: Entry) {
  const { data, error } = await supabase
    .from("entries")
    .insert([entry])
    .select();

  if (error) {
    console.error("Fehler beim Speichern:", error.message);
    throw error;
  }

  return data;
}

/**
 * Alle Einträge laden (optional mit Limit)
 */
export async function getEntries(limit: number = 50) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Fehler beim Laden:", error.message);
    throw error;
  }

  return data as Entry[];
}

/**
 * Einen Eintrag anhand der ID löschen
 */
export async function deleteEntry(id: string) {
  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Fehler beim Löschen:", error.message);
    throw error;
  }

  return true;
}

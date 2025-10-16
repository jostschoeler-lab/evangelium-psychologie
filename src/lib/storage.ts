// src/lib/storage.ts
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
  psychology_comment?: string | null;
  theological_background?: string | null;
  psychological_background?: string | null;
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

const LOCAL_STORAGE_KEY = "ep:entries";

let inMemoryEntries: EntryRow[] | null = null;

function getLocalStorage(): Storage | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
    try {
      const storage = (globalThis as any).localStorage as Storage | undefined;
      return storage ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

function readLocalEntries(): EntryRow[] {
  if (inMemoryEntries) {
    return [...inMemoryEntries];
  }

  const storage = getLocalStorage();
  if (!storage) {
    inMemoryEntries = [];
    return [];
  }

  try {
    const raw = storage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      inMemoryEntries = [];
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      inMemoryEntries = [];
      return [];
    }
    inMemoryEntries = parsed as EntryRow[];
    return [...inMemoryEntries];
  } catch {
    inMemoryEntries = [];
    return [];
  }
}

function writeLocalEntries(entries: EntryRow[]): void {
  inMemoryEntries = [...entries];

  const storage = getLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore persistence errors (e.g. private mode quota)
  }
}

function generateLocalId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `local-${crypto.randomUUID()}`;
  }
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function saveEntryLocally(draft: EntryDraft): EntryRow {
  const now = new Date().toISOString();
  const entry: EntryRow = {
    id: generateLocalId(),
    created_at: now,
    bible_reference: draft.bible_reference?.trim() ?? null,
    theological_explanation: draft.theological_explanation?.trim() ?? null,
    psychological_term: draft.psychological_term?.trim() ?? null,
    bridge_text: draft.bridge_text?.trim() ?? null,
    tags: draft.tags?.trim() ?? null,
    visibility: draft.visibility?.trim() ?? null,
    notes: draft.notes?.trim() ?? null,
    psychology_comment: draft.psychology_comment?.trim() ?? null,
    theological_background: draft.theological_background?.trim() ?? null,
    psychological_background: draft.psychological_background?.trim() ?? null,
  };

  const entries = readLocalEntries();
  entries.unshift(entry);
  writeLocalEntries(entries);

  return entry;
}

/**
 * Speichert einen neuen Datensatz in `entries`.
 * Gibt die vollständige gespeicherte Zeile zurück (inkl. id/created_at).
 */
export async function saveEntry(draft: EntryDraft): Promise<EntryRow> {
  return saveEntryLocally(draft);
}

/**
 * Lädt die zuletzt erstellte Zeile (neueste) aus `entries`.
 */
export async function loadLatestEntry(): Promise<EntryRow | null> {
  const entries = readLocalEntries();
  return entries[0] ?? null;
}

/**
 * Lädt eine bestimmte Zeile per id.
 */
export async function loadEntryById(id: string): Promise<EntryRow | null> {
  const entries = readLocalEntries();
  return entries.find((entry) => entry.id === id) ?? null;
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
  const entries = readLocalEntries();
  return entries.slice(offset, offset + limit);
}

// src/lib/storage.ts
import { UnifiedEntry } from "../types";

const KEY = "nbj_unified_entries_v1";

function nowIso() {
  return new Date().toISOString();
}

export function newEmptyUnified(): UnifiedEntry {
  const ts = Date.now();
  return {
    id: `unified.${ts}`,
    title: "",

    bible: {
      id: "",
      ref: "",
      title: "",
      summary: "",
      exegeses: [
        { key: "A", label: "A) Tradition/Verdrängung", body: "" },
        { key: "B", label: "B) Verwandlung/Integration", body: "" },
      ],
    },

    psych: {
      id: "",
      term: "",
      synonyms: [],
      short: "",
      long: "",
      sources: "",
    },

    link: {
      id: "",
      bibleId: "",
      psychIds: [],
      bridgeText: "",
      tags: [],
    },

    tags: [],
    resources: [],
    visibility: "draft",
    note: "",

    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

export function loadAll(): UnifiedEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as UnifiedEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveOne(entry: UnifiedEntry): UnifiedEntry {
  const all = loadAll();
  const idx = all.findIndex((e) => e.id === entry.id);
  const updated = { ...entry, updatedAt: nowIso() };
  if (idx >= 0) {
    all[idx] = updated;
  } else {
    all.unshift(updated);
  }
  localStorage.setItem(KEY, JSON.stringify(all));
  return updated;
}

export function findById(id: string): UnifiedEntry | undefined {
  return loadAll().find((e) => e.id === id);
}

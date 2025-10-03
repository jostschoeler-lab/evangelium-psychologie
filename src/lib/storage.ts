// src/lib/storage.ts
import { UnifiedEntry } from "../types";

const KEY = "nbj_entries_v1";

export function loadEntries(): UnifiedEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(list: UnifiedEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

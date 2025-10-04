import { EpEintraege } from "../types/epTypes";

const KEY = "ep_verwandlung_eintraege_v1"; // eigener Key, kollidiert nicht mit altem

export const epLoadLocal = (): EpEintraege => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as EpEintraege; }
  catch { return []; }
};

export const epSaveLocal = (list: EpEintraege) => {
  localStorage.setItem(KEY, JSON.stringify(list, null, 2));
};

// Platzhalter für spätere echte Cloud
export const epLoadCloud = async (): Promise<EpEintraege> => epLoadLocal();
export const epSaveCloud = async (list: EpEintraege) => epSaveLocal(list);

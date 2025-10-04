import { EpEintraege, EpEintrag } from "../types/epTypes";
import { epLoadLocal, epSaveLocal } from "./epStorage";
import { epNewEintrag } from "../types/epTemplates";

let epCache: EpEintraege = epLoadLocal();

export const epList = () => [...epCache];

export const epCreate = (): EpEintrag => {
  const e = epNewEintrag();
  epCache = [e, ...epCache];
  epSaveLocal(epCache);
  return e;
};

export const epReplace = (updated: EpEintrag) => {
  epCache = epCache.map(e => e.id === updated.id ? updated : e);
  epSaveLocal(epCache);
};

export const epRemove = (id: string) => {
  epCache = epCache.filter(e => e.id !== id);
  epSaveLocal(epCache);
};

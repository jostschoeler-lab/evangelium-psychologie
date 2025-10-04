import { useEffect, useState } from "react";
import { EpEintrag } from "../types/epTypes";
import { epList, epCreate, epReplace, epRemove } from "../lib/epRepo";

export function useEpEntries() {
  const [items, setItems] = useState<EpEintrag[]>([]);
  const refresh = () => setItems(epList());
  useEffect(() => { refresh(); }, []);
  const create = () => { epCreate(); refresh(); };
  const save = (e: EpEintrag) => { epReplace(e); refresh(); };
  const remove = (id: string) => { epRemove(id); refresh(); };
  return { items, create, save, remove };
}

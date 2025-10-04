import React from "react";
import { EpEintrag } from "../types/epTypes";

type Props = {
  value: EpEintrag;
  onChange: (e: EpEintrag) => void;
  onDelete?: () => void;
};

export default function EpEntryForm({ value, onChange, onDelete }: Props) {
  const e = value;

  const update = (patch: Partial<EpEintrag>) => onChange({ ...e, ...patch });

  const setBibel = (patch: Partial<EpEintrag["bibelstelle"]>) =>
    update({ bibelstelle: { ...e.bibelstelle, ...patch },
             meta: { ...e.meta, updatedAt: new Date().toISOString() } });

  const setPsych = (patch: Partial<EpEintrag["psychologie"]>) =>
    update({ psychologie: { ...e.psychologie, ...patch },
             meta: { ...e.meta, updatedAt: new Date().toISOString() } });

  const setBruecke = (patch: Partial<EpEintrag["bruecke"]>) =>
    update({ bruecke: { ...e.bruecke, ...patch },
             meta: { ...e.meta, updatedAt: new Date().toISOString() } });

  const tagsText = e.bruecke.tags.join(", ");
  const setTagsFromText = (txt: string) =>
    setBruecke({ tags: txt.split(",").map(t => t.trim()).filter(Boolean) });

  return (
    <div style={{border:"1px solid #ddd", borderRadius:12, padding:16, marginBottom:16}}>
      <div style={{fontSize:12, color:"#666", marginBottom:8}}>
        Eintrag-ID: {e.id} | B: {e.bibelstelle.id} | P: {e.psychologie.id} | L: {e.bruecke.id}
      </div>

      <h3>Bibelstelle</h3>
      <input
        placeholder="z. B. Johannes 3,16"
        value={e.bibelstelle.ref}
        onChange={ev => setBibel({ ref: ev.target.value })}
      />
      <textarea
        placeholder="Kurze theologische Auslegung"
        value={e.bibelstelle.theologischeAuslegung}
        onChange={ev => setBibel({ theologischeAuslegung: ev.target.value })}
      />
      <textarea
        placeholder="Theologische Hintergründe (optional, lang)"
        value={e.bibelstelle.theologischeHintergruende || ""}
        onChange={ev => setBibel({ theologischeHintergruende: ev.target.value })}
        rows={3}
      />

      <h3>Psychologie</h3>
      <input
        placeholder="Begriff (z. B. Bindung)"
        value={e.psychologie.begriff}
        onChange={ev => setPsych({ begriff: ev.target.value })}
      />
      <textarea
        placeholder="Kurze Erklärung"
        value={e.psychologie.erklaerungKurz}
        onChange={ev => setPsych({ erklaerungKurz: ev.target.value })}
      />
      <textarea
        placeholder="Psychologische Hintergründe (optional, lang)"
        value={e.psychologie.psychologischeHintergruende || ""}
        onChange={ev => setPsych({ psychologischeHintergruende: ev.target.value })}
        rows={3}
      />

      <h3>Brücke (Crosslink)</h3>
      <textarea
        placeholder="Brückentext"
        value={e.bruecke.text}
        onChange={ev => setBruecke({ text: ev.target.value })}
        rows={3}
      />
      <input
        placeholder="Tags (kommagetrennt: Liebe, Sicherheit)"
        value={tagsText}
        onChange={ev => setTagsFromText(ev.target.value)}
      />

      <h3>Organisation</h3>
      <select
        value={e.sichtbarkeit}
        onChange={ev => update({ sichtbarkeit: ev.target.value as any })}
      >
        <option value="Entwurf">Entwurf</option>
        <option value="öffentlich">öffentlich</option>
        <option value="lokal">lokal</option>
      </select>
      <textarea
        placeholder="Notiz"
        value={e.notiz}
        onChange={ev => update({ notiz: ev.target.value })}
        rows={2}
      />

      <div style={{marginTop:8, display:"flex", gap:8}}>
        <button onClick={() => onChange({ ...e, meta:{...e.meta, updatedAt: new Date().toISOString()} })}>
          Änderungen übernehmen
        </button>
        {onDelete && <button onClick={onDelete}>Löschen</button>}
      </div>
    </div>
  );
}

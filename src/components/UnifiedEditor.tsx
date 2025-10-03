// src/components/UnifiedEditor.tsx
import React, { useState } from "react";

type Entry = {
  // Bibel-Modul
  bibleId: string;
  bibleRef: string;
  bibleTitle: string;
  bibleSummary: string;
  exegesesA: string; // Tradition/Verdrängung
  exegesesB: string; // Integration/Verwandlung

  // Psychologie-Modul
  psychId: string;
  psychTerm: string;
  psychSyn: string;
  psychShort: string;

  // Crosslink
  bridgeId: string;
  bridgeText: string;

  // Meta
  tags: string;
  visibility: "draft" | "public";
  note: string;
};

const LS_KEY = "nbj_unified_entries_v1";

function load(): Entry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function save(all: Entry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

export default function UnifiedEditor() {
  const [entry, setEntry] = useState<Entry>({
    bibleId: "",
    bibleRef: "",
    bibleTitle: "",
    bibleSummary: "",
    exegesesA: "",
    exegesesB: "",

    psychId: "",
    psychTerm: "",
    psychSyn: "",
    psychShort: "",

    bridgeId: "",
    bridgeText: "",

    tags: "",
    visibility: "draft",
    note: "",
  });

  const [saved, setSaved] = useState(false);
  const [list, setList] = useState<Entry[]>(load());

  function update<K extends keyof Entry>(key: K, value: Entry[K]) {
    setEntry(prev => ({ ...prev, [key]: value }));
  }

  function onSave() {
    const next = [entry, ...load()];
    save(next);
    setList(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 900 }}>
      <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Bibel</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="bibelId (z. B. bibel.2petrus1.3-4)"
            value={entry.bibleId}
            onChange={(e) => update("bibleId", e.target.value)}
          />
          <input
            placeholder="bibelRef (z. B. 2. Petrus 1,3–4)"
            value={entry.bibleRef}
            onChange={(e) => update("bibleRef", e.target.value)}
          />
          <input
            placeholder="bibleTitle (z. B. Teilnahme an göttlicher Natur)"
            value={entry.bibleTitle}
            onChange={(e) => update("bibleTitle", e.target.value)}
          />
          <textarea
            placeholder="bibleSummary (Kurz-Zusammenfassung)"
            rows={3}
            value={entry.bibleSummary}
            onChange={(e) => update("bibleSummary", e.target.value)}
          />
          <textarea
            placeholder="Auslegung A (Tradition / Verdrängung)"
            rows={3}
            value={entry.exegesesA}
            onChange={(e) => update("exegesesA", e.target.value)}
          />
          <textarea
            placeholder="Auslegung B (Integration / Verwandlung)"
            rows={3}
            value={entry.exegesesB}
            onChange={(e) => update("exegesesB", e.target.value)}
          />
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Psychologie</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="psychId (z. B. psych.grawe.bindung)"
            value={entry.psychId}
            onChange={(e) => update("psychId", e.target.value)}
          />
          <input
            placeholder="psychTerm (z. B. Bindung)"
            value={entry.psychTerm}
            onChange={(e) => update("psychTerm", e.target.value)}
          />
          <input
            placeholder="psychSyn (Synonyme, z. B. Nähe, Sicherheit, Zugehörigkeit)"
            value={entry.psychSyn}
            onChange={(e) => update("psychSyn", e.target.value)}
          />
          <textarea
            placeholder="psychShort (Kurzdefinition)"
            rows={2}
            value={entry.psychShort}
            onChange={(e) => update("psychShort", e.target.value)}
          />
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Crosslink</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="bridgeId (z. B. crosslink.bibel.2petrus1.3-4.psych.bindung)"
            value={entry.bridgeId}
            onChange={(e) => update("bridgeId", e.target.value)}
          />
          <textarea
            placeholder="bridgeText (Brückentext)"
            rows={3}
            value={entry.bridgeText}
            onChange={(e) => update("bridgeText", e.target.value)}
          />
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Meta</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="tags (kommagetrennt, z. B. Bedürfnis, Lust, Verwandlung)"
            value={entry.tags}
            onChange={(e) => update("tags", e.target.value)}
          />
          <div>
            <label>
              <input
                type="radio"
                name="visibility"
                checked={entry.visibility === "draft"}
                onChange={() => update("visibility", "draft")}
              />
              &nbsp;Entwurf
            </label>
            &nbsp;&nbsp;
            <label>
              <input
                type="radio"
                name="visibility"
                checked={entry.visibility === "public"}
                onChange={() => update("visibility", "public")}
              />
              &nbsp;Öffentlich
            </label>
          </div>
          <textarea
            placeholder="Notiz / Version"
            rows={2}
            value={entry.note}
            onChange={(e) => update("note", e.target.value)}
          />
        </div>
      </section>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSave} style={{ padding: "8px 12px" }}>Speichern (lokal)</button>
        {saved && <span style={{ color: "green" }}>✓ Gespeichert</span>}
      </div>

      <section style={{ border: "1px dashed #aaa", borderRadius: 8, padding: 12 }}>
        <h4 style={{ marginTop: 0 }}>Vorschau gespeicherter Einträge</h4>
        {list.length === 0 ? (
          <div style={{ color: "#777" }}>Noch keine Einträge gespeichert.</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {list.map((e, i) => (
              <li key={i}>
                <b>{e.bibleRef || e.bibleId || "(ohne Bibel-Ref)"}:</b>{" "}
                {e.bibleTitle || "(ohne Titel)"} &nbsp;—&nbsp;
                <i>{e.psychTerm || e.psychId || "(ohne Psych-Begriff)"}</i>
                {e.tags ? <> &nbsp; • &nbsp;{e.tags}</> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

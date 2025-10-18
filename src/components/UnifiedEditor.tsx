// @ts-nocheck
// für TYP-Referenzen wie  : Entry
type Entry = any
// für evtl. JSX wie <Entry .../>  (falls irgendwo vorhanden)
const Entry: any = null as any

import React, { useEffect, useMemo, useState } from "react";
import { saveEntry, loadEntry, listEntries } from "../lib/storage";

// TEMP: Typdefinition, damit der Build läuft.
// Passe die Felder später an deine echten Spaltennamen an.
// ganz oben bei den Imports
import type { Entry } from '../types/entry' // wenn du KEIN '@' Alias hast
// oder: import type { Entry } from '@/types/entry'  // falls '@' als alias konfiguriert ist
// TEMP-HOTFIX: entblockt den Build – wir tippen später sauber
type Entry = any

type EditorEntry = import('../types/entry').Entry


/**
 * Kleine Hilfsfunktion: liest/schreibt einen einzelnen Feldwert
 * aus/in localStorage, damit dir Eingaben bei einem Browser-Reload
 * nicht verloren gehen.
 */
function useLocalField(key: string, initial = "") {
  const [value, setValue] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ?? initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}

export default function UnifiedEditor() {
  // Alle Felder (mit localStorage-Persistenz)
  const [bible_reference, setBibleReference] = useLocalField(
    "ue:bible_reference",
    ""
  );
  const [theological_explanation, setTheo] = useLocalField(
    "ue:theological_explanation",
    ""
  );
  const [psychological_term, setPsych] = useLocalField(
    "ue:psychological_term",
    ""
  );
  const [bridge_text, setBridge] = useLocalField("ue:bridge_text", "");
  const [tags, setTags] = useLocalField("ue:tags", "");
  const [visibility, setVisibility] = useLocalField("ue:visibility", "draft");
  const [notes, setNotes] = useLocalField("ue:notes", "");
// NEU: Zusatzfelder
const [psychology_comment, setPsychologyComment] = useLocalField("ue:psychology_comment", "");
const [theological_background, setTheoBg] = useLocalField("ue:theological_background", "");
const [psychological_background, setPsychBg] = useLocalField("ue:psychological_background", "");

  
  // UI-Status
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<null | { type: "ok" | "error"; text: string }>(null);

  // Für simple Validierung
  const isValid = useMemo(() => {
    return bible_reference.trim().length > 0;
  }, [bible_reference]);

  async function handleSaveToCloud() {
    setMessage(null);

    if (!isValid) {
      setMessage({
        type: "error",
        text: "Bitte mindestens 'Bibelstelle(n)' ausfüllen.",
      });
      return;
    }
const entry = {
  bible_reference: bible_reference.trim(),
  theological_explanation: theological_explanation.trim(),
  psychological_term: psychological_term.trim(),
  bridge_text: bridge_text.trim(),
  tags: tags.trim(),            // falls tags ein String ist; sonst: tags,
  visibility: visibility.trim(),
  notes: notes.trim(),

  // neu hinzugefügt – für die drei neuen Spalten in Supabase
  psychology_comment: psychology_comment.trim(),
  theological_background: theological_background.trim(),
  psychological_background: psychological_background.trim(),
};


    setSaving(true);
    try {
      await saveEntry(entry);
      setMessage({ type: "ok", text: "Eintrag wurde in Supabase gespeichert ✅" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          "Speichern fehlgeschlagen: " +
          (err?.message || "Unbekannter Fehler"),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "8px 12px" }}>
      <h2>Unified-Editor (Bibel + Psych + Brücke)</h2>
     <div style={{background:"#eef6ff",border:"1px solid #4da3ff",padding:8,margin:"8px 0"}}>
  *** MARKER C: UnifiedEditor aktiv ***
</div>

      <p>Alle Felder werden lokal gespeichert (localStorage). Mit „In die Cloud speichern“ schreibst du in Supabase.</p>

      {/* Status / Meldungen */}
      {message && (
        <div
          style={{
            border: "1px solid",
            borderColor: message.type === "ok" ? "#28a745" : "#dc3545",
            background: message.type === "ok" ? "#eaf9f0" : "#fdeaea",
            color: message.type === "ok" ? "#1e7e34" : "#8a1c1c",
            padding: "10px 12px",
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          {message.text}
        </div>
      )}

      <label>
        <b>Bibelstelle(n)</b>
        <input
          value={bible_reference}
          onChange={(e) => setBibleReference(e.target.value)}
          placeholder="z.B. 1. Petr 4,1–2"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Theologische Auslegungen</b>
        <textarea
          value={theological_explanation}
          onChange={(e) => setTheo(e.target.value)}
          rows={6}
          placeholder="Kurzkommentar oder Auslegung …"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Psychologischer Begriff</b>
        <input
          value={psychological_term}
          onChange={(e) => setPsych(e.target.value)}
          placeholder="z.B. Akzeptanz, Bindung, …"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Brückentext (Theologie ↔ Psychologie)</b>
        <textarea
          value={bridge_text}
          onChange={(e) => setBridge(e.target.value)}
          rows={5}
          placeholder="Wie passt der psychologische Begriff zur Bibelstelle?"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
</label>

        <div style={{padding:"8px",border:"1px dashed #999",margin:"8px 0"}}>
  *** MARKER: UnifiedEditor aktiv ***
</div>

        {/* NEUE FELDER */}
<label>
  <b>Kommentar (Psychologie) – kurz</b>
  <textarea
    value={psychology_comment}
    onChange={(e) => setPsychologyComment(e.target.value)}
    rows={4}
    placeholder="Kurzer psychologischer Kommentar, z. B. Schema, Emotion, Verhalten …"
    style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
  />
</label>

<details style={{ marginBottom: 12 }}>
  <summary style={{ fontWeight: 700 }}>Theologischer Hintergrund (ausführlich)</summary>
  <textarea
    value={theological_background}
    onChange={(e) => setTheoBg(e.target.value)}
    rows={10}
    placeholder="Biblische Bezüge, Auslegungen, theologische Vertiefung …"
    style={{ width: "100%", marginTop: 6 }}
  />
</details>

<details style={{ marginBottom: 12 }}>
  <summary style={{ fontWeight: 700 }}>Psychologischer Hintergrund (ausführlich)</summary>
  <textarea
    value={psychological_background}
    onChange={(e) => setPsychBg(e.target.value)}
    rows={10}
    placeholder="Psychologische Konzepte, Schematherapie, Grawe, Synergetik …"
    style={{ width: "100%", marginTop: 6 }}
  />
</details>


<details style={{ marginBottom: 12 }}>
  <summary style={{ fontWeight: 700 }}>Theologischer Hintergrund (ausführlich)</summary>
  <textarea
    value={theological_background}
    onChange={(e) => setTheoBg(e.target.value)}
    rows={10}
    placeholder="Biblische Bezüge, Auslegungen, theologische Vertiefung …"
    style={{ width: "100%", marginTop: 6 }}
  />
</details>

<details style={{ marginBottom: 12 }}>
  <summary style={{ fontWeight: 700 }}>Psychologischer Hintergrund (ausführlich)</summary>
  <textarea
    value={psychological_background}
    onChange={(e) => setPsychBg(e.target.value)}
    rows={10}
    placeholder="Psychologische Konzepte, Schematherapie, Grawe, Synergetik …"
    style={{ width: "100%", marginTop: 6 }}
  />
</details>

      
      <label>
        <b>Tags (mit Enter hinzufügen oder Liste durch Kommas)</b>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="z.B. Trauer, Leiden, Schmerz, Bindung"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Sichtbarkeit</b>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          style={{ display: "block", marginTop: 6, marginBottom: 12 }}
        >
          <option value="draft">Entwurf (lokal)</option>
          <option value="public">Öffentlich (später)</option>
          <option value="private">Privat (nur Admin)</option>
        </select>
      </label>

      <label>
        <b>Notiz</b>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Spätere Gedanken, To-dos …"
          style={{ width: "100%", marginTop: 6, marginBottom: 20 }}
        />
      </label>

      <button
        onClick={handleSaveToCloud}
        disabled={saving || !isValid}
        style={{
          padding: "10px 16px",
          fontWeight: 600,
          borderRadius: 8,
          border: "1px solid #198754",
          background: saving ? "#7bd3a3" : "#20c997",
          color: "white",
          cursor: saving ? "not-allowed" : "pointer",
        }}
        title={!isValid ? "Bitte 'Bibelstelle(n)' ausfüllen" : "In die Cloud speichern"}
      >
        {saving ? "Speichere …" : "In die Cloud speichern"}
      </button>
    </div>
  );
}

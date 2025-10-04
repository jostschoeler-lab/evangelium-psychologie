// src/components/UnifiedEditor.tsx
import React, { useEffect, useMemo, useState } from "react";
import { saveEntry, loadEntry, EntryRow } from "../lib/storage";

/**
 * Kleiner Hook: liest/schreibt ein einzelnes Feld in localStorage,
 * damit bei einem Reload Eingaben nicht verloren gehen.
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
  // Statusleisten
  const [busy, setBusy] = useState(false);        // für "Laden"
  const [saving, setSaving] = useState(false);    // für "Speichern"
  const [status, setStatus] = useState<string>(""); // kleine Textzeile rechts
  const [message, setMessage] = useState<null | { type: "ok" | "error"; text: string }>(null);

  // Alle Eingabefelder (persistieren in localStorage)
  const [bible_reference, setBibleReference] = useLocalField("ue:bible_reference", "");
  const [theological_explanation, setTheo] = useLocalField("ue:theological_explanation", "");
  const [psychological_term, setPsych] = useLocalField("ue:psychological_term", "");
  const [bridge_text, setBridge] = useLocalField("ue:bridge_text", "");
  const [tags, setTags] = useLocalField("ue:tags", "");
  const [visibility, setVisibility] = useLocalField("ue:visibility", "draft");
  const [notes, setNotes] = useLocalField("ue:notes", "");

  // Quick-Validierung: Bibelstelle muss gefüllt sein
  const isValid = useMemo(() => bible_reference.trim().length > 0, [bible_reference]);

  // Speichern in Supabase
  async function handleSaveToCloud() {
    setMessage(null);

    if (!isValid) {
      setMessage({ type: "error", text: "Bitte mindestens 'Bibelstelle(n)' ausfüllen." });
      return;
    }

    const entry: EntryRow = {
      bible_reference: bible_reference.trim(),
      theological_explanation: theological_explanation.trim(),
      psychological_term: psychological_term.trim(),
      bridge_text: bridge_text.trim(),
      tags: tags.trim(),
      visibility: visibility.trim(), // 'draft' | 'public' | 'private'
      notes: notes.trim(),
    };

    setSaving(true);
    try {
      await saveEntry(entry);
      setMessage({ type: "ok", text: "Eintrag wurde in Supabase gespeichert ✅" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: "Speichern fehlgeschlagen: " + (err?.message || "Unbekannter Fehler"),
      });
    } finally {
      setSaving(false);
    }
  }

  // Letzten Eintrag aus Supabase laden (optional)
  async function handleLoad() {
    try {
      setBusy(true);
      setStatus("⏳ Lade …");
      const row = await loadEntry(); // neueste Zeile
      if (!row) {
        setStatus("ℹ️ Keine Einträge gefunden.");
        return;
      }
      setBibleReference(row.bible_reference ?? "");
      setTheo(row.theological_explanation ?? "");
      setPsych(row.psychological_term ?? "");
      setBridge(row.bridge_text ?? "");
      setTags(row.tags ?? "");
      setVisibility((row.visibility as any) ?? "draft");
      setNotes(row.notes ?? "");
      setStatus("✅ Geladen.");
    } catch (e: any) {
      setStatus("❌ Fehler beim Laden: " + (e?.message ?? String(e)));
    } finally {
      setBusy(false);
    }
  }

  // Lokalen Entwurf löschen
  function handleClearLocal() {
    try {
      localStorage.removeItem("ue:bible_reference");
      localStorage.removeItem("ue:theological_explanation");
      localStorage.removeItem("ue:psychological_term");
      localStorage.removeItem("ue:bridge_text");
      localStorage.removeItem("ue:tags");
      localStorage.removeItem("ue:visibility");
      localStorage.removeItem("ue:notes");
      setStatus("🧹 Lokaler Entwurf gelöscht.");
    } catch {
      setStatus("⚠️ Konnte lokalen Entwurf nicht löschen.");
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "8px 12px" }}>
      <h2>Unified-Editor (Bibel + Psych + Brücke)</h2>
      <p>Alle Felder werden lokal gespeichert (localStorage). Mit „In die Cloud speichern“ schreibst du in Supabase.</p>

      {/* Status-Meldungen (grün/rot) */}
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

      {/* Buttons oben, damit du sie sofort siehst */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={handleSaveToCloud} disabled={saving || !isValid}>
          {saving ? "Speichere …" : "In die Cloud speichern"}
        </button>
        <button onClick={handleLoad} disabled={busy}>Aus Cloud laden</button>
        <button onClick={handleClearLocal}>Lokalen Entwurf löschen</button>
        <span style={{ marginLeft: 8, opacity: 0.8 }}>{status}</span>
      </div>

      {/* Eingabefelder */}
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
    </div>
  );
}

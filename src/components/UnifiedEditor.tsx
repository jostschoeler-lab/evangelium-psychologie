// src/components/UnifiedEditor.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

// Typ passend zu deiner Tabelle "entries"
type EntryRow = {
  id?: string;
  created_at?: string;
  bible_reference: string | null;
  theological_explanation: string | null;
  psychological_term: string | null;
  bridge_text: string | null;
  tags: string | null;       // bei dir ist "tags" ein TEXT-Feld
  visibility: string | null; // "draft" | "public" | "private"
  notes: string | null;
};

/** Kleiner Hook: Feldwerte zusätzlich lokal puffern */
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
  // UI-Status
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<null | { type: "ok" | "error"; text: string }>(null);

  // Form-Felder (lokal gesichert)
  const [bible_reference, setBibleReference] = useLocalField("ue:bible_reference", "");
  const [theological_explanation, setTheo] = useLocalField("ue:theological_explanation", "");
  const [psychological_term, setPsych] = useLocalField("ue:psychological_term", "");
  const [bridge_text, setBridge] = useLocalField("ue:bridge_text", "");
  const [tags, setTags] = useLocalField("ue:tags", "");
  const [visibility, setVisibility] = useLocalField("ue:visibility", "draft");
  const [notes, setNotes] = useLocalField("ue:notes", "");

  const formRef = useRef<HTMLFormElement>(null);
  const isValid = useMemo(() => bible_reference.trim().length > 0, [bible_reference]);

  // ---- SPEICHERN → SUPABASE -------------------------------------------------
  async function handleSaveToCloud() {
    setMessage(null);
    if (!isValid) {
      setMessage({ type: "error", text: "Bitte mindestens 'Bibelstelle(n)' ausfüllen." });
      return;
    }

    const payload: EntryRow = {
      bible_reference: bible_reference.trim() || null,
      theological_explanation: theological_explanation.trim() || null,
      psychological_term: psychological_term.trim() || null,
      bridge_text: bridge_text.trim() || null,
      tags: tags.trim() || null,
      visibility: visibility.trim() || "draft",
      notes: notes.trim() || null,
    };

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("entries")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      setMessage({ type: "ok", text: `Gespeichert ✅ (ID: ${data.id})` });
      setStatus("✅ Eintrag auf Server gespeichert.");
      // Optional: nach Erfolg lokalen Entwurf lassen (oder löschen – deine Wahl)
    } catch (e: any) {
      setMessage({ type: "error", text: "Speichern fehlgeschlagen: " + (e?.message ?? String(e)) });
      setStatus("❌ Fehler beim Speichern.");
      console.error("Supabase insert error:", e);
    } finally {
      setSaving(false);
    }
  }

  // ---- LADEN (letzter Eintrag) ----------------------------------------------
  async function handleLoad() {
    setMessage(null);
    setBusy(true);
    setStatus("⏳ Lade …");
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      if (!data) {
        setStatus("ℹ️ Keine Einträge gefunden.");
        return;
      }
      setBibleReference(data.bible_reference ?? "");
      setTheo(data.theological_explanation ?? "");
      setPsych(data.psychological_term ?? "");
      setBridge(data.bridge_text ?? "");
      setTags(data.tags ?? "");
      setVisibility((data.visibility as any) ?? "draft");
      setNotes(data.notes ?? "");
      setStatus("✅ Geladen.");
    } catch (e: any) {
      setStatus("❌ Fehler beim Laden: " + (e?.message ?? String(e)));
      console.error("Supabase load error:", e);
    } finally {
      setBusy(false);
    }
  }

  // ---- LOKAL LÖSCHEN --------------------------------------------------------
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
      {/* Marker: neue Version */}
      <h2>Unified-Editor (Bibel + Psych + Brücke) • v5</h2>
      <p>
        Alle Felder werden lokal gespeichert (localStorage).
        <br />
        Mit <b>„In die Cloud speichern“</b> schreibst du zusätzlich in Supabase (Tabelle <code>entries</code>).
      </p>

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

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={handleSaveToCloud} disabled={saving || !isValid}>
          {saving ? "Speichere …" : "In die Cloud speichern"}
        </button>
        <button onClick={handleLoad} disabled={busy}>Aus Cloud laden</button>
        <button onClick={handleClearLocal}>Lokalen Entwurf löschen</button>
        <span style={{ marginLeft: 8, opacity: 0.8 }}>{status}</span>
      </div>

      <form ref={formRef}>
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
            placeholder="z.B. Akzeptanz, Bindung …"
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
          <b>Tags (Komma-getrennt)</b>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="z.B. Trauer, Leiden, Bindung"
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
      </form>
    </div>
  );
}

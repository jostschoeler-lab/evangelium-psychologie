import { useEffect, useMemo, useState } from "react";
import { saveEntry, type EntryDraft } from "../lib/storage";

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
    } catch {
      /* ignore localStorage quota issues */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function toOptional(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

type StatusMessage = { type: "ok" | "error"; text: string };

export default function UnifiedEditor() {
  const [bibleReference, setBibleReference] = useLocalField("ue:bible_reference");
  const [theologicalExplanation, setTheologicalExplanation] = useLocalField(
    "ue:theological_explanation"
  );
  const [psychologicalTerm, setPsychologicalTerm] = useLocalField(
    "ue:psychological_term"
  );
  const [bridgeText, setBridgeText] = useLocalField("ue:bridge_text");
  const [tags, setTags] = useLocalField("ue:tags");
  const [visibility, setVisibility] = useLocalField("ue:visibility", "draft");
  const [notes, setNotes] = useLocalField("ue:notes");
  const [psychologyComment, setPsychologyComment] = useLocalField(
    "ue:psychology_comment"
  );
  const [theologicalBackground, setTheologicalBackground] = useLocalField(
    "ue:theological_background"
  );
  const [psychologicalBackground, setPsychologicalBackground] = useLocalField(
    "ue:psychological_background"
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);

  const isValid = useMemo(() => bibleReference.trim().length > 0, [bibleReference]);

  async function handleSaveToCloud() {
    setMessage(null);

    if (!isValid) {
      setMessage({
        type: "error",
        text: "Bitte mindestens \"Bibelstelle(n)\" ausfüllen.",
      });
      return;
    }

    const entry: EntryDraft = {
      bible_reference: toOptional(bibleReference),
      theological_explanation: toOptional(theologicalExplanation),
      psychological_term: toOptional(psychologicalTerm),
      bridge_text: toOptional(bridgeText),
      tags: toOptional(tags),
      visibility: toOptional(visibility),
      notes: toOptional(notes),
      psychology_comment: toOptional(psychologyComment),
      theological_background: toOptional(theologicalBackground),
      psychological_background: toOptional(psychologicalBackground),
    };

    setSaving(true);
    try {
      await saveEntry(entry);
      setMessage({
        type: "ok",
        text: "Eintrag wurde in Supabase gespeichert ✅",
      });
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setMessage({
        type: "error",
        text: `Speichern fehlgeschlagen: ${reason}`,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "8px 12px" }}>
      <h2>Unified-Editor (Bibel + Psych + Brücke)</h2>
      <p>
        Alle Felder werden lokal gespeichert (localStorage). Mit „In die Cloud
        speichern“ schreibst du in Supabase.
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

      <label>
        <b>Bibelstelle(n)</b>
        <input
          value={bibleReference}
          onChange={(event) => setBibleReference(event.target.value)}
          placeholder="z.B. 1. Petr 4,1–2"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Theologische Auslegungen</b>
        <textarea
          value={theologicalExplanation}
          onChange={(event) => setTheologicalExplanation(event.target.value)}
          rows={6}
          placeholder="Kurzkommentar oder Auslegung …"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Psychologischer Begriff</b>
        <input
          value={psychologicalTerm}
          onChange={(event) => setPsychologicalTerm(event.target.value)}
          placeholder="z.B. Akzeptanz, Bindung, …"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Brückentext (Theologie ↔ Psychologie)</b>
        <textarea
          value={bridgeText}
          onChange={(event) => setBridgeText(event.target.value)}
          rows={5}
          placeholder="Wie passt der psychologische Begriff zur Bibelstelle?"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Kommentar (Psychologie) – kurz</b>
        <textarea
          value={psychologyComment}
          onChange={(event) => setPsychologyComment(event.target.value)}
          rows={4}
          placeholder="Kurzer psychologischer Kommentar, z. B. Schema, Emotion, Verhalten …"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <details style={{ marginBottom: 12 }}>
        <summary style={{ fontWeight: 700 }}>
          Theologischer Hintergrund (ausführlich)
        </summary>
        <textarea
          value={theologicalBackground}
          onChange={(event) => setTheologicalBackground(event.target.value)}
          rows={10}
          placeholder="Biblische Bezüge, Auslegungen, theologische Vertiefung …"
          style={{ width: "100%", marginTop: 6 }}
        />
      </details>

      <details style={{ marginBottom: 12 }}>
        <summary style={{ fontWeight: 700 }}>
          Psychologischer Hintergrund (ausführlich)
        </summary>
        <textarea
          value={psychologicalBackground}
          onChange={(event) => setPsychologicalBackground(event.target.value)}
          rows={10}
          placeholder="Psychologische Konzepte, Schematherapie, Grawe, Synergetik …"
          style={{ width: "100%", marginTop: 6 }}
        />
      </details>

      <label>
        <b>Tags (mit Enter hinzufügen oder Liste durch Kommas)</b>
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="z.B. Trauer, Leiden, Schmerz, Bindung"
          style={{ width: "100%", marginTop: 6, marginBottom: 12 }}
        />
      </label>

      <label>
        <b>Sichtbarkeit</b>
        <select
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
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
          onChange={(event) => setNotes(event.target.value)}
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
        title={
          !isValid
            ? "Bitte 'Bibelstelle(n)' ausfüllen"
            : "In die Cloud speichern"
        }
      >
        {saving ? "Speichere …" : "In die Cloud speichern"}
      </button>
    </div>
  );
}

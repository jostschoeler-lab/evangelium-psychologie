import EpEditorPage from "./pages/EpEditorPage";

// src/App.tsx  — clean build: v2

import { useEffect, useMemo, useState } from "react";
import { saveEntry, loadEntry, listEntries } from "./lib/storage";

/** Sichtbarkeits-Optionen */
const VIS_OPTIONS = ["Entwurf (lokal)", "Öffentlich (später)", "Öffentlich"] as const;
type Visibility = (typeof VIS_OPTIONS)[number];

/** Draft-Struktur (muss zu saveEntry passen) */
type EntryDraft = {
  bible_reference: string;
  theological_explanation: string;
  psychological_term: string;
  bridge_text: string;
  tags: string;            // Kommaliste
  visibility: Visibility;
  notes: string;
};

/** localStorage Helpers */
const LOCAL_KEY = "unified-editor@draft-v1";
function loadLocal(): EntryDraft | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as EntryDraft) : null;
  } catch {
    return null;
  }
}
function saveLocal(d: EntryDraft) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(d));
}
function clearLocal() {
  localStorage.removeItem(LOCAL_KEY);
}

export default function App() {
 // Neuer Editor über #/ep
  if (typeof window !== "undefined" && window.location.hash === "#/ep") {
    return <EpEditorPage />;
  }
  // ---------- Formular-State ----------
  const [bible_reference, setBibleReference] = useState("");
  const [theological_explanation, setTheological] = useState("");
  const [psychological_term, setPsych] = useState("");
  const [bridge_text, setBridge] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("Entwurf (lokal)");
  const [notes, setNotes] = useState("");

  // UI/Status
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [build] = useState("build: app v2"); // hilft, neuen Build zu erkennen

  // Draft für Autosave/Cloud
  const draft: EntryDraft = useMemo(
    () => ({
      bible_reference,
      theological_explanation,
      psychological_term,
      bridge_text,
      tags,
      visibility,
      notes,
    }),
    [
      bible_reference,
      theological_explanation,
      psychological_term,
      bridge_text,
      tags,
      visibility,
      notes,
    ]
  );

  // ---------- localStorage: beim Start laden ----------
  useEffect(() => {
    const loc = loadLocal();
    if (loc) {
      setBibleReference(loc.bible_reference ?? "");
      setTheological(loc.theological_explanation ?? "");
      setPsych(loc.psychological_term ?? "");
      setBridge(loc.bridge_text ?? "");
      setTags(loc.tags ?? "");
      setVisibility((loc.visibility as Visibility) ?? "Entwurf (lokal)");
      setNotes(loc.notes ?? "");
      setStatus("ℹ️ Lokaler Entwurf geladen.");
    }
  }, []);

  // ---------- Autosave ----------
  useEffect(() => {
    saveLocal(draft);
  }, [draft]);

  // ---------- Cloud Aktionen ----------
  async function handleSave() {
    try {
      setBusy(true);
      setStatus("⏳ Speichere in Supabase …");
      await saveEntry(draft);
      setStatus("✅ In die Cloud gespeichert.");
    } catch (e: any) {
      setStatus("❌ Fehler beim Speichern: " + (e?.message ?? String(e)));
    } finally {
      setBusy(false);
    }
  }

  async function handleLoad() {
    try {
      setBusy(true);
      setStatus("⏳ Lade aus Supabase …");
      const data = await loadEntry(); // „neuester“ Datensatz
      if (!data) {
        setStatus("ℹ️ Keine Einträge in der Cloud gefunden.");
        return;
      }
      setBibleReference(data.bible_reference ?? "");
      setTheological(data.theological_explanation ?? "");
      setPsych(data.psychological_term ?? "");
      setBridge(data.bridge_text ?? "");
      setTags(data.tags ?? "");
      setVisibility((data.visibility as Visibility) ?? "Entwurf (lokal)");
      setNotes(data.notes ?? "");
      setStatus("✅ Aus der Cloud geladen.");
    } catch (e: any) {
      setStatus("❌ Fehler beim Laden: " + (e?.message ?? String(e)));
    } finally {
      setBusy(false);
    }
  }

  function handleClearLocal() {
    clearLocal();
    setStatus("🧹 Lokaler Entwurf gelöscht (Cloud bleibt).");
  }

  // ---------- Dev-Helpers einmalig am window registrieren ----------
  useEffect(() => {
    (window as any).__pingSupabase = async () => {
      const rows = await listEntries(1, 0);
      console.log("✅ __pingSupabase:", rows[0] ?? null);
      return rows[0] ?? null;
    };

    (window as any).__saveDemo = async () => {
      const id = await saveEntry({
        bible_reference: "Test 1. Kor 13",
        theological_explanation: "Liebe ist das Größte",
        psychological_term: "Bindung",
        bridge_text: "Bindung ↔ Liebe",
        tags: "Liebe, Bindung",
        visibility: "Entwurf (lokal)",
        notes: "Nur ein Testeintrag",
      });
      console.log("💾 __saveDemo -> ID:", id);
      return id;
    };

    (window as any).__handleSaveTest = async () => {
      const id = await saveEntry(draft);
      console.log("💾 __handleSaveTest -> ID:", id);
      return id;
    };

    console.log(
      "🔧 Helpers registriert:",
      Object.keys(window).filter((k) => k.startsWith("__"))
    );
  }, [draft]);

  // ---------- UI ----------
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <div style={{ fontSize: 12, color: "#0a0", marginBottom: 8 }}>{build}</div>

      <h1 style={{ marginTop: 0 }}>Not-Bedürfnis-Jesus</h1>
      <p style={{ marginTop: 0, color: "#555" }}>Startergerüst (React + Vite + i18n).</p>

      {/* Aktionen */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0 16px" }}>
        <button onClick={handleSave} disabled={busy}>💾 In die Cloud speichern</button>
        <button onClick={handleLoad} disabled={busy}>☁️ Aus der Cloud laden</button>
        <button onClick={handleClearLocal} disabled={busy}>🧹 Lokalen Entwurf löschen</button>
        <span style={{ marginLeft: 8, color: "#444" }}>{status}</span>
      </div>

      <h2 style={{ marginTop: 0 }}>Unified-Editor (Bibel + Psych + Brücke)</h2>
      <p style={{ marginTop: 0, color: "#666" }}>
        Alle Felder werden lokal gespeichert (localStorage). Mit dem Speichern-Button
        kannst du zusätzlich in der Cloud sichern.
      </p>

      <Section label="Bibelstelle(n)">
        <input
          value={bible_reference}
          onChange={(e) => setBibleReference(e.target.value)}
          placeholder="z. B. 1. Petr 4,1–2"
        />
      </Section>

      <Section label="Theologische Auslegungen">
        <textarea
          value={theological_explanation}
          onChange={(e) => setTheological(e.target.value)}
          rows={6}
          placeholder="Kurzer Kommentar oder Auslegung …"
        />
      </Section>

      <Section label="Psychologischer Begriff">
        <input
          value={psychological_term}
          onChange={(e) => setPsych(e.target.value)}
          placeholder="z. B. Akzeptanz/ACT, Bindung, …"
        />
      </Section>

      <Section label="Brückentext (Theologie ↔ Psychologie)">
        <textarea
          value={bridge_text}
          onChange={(e) => setBridge(e.target.value)}
          rows={6}
          placeholder="Wie passt der psychologische Begriff zur Bibelstelle?"
        />
      </Section>

      <Section label="Tags (Kommaliste)">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="z. B. Trauer, Bindung, Angst"
        />
      </Section>

      <Section label="Sichtbarkeit">
        <select value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
          {VIS_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </Section>

      <Section label="Notiz">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="Eigene Gedanken, To-dos …"
        />
      </Section>

      <div style={{ marginTop: 24, fontSize: 12, color: "#777" }}>
        Hinweis: „Entwurf (lokal)“ bleibt ausschließlich im Browser (localStorage).
        „In die Cloud speichern“ legt einen Datensatz in deiner Supabase-Tabelle
        <code style={{ marginLeft: 4 }}>entries</code> an.
      </div>
    </div>
  );
}

/** Kleine Sektion mit Label */
function Section(props: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{props.label}</div>
      <div>{props.children}</div>
      <style>{`
        input, select, textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        textarea { resize: vertical; }
        button {
          padding: 8px 12px;
          border: 1px solid #bbb;
          border-radius: 6px;
          background: #f7f7f7;
          cursor: pointer;
        }
        button:hover { background: #f0f0f0; }
        button:disabled { opacity: .6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

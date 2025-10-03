// src/components/UnifiedEditor.tsx
import React, { useMemo, useState } from "react";
import { UnifiedEntry, Visibility } from "../types";
import { loadAll, saveOne, newEmptyUnified, findById } from "../lib/storage";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };
type TextProps  = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string };

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 8, alignItems: "start", marginBottom: 10 }}>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontWeight: 600, paddingTop: 6 }}>{children}</div>
);

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <Row>
    <Label>{label}</Label>
    <input {...props} style={{ width: "100%", padding: "6px 8px" }} />
  </Row>
);

const TextArea: React.FC<TextProps> = ({ label, rows = 4, ...props }) => (
  <Row>
    <Label>{label}</Label>
    <textarea {...props} rows={rows} style={{ width: "100%", padding: "6px 8px" }} />
  </Row>
);

const Select: React.FC<{ label: string; value: Visibility; onChange: (v: Visibility) => void }> = ({ label, value, onChange }) => (
  <Row>
    <Label>{label}</Label>
    <select value={value} onChange={(e) => onChange(e.target.value as Visibility)} style={{ padding: "6px 8px" }}>
      <option value="draft">Entwurf</option>
      <option value="internal">Intern</option>
      <option value="public">Öffentlich</option>
    </select>
  </Row>
);

export default function UnifiedEditor() {
  const [list, setList] = useState<UnifiedEntry[]>(() => loadAll());
  const [entry, setEntry] = useState<UnifiedEntry>(() => newEmptyUnified());
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return list;
    return list.filter((e) =>
      [e.title, e.bible.ref, e.psych.term, e.link.bridgeText, e.tags.join(",")].join(" ").toLowerCase().includes(f)
    );
  }, [filter, list]);

  function save() {
    const updated = saveOne(entry);
    setEntry(updated);
    setList(loadAll());
    alert("Gespeichert ✅");
  }

  function newEmpty() {
    setEntry(newEmptyUnified());
  }

  function load(id: string) {
    const e = findById(id);
    if (e) setEntry(e);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
      {/* Sidebar */}
      <div style={{ borderRight: "1px solid #ddd", paddingRight: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Einträge</div>
        <input
          placeholder="Suche…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: "100%", padding: "6px 8px", marginBottom: 8 }}
        />
        <div style={{ maxHeight: 500, overflow: "auto", border: "1px solid #eee" }}>
          {filtered.map((e) => (
            <div
              key={e.id}
              onClick={() => load(e.id)}
              style={{
                padding: 8,
                cursor: "pointer",
                borderBottom: "1px solid #f2f2f2",
                background: e.id === entry.id ? "#f7fbff" : "transparent",
              }}
            >
              <div style={{ fontWeight: 600 }}>{e.title || "(ohne Titel)"}</div>
              <div style={{ fontSize: 12, color: "#555" }}>{e.bible.ref} • {e.psych.term}</div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: 8, color: "#666" }}>Keine Einträge.</div>}
        </div>

        <button onClick={newEmpty} style={{ marginTop: 10, width: "100%", padding: "8px 10px" }}>
          Neuer Eintrag
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
            alert("Aktueller Eintrag in die Zwischenablage kopiert (JSON).");
          }}
          style={{ marginTop: 6, width: "100%", padding: "8px 10px" }}
        >
          JSON kopieren
        </button>
      </div>

      {/* Form */}
      <div>
        <h2 style={{ marginTop: 0 }}>Unified-Editor</h2>

        <Input
          label="Titel / Thema"
          value={entry.title}
          onChange={(e) => setEntry({ ...entry, title: e.target.value })}
          placeholder="z. B. Teilnahme an göttlicher Natur"
        />

        <h3 style={{ marginTop: 20 }}>1) Bibel</h3>
        <Input
          label="Bibel-ID"
          value={entry.bible.id}
          onChange={(e) => setEntry({ ...entry, bible: { ...entry.bible, id: e.target.value } })}
          placeholder="bibel.2petrus1.3-4"
        />
        <Input
          label="Bibelstelle"
          value={entry.bible.ref}
          onChange={(e) => setEntry({ ...entry, bible: { ...entry.bible, ref: e.target.value } })}
          placeholder="2. Petrus 1,3–4"
        />
        <Input
          label="Bibel-Titel"
          value={entry.bible.title}
          onChange={(e) => setEntry({ ...entry, bible: { ...entry.bible, title: e.target.value } })}
          placeholder="Teilnahme an göttlicher Natur"
        />
        <TextArea
          label="Kurz-Zusammenfassung"
          value={entry.bible.summary}
          onChange={(e) => setEntry({ ...entry, bible: { ...entry.bible, summary: e.target.value } })}
          rows={3}
        />
        {/* Exegesen A/B */}
        {entry.bible.exegeses.map((ex, i) => (
          <div key={ex.key} style={{ border: "1px solid #eee", padding: 10, marginBottom: 10 }}>
            <Input
              label={`Auslegung ${ex.key} – Label`}
              value={ex.label}
              onChange={(e) => {
                const exs = [...entry.bible.exegeses];
                exs[i] = { ...exs[i], label: e.target.value };
                setEntry({ ...entry, bible: { ...entry.bible, exegeses: exs } });
              }}
            />
            <TextArea
              label={`Auslegung ${ex.key} – Text`}
              value={ex.body}
              onChange={(e) => {
                const exs = [...entry.bible.exegeses];
                exs[i] = { ...exs[i], body: e.target.value };
                setEntry({ ...entry, bible: { ...entry.bible, exegeses: exs } });
              }}
              rows={4}
            />
            <Input
              label="Crosslinks (optional, Kommas)"
              placeholder="bibel.1kor10.13, artikel.xyz/…"
              value={(ex.links || []).join(", ")}
              onChange={(e) => {
                const exs = [...entry.bible.exegeses];
                exs[i] = { ...exs[i], links: e.target.value.split(",").map(s => s.trim()).filter(Boolean) };
                setEntry({ ...entry, bible: { ...entry.bible, exegeses: exs } });
              }}
            />
          </div>
        ))}

        <h3 style={{ marginTop: 20 }}>2) Psychologie</h3>
        <Input
          label="Psych-ID"
          value={entry.psych.id}
          onChange={(e) => setEntry({ ...entry, psych: { ...entry.psych, id: e.target.value } })}
          placeholder="psych.grawe.bindung"
        />
        <Input
          label="Begriff"
          value={entry.psych.term}
          onChange={(e) => setEntry({ ...entry, psych: { ...entry.psych, term: e.target.value } })}
          placeholder="Bindung"
        />
        <Input
          label="Synonyme (Kommas)"
          value={entry.psych.synonyms.join(", ")}
          onChange={(e) =>
            setEntry({ ...entry, psych: { ...entry.psych, synonyms: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })
          }
          placeholder="Nähe, Sicherheit, Zugehörigkeit"
        />
        <TextArea
          label="Kurzdefinition (1–2 Sätze)"
          value={entry.psych.short}
          onChange={(e) => setEntry({ ...entry, psych: { ...entry.psych, short: e.target.value } })}
          rows={3}
        />
        <TextArea
          label="Vertiefung (optional)"
          value={entry.psych.long || ""}
          onChange={(e) => setEntry({ ...entry, psych: { ...entry.psych, long: e.target.value } })}
          rows={4}
        />
        <TextArea
          label="Quellen / APA / Zitate (optional)"
          value={entry.psych.sources || ""}
          onChange={(e) => setEntry({ ...entry, psych: { ...entry.psych, sources: e.target.value } })}
          rows={3}
        />

        <h3 style={{ marginTop: 20 }}>3) Crosslink (Brücke)</h3>
        <Input
          label="Crosslink-ID"
          value={entry.link.id}
          onChange={(e) => setEntry({ ...entry, link: { ...entry.link, id: e.target.value } })}
          placeholder="crosslink.bibel.2petrus1.3-4.psych.bindung"
        />
        <Input
          label="Bibel-ID (Verweis)"
          value={entry.link.bibleId}
          onChange={(e) => setEntry({ ...entry, link: { ...entry.link, bibleId: e.target.value } })}
          placeholder="bibel.2petrus1.3-4"
        />
        <Input
          label="Psych-IDs (Kommas)"
          value={entry.link.psychIds.join(", ")}
          onChange={(e) =>
            setEntry({ ...entry, link: { ...entry.link, psychIds: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })
          }
          placeholder="psych.grawe.bindung"
        />
        <TextArea
          label="Brückentext"
          value={entry.link.bridgeText}
          onChange={(e) => setEntry({ ...entry, link: { ...entry.link, bridgeText: e.target.value } })}
          rows={4}
        />
        <Input
          label="Crosslink-Tags (Kommas)"
          value={entry.link.tags.join(", ")}
          onChange={(e) =>
            setEntry({ ...entry, link: { ...entry.link, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })
          }
          placeholder="Bedürfnis, Lust, Verwandlung"
        />

        <h3 style={{ marginTop: 20 }}>4) Gemeinsame Felder</h3>
        <Input
          label="Tags (Kommas)"
          value={entry.tags.join(", ")}
          onChange={(e) => setEntry({ ...entry, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
          placeholder="Scham, Angst, Abhängigkeit…"
        />
        <Input
          label="Ressourcen (Kommas)"
          value={entry.resources.join(", ")}
          onChange={(e) => setEntry({ ...entry, resources: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
          placeholder="Lied: …, Bild: …, Zitat: …"
        />
        <Select
          label="Sichtbarkeit"
          value={entry.visibility}
          onChange={(v) => setEntry({ ...entry, visibility: v })}
        />
        <TextArea
          label="Notiz (optional)"
          value={entry.note || ""}
          onChange={(e) => setEntry({ ...entry, note: e.target.value })}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={save} style={{ padding: "8px 12px" }}>💾 Speichern</button>
          <button
            onClick={() => {
              const confirmNew = confirm("Ungespeicherte Änderungen gehen verloren. Neuen Eintrag beginnen?");
              if (confirmNew) setEntry(newEmptyUnified());
            }}
            style={{ padding: "8px 12px" }}
          >
            ➕ Neu (leer)
          </button>
        </div>

        <div style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
          <div>Erstellt: {new Date(entry.createdAt).toLocaleString()}</div>
          <div>Geändert: {new Date(entry.updatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

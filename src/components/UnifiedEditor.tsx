// src/components/UnifiedEditor.tsx
import React, { useMemo, useState } from "react";
import { UnifiedEntry } from "../types";
import { loadEntries, saveEntries } from "../lib/storage";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyEntry(): UnifiedEntry {
  return {
    id: newId(),
    title: "",
    summary: "",
    cross: {
      bibleRef: "",
      bibleView: "",
      psychView: "",
      bridge: "",
      tags: [],
      visibility: "draft",
      note: ""
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export default function UnifiedEditor() {
  const initial = useMemo(() => loadEntries(), []);
  const [items, setItems] = useState<UnifiedEntry[]>(initial);
  const [cur, setCur] = useState<UnifiedEntry>(emptyEntry());

  function onSave() {
    const list = [...items, { ...cur, updatedAt: Date.now() }];
    setItems(list);
    saveEntries(list);
    setCur(emptyEntry());
  }

  return (
    <div style={{ padding: 16, maxWidth: 880 }}>
      <h2 style={{ marginBottom: 12 }}>Unified-Editor</h2>

      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8 }}>
        <label>Titel</label>
        <input
          value={cur.title}
          onChange={(e) => setCur({ ...cur, title: e.target.value })}
        />

        <label>Bibelstelle</label>
        <input
          value={cur.cross.bibleRef}
          onChange={(e) =>
            setCur({ ...cur, cross: { ...cur.cross, bibleRef: e.target.value } })
          }
        />

        <label>Theologische Auslegung</label>
        <textarea
          rows={3}
          value={cur.cross.bibleView}
          onChange={(e) =>
            setCur({ ...cur, cross: { ...cur.cross, bibleView: e.target.value } })
          }
        />

        <label>Psychologische Begriffe/Erklärung</label>
        <textarea
          rows={3}
          value={cur.cross.psychView}
          onChange={(e) =>
            setCur({ ...cur, cross: { ...cur.cross, psychView: e.target.value } })
          }
        />

        <label>Brückentext</label>
        <textarea
          rows={2}
          value={cur.cross.bridge}
          onChange={(e) =>
            setCur({ ...cur, cross: { ...cur.cross, bridge: e.target.value } })
          }
        />

        <label>Tags (Komma)</label>
        <input
          value={cur.cross.tags.join(", ")}
          onChange={(e) =>
            setCur({
              ...cur,
              cross: {
                ...cur.cross,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              },
            })
          }
        />

        <label>Sichtbarkeit</label>
        <select
          value={cur.cross.visibility}
          onChange={(e) =>
            setCur({
              ...cur,
              cross: { ...cur.cross, visibility: e.target.value as "draft" | "public" },
            })
          }
        >
          <option value="draft">Entwurf</option>
          <option value="public">Öffentlich</option>
        </select>

        <div />
        <button onClick={onSave}>Speichern & neuen Eintrag beginnen</button>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <h3>Gespeicherte Einträge</h3>
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <strong>{it.title || "(ohne Titel)"}</strong> — {it.cross.bibleRef}
          </li>
        ))}
      </ul>
    </div>
  );
}

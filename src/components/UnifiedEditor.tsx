// src/components/UnifiedEditor.tsx
import { useState } from "react";
import { t } from "../i18n";
import { LS_KEYS, loadLS, saveLS } from "../lib/storage";
import type { UnifiedEntry } from "../types";

const EMPTY: UnifiedEntry = {
  bibleRef: "",
  bibleView: "",
  psychTerm: "",
  bridgeText: "",
  tags: [],
  visibility: "draft",
  note: "",
};

export default function UnifiedEditor() {
  const [entry, setEntry] = useState<UnifiedEntry>(() =>
    loadLS<UnifiedEntry>(LS_KEYS.unified, EMPTY)
  );

  function update<K extends keyof UnifiedEntry>(key: K, value: UnifiedEntry[K]) {
    const next = { ...entry, [key]: value };
    setEntry(next);
    saveLS(LS_KEYS.unified, next);
  }

  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (!value) return;
      update("tags", Array.from(new Set([...entry.tags, value])));
      (e.target as HTMLInputElement).value = "";
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 4 }}>{t("editor.title")}</h2>
      <p style={{ marginTop: 0, color: "#666" }}>{t("editor.hint")}</p>

      <label>
        {t("editor.fields.bibleRef")}
        <input
          style={{ width: "100%", marginTop: 4, marginBottom: 12 }}
          value={entry.bibleRef}
          onChange={(e) => update("bibleRef", e.target.value)}
          placeholder="Joh 3,16; Psalm 23; …"
        />
      </label>

      <label>
        {t("editor.fields.bibleView")}
        <textarea
          style={{ width: "100%", height: 80, marginTop: 4, marginBottom: 12 }}
          value={entry.bibleView}
          onChange={(e) => update("bibleView", e.target.value)}
          placeholder={t("editor.placeholders.bibleView")}
        />
      </label>

      <label>
        {t("editor.fields.psych")}
        <input
          style={{ width: "100%", marginTop: 4, marginBottom: 12 }}
          value={entry.psychTerm}
          onChange={(e) => update("psychTerm", e.target.value)}
          placeholder="Bindung, Verdrängung, …"
        />
      </label>

      <label>
        {t("editor.fields.bridge")}
        <textarea
          style={{ width: "100%", height: 80, marginTop: 4, marginBottom: 12 }}
          value={entry.bridgeText}
          onChange={(e) => update("bridgeText", e.target.value)}
          placeholder={t("editor.placeholders.bridge")}
        />
      </label>

      <label>
        {t("editor.fields.tags")}
        <input
          style={{ width: "100%", marginTop: 4 }}
          onKeyDown={onTagKeyDown}
          placeholder={t("editor.placeholders.tags")}
        />
      </label>
      <div style={{ margin: "6px 0 12px" }}>
        {entry.tags.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-block",
              padding: "2px 8px",
              marginRight: 6,
              marginBottom: 6,
              borderRadius: 12,
              background: "#eee",
              fontSize: 12,
            }}
            onClick={() =>
              update(
                "tags",
                entry.tags.filter((t) => t !== tag)
              )
            }
            title="Tag entfernen"
          >
            {tag} ✕
          </span>
        ))}
      </div>

      <label>
        {t("editor.fields.visibility")}
        <select
          style={{ display: "block", marginTop: 4, marginBottom: 12 }}
          value={entry.visibility}
          onChange={(e) => update("visibility", e.target.value as UnifiedEntry["visibility"])}
        >
          <option value="draft">{t("editor.visibility.draft")}</option>
          <option value="public">{t("editor.visibility.public")}</option>
        </select>
      </label>

      <label>
        {t("editor.fields.note")}
        <textarea
          style={{ width: "100%", height: 80, marginTop: 4 }}
          value={entry.note}
          onChange={(e) => update("note", e.target.value)}
          placeholder={t("editor.placeholders.note")}
        />
      </label>
    </div>
  );
}

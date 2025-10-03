// src/App.tsx
import React, { useState } from "react";
import { t, setLang, getLang } from "./i18n";
import UnifiedEditor from "./components/UnifiedEditor";

export default function App() {
  const [lang, setLangState] = useState<"de" | "en" | "no">(getLang() as "de" | "en" | "no");
  const [showEditor, setShowEditor] = useState(false);

  function switchLang(next: "de" | "en" | "no") {
    setLang(next);
    setLangState(next);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, lineHeight: 1.5 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>{t("app.title")}</h1>
      </header>

      <p style={{ marginTop: 0 }}>{t("app.subtitle")}</p>

      <div style={{ display: "flex", gap: 6, margin: "10px 0 18px" }}>
        <button onClick={() => switchLang("de")} disabled={lang === "de"}>DE</button>
        <button onClick={() => switchLang("en")} disabled={lang === "en"}>EN</button>
        <button onClick={() => switchLang("no")} disabled={lang === "no"}>NO</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowEditor(v => !v)} style={{ padding: "8px 12px" }}>
          {showEditor ? "Editor schließen" : "Unified-Editor öffnen"}
        </button>
      </div>

      {showEditor ? (
        <UnifiedEditor />
      ) : (
        <div style={{ color: "#555" }}>
          <p>Nutze den Button oben, um den Editor zu öffnen.</p>
        </div>
      )}
    </div>
  );
}

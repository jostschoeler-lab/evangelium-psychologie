// src/App.tsx
import React, { useState } from "react";
import { t, setLang, getLang } from "./i18n";
import UnifiedEditor from "./components/UnifiedEditor";

export default function App() {
  const [lang, setLangState] = useState(getLang());
  function switchLang(next: "de" | "en" | "no") {
    setLang(next);
    setLangState(next);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, lineHeight: 1.5 }}>
      <header style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>{t("app.title")}</h1>
      </header>

      <p style={{ marginTop: 8 }}>{t("app.subtitle")}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => switchLang("de")} disabled={lang === "de"}>DE</button>
        <button onClick={() => switchLang("en")} disabled={lang === "en"}>EN</button>
        <button onClick={() => switchLang("no")} disabled={lang === "no"}>NO</button>
      </div>

      {/* 👉 Hier wird der neue Editor angezeigt */}
      <UnifiedEditor />
    </div>
  );
}

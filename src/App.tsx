// src/App.tsx
import { useState } from "react";
import { t, switchLang, getLang } from "./i18n";
import UnifiedEditor from "./components/UnifiedEditor";

export default function App() {
  const [lang, setLang] = useState(getLang());
  const [view, setView] = useState<"home" | "editor">("editor");

  function changeLanguage(next: "de" | "en" | "no") {
    switchLang(next);
    setLang(next);
  }

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
      <header style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>{t("app.title")}</h1>
        <p style={{ margin: 0, color: "#666" }}>{t("app.subtitle")}</p>

        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button onClick={() => changeLanguage("de")} disabled={lang === "de"}>DE</button>
          <button onClick={() => changeLanguage("en")} disabled={lang === "en"}>EN</button>
          <button onClick={() => changeLanguage("no")} disabled={lang === "no"}>NO</button>
        </div>
      </header>

      <nav style={{ marginTop: 16, marginBottom: 8, display: "flex", gap: 8 }}>
        <button onClick={() => setView("home")}  disabled={view === "home"}>{t("nav.home")}</button>
        <button onClick={() => setView("editor")} disabled={view === "editor"}>{t("nav.editor")}</button>
      </nav>

      {view === "home" && (
        <p style={{ color: "#555" }}>
          {t("home.welcome")}
        </p>
      )}

      {view === "editor" && <UnifiedEditor />}
    </div>
  );
}

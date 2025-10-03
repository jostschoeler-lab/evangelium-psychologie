// src/App.tsx
import React, { useState } from "react";

// aus deinem i18n-Modul (du hast bereits t, setLang, getLang)
import { t, setLang, getLang } from "./i18n";

// unser Editor (aus dem letzten Schritt)
import UnifiedEditor from "./components/UnifiedEditor";

export default function App() {
  // aktuelle Sprache im Zustand halten (damit die Buttons korrekt disabled werden)
  const [lang, setLangState] = useState<"de" | "en" | "no">(getLang() as "de" | "en" | "no");

  // Editor sichtbar/unsichtbar schalten
  const [showEditor, setShowEditor] = useState(false);

  function switchLang(next: "de" | "en" | "no") {
    setLang(next);       // i18n umstellen (persistiert z. B. im localStorage)
    setLangState(next);  // UI neu rendern (damit Buttons & Texte aktualisiert sind)
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, lineHeight: 1.5 }}>
      {/* Kopf */}
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>{t("app.title")}</h1>
      </header>

      {/* Untertitel aus i18n */}
      <p style={{ marginTop: 0 }}>{t("app.subtitle")}</p>

      {/* === Sprach-Buttons (DE/EN/NO) ===
          Klicken -> setLang(...) + UI-State aktualisieren
          Der Button der aktuellen Sprache ist disabled. */}
      <div style={{ display: "flex", gap: 6, margin: "10px 0 18px" }}>
        <button onClick={() => switchLang("de")} disabled={lang === "de"}>DE</button>
        <button onClick={() => switchLang("en")} disabled={lang === "en"}>EN</button>
        <button onClick={() => switchLang("no")} disabled={lang === "no"}>NO</button>
      </div>

      {/* Editor-Toggle */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowEditor((v) => !v)} style={{ padding: "8px 12px" }}>
          {showEditor ? "Editor schließen" : "Unified-Editor öffnen"}
        </button>
      </div>

      {/* Inhalt: entweder Editor oder kurzer Hinweis */}
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

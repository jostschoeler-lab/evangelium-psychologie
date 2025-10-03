import { useState } from "react";
import { t, setLang, getLang } from "./i18n";

export default function App() {
  const [lang, setL] = useState(getLang());

  function switchLang(next: "de" | "en" | "no") {
    setLang(next);
    setL(next);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, lineHeight: 1.5 }}>
      <header style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>{t("app.title")}</h1>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button onClick={() => switchLang("de")} disabled={lang === "de"}>DE</button>
          <button onClick={() => switchLang("en")} disabled={lang === "en"}>EN</button>
          <button onClick={() => switchLang("no")} disabled={lang === "no"}>NO</button>
        </div>
      </header>

      <p style={{ marginTop: 8 }}>{t("app.subtitle")}</p>

      <nav style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <span>• {t("menu.uebung")}</span>
        <span>• {t("menu.themen")}</span>
        <span>• {t("menu.grundwissen")}</span>
        <span>• {t("menu.bibliothek")}</span>
        <span>• {t("menu.editor")}</span>
        <span>• {t("menu.journal")}</span>
        <span>• {t("menu.settings")}</span>
      </nav>

      <section style={{ marginTop: 20, padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>{t("editor.title")}</h3>
        <p style={{ margin: 0 }}>{t("editor.hint")}</p>
        <ul>
          <li>{t("editor.fields.bible")}</li>
          <li>{t("editor.fields.psych")}</li>
          <li>{t("editor.fields.bridge")}</li>
          <li>{t("editor.fields.tags")}</li>
          <li>{t("editor.fields.visibility")}</li>
        </ul>
        <p style={{ fontSize: 12, color: "#6b7280" }}>{t("footnote.localOnly")}</p>
      </section>
    </div>
  );
}

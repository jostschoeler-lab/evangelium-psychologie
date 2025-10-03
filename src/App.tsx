import { useState } from "react";
import { t, switchLang, getLang } from "./i18n";

export default function App() {
  const [lang, setLangState] = useState(getLang());

  return (
    <div>
      <h1>{t("app.title")}</h1>
      <p>{t("app.subtitle")}</p>

      <button onClick={() => switchLang("de")} disabled={lang === "de"}>DE</button>
      <button onClick={() => switchLang("en")} disabled={lang === "en"}>EN</button>
      <button onClick={() => switchLang("no")} disabled={lang === "no"}>NO</button>
    </div>
  );
}

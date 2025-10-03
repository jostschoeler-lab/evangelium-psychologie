import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Not‑Bedürfnis‑Jesus – Modularer App‑Prototyp
 * -------------------------------------------------
 * Ein einzelner React-File als lauffähiger Prototyp mit:
 * - Seitenmenü + Module (Themen-Hub, Stuhldialog, Spannungsmodell, Meditation, Ressourcen, Texte, Themen/Crosslinks)
 * - i18n (Deutsch/Englisch/Norwegisch) + zentraler Label-/Prompt-Editor (nur mit Login)
 * - Mikrofon (Web Speech API) für Spracheingabe
 * - Ressourcen, die in mehreren Modulen verlinkbar sind
 * - Formular für Themen-Einträge mit Crosslinks (Bibel <-> Psychologie)
 * - Lokale Persistenz (localStorage) für Inhalte, Sprache, Admin-Labels
 *
 * Hinweis: Dieser Prototyp ist bewusst in einer Datei gehalten, damit du ihn
 *  leicht kopieren kannst. Für Produktion würdest du Module in Dateien trennen.
 */

// --- Utilities -------------------------------------------------------------
const LS_KEYS = {
  appState: "nbj_app_state_v1",
  i18n: "nbj_i18n_labels_v1",
  resources: "nbj_resources_v1",
  topics: "nbj_topics_v1",
  dialogs: "nbj_dialogs_v1",
  unified: "nbj_unified_entries_v1",
};

function saveLS(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

// --- Minimal i18n ----------------------------------------------------------
const defaultI18N = {
  de: {
    appTitle: "Not‑Bedürfnis‑Jesus",
    menu: {
      uebung: "Übung (Start)",
      themen: "Themen",
      grundwissen: "Grundwissen",
      bibliothek: "Bibliothek",
      ressourcenEditor: "Ressourcen/Brücken (Editor)",
      journal: "Journal & Auswertung",
      einstellungen: "Einstellungen",
      admin: "Admin (Labels/Prompts)"
    },
    hub: {
      title: "Themen‑Hub",
      desc: "Wähle, womit du arbeiten möchtest. Deine Auswahl verknüpft die Module über Tags.",
      feelings: "Gefühle",
      needs: "Bedürfnisse",
      behaviors: "Verhaltensmuster",
      domains: "Lebensbereiche",
      apply: "Auswahl anwenden"
    },
    modules: {
      meditation: "Meditation",
      stuhldialog: "Stuhldialog",
      spannung: "Spannungsmodell",
      ressourcen: "Ressourcen",
      texte: "Texte",
      themen: "Themen (Theologie ↔ Psychologie)"
    },
    common: {
      start: "Start",
      pause: "Pause",
      save: "Speichern",
      edit: "Bearbeiten",
      add: "Hinzufügen",
      remove: "Entfernen",
      language: "Sprache",
      login: "Login",
      logout: "Logout",
      username: "Benutzername",
      password: "Passwort",
      signIn: "Anmelden",
      private: "(Privat)"
    },
    dialog: {
      autoPlay: "Automatisch abspielen",
      selfSpeak: "Selbst sprechen",
      chooseRole: "Rolle wählen",
      roles: { child: "Kind", accuser: "Ankläger", self: "Ich (Erwachsen)", jesus: "Jesus (Hohepriester)" },
      record: "Mikro aufnehmen",
      stop: "Stopp",
      saySomething: "Sag 1–2 Sätze…",
      transcript: "Transkript",
      addTurn: "Zug einfügen",
      clear: "Zurücksetzen"
    },
    cross: {
      newEntry: "Neuer Themen‑Eintrag",
      title: "Titel",
      bibleRef: "Bibelstelle(n)",
      bibleView: "Theologische Auslegungen",
      psychView: "Psychologische Begriffe",
      bridge: "Brückentext (Theologie ↔ Psychologie)",
      tags: "Tags",
      visibility: "Sichtbarkeit",
      public: "Öffentlich",
      draft: "Entwurf"
    },
    res: {
      addRes: "Ressource hinzufügen",
      type: "Typ",
      url: "URL / ID",
      note: "Notiz / Beschreibung"
    },
    unified: {
      title: "Editor: Bibel – Psychologie – Crosslink",
      bibelId: "Bibel‑ID",
      bibelTitle: "Bibel‑Titel/Thema",
      bibelSummary: "Kurz‑Zusammenfassung",
      exegeses: "Auslegungen (eine pro Zeile)",
      psychId: "Psych‑ID",
      psychTerm: "Kurzbegriff",
      psychSyn: "Synonyme",
      psychShort: "Kurzdefinition",
      psychLong: "Vertiefung (optional)",
      bridgeId: "Crosslink‑ID",
      bridgeText: "Brückentext",
      common: "Gemeinsame Felder",
      saveAll: "Alles speichern"
    }
  },
  en: {
    appTitle: "Need‑Crisis‑Jesus",
    menu: { uebung: "Practice (Start)", themen: "Topics", grundwissen: "Knowledge", bibliothek: "Library", ressourcenEditor: "Resources/Bridges (Editor)", journal: "Journal & Review", einstellungen: "Settings", admin: "Admin (Labels/Prompts)" },
    hub: { title: "Topic Hub", desc: "Select what you want to work on. Your selection links modules via tags.", feelings: "Feelings", needs: "Needs", behaviors: "Coping", domains: "Domains", apply: "Apply" },
    modules: { meditation: "Meditation", stuhldialog: "Chair Dialogue", spannung: "Tension Model", ressourcen: "Resources", texte: "Texts", themen: "Topics (Theology ↔ Psychology)" },
    common: { start: "Start", pause: "Pause", save: "Save", edit: "Edit", add: "Add", remove: "Remove", language: "Language", login: "Login", logout: "Logout", username: "Username", password: "Password", signIn: "Sign in", private: "(Private)" },
    dialog: { autoPlay: "Auto play", selfSpeak: "Self speak", chooseRole: "Choose role", roles: { child: "Child", accuser: "Accuser", self: "Self (Adult)", jesus: "Jesus (High Priest)" }, record: "Record", stop: "Stop", saySomething: "Say 1–2 sentences…", transcript: "Transcript", addTurn: "Add turn", clear: "Reset" },
    cross: { newEntry: "New topic entry", title: "Title", bibleRef: "Bible reference(s)", bibleView: "Theological readings", psychView: "Psychological terms", bridge: "Bridge text (Theology ↔ Psychology)", tags: "Tags", visibility: "Visibility", public: "Public", draft: "Draft" },
    res: { addRes: "Add resource", type: "Type", url: "URL / ID", note: "Note / description" },
    unified: { title: "Editor: Bible – Psychology – Bridge", bibelId: "Bible ID", bibelTitle: "Bible title/topic", bibelSummary: "Short summary", exegeses: "Exegeses (one per line)", psychId: "Psych ID", psychTerm: "Term", psychSyn: "Synonyms", psychShort: "Short definition", psychLong: "Extended (optional)", bridgeId: "Bridge ID", bridgeText: "Bridge text", common: "Common fields", saveAll: "Save all" }
  },
  no: {
    appTitle: "Nød‑Behov‑Jesus",
    menu: { uebung: "Øvelse (Start)", themen: "Temaer", grundwissen: "Grunnkunnskap", bibliothek: "Bibliotek", ressourcenEditor: "Ressurser/Broer (Editor)", journal: "Journal & Analyse", einstellungen: "Innstillinger", admin: "Admin (etiketter/prompter)" },
    hub: { title: "Tema‑hub", desc: "Velg hva du vil jobbe med. Valget ditt kobler moduler via tagger.", feelings: "Følelser", needs: "Behov", behaviors: "Mestring", domains: "Livsområder", apply: "Bruk" },
    modules: { meditation: "Meditasjon", stuhldialog: "Stol‑dialog", spannung: "Spenningsmodell", ressourcen: "Ressurser", texte: "Tekster", themen: "Tema (Teologi ↔ Psykologi)" },
    common: { start: "Start", pause: "Pause", save: "Lagre", edit: "Rediger", add: "Legg til", remove: "Fjern", language: "Språk", login: "Logg inn", logout: "Logg ut", username: "Brukernavn", password: "Passord", signIn: "Logg inn", private: "(Privat)" },
    dialog: { autoPlay: "Auto", selfSpeak: "Snakk selv", chooseRole: "Velg rolle", roles: { child: "Barn", accuser: "Anklager", self: "Jeg (Voksen)", jesus: "Jesus (Yppersteprest)" }, record: "Ta opp", stop: "Stopp", saySomething: "Si 1–2 setninger…", transcript: "Transkript", addTurn: "Legg til replikk", clear: "Nullstill" },
    cross: { newEntry: "Ny temapost", title: "Tittel", bibleRef: "Bibelsted(er)", bibleView: "Teologiske tolkninger", psychView: "Psykologiske begrep", bridge: "Bro‑tekst (Teologi ↔ Psykologi)", tags: "Tagger", visibility: "Synlighet", public: "Offentlig", draft: "Utkast" },
    res: { addRes: "Legg til ressurs", type: "Type", url: "URL / ID", note: "Notat / beskrivelse" },
    unified: { title: "Editor: Bibel – Psykologi – Bro", bibelId: "Bibel‑ID", bibelTitle: "Bibel‑tittel/tema", bibelSummary: "Kort sammendrag", exegeses: "Tolkninger (én per linje)", psychId: "Psyk‑ID", psychTerm: "Begrep", psychSyn: "Synonymer", psychShort: "Kortdefinisjon", psychLong: "Utdyping (valgfritt)", bridgeId: "Bro‑ID", bridgeText: "Bro‑tekst", common: "Felles felt", saveAll: "Lagre alt" }
  }
};

function useI18N() {
  const [labels, setLabels] = useState(() => loadLS(LS_KEYS.i18n, defaultI18N));
  const [lang, setLang] = useState(() => loadLS(LS_KEYS.appState, { lang: "de" }).lang || "de");
  useEffect(() => saveLS(LS_KEYS.i18n, labels), [labels]);
  useEffect(() => saveLS(LS_KEYS.appState, { lang }), [lang]);
  const t = useMemo(() => labels[lang], [labels, lang]);
  return { t, labels, setLabels, lang, setLang };
}

// --- Dummy Auth ------------------------------------------------------------
function useAuth() {
  const [user, setUser] = useState(() => loadLS(LS_KEYS.appState, { user: null }).user);
  useEffect(() => {
    const saved = loadLS(LS_KEYS.appState, {});
    saveLS(LS_KEYS.appState, { ...saved, user });
  }, [user]);
  return { user, login: (u) => setUser(u), logout: () => setUser(null) };
}

// --- Shared data types -----------------------------------------------------
const DEFAULT_TAGS = {
  feelings: ["Angst", "Trauer", "Wut", "Scham", "Freude"],
  needs: ["Bindung", "Autonomie/Kontrolle", "Selbstwert", "Lustgewinn/Vermeidung", "Sinn/Transzendenz"],
  behaviors: ["Vermeidung", "Unterwerfung", "Sucht", "Aggression", "Rückzug", "Überkompensation"],
  domains: ["Trauerfall", "Abhängigkeit", "Beziehungsproblem", "Angst vor Zurückweisung", "Schuld/Verdammnis", "Hoffnungslosigkeit"],
};

// Dialog Seed (kannst du später im Admin anpassen)
const SEED_DIALOGS = loadLS(LS_KEYS.dialogs, {
  "Trauer": [
    { role: "Ankläger", text: "Du hättest stärker sein müssen." },
    { role: "Kind", text: "Ich bin so allein. Es war zu viel." },
    { role: "Ich", text: "Ich höre dich. Es war überwältigend; niemand hat dich gehalten." },
    { role: "Jesus", text: "Kommt her zu mir, die ihr mühselig und beladen seid… (Mt 11,28)." },
  ],
});

// Ressourcen Seed
const SEED_RESOURCES = loadLS(LS_KEYS.resources, [
  { id: "ps23", type: "Vers", title: "Psalm 23", url: "", note: "Trostritual" },
  { id: "song_stille", type: "Lied", title: "Sei stille dem Herrn", url: "https://example.com", note: "Angst/Trauer" },
]);

// Themen/Crosslink Seed
const SEED_TOPICS = loadLS(LS_KEYS.topics, [
  { id: "t1", title: "Trauer – Verlassenheit", bible: "Mt 11,28; Ps 34,19", bibleView: "Trost in Christus, Zulassen von Leid", psychView: "Bindung, Schema Verlassenheit, ACT‑Akzeptanz", bridge: "Verheißung stillt Bindungsbedürfnis; dadurch verliert Rückzug Kraft.", tags: ["Trauer", "Bindung"], visibility: "public" },
]);

// --- Components ------------------------------------------------------------
const Pill = ({children}) => (<span className="inline-block rounded-full bg-slate-200 px-2 py-0.5 text-xs mr-1 mb-1">{children}</span>);

function Header({ t, lang, setLang, user, onLogout }) {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0 z-10">
      <h1 className="text-xl font-semibold">{t.appTitle}</h1>
      <div className="flex items-center gap-3">
        <select className="border rounded px-2 py-1" value={lang} onChange={e=>setLang(e.target.value)}>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="no">Norsk</option>
        </select>
        {user ? (
          <button onClick={onLogout} className="px-3 py-1 rounded bg-slate-800 text-white">{t.common.logout}</button>
        ) : null}
      </div>
    </div>
  );
}

function SideMenu({ t, current, setCurrent, user }) {
  const items = [
    { id: "hub", label: t.menu.themen },
    { id: "practice", label: t.menu.uebung },
    { id: "knowledge", label: t.menu.grundwissen },
    { id: "library", label: t.menu.bibliothek }, { id: "unified", label: t.menu.ressourcenEditor },
    { id: "unified", label: t.menu.ressourcenEditor },
    { id: "journal", label: t.menu.journal },
    { id: "settings", label: t.menu.einstellungen },
    { id: "admin", label: t.menu.admin, private: true },
  ];
  return (
    <div className="w-64 border-r h-full p-3 hidden md:block">
      {items.filter(it=>!it.private || user).map(it=> (
        <div key={it.id}
             className={`cursor-pointer rounded px-3 py-2 mb-1 hover:bg-slate-100 ${current===it.id?"bg-slate-200 font-medium":""}`}
             onClick={()=>setCurrent(it.id)}>
          {it.label} {it.private? <span className="text-xs text-slate-500">{t.common.private}</span>:null}
        </div>
      ))}
    </div>
  );
}

function TagHub({ t, tagsState, setTagsState }) {
  const [local, setLocal] = useState(tagsState);
  useEffect(()=> setLocal(tagsState),[tagsState]);
  function toggle(group, tag) {
    const s = new Set(local[group]);
    s.has(tag) ? s.delete(tag) : s.add(tag);
    setLocal({ ...local, [group]: Array.from(s) });
  }
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">{t.hub.title}</h2>
      <p className="text-slate-600 mb-4">{t.hub.desc}</p>
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(DEFAULT_TAGS).map(([group, list])=> (
          <div key={group} className="border rounded p-3">
            <div className="font-medium mb-2">{t.hub[group] || group}</div>
            <div className="flex flex-wrap">
              {list.map(tag=> (
                <label key={tag} className={`mr-2 mb-2 cursor-pointer select-none px-2 py-1 rounded border ${local[group].includes(tag)?"bg-slate-800 text-white border-slate-800":""}`}>
                  <input type="checkbox" className="hidden" checked={local[group].includes(tag)} onChange={()=>toggle(group, tag)} />
                  {tag}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="px-3 py-2 rounded bg-slate-800 text-white" onClick={()=>setTagsState(local)}>{t.hub.apply}</button>
      </div>
    </div>
  );
}

// --- Mikrofon (Web Speech API) --------------------------------------------
function useMic() {
  const recRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  useEffect(()=>()=>{ if(recRef.current) recRef.current.stop?.(); },[]);
  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Web Speech API nicht verfügbar in diesem Browser."); return; }
    const rec = new SR();
    rec.lang = (loadLS(LS_KEYS.appState,{lang:"de"}).lang)||"de-DE";
    rec.interimResults = true;
    rec.onresult = (e)=>{
      let txt = ""; for (let i=0;i<e.results.length;i++) txt += e.results[i][0].transcript + " ";
      setTranscript(txt.trim());
    };
    rec.onend = ()=> setRecording(false);
    rec.start();
    recRef.current = rec; setRecording(true);
  }
  function stop(){ recRef.current?.stop(); setRecording(false); }
  return { recording, transcript, start, stop, setTranscript };
}

// --- Module: Stuhldialog ---------------------------------------------------
function ChairDialog({ t, selectedTags, dialogsState, setDialogsState }) {
  const [topic, setTopic] = useState(Object.keys(dialogsState)[0]||"Trauer");
  const [turns, setTurns] = useState(dialogsState[topic] || []);
  useEffect(()=> setTurns(dialogsState[topic]||[]), [topic, dialogsState]);
  const { recording, transcript, start, stop, setTranscript } = useMic();
  const [role, setRole] = useState("Ich");

  function addTurn(text){
    const nt = [...turns, { role, text }];
    setTurns(nt);
    const clone = { ...dialogsState, [topic]: nt };
    setDialogsState(clone); saveLS(LS_KEYS.dialogs, clone);
    setTranscript("");
  }
  function reset(){
    const nt = (SEED_DIALOGS[topic]||[]);
    setTurns(nt); const clone = { ...dialogsState, [topic]: nt }; setDialogsState(clone); saveLS(LS_KEYS.dialogs, clone);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <select className="border rounded px-2 py-1" value={topic} onChange={e=>setTopic(e.target.value)}>
          {Object.keys(dialogsState).map(k=> <option key={k}>{k}</option>)}
          {!dialogsState["Trauer"] && <option>Trauer</option>}
        </select>
        <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={reset}>{t.dialog.clear}</button>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {(["Kind","Ankläger","Ich","Jesus"]).map(r => (
          <button key={r} onClick={()=>setRole(r)}
                  className={`rounded p-3 border text-left ${role===r?"bg-slate-800 text-white":"hover:bg-slate-100"}`}>
            <div className="font-medium">{t.dialog.roles[r.toLowerCase()] || r}</div>
            <div className="text-xs text-slate-500">{r==="Jesus"?"Trost & Orientierung": r==="Ankläger"?"Kritik & Druck": r==="Kind"?"Gefühle & Bedürfnisse":"Validierung & Entscheidung"}</div>
          </button>
        ))}
      </div>

      <div className="border rounded p-3">
        <div className="mb-2 text-sm text-slate-600">{t.dialog.saySomething}</div>
        <textarea className="w-full border rounded p-2 h-24" value={transcript} onChange={e=>setTranscript(e.target.value)} />
        <div className="mt-2 flex items-center gap-2">
          {!recording ? (
            <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={start}>{t.dialog.record}</button>
          ) : (
            <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={stop}>{t.dialog.stop}</button>
          )}
          <button className="px-3 py-1 rounded bg-emerald-700 text-white" onClick={()=>addTurn(transcript)}>{t.dialog.addTurn}</button>
        </div>
      </div>

      <div className="border rounded p-3">
        <div className="font-medium mb-2">Dialog – {topic}</div>
        <ol className="space-y-2 list-decimal pl-5">
          {turns.map((tr,idx)=> (
            <li key={idx} className="bg-slate-50 rounded p-2">
              <span className="font-semibold mr-2">{tr.role}:</span>
              <span>{tr.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// --- Module: Meditation ----------------------------------------------------
function Meditation({ t, selectedTags }){
  const [running, setRunning] = useState(false);
  const steps = [
    { title: "Ankommen", sec: 30 },
    { title: "Atem 4‑6‑Atmung", sec: 45 },
    { title: "Dankbarkeit (3 Dinge)", sec: 60 },
    { title: "Gefühle benennen", sec: 45 },
    { title: "Commitment: ein kleiner Schritt", sec: 30 },
  ];
  const [i, setI] = useState(0);
  useEffect(()=>{
    if (!running) return; if (i>=steps.length) { setRunning(false); return; }
    const id = setTimeout(()=> setI(i+1), steps[i].sec*1000);
    return ()=> clearTimeout(id);
  },[running, i]);
  return (
    <div className="p-4 space-y-3">
      <h3 className="font-semibold">{t.modules.meditation}</h3>
      <div className="text-slate-600 text-sm">Tags: {Object.values(selectedTags).flat().map(x=> <Pill key={x}>{x}</Pill>)}</div>
      <div className="border rounded p-3">
        <div className="font-medium">{i<steps.length? steps[i].title : "Fertig"}</div>
        <div className="mt-2 flex gap-2">
          {!running ? (
            <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={()=>{setI(0); setRunning(true);}}>{t.common.start}</button>
          ) : (
            <button className="px-3 py-1 rounded bg-slate-600 text-white" onClick={()=>setRunning(false)}>{t.common.pause}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Module: Spannungsmodell (Placeholder) --------------------------------
function TensionModel({ selectedTags }){
  return (
    <div className="p-4 space-y-2">
      <h3 className="font-semibold">Spannungsmodell</h3>
      <p className="text-sm text-slate-600">(Platzhalter) – Hier kannst du später deine Diagramme/Grafiken integrieren. Aktive Tags:</p>
      <div>{Object.values(selectedTags).flat().map(x=> <Pill key={x}>{x}</Pill>)}</div>
    </div>
  );
}

// --- Module: Ressourcen ----------------------------------------------------
function Resources({ t, resources, setResources }){
  const [f, setF] = useState({ type: "Vers", title: "", url: "", note: "" });
  function add(){ const id = `${f.type}_${Date.now()}`; const nr = [...resources, { id, ...f }]; setResources(nr); saveLS(LS_KEYS.resources, nr); setF({ type: "Vers", title: "", url: "", note: ""}); }
  function remove(id){ const nr = resources.filter(r=>r.id!==id); setResources(nr); saveLS(LS_KEYS.resources, nr); }
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">{t.modules.ressourcen}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-3">
          <div className="font-medium mb-2">{t.res.addRes}</div>
          <select className="border rounded px-2 py-1 w-full mb-2" value={f.type} onChange={e=>setF({...f, type:e.target.value})}>
            {['Vers','Lied','Meditation','Übung','Notiz'].map(x=> <option key={x}>{x}</option>)}
          </select>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Titel" value={f.title} onChange={e=>setF({...f, title:e.target.value})}/>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.res.url} value={f.url} onChange={e=>setF({...f, url:e.target.value})}/>
          <textarea className="border rounded p-2 w-full mb-2" placeholder={t.res.note} value={f.note} onChange={e=>setF({...f, note:e.target.value})}></textarea>
          <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={add}>{t.common.add}</button>
        </div>
        <div className="md:col-span-2 border rounded p-3">
          <div className="font-medium mb-2">Liste</div>
          <div className="space-y-2">
            {resources.map(r=> (
              <div key={r.id} className="border rounded p-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.title} <span className="text-xs text-slate-500">({r.type})</span></div>
                  <div className="text-xs text-slate-500 break-all">{r.url}</div>
                  <div className="text-sm">{r.note}</div>
                </div>
                <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={()=>remove(r.id)}>{t.common.remove}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Module: Themen/Crosslinks --------------------------------------------
function Topics({ t, topics, setTopics }){
  const empty = { title:"", bible:"", bibleView:"", psychView:"", bridge:"", tags:[], visibility:"draft" };
  const [form, setForm] = useState(empty);
  function add(){ const id = `topic_${Date.now()}`; const nt = [...topics, { id, ...form }]; setTopics(nt); saveLS(LS_KEYS.topics, nt); setForm(empty); }
  function remove(id){ const nt = topics.filter(x=>x.id!==id); setTopics(nt); saveLS(LS_KEYS.topics, nt); }
  function toggleTag(tag){ const s = new Set(form.tags); s.has(tag)?s.delete(tag):s.add(tag); setForm({...form, tags:[...s]}); }
  return (
    <div className="p-4 space-y-4">
      <div className="border rounded p-3">
        <div className="font-semibold mb-2">{t.cross.newEntry}</div>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded px-2 py-1" placeholder={t.cross.title} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <input className="border rounded px-2 py-1" placeholder={t.cross.bibleRef} value={form.bible} onChange={e=>setForm({...form,bible:e.target.value})}/>
          <textarea className="border rounded p-2 md:col-span-1" placeholder={t.cross.bibleView} value={form.bibleView} onChange={e=>setForm({...form,bibleView:e.target.value})}/>
          <textarea className="border rounded p-2 md:col-span-1" placeholder={t.cross.psychView} value={form.psychView} onChange={e=>setForm({...form,psychView:e.target.value})}/>
          <textarea className="border rounded p-2 md:col-span-2" placeholder={t.cross.bridge} value={form.bridge} onChange={e=>setForm({...form,bridge:e.target.value})}/>
          <div className="md:col-span-2">
            <div className="text-sm mb-1">{t.cross.tags}</div>
            <div className="flex flex-wrap">
              {Object.values(DEFAULT_TAGS).flat().map(tag=> (
                <label key={tag} className={`mr-2 mb-2 cursor-pointer select-none px-2 py-1 rounded border ${form.tags.includes(tag)?"bg-slate-800 text-white border-slate-800":""}`}>
                  <input type="checkbox" className="hidden" onChange={()=>toggleTag(tag)}/>
                  {tag}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <label className="text-sm">{t.cross.visibility}</label>
            <select className="border rounded px-2 py-1" value={form.visibility} onChange={e=>setForm({...form, visibility:e.target.value})}>
              <option value="draft">{t.cross.draft}</option>
              <option value="public">{t.cross.public}</option>
            </select>
            <button className="ml-auto px-3 py-1 rounded bg-slate-800 text-white" onClick={add}>{t.common.save}</button>
          </div>
        </div>
      </div>

      <div className="border rounded p-3">
        <div className="font-semibold mb-2">Liste</div>
        <div className="space-y-2">
          {topics.map(tp=> (
            <div key={tp.id} className="border rounded p-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{tp.title} <span className="text-xs text-slate-500">[{tp.visibility}]</span></div>
                  <div className="text-sm">{tp.bridge}</div>
                </div>
                <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={()=>remove(tp.id)}>Entfernen</button>
              </div>
              <div className="mt-2 text-xs text-slate-600">Bibel: {tp.bible}</div>
              <div className="text-xs text-slate-600">Theologie: {tp.bibleView}</div>
              <div className="text-xs text-slate-600">Psychologie: {tp.psychView}</div>
              <div className="mt-1">{tp.tags.map(x=> <Pill key={x}>{x}</Pill>)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Module: Unified Editor (Bibel + Psych + Crosslink in 1 Formular) -----
function UnifiedEditor({ t }){
  const [entry, setEntry] = useState(loadLS(LS_KEYS.unified, {
    bibelId: "bibel.2petrus1.3-4",
    bibelRef: "2Petr 1,3–4",
    bibelTitle: "Teilnahme an göttlicher Natur",
    bibelSummary: "Gottes Verheißungen helfen, den Lüsten zu entfliehen.",
    exegeses: "A) Tradition/Verdrängung…
B) Verwandlung/Integration…",
    psychId: "psych.grawe.bindung",
    psychTerm: "Bindung",
    psychSyn: "Nähe, Sicherheit, Zugehörigkeit",
    psychShort: "Bedürfnis nach emotionaler Nähe und Schutz.",
    psychLong: "Bezug zu Schema Verlassenheit, ACT‑Akzeptanz, Synergetik/Attraktoren.",
    bridgeId: "crosslink.2p1_3-4.bindung",
    bridgeText: "Verheißungen stillen Bindungsbedürfnisse; dadurch verliert Lust ihre Kraft.",
    tags: ["Trauer","Bindung"],
    visibility: "draft",
    note: "",
  }));
  function save(){ saveLS(LS_KEYS.unified, entry); alert("Gespeichert (lokal)"); }
  function toggleTag(tag){ const s = new Set(entry.tags); s.has(tag)?s.delete(tag):s.add(tag); setEntry({...entry, tags:[...s]}); }
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold">{t.unified.title}</h3>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="border rounded p-3">
          <div className="font-medium mb-2">Bibel</div>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.unified.bibelId} value={entry.bibelId} onChange={e=>setEntry({...entry,bibelId:e.target.value})}/>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.cross.bibleRef} value={entry.bibelRef} onChange={e=>setEntry({...entry,bibelRef:e.target.value})}/>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.unified.bibelTitle} value={entry.bibelTitle} onChange={e=>setEntry({...entry,bibelTitle:e.target.value})}/>
          <textarea className="border rounded p-2 w-full mb-2" placeholder={t.unified.bibelSummary} value={entry.bibelSummary} onChange={e=>setEntry({...entry,bibelSummary:e.target.value})}/>
          <textarea className="border rounded p-2 w-full h-28" placeholder={t.unified.exegeses} value={entry.exegeses} onChange={e=>setEntry({...entry,exegeses:e.target.value})}/>
        </div>
        <div className="border rounded p-3">
          <div className="font-medium mb-2">Psychologie</div>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.unified.psychId} value={entry.psychId} onChange={e=>setEntry({...entry,psychId:e.target.value})}/>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.unified.psychTerm} value={entry.psychTerm} onChange={e=>setEntry({...entry,psychTerm:e.target.value})}/>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.unified.psychSyn} value={entry.psychSyn} onChange={e=>setEntry({...entry,psychSyn:e.target.value})}/>
          <textarea className="border rounded p-2 w-full mb-2" placeholder={t.unified.psychShort} value={entry.psychShort} onChange={e=>setEntry({...entry,psychShort:e.target.value})}/>
          <textarea className="border rounded p-2 w-full h-28" placeholder={t.unified.psychLong} value={entry.psychLong} onChange={e=>setEntry({...entry,psychLong:e.target.value})}/>
        </div>
        <div className="border rounded p-3">
          <div className="font-medium mb-2">Crosslink</div>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.unified.bridgeId} value={entry.bridgeId} onChange={e=>setEntry({...entry,bridgeId:e.target.value})}/>
          <textarea className="border rounded p-2 w-full h-28 mb-2" placeholder={t.unified.bridgeText} value={entry.bridgeText} onChange={e=>setEntry({...entry,bridgeText:e.target.value})}/>
          <div className="text-sm mb-1">{t.cross.tags}</div>
          <div className="flex flex-wrap mb-2">
            {Object.values(DEFAULT_TAGS).flat().map(tag=> (
              <label key={tag} className={`mr-2 mb-2 cursor-pointer select-none px-2 py-1 rounded border ${entry.tags.includes(tag)?"bg-slate-800 text-white border-slate-800":""}`}>
                <input type="checkbox" className="hidden" onChange={()=>toggleTag(tag)} />
                {tag}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select className="border rounded px-2 py-1" value={entry.visibility} onChange={e=>setEntry({...entry, visibility:e.target.value})}>
              <option value="draft">{t.cross.draft}</option>
              <option value="public">{t.cross.public}</option>
            </select>
            <input className="border rounded px-2 py-1 flex-1" placeholder="Notiz / Version" value={entry.note||""} onChange={e=>setEntry({...entry, note:e.target.value})}/>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="px-3 py-2 rounded bg-slate-800 text-white" onClick={save}>{t.unified.saveAll}</button>
      </div>
    </div>
  );
}

// --- Module: Admin (Labels/Prompts + Login) -------------------------------
function Admin({ labels, setLabels, currentLang, setLang }){
  const [pwdOk, setPwdOk] = useState(false);
  const [pwd, setPwd] = useState("");
  const langs = Object.keys(labels);
  if (!pwdOk) {
    return (
      <div className="p-4 max-w-md">
        <div className="font-semibold mb-2">Login (nur lokal)</div>
        <input className="border rounded px-2 py-1 w-full mb-2" type="password" placeholder="Passwort (z. B. jesus2025)" value={pwd} onChange={e=>setPwd(e.target.value)}/>
        <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={()=>setPwdOk(!!pwd)}>Anmelden</button>
        <p className="text-xs text-slate-500 mt-2">Hinweis: Kein echter Server‑Login, nur lokale Bearbeitung der Labels.</p>
      </div>
    );
  }
  const [path, setPath] = useState([currentLang]);
  const node = path.reduce((acc,key)=> acc[key], labels);
  function setNode(newVal){
    // Tiefen-Update
    const clone = JSON.parse(JSON.stringify(labels));
    let cur = clone; for (let i=0;i<path.length-1;i++) cur = cur[path[i]];
    cur[path[path.length-1]] = newVal; setLabels(clone);
  }
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <select className="border rounded px-2 py-1" value={currentLang} onChange={e=>{setLang(e.target.value); setPath([e.target.value]);}}>
          {langs.map(l=> <option key={l}>{l}</option>)}
        </select>
        <div className="text-sm text-slate-500">Pfad: {path.join(" → ")}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="border rounded p-3">
          <div className="font-medium mb-2">Struktur</div>
          <Tree obj={labels[currentLang]} path={[currentLang]} onOpen={setPath} />
        </div>
        <div className="border rounded p-3">
          <div className="font-medium mb-2">Editor</div>
          {typeof node === 'string' ? (
            <textarea className="w-full h-64 border rounded p-2" value={node} onChange={e=>setNode(e.target.value)} />
          ) : (
            <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto h-64">{JSON.stringify(node, null, 2)}</pre>
          )}
          <div className="text-xs text-slate-500 mt-2">Tipp: Klicke links auf einen String‑Knoten, um ihn direkt zu bearbeiten.</div>
        </div>
      </div>
    </div>
  );
}

function Tree({ obj, path, onOpen }){
  return (
    <ul className="text-sm">
      {Object.entries(obj).map(([k,v])=> (
        <li key={k} className="mb-1">
          <button className="hover:underline" onClick={()=>onOpen([...path,k])}>{k}{typeof v==='string'?': '+(v.length>30? v.slice(0,30)+'…':v):''}</button>
          {typeof v==='object' && v && <div className="ml-4 border-l pl-2"><Tree obj={v} path={[...path,k]} onOpen={onOpen} /></div>}
        </li>
      ))}
    </ul>
  );
}

// --- Main App --------------------------------------------------------------
export default function App(){
  const { t, labels, setLabels, lang, setLang } = useI18N();
  const auth = useAuth();
  const [current, setCurrent] = useState("hub");
  const [selectedTags, setTagsState] = useState({ feelings:[], needs:[], behaviors:[], domains:[] });
  const [resources, setResources] = useState(SEED_RESOURCES);
  const [topics, setTopics] = useState(SEED_TOPICS);
  const [dialogs, setDialogs] = useState(SEED_DIALOGS);

  const mobileMenu = (
    <div className="md:hidden p-2 border-b flex overflow-x-auto gap-2 sticky top-[49px] bg-white z-10">
      {[
        { id: "hub", label: t.menu.themen },
        { id: "practice", label: t.menu.uebung },
        { id: "knowledge", label: t.menu.grundwissen },
        { id: "library", label: t.menu.bibliothek },
        { id: "journal", label: t.menu.journal },
        { id: "settings", label: t.menu.einstellungen },
        ...(auth.user? [{ id:"admin", label:t.menu.admin }]:[])
      ].map(it=> (
        <button key={it.id} className={`px-3 py-1 rounded border ${current===it.id? 'bg-slate-200':''}`} onClick={()=>setCurrent(it.id)}>{it.label}</button>
      ))}
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <Header t={t} lang={lang} setLang={setLang} user={auth.user} onLogout={auth.logout} />
      {mobileMenu}
      <div className="flex flex-1 overflow-hidden">
        <SideMenu t={t} current={current} setCurrent={setCurrent} user={auth.user} />
        <div className="flex-1 overflow-auto">
          {current==="hub" && <TagHub t={t} tagsState={selectedTags} setTagsState={setTagsState} />}
          {current==="practice" && (
            <div className="p-4 grid md:grid-cols-2 gap-4">
              <Meditation t={t} selectedTags={selectedTags} />
              <ChairDialog t={t} selectedTags={selectedTags} dialogsState={dialogs} setDialogsState={setDialogs} />
              <TensionModel selectedTags={selectedTags} />
              <Resources t={t} resources={resources} setResources={setResources} />
            </div>
          )}
          {current==="knowledge" && (
            <div className="p-4 space-y-3">
              <h3 className="font-semibold">{t.menu.grundwissen}</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <Card title="Schematherapie + Jesus‑Modus" text="Kind (Bedürfnisse), Ankläger (strenger Elternmodus), Gesunder Erwachsener; Jesus‑Modus als transzendenter, fürsorglicher Modus." />
                <Card title="ACT (Acceptance & Commitment)" text="Akzeptanz von Gefühlen + Commitment zu Werten (Jesu Wille)." />
                <Card title="Synergetik (Attraktoren)" text="Alte Attraktoren destabilisieren; Jesus als Attraktor höherer Kohärenz." />
                <Card title="Spannungsmodell" text="Leidensspannung vs. Potenzialspannung; Integration statt Verdrängung." />
              </div>
            </div>
          )}
          {current==="library" && <Resources t={t} resources={resources} setResources={setResources} />}
          {current==="unified" && <UnifiedEditor t={t} />}
          {current==="journal" && <Journal selectedTags={selectedTags} />}
          {current==="settings" && <Settings t={t} auth={auth} />}
          {current==="admin" && auth.user && <Admin labels={labels} setLabels={setLabels} currentLang={lang} setLang={setLang} />}
        </div>
      </div>
    </div>
  );
}

function Card({ title, text }){
  return (
    <div className="border rounded p-3 bg-white">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-slate-600">{text}</div>
    </div>
  );
}

function Journal({ selectedTags }){
  const [entries, setEntries] = useState(loadLS("nbj_journal", []));
  const [txt, setTxt] = useState("");
  function add(){ const e = { id: Date.now(), txt, tags: selectedTags, ts: new Date().toISOString() }; const nr = [e, ...entries]; setEntries(nr); saveLS("nbj_journal", nr); setTxt(""); }
  return (
    <div className="p-4 space-y-3">
      <h3 className="font-semibold">Journal</h3>
      <textarea className="w-full border rounded p-2 h-24" placeholder="Gedanken…" value={txt} onChange={e=>setTxt(e.target.value)} />
      <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={add}>Speichern</button>
      <div className="space-y-2">
        {entries.map(e=> (
          <div key={e.id} className="border rounded p-2">
            <div className="text-xs text-slate-500">{new Date(e.ts).toLocaleString()}</div>
            <div>{e.txt}</div>
            <div className="mt-1">{Object.values(e.tags).flat().map(x=> <Pill key={x}>{x}</Pill>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings({ t, auth }){
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  return (
    <div className="p-4 space-y-3">
      <h3 className="font-semibold">{t.menu.einstellungen}</h3>
      {!auth.user ? (
        <div className="max-w-sm border rounded p-3">
          <div className="font-medium mb-2">{t.common.login}</div>
          <input className="border rounded px-2 py-1 w-full mb-2" placeholder={t.common.username} value={u} onChange={e=>setU(e.target.value)} />
          <input type="password" className="border rounded px-2 py-1 w-full mb-2" placeholder={t.common.password} value={p} onChange={e=>setP(e.target.value)} />
          <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={()=>auth.login({ name: u })}>{t.common.signIn}</button>
          <p className="text-xs text-slate-500 mt-2">Einfaches lokales Login – nur um den Admin‑Editor sichtbar zu machen.</p>
        </div>
      ) : (
        <div className="text-slate-700">Angemeldet als <span className="font-medium">{auth.user.name}</span></div>
      )}
    </div>
  );
}

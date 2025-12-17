import { useNavigate } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties
} from "react";

import kindMitPanzerImage from "../assets/images/kindmitpanzer.png";
import childImage from "../assets/images/kind.png";
import { runChatCompletion, type ChatMessage } from "../lib/openaiChat";
import styles from "./Bibliothek.module.css";

const HIGH_PRIEST_IMAGE_CANDIDATES = [
  "/public-images/Hohepriester.png",
  "/public-images/hohepriester.png",
  "/public-images/www.hohepriester.png",
  "/Images/hohepriester.png"
] as const;

type NeedContent = {
  resonance: string[];
  dialog: string[];
  jesus: string;
};

type SavedChatItem = {
  label: string;
  value: string;
};

type SavedChat = {
  id: string;
  createdAt: string;
  items: SavedChatItem[];
};

type DictationField =
  | "problem"
  | "personalNeed"
  | "childhoodExperience"
  | "meditationNotes"
  | "introDiscussionQuestion";

type MaximizableField =
  | "introAnswer"
  | "needSuggestions"
  | "jesusResponse"
  | "closingResponse";

type LanguageMode = "combined" | "christian";

const maximizeButtonBaseStyle: CSSProperties = {
  borderRadius: "999px",
  border: "1px solid #cbd2d9",
  padding: "0.35rem 0.9rem",
  fontSize: "0.9rem",
  fontWeight: 700,
  backgroundColor: "#f6f8fc",
  color: "#1f2933",
  cursor: "pointer",
  boxShadow: "0 6px 12px rgba(31, 61, 116, 0.12)",
  transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease"
};

const needs: Record<string, NeedContent> = {
  "Gesehen / gehört / gewürdigt werden": {
    resonance: [
      "Vielleicht fühlst du dich übersehen, obwohl du viel gibst.",
      "Vielleicht hast du das Gefühl, dass deine Worte nicht ankommen.",
      "Vielleicht trägst du die alte Angst, für andere unsichtbar zu sein."
    ],
    dialog: [
      "Herr Jesus, sieh mich jetzt mit deinen Augen – so wie ich wirklich bin.",
      "Ich will mich dir zeigen, ohne Rolle, ohne Maske."
    ],
    jesus:
      "Ich sehe dich, mein Kind. Ich kenne deinen Weg und deine Mühe. Du bist in meinem Blick – schon bevor du mich gesucht hast."
  },
  "Sicherheit & Vorhersagbarkeit": {
    resonance: [
      "Vielleicht fühlst du dich unsicher, weil sich vieles verändert.",
      "Vielleicht hast du Angst, die Kontrolle zu verlieren.",
      "Vielleicht wünschst du dir Klarheit, wo Nebel ist."
    ],
    dialog: [
      "Jesus, ich lege meine Unsicherheit in deine Hände.",
      "Zeig mir, wie ich vertrauen kann, auch wenn ich den Weg nicht sehe."
    ],
    jesus:
      "Ich bin dein Halt in allem Wandel. Du musst nicht wissen, wohin – nur, dass ich mit dir gehe."
  },
  "Würde / Respekt / Unversehrtheit": {
    resonance: [
      "Vielleicht hast du dich gedemütigt oder ungerecht behandelt gefühlt.",
      "Vielleicht warst du zu oft still, wenn du dich klein gefühlt hast.",
      "Vielleicht spürst du den Wunsch, in deiner Würde aufgerichtet zu werden."
    ],
    dialog: [
      "Jesus, richte mich auf in meiner wahren Würde.",
      "Ich will lernen, aufrecht zu stehen in deiner Wahrheit."
    ],
    jesus:
      "Ich habe dich nicht geschaffen, um dich zu beugen. Steh auf, mein Kind – du trägst mein Ebenbild."
  },
  "Autonomie & Einfluss": {
    resonance: [
      "Vielleicht fühlst du dich eingeengt oder fremdbestimmt.",
      "Vielleicht warst du gewohnt, dich anzupassen, um geliebt zu werden.",
      "Vielleicht spürst du, dass du mehr aus deinem inneren Ruf leben möchtest."
    ],
    dialog: [
      "Herr, lehre mich, frei zu sein, ohne dich zu verlieren.",
      "Zeig mir, was mein Platz ist in deiner Ordnung."
    ],
    jesus:
      "Ich nenne dich Freund, nicht Knecht. Geh in der Freiheit, die aus Liebe wächst, nicht aus Trotz."
  },
  "Fairness / Gerechtigkeit": {
    resonance: [
      "Vielleicht siehst du Unrecht und fühlst dich machtlos.",
      "Vielleicht erträgst du Widerspruch zwischen Worten und Taten nur schwer.",
      "Vielleicht spürst du Zorn, weil du für Wahrheit brennst."
    ],
    dialog: [
      "Jesus, ich bringe dir meinen Schmerz über das Unrecht.",
      "Zeig mir, wie ich für Wahrheit eintreten kann, ohne Bitterkeit."
    ],
    jesus:
      "Ich bin der Gerechte. Ich trage alles Unrecht ans Licht – in meinem Tempo. Du darfst für Wahrheit stehen, ohne dich zu verzehren."
  },
  "Nähe / Verbundenheit": {
    resonance: [
      "Vielleicht fühlst du dich isoliert oder anders als die anderen.",
      "Vielleicht sehnst du dich nach einem Ort, wo du wirklich dazugehört.",
      "Vielleicht hast du Angst, zu viel oder zu wenig zu sein."
    ],
    dialog: [
      "Jesus, ich will in deiner Nähe bleiben, auch wenn andere mich nicht verstehen.",
      "Lass mich erfahren, dass ich Teil deines Leibes bin."
    ],
    jesus:
      "Du bist nie allein. Ich habe dich in meine Gemeinschaft aufgenommen – dort, wo wahre Nähe aus meinem Geist entsteht."
  },
  "Kompetenz / Wirksamkeit": {
    resonance: [
      "Vielleicht zweifelst du, ob du genug bewirkst.",
      "Vielleicht fühlst du dich erschöpft, weil du dich ständig beweisen willst.",
      "Vielleicht hast du Angst zu versagen oder zu enttäuschen."
    ],
    dialog: [
      "Herr, ich lege dir meine Arbeit hin – mach sie fruchtbar in deinem Sinn.",
      "Lass mich wirken, ohne mich zu verlieren."
    ],
    jesus:
      "Deine Kraft ist nicht das Maß meiner Liebe. In deiner Schwachheit entfaltet sich meine Wirksamkeit."
  },
  "Leichtigkeit / Entlastung": {
    resonance: [
      "Vielleicht bist du müde, immer stark zu sein.",
      "Vielleicht trägst du mehr, als du musst.",
      "Vielleicht sehnst du dich nach Ruhe, darfst sie dir aber nicht gönnen."
    ],
    dialog: [
      "Jesus, ich lege meine Lasten ab. Lehre mich, in dir zu ruhen.",
      "Ich will leicht werden – nicht, weil alles einfach ist, sondern weil du trägst."
    ],
    jesus:
      "Komm zu mir, du Müder. Ich will dir Ruhe geben. Meine Last ist leicht, wenn du sie mit mir teilst."
  }
};

const needOptions: { key: keyof typeof needs; label: string }[] = [
  { key: "Sicherheit & Vorhersagbarkeit", label: "Sicherheit" },
  {
    key: "Gesehen / gehört / gewürdigt werden",
    label: "Gesehen / gehört / gewürdigt werden"
  },
  { key: "Nähe / Verbundenheit", label: "Nähe & Verbundenheit" },
  { key: "Fairness / Gerechtigkeit", label: "Gerechtigkeit / Fairness" },
  { key: "Würde / Respekt / Unversehrtheit", label: "Würde / Respekt" },
  { key: "Leichtigkeit / Entlastung", label: "Entlastung / Ruhe" },
  { key: "Autonomie & Einfluss", label: "Autonomie / Einfluss" }
];

type IntroSection = {
  icon: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  variant?: "default" | "discussion";
  displayInCollapsed?: boolean;
  collapsedPlacement?: "beforeToggle" | "afterToggle";
};

const introLeadParagraphs: string[] = [
  "Um wirklich von Jesus getröstet zu werden, müssen wir trauern.",
  "Wenn ich das Himmelreich bekommen will, muss ich mich arm fühlen, hilflos, wie ein Kind.",
  "Das Reich Gottes gehört den Kindern, nicht den Starken. (Matthäus 5,3; Markus 10,15)",
  "Paulus sagt: „Gottes Kraft wird in der Schwachheit vollkommen.“ (2. Korinther 12,9)",
  "Er wollte seine Schwachheit sogar wegbeten und nannte sie einen „Engel Satans“. (2. Korinther 12,7–8)",
  "Aber genau diese Schwachheit war der Ort, wo Gottes Kraft offenbar wurde. Dort lag die Verwandlung."
];

const problemLeadParagraphs: string[] = [
  "Hier darfst du aussprechen, was dich drückt. Kein Gefühl ist Jesus fremd – Er begegnet dir gerade in deiner Schwachheit.",
  "Beschreibe konkret, was dich belastet oder bewegt. Damit öffnest du dein Herz, damit Er dich trösten und führen kann.",
  "Halte nichts zurück: Alles, was du hier teilst, darf zum Ort werden, an dem Gottes Trost sichtbar wird.",
  "Die Antwort ist anonym und wird nicht automatisch gespeichert. Am Ende kannst du wählen, ob du speichern möchtest – für dich alleine oder es zu Entwicklungszwecken weitergeben möchtest."
];

const LANGUAGE_BRIDGE_INSTRUCTION_DE = [
  "Sprache: Verbinde biblische Ausdrucksweise mit psychologischer und wissenschaftlicher Sprache (z. B. Emotionsregulation, Bindungssicherheit).",
  "Wenn die Person ausdrücklich nach psychologischer/wissenschaftlicher Sprache fragt, liefere sie – inklusive Synergetik-Begriffen wie Attraktoren, Ordnungsmuster, Selbstorganisation und Phasenübergänge – und übersetze kurz zur biblischen Perspektive (und umgekehrt, falls gewünscht)."
].join("\n");

const LANGUAGE_BRIDGE_INSTRUCTION_EN =
  "Language bridging: Provide short bridges between biblical language and psychological or scientific terminology (including Synergetik concepts such as attractors, order transitions, self-organization, and phase shifts) whenever it helps the user. Honour explicit user requests for a preferred register.";

const CHRISTIAN_LANGUAGE_ONLY_DE =
  "Sprache: Bleibe in einer warmherzigen, biblischen Ausdrucksweise. Verzichte auf psychologische oder wissenschaftliche Fachbegriffe, es sei denn, die Person bittet ausdrücklich darum.";

const CHRISTIAN_LANGUAGE_ONLY_EN =
  "Language: Stay within a warm, Bible-centred register. Avoid psychological or scientific jargon unless the person explicitly asks for it.";

const buildIntroDiscussionPromptBase = (languageInstruction: string) =>
  [
    "Rolle: Du begleitest ein Kind Gottes seelsorglich mit biblischem Blick.",
    languageInstruction,
    "Rüstung: Erkläre die Rüstung des Kindes Gottes als Festungswerke (2. Korinther 10,4), die das innere Kind beschützen. Du darfst diese Festungswerke auch den Balken nennen, der die Sicht verändert, um das eigene Auge zu schützen (Matthäus 7,3).",
    "Verwandlung: Zeige, wie Armut im Geist (Matthäus 5,3), Traurigkeit (Matthäus 5,4), zugelassene Gefühle und Schwachheit (2. Korinther 12,9) in der Gegenwart Jesu zur Verwandlung führen.",
    "Haltung: Sei empathisch und zugleich leicht konfrontierend.",
    "Hinweis: Hebe kurz hervor, welches Bedürfnis angesprochen ist und wie Jesus darin begegnet.",
    "Bitte beende jede Antwort mit einer kurzen Rückfrage, damit das Gespräch weitergehen kann."
  ].join("\n");

const buildJesusAttractorSystemPrompt = (languageInstruction: string) =>
  [
    "You respond within a Christian-psychological framework that values truth, emotional integrity, and gradual transformation.",
    "You do not promote emotional suppression, spiritual bypassing, or moral pressure disguised as spirituality.",
    "You respect emotional processes and allow feelings to exist before theological or cognitive interpretation.",
    "Jesus is understood as a higher-order integrator — in this framework also described as the Jesus-Attractor.",
    "You distinguish clearly between repression and transformation.",
    "You treat unconscious patterns (Romans 7: doing what one hates) with compassion and psychological insight, not judgment.",
    "You avoid simplistic answers and quick resolutions. When appropriate, you ask clarifying questions instead of concluding.",
    "Your goal is integration, increased coherence, and freedom, not control or compliance.",
    languageInstruction
  ].join("\n");

const buildNeedSuggestionSystemMessage = (
  jesusAttractorPrompt: string,
  languageMode: LanguageMode,
  languageInstruction: string
) => {
  const languageLine =
    languageMode === "combined"
      ? "Nutze sowohl biblische Formulierungen als auch psychologisch-wissenschaftliche Begriffe (z. B. Emotionsregulation, Bindung, Synergetik: Attraktoren, Stabilitätswechsel), damit beides nachvollziehbar bleibt."
      : "Bleibe in biblischer Sprache und verzichte auf psychologische oder wissenschaftliche Fachbegriffe, es sei denn, die Person bittet ausdrücklich darum.";

  return [
    jesusAttractorPrompt,
    "Analysiere die folgende Situation mit einem einfühlsamen, psychologisch-christlichen Blick. Das Ziel ist, zu erkennen, welches Bedürfnis hinter der beschriebenen Reaktion oder dem Konflikt steckt. Orientiere dich dabei an diesen acht zentralen Bedürfnissen: 1) Gesehen / gehört / gewürdigt werden, 2) Sicherheit & Vorhersagbarkeit, 3) Würde / Respekt / Unversehrtheit, 4) Autonomie & Einfluss, 5) Fairness / Gerechtigkeit, 6) Nähe / Verbundenheit, 7) Kompetenz / Wirksamkeit, 8) Leichtigkeit / Entlastung. Bitte wähle 1–3 passende Bedürfnisse aus dieser Liste, erkläre kurz warum, und schlage anschließend einen kurzen Jesus-Impuls vor.",
    languageLine,
    languageInstruction
  ].join("\n\n");
};

const buildAskJesusSystemMessage = (
  jesusAttractorPrompt: string,
  languageMode: LanguageMode,
  languageInstruction: string
) => {
  const summaryLine =
    languageMode === "combined"
      ? "Fasse die Zusagen sowohl geistlich als auch kurz in psychologisch-wissenschaftlicher Sprache zusammen (gerne mit Synergetik-Begriffen wie Attraktoren oder Selbstorganisation), wenn die Person das wünscht oder wenn es das Verständnis vertieft."
      : "Bleibe in biblischer Sprache und verzichte auf psychologische oder wissenschaftliche Fachbegriffe, es sei denn, die Person bittet ausdrücklich darum.";

  return [
    jesusAttractorPrompt,
    "Lies den folgenden Text, in dem ein Mensch sein inneres Bedürfnis beschreibt.",
    "Antworte als Jesus – liebevoll, wahrhaftig, ermutigend.",
    "Zeige, wie dieses Bedürfnis in der Beziehung zu mir gestillt werden könnte,",
    "nicht durch äußere Umstände, sondern durch die Gemeinschaft mit mir.",
    "Schlage außerdem 2–3 Bibelverse vor, die unterstützen, wie ich dieses Bedürfnis mit dir erlebe, und nenne die genaue Bibelstelle.",
    "Sprich in der Du-Form, sanft und persönlich, mit Wärme.",
    summaryLine,
    languageInstruction
  ].join("\n\n");
};

const introSections: IntroSection[] = [
  {
    icon: "⚡",
    title: "Warum wir Schwachheit wegdrücken",
    paragraphs: [
      "Schwachheit fühlt sich schmerzhaft an. Darum machen wir Menschen das oft unbewusst:",
      "Dann machen wir eine fromme Fassade: „Ich bin stark, ich bin getröstet, alles ist in Ordnung.“ Aber das ist Verdrängung – nicht Verwandlung."
    ],
    list: [
      "Wir wollen die Auferstehung ohne das Kreuz",
      "Trost ohne Trauer",
      "Himmelreich ohne Armut",
      "Glauben ohne Hilflosigkeit"
    ],
    displayInCollapsed: true
  },
  {
    icon: "👶",
    title: "Als Kind Gottes",
    paragraphs: [
      "Dann machen wir eine fromme Fassade: „Ich bin stark, ich bin getröstet, alles ist in Ordnung.“ Aber das ist Verdrängung – nicht Verwandlung.",
      "❤️ Der verborgene Schatz",
      "Hinter schmerzhaften Gefühlen liegt fast immer ein unbefriedigtes Bedürfnis. Und Jesus möchte dieses Bedürfnis stillen.",
      "Wenn ich das Bedürfnis aber nicht erkenne, kann ich es Jesus nicht bringen – und Er kann mich nicht verändern.",
      "Viele Christen verwechseln Schwachheit mit Sünde. Aber das stimmt nicht: Das ist die Schwachheit, in der Gottes Kraft wirkt.",
      "🌿 Der Weg Jesu",
      "Warum vermeiden wir das trotzdem? Weil es weh tut, weil wir uns hilflos fühlen, weil Wahrheit uns entblößt.",
      "Aber das Evangelium sagt: „Durch Leiden zur Herrlichkeit.“ (Römer 8,17) Das ist der Weg Jesu.",
      "🙏 Eine Einladung",
      "Nimm dir einen Moment. Schließe die Augen.",
      "Spüre das Gefühl, das du sonst wegdrückst. Sprich es aus.",
      "Du kannst es in dieser App einsprechen oder schreiben. Dann zeigt dir die App Vorschläge, welches Bedürfnis dahinter liegt.",
      "Am Anfang kann das fremd wirken. Denn wir sind nicht gewohnt, Bedürfnisse zu erkennen. Aber dort begegnet Jesus.",
      "⏳ Wenn Gefühle nicht sofort kommen",
      "Der Verstand begreift schnell. Das Herz begreift langsam. Der Körper hat sein eigenes Tempo.",
      "Das ist normal. So erleben wir das ganze Leben hindurch Schwachheit – und immer wieder Gottes Güte.",
      "👑 Das ist nicht Knechtschaft",
      "Das ist Sohnschaft: Mit Jesus leiden, mit Jesus verherrlicht werden (Römer 8,17), die Werke des Leibes töten (Römer 8,13) und echte Verwandlung erleben."
    ]
  },
  {
    icon: "❤️",
    title: "Der verborgene Schatz",
    paragraphs: [
      "Hinter schmerzhaften Gefühlen liegt fast immer ein unbefriedigtes Bedürfnis.",
      "Und Jesus möchte dieses Bedürfnis stillen. Wenn ich das Bedürfnis aber nicht erkenne, kann ich es Jesus nicht bringen – und Er kann mich nicht verändern.",
      "Viele Christen verwechseln Schwachheit mit Sünde. Aber das stimmt nicht: Das ist die Schwachheit, in der Gottes Kraft wirkt."
    ]
  },
  {
    icon: "🌿",
    title: "Der Weg Jesu",
    paragraphs: [
      "Warum vermeiden wir das trotzdem? Weil es weh tut, weil wir uns hilflos fühlen, weil Wahrheit uns entblößt.",
      "Aber das Evangelium sagt: „Durch Leiden zur Herrlichkeit.“ (Römer 8,17) Das ist der Weg Jesu."
    ]
  },
  {
    icon: "🙏",
    title: "Eine Einladung",
    paragraphs: [
      "Nimm dir einen Moment und spüre das Gefühl, das du sonst wegdrückst.",
      "Sprich es aus. Du kannst es in dieser App einsprechen oder schreiben. Dann zeigt dir die App Vorschläge, welches Bedürfnis dahinter liegt.",
      "Am Anfang kann das fremd wirken, denn wir sind nicht gewohnt, Bedürfnisse zu erkennen. Aber dort begegnet Jesus."
    ],
    list: [
      "Schließe die Augen",
      "Spüre, was in dir lebendig ist",
      "Sprich es laut oder schreibe es auf"
    ]
  },
  {
    icon: "⏳",
    title: "Wenn Gefühle nicht sofort kommen",
    paragraphs: [
      "Der Verstand begreift schnell, das Herz begreift langsam, der Körper hat sein eigenes Tempo.",
      "Das ist normal. So erleben wir das ganze Leben hindurch Schwachheit – und immer wieder Gottes Güte."
    ]
  },
  {
    icon: "👑",
    title: "Das ist nicht Knechtschaft",
    paragraphs: [
      "Das ist Sohnschaft:",
      "Mit Jesus leiden, mit Jesus verherrlicht werden (Römer 8,17), die Werke des Leibes töten (Römer 8,13) – und echte Verwandlung erleben."
    ],
    list: [
      "Mit Jesus leiden",
      "Mit Jesus verherrlicht werden (Römer 8,17)",
      "Die Werke des Leibes töten (Römer 8,13)"
    ]
  },
  {
    icon: "💬",
    title: "Diskussion mit ChatGPT",
    paragraphs: [
      "Falls du nicht einig bist oder es nicht verstehst oder Fragen hast, dann stelle deine Frage hier. Ich werde antworten.",
      "Kopiere nach jeder Antwort von ChatGPT die Worte unten in das Feld „Vorherige Antwort“, damit die nächste Nachricht darauf aufbauen kann."
    ],
    variant: "discussion",
    displayInCollapsed: true,
    collapsedPlacement: "afterToggle"
  },
  {
    icon: "✅",
    title: "Abschluss",
    paragraphs: [
      "Wenn du bereit bist, kannst du in dem nächsten Punkt eingeben, was dich belastet oder dich bewegt."
    ],
    displayInCollapsed: true,
    collapsedPlacement: "afterToggle"
  }
];

export default function Bibliothek() {
  const nav = useNavigate();
  const [problem, setProblem] = useState("");
  const [selectedNeed, setSelectedNeed] = useState<string>("");
  const [showResult, setShowResult] = useState(true);
  const [personalNeed, setPersonalNeed] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [meditationNotes, setMeditationNotes] = useState("");
  const [listeningField, setListeningField] = useState<DictationField | null>(null);
  const [childhoodExperience, setChildhoodExperience] = useState("");
  const [needSuggestionsNotes, setNeedSuggestionsNotes] = useState("");
  const [needSuggestionsFollowUp, setNeedSuggestionsFollowUp] = useState("");
  const [needSuggestionsLoading, setNeedSuggestionsLoading] = useState(false);
  const [needSuggestionsError, setNeedSuggestionsError] = useState<string | null>(null);
  const [jesusChatResponse, setJesusChatResponse] = useState("");
  const [jesusChatLoading, setJesusChatLoading] = useState(false);
  const [jesusChatError, setJesusChatError] = useState<string | null>(null);
  const [jesusChatFollowUp, setJesusChatFollowUp] = useState("");
  const [closingChatResponse, setClosingChatResponse] = useState("");
  const [closingChatLoading, setClosingChatLoading] = useState(false);
  const [closingChatError, setClosingChatError] = useState<string | null>(null);
  const [closingChatFollowUp, setClosingChatFollowUp] = useState("");
  const [introDiscussionMessages, setIntroDiscussionMessages] = useState<ChatMessage[]>([]);
  const [needSuggestionsMessages, setNeedSuggestionsMessages] = useState<ChatMessage[]>([]);
  const [jesusChatMessages, setJesusChatMessages] = useState<ChatMessage[]>([]);
  const [closingChatMessages, setClosingChatMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [activeMobileStep, setActiveMobileStep] = useState(0);
  const [introDiscussionQuestion, setIntroDiscussionQuestion] = useState("");
  const [introDiscussionAnswer, setIntroDiscussionAnswer] = useState("");
  const [introDiscussionLoading, setIntroDiscussionLoading] = useState(false);
  const [introDiscussionError, setIntroDiscussionError] = useState<string | null>(null);
  const [highPriestImageSrc, setHighPriestImageSrc] = useState<string | null>(null);
  const [isHighPriestImageAvailable, setHighPriestImageAvailable] = useState(false);
  const [maximizedField, setMaximizedField] = useState<MaximizableField | null>(null);
  const [languageMode, setLanguageMode] = useState<LanguageMode>("combined");

  const dictationSupported =
    typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const recognitionRef = useRef<any>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const stepTwoRef = useRef<HTMLDivElement | null>(null);
  const introDiscussionQuestionRef = useRef<HTMLTextAreaElement | null>(null);
  const activeFieldRef = useRef<DictationField | null>(null);
  const pendingFieldRef = useRef<DictationField | null>(null);
  const pendingBaseRef = useRef<string>("");
  const shareInProgressRef = useRef(false);
  const dictationBaseRef = useRef<Record<DictationField, string>>({
    problem: "",
    personalNeed: "",
    childhoodExperience: "",
    meditationNotes: "",
    introDiscussionQuestion: ""
  });

  const formatChatError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Leider kam keine Antwort von ChatGPT. Bitte prüfe deine Internetverbindung oder den API-Key.";
  }, []);

  const toggleMaximizedField = useCallback((field: MaximizableField) => {
    setMaximizedField((current) => (current === field ? null : field));
  }, []);

  const getTextareaSizing = useCallback(
    (
      field: MaximizableField,
      defaultMinHeight: string,
      expandedMinHeight = "26rem"
    ): Pick<CSSProperties, "resize" | "minHeight"> => ({
      resize: (maximizedField === field ? "none" : "vertical") as CSSProperties["resize"],
      minHeight: maximizedField === field ? expandedMinHeight : defaultMinHeight
    }),
    [maximizedField]
  );

  const getMaximizeButtonStyle = useCallback(
    (field: MaximizableField): CSSProperties => {
      const needsDarkBlueContrast =
        field === "introAnswer" ||
        field === "needSuggestions" ||
        field === "jesusResponse" ||
        field === "closingResponse";
      const isMaximized = maximizedField === field;

      if (needsDarkBlueContrast) {
        return {
          ...maximizeButtonBaseStyle,
          backgroundColor: "#1f3c88",
          borderColor: isMaximized ? "#1b3578" : "#1f3c88",
          color: "#fff"
        };
      }

      return {
        ...maximizeButtonBaseStyle,
        backgroundColor: isMaximized ? "#e8f0ff" : maximizeButtonBaseStyle.backgroundColor,
        borderColor: isMaximized ? "#7aa2ff" : "#cbd2d9",
        color: isMaximized ? "#1f3c88" : "#1f2933"
      };
    },
    [maximizedField]
  );

  const getLanguageButtonStyle = useCallback(
    (mode: LanguageMode): CSSProperties => ({
      backgroundColor: languageMode === mode ? "#1f3c88" : "#f5f7fb",
      color: languageMode === mode ? "#fff" : "#1f3c88",
      border: languageMode === mode ? "1px solid #1b3578" : "1px solid #cbd2d9",
      borderRadius: "10px",
      padding: "0.65rem 0.9rem",
      cursor: "pointer",
      fontWeight: 700,
      boxShadow: languageMode === mode ? "0 8px 14px rgba(31, 60, 136, 0.18)" : "none",
      width: "100%",
      transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease"
    }),
    [languageMode]
  );

  const languageInstructionDe = useMemo(
    () =>
      languageMode === "combined"
        ? LANGUAGE_BRIDGE_INSTRUCTION_DE
        : CHRISTIAN_LANGUAGE_ONLY_DE,
    [languageMode]
  );

  const languageInstructionEn = useMemo(
    () =>
      languageMode === "combined"
        ? LANGUAGE_BRIDGE_INSTRUCTION_EN
        : CHRISTIAN_LANGUAGE_ONLY_EN,
    [languageMode]
  );

  const introDiscussionPromptBase = useMemo(
    () => buildIntroDiscussionPromptBase(languageInstructionDe),
    [languageInstructionDe]
  );

  const jesusAttractorSystemPrompt = useMemo(
    () => buildJesusAttractorSystemPrompt(languageInstructionEn),
    [languageInstructionEn]
  );

  const needSuggestionSystemMessage = useMemo(
    () =>
      buildNeedSuggestionSystemMessage(
        jesusAttractorSystemPrompt,
        languageMode,
        languageInstructionDe
      ),
    [jesusAttractorSystemPrompt, languageMode, languageInstructionDe]
  );

  const askJesusSystemMessage = useMemo(
    () =>
      buildAskJesusSystemMessage(
        jesusAttractorSystemPrompt,
        languageMode,
        languageInstructionDe
      ),
    [jesusAttractorSystemPrompt, languageMode, languageInstructionDe]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let cancelled = false;

    const tryCandidate = (index: number) => {
      if (index >= HIGH_PRIEST_IMAGE_CANDIDATES.length) {
        if (!cancelled) {
          setHighPriestImageSrc(null);
          setHighPriestImageAvailable(false);
        }
        return;
      }

      const candidate = HIGH_PRIEST_IMAGE_CANDIDATES[index];
      const image = new Image();

      image.onload = () => {
        if (cancelled) {
          return;
        }
        setHighPriestImageSrc(candidate);
        setHighPriestImageAvailable(true);
      };

      image.onerror = () => {
        if (cancelled) {
          return;
        }
        tryCandidate(index + 1);
      };

      image.src = candidate;
    };

    tryCandidate(0);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedProblem = localStorage.getItem("bibliothekProblem");
      if (storedProblem) {
        setProblem(storedProblem);
        dictationBaseRef.current.problem = storedProblem;
      }
    } catch {
      /* ignore */
    }

    try {
      const storedPersonalNeed = localStorage.getItem("bibliothekPersonalNeed");
      if (storedPersonalNeed) {
        setPersonalNeed(storedPersonalNeed);
        dictationBaseRef.current.personalNeed = storedPersonalNeed;
      }
    } catch {
      /* ignore */
    }

    try {
      const storedChildhoodExperience = localStorage.getItem("bibliothekChildhoodExperience");
      if (storedChildhoodExperience) {
        setChildhoodExperience(storedChildhoodExperience);
        dictationBaseRef.current.childhoodExperience = storedChildhoodExperience;
      }
    } catch {
      /* ignore */
    }

    try {
      const storedIntroQuestion = localStorage.getItem("bibliothekIntroDiscussionQuestion");
      if (storedIntroQuestion) {
        setIntroDiscussionQuestion(storedIntroQuestion);
        dictationBaseRef.current.introDiscussionQuestion = storedIntroQuestion;
      }
    } catch {
      /* ignore */
    }

  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (!problem.trim()) {
        localStorage.removeItem("bibliothekProblem");
      } else {
        localStorage.setItem("bibliothekProblem", problem);
      }
    } catch {
      /* ignore */
    }
  }, [problem]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      if (!personalNeed.trim()) {
        localStorage.removeItem("bibliothekPersonalNeed");
      } else {
        localStorage.setItem("bibliothekPersonalNeed", personalNeed);
      }
    } catch {
      /* ignore */
    }
  }, [personalNeed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (!childhoodExperience.trim()) {
        localStorage.removeItem("bibliothekChildhoodExperience");
      } else {
        localStorage.setItem("bibliothekChildhoodExperience", childhoodExperience);
      }
    } catch {
      /* ignore */
    }
  }, [childhoodExperience]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (!introDiscussionQuestion.trim()) {
        localStorage.removeItem("bibliothekIntroDiscussionQuestion");
      } else {
        localStorage.setItem("bibliothekIntroDiscussionQuestion", introDiscussionQuestion);
      }
    } catch {
      /* ignore */
    }
  }, [introDiscussionQuestion]);

  const setFieldValue = useCallback(
    (field: DictationField, value: string) => {
      switch (field) {
        case "problem":
          setProblem(value);
          break;
        case "personalNeed":
          setPersonalNeed(value);
          break;
      case "childhoodExperience":
        setChildhoodExperience(value);
        break;
      case "meditationNotes":
        setMeditationNotes(value);
        break;
      case "introDiscussionQuestion":
        setIntroDiscussionQuestion(value);
        break;
      default:
        break;
      }
    },
    [setProblem, setPersonalNeed, setChildhoodExperience, setMeditationNotes, setIntroDiscussionQuestion]
  );

  const startRecognition = useCallback(
    (field: DictationField, baseValue: string) => {
      if (!dictationSupported) return;
      const recognition = recognitionRef.current;
      if (!recognition) return;
      dictationBaseRef.current[field] = baseValue;
      activeFieldRef.current = field;
      setListeningField(field);
      try {
        recognition.start();
      } catch {
        /* ignore */
      }
    },
    [dictationSupported, setListeningField]
  );

  useEffect(() => {
    if (!dictationSupported) return;
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      const field = activeFieldRef.current;
      if (!field) return;

      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result?.[0]?.transcript ?? "";

        if (result.isFinal) {
          const currentBase = dictationBaseRef.current[field] ?? "";
          const separator = currentBase.endsWith(" ") || currentBase.length === 0 ? "" : " ";
          dictationBaseRef.current[field] = `${currentBase}${separator}${text}`.trimEnd() + " ";
        } else {
          interimTranscript += text;
        }
      }

      const base = dictationBaseRef.current[field] ?? "";
      const combined = `${base}${interimTranscript}`.trim();
      setFieldValue(field, combined);
    };

    recognition.onstart = () => {
      const field = activeFieldRef.current;
      if (field) {
        setListeningField(field);
      }
    };

    recognition.onend = () => {
      const field = activeFieldRef.current;
      if (field) {
        dictationBaseRef.current[field] = "";
      }
      activeFieldRef.current = null;
      setListeningField(null);

      if (pendingFieldRef.current) {
        const nextField = pendingFieldRef.current;
        const nextBase = pendingBaseRef.current;
        pendingFieldRef.current = null;
        pendingBaseRef.current = "";
        startRecognition(nextField, nextBase);
      }
    };

    recognition.onerror = () => {
      if (activeFieldRef.current) {
        dictationBaseRef.current[activeFieldRef.current] = "";
      }
      activeFieldRef.current = null;
      pendingFieldRef.current = null;
      pendingBaseRef.current = "";
      setListeningField(null);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, [dictationSupported, setFieldValue, startRecognition]);

  useEffect(() => {
    const stored = localStorage.getItem("bibliothekSavedChats");
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Array<any>;
      if (!Array.isArray(parsed)) {
        return;
      }

      const normalized: SavedChat[] = parsed
        .map((entry: any): SavedChat | null => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          if (Array.isArray(entry.items)) {
            const items: SavedChatItem[] = entry.items
              .filter((item: any) => item && typeof item.label === "string")
              .map((item: any) => ({
                label: item.label as string,
                value: typeof item.value === "string" ? item.value : ""
              }));

            return {
              id: typeof entry.id === "string" ? entry.id : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt:
                typeof entry.createdAt === "string"
                  ? entry.createdAt
                  : new Date().toISOString(),
              items
            };
          }

          const legacyItems: SavedChatItem[] = [];
          if (typeof entry.userInput === "string" && entry.userInput.trim().length > 0) {
            legacyItems.push({
              label: "Frühere Eingabe an ChatGPT",
              value: entry.userInput.trim()
            });
          }
          if (typeof entry.assistantResponse === "string" && entry.assistantResponse.trim().length > 0) {
            legacyItems.push({
              label: "Frühere Antwort von ChatGPT",
              value: entry.assistantResponse.trim()
            });
          }

          if (legacyItems.length === 0) {
            return null;
          }

          return {
            id: typeof entry.id === "string" ? entry.id : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt:
              typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
            items: legacyItems
          };
        })
        .filter((entry): entry is SavedChat => entry !== null);

      if (normalized.length > 0) {
        setSavedChats(normalized);
      }
    } catch (error) {
      console.error("Konnte gespeicherte Chats nicht laden:", error);
    }
  }, []);

  useEffect(() => {
    if (savedChats.length === 0) {
      localStorage.removeItem("bibliothekSavedChats");
      return;
    }

    localStorage.setItem("bibliothekSavedChats", JSON.stringify(savedChats));
  }, [savedChats]);

  const selectedNeedData = useMemo(() => {
    if (!selectedNeed) {
      return undefined;
    }
    return needs[selectedNeed];
  }, [selectedNeed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!selectedNeed || !selectedNeedData) {
      localStorage.removeItem("bibliothekNeedDetails");
      return;
    }

    const payload = {
      need: selectedNeed,
      resonance: selectedNeedData.resonance,
      dialog: selectedNeedData.dialog,
      jesus: selectedNeedData.jesus
    } as const;

    try {
      localStorage.setItem("bibliothekNeedDetails", JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [selectedNeed, selectedNeedData]);

  const handleShowResult = () => {
    if (!selectedNeed) {
      setError("Bitte wähle ein Bedürfnis aus.");
      return;
    }
    setError(null);
    setShowResult(true);
    setActiveMobileStep(3);
  };

  const handleContinueFromStepOne = useCallback(() => {
    setActiveMobileStep(2);
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        stepTwoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [setActiveMobileStep, stepTwoRef]);

  const buildIntroDiscussionMessages = useCallback(
    (mode: "initial" | "follow-up"): ChatMessage[] => {
      const currentMessage =
        introDiscussionQuestionRef.current?.value.trim() ?? introDiscussionQuestion.trim();
      if (!currentMessage) {
        return [];
      }

      const systemInstruction = [
        introDiscussionPromptBase,
        mode === "initial"
          ? "Aufgabe: Antworte auf die folgende Frage oder Aussage eines Kindes Gottes."
          : "Aufgabe: Antworte auf die folgende Rückmeldung des Kindes Gottes, beziehe dich auf die bisherigen Gedanken und führe das Gespräch weiter."
      ].join("\n\n");

      const userMessage: ChatMessage = {
        role: "user",
        content: ["Nachricht der Person:", currentMessage].join("\n")
      };

      return [
        { role: "system", content: systemInstruction },
        ...introDiscussionMessages,
        userMessage
      ];
    },
    [introDiscussionMessages, introDiscussionQuestion]
  );

  const handleIntroDiscussion = useCallback(
    async (mode: "initial" | "follow-up") => {
      const messages = buildIntroDiscussionMessages(mode);
      if (messages.length === 0) {
        return;
      }

      const userMessage = messages[messages.length - 1];

      setIntroDiscussionError(null);
      setIntroDiscussionLoading(true);

      try {
        const response = await runChatCompletion({ messages });
        setIntroDiscussionAnswer(response);
        setIntroDiscussionMessages((previous) => [
          ...previous,
          userMessage,
          { role: "assistant", content: response }
        ]);
      } catch (error) {
        setIntroDiscussionError(formatChatError(error));
      } finally {
        setIntroDiscussionLoading(false);
      }
    },
    [buildIntroDiscussionMessages, formatChatError]
  );

  const needSuggestionMessages = useMemo<ChatMessage[]>(() => {
    const trimmedProblem = problem.trim();
    const followUp = needSuggestionsFollowUp.trim();
    const hasHistory = needSuggestionsMessages.length > 0;

    const baseUserText = trimmedProblem
      ? `Situation: ${trimmedProblem}`
      : "Situation: (keine Beschreibung hinterlegt)";

    const userMessage: ChatMessage = {
      role: "user",
      content:
        hasHistory && followUp
          ? [followUp, "", "Ausgangssituation:", baseUserText].join("\n")
          : baseUserText
    };

    if (!trimmedProblem && !followUp) {
      return [] as ChatMessage[];
    }

    return [
      { role: "system", content: needSuggestionSystemMessage },
      ...needSuggestionsMessages,
      userMessage
    ];
  }, [needSuggestionsFollowUp, needSuggestionsMessages, needSuggestionSystemMessage, problem]);

  const handleChatGPT = useCallback(async () => {
    if (needSuggestionMessages.length === 0) {
      return;
    }

    const userMessage = needSuggestionMessages[needSuggestionMessages.length - 1];

    setNeedSuggestionsError(null);
    setNeedSuggestionsLoading(true);

    try {
      const response = await runChatCompletion({ messages: needSuggestionMessages });
      setNeedSuggestionsNotes(response);
      setNeedSuggestionsMessages((previous) => [
        ...previous,
        userMessage,
        { role: "assistant", content: response }
      ]);
      setNeedSuggestionsFollowUp("");
    } catch (error) {
      setNeedSuggestionsError(formatChatError(error));
    } finally {
      setNeedSuggestionsLoading(false);
    }
  }, [formatChatError, needSuggestionMessages]);

  const buildDetailList = (
    items: Array<{ label: string; value: string }>
  ): string =>
    items
      .map(({ label, value }) => {
        const trimmed = value.trim();
        if (!trimmed) {
          return "";
        }
        return `- ${label}: ${trimmed}`;
      })
      .filter(Boolean)
      .join("\n");

  const formatNeedExplanation = (need?: NeedContent): string => {
    if (!need) {
      return "";
    }

    const segments: string[] = [];

    if (need.resonance?.length) {
      const resonanceText = need.resonance
        .map((entry) => `  • ${entry}`)
        .join("\n");
      segments.push(`Resonanz-Hypothesen:\n${resonanceText}`);
    }

    if (need.dialog?.length) {
      const dialogText = need.dialog.map((entry) => `  • ${entry}`).join("\n");
      segments.push(`Dialog-Impulse an Jesus:\n${dialogText}`);
    }

    if (need.jesus) {
      segments.push(`Zusammenfassung der bisherigen Jesus-Antwort:\n  • ${need.jesus}`);
    }

    return segments.join("\n\n");
  };

  const askJesusPrompt = useMemo(() => {
    const contextDetails = buildDetailList([
      { label: "Was dich beschäftigt", value: problem },
      {
        label: "Ausgewähltes Bedürfnis (aus der Liste)",
        value: selectedNeed
      },
      {
        label: "Persönliche Beschreibung des Bedürfnisses",
        value: personalNeed
      },
      {
        label: "Kindheitserfahrungen zu diesem Gefühl/Bedürfnis",
        value: childhoodExperience
      }
    ]);

    const needExplanation = formatNeedExplanation(selectedNeedData);

    const promptLines = [
      "Lies den folgenden Text, in dem ein Mensch sein inneres Bedürfnis beschreibt.",
      "Antworte als Jesus – liebevoll, wahrhaftig, ermutigend.",
      "Zeige, wie dieses Bedürfnis in der Beziehung zu mir gestillt werden könnte,",
      "nicht durch äußere Umstände, sondern durch die Gemeinschaft mit mir.",
      "Schlage außerdem 2–3 Bibelverse vor, die unterstützen, wie ich dieses Bedürfnis mit dir erlebe, und nenne die genaue Bibelstelle.",
      "Sprich in der Du-Form, sanft und persönlich, mit Wärme.",
      "",
      "Angaben der Person:",
      contextDetails || "- (Der Mensch hat keine zusätzlichen Details hinterlassen.)"
    ];

    if (needExplanation) {
      promptLines.push("", "Bedürfnis-Erklärung aus der Bibliothek:", needExplanation);
    }

    return promptLines.join("\n").trim();
  }, [problem, selectedNeed, personalNeed, childhoodExperience, selectedNeedData]);

  const askJesusMessages = useMemo<ChatMessage[]>(() => {
    const trimmedPrompt = askJesusPrompt.trim();
    const followUp = jesusChatFollowUp.trim();
    const hasHistory = jesusChatMessages.length > 0;

    const userContent = hasHistory && followUp
      ? [followUp, "", "Kontext zur Erinnerung:", trimmedPrompt || "(kein Kontext hinterlegt)"]
          .join("\n")
      : trimmedPrompt;

    if (!userContent) {
      return [] as ChatMessage[];
    }

    return [
      { role: "system", content: askJesusSystemMessage },
      ...jesusChatMessages,
      { role: "user", content: userContent }
    ];
  }, [askJesusPrompt, askJesusSystemMessage, jesusChatFollowUp, jesusChatMessages]);

  const handleAskJesus = useCallback(async () => {
    if (askJesusMessages.length === 0) {
      return;
    }

    const userMessage = askJesusMessages[askJesusMessages.length - 1];

    setJesusChatError(null);
    setJesusChatLoading(true);

      try {
        const response = await runChatCompletion({ messages: askJesusMessages });
        setJesusChatResponse(response);
        setJesusChatMessages((previous) => [
          ...previous,
          userMessage,
          { role: "assistant", content: response }
        ]);
        setJesusChatFollowUp("");
      } catch (error) {
        setJesusChatError(formatChatError(error));
      } finally {
        setJesusChatLoading(false);
      }
  }, [askJesusMessages, formatChatError]);

  const closingPromptContextItems = useMemo(() => {
    const entries: Array<{ label: string; value: string }> = [];

    const addEntry = (label: string, value?: string | null) => {
      if (!value) {
        return;
      }

      const trimmed = value.trim();
      if (!trimmed) {
        return;
      }

      entries.push({ label, value: trimmed });
    };

    addEntry("Aktuelles Anliegen", problem);
    addEntry("Ausgewähltes Bedürfnis", selectedNeed ?? "");
    addEntry("Deine Beschreibung des Bedürfnisses", personalNeed);
    addEntry("Kindheitserinnerung", childhoodExperience);
    addEntry("Antwort aus Schritt 8 – Frage an Jesus", meditationNotes);
    addEntry("Frage an Jesus (ChatGPT-Prompt)", askJesusPrompt);
    addEntry("Jesus-Impuls aus der Bedürfnis-Erklärung", selectedNeedData?.jesus ?? "");

    return entries;
  }, [askJesusPrompt, problem, selectedNeed, personalNeed, childhoodExperience, meditationNotes, selectedNeedData]);

  const meditationNotesReference =
    "Das Texteingabefeld mit der Frage „Was hat Jesus dir in dieser Meditation gesagt?“ findest du in src/pages/Bibliothek.tsx. Dort wird innerhalb des mobilen Abschnitts ein <textarea> mit der id=\"mobileMeditationNotes\" gerendert, und direkt daneben sitzt der DictationButton, über den du die Eingaben diktieren kannst.";

  const closingMessages = useMemo<ChatMessage[]>(() => {
    if (closingPromptContextItems.length === 0) {
      return [] as ChatMessage[];
    }

    const stepEightEntry = closingPromptContextItems.find((item) =>
      item.label.toLowerCase().includes("antwort aus schritt 8")
    );

    const instructions = [
      "Rolle: Du bist eine seelsorgliche, psychologisch geschulte geistliche Begleitung. Sprich die Person warmherzig in der Du-Form an und nimm Bezug auf Jesu Gegenwart.",
      "Aufgabe: Verfasse einen Abschlusskommentar. Beginne mit der Überschrift \"Abschluss\" und würdige in zwei bis drei Sätzen den Weg dieser Person und das Wirken Jesu.",
      "Struktur: Schreibe danach unter der Überschrift \"Alltagstipps\" drei konkrete, kleine Schritte in einer nummerierten Liste, wie die Person Jesu Zuspruch im Alltag leben kann.",
      "Bezug: Verknüpfe deine Worte mit allen Angaben, besonders mit der Frage an Jesus und dem gehörten Zuspruch.",
      "Stil: Schreibe auf Deutsch, hoffnungsvoll, ermutigend und praxisnah. Greife Aussagen über Jesu Blick und Einladung auf, ohne zu moralisieren.",
      languageInstructionDe
    ];

    if (stepEightEntry) {
      instructions.push(
        [
          "Verarbeite ausdrücklich diese empfangene Antwort aus Schritt 8 in deinem Abschluss und nimm darauf Bezug.",
          "Antwort aus Schritt 8:",
          stepEightEntry.value
        ].join("\n")
      );
    }

    const contextLines = closingPromptContextItems
      .map((item) => `- ${item.label}: ${item.value}`)
      .join("\n");

    const baseUserMessage = [
      `Kontext:\n${contextLines}\n${meditationNotesReference}`,
      `Angaben der Person:\n${meditationNotesReference}`
    ].join("\n\n");

    const followUp = closingChatFollowUp.trim();
    const hasHistory = closingChatMessages.length > 0;

    const userMessage: ChatMessage = {
      role: "user",
      content:
        hasHistory && followUp
          ? [followUp, "", "Kontext zur Erinnerung:", baseUserMessage].join("\n")
          : baseUserMessage
    };

    return [
      { role: "system", content: instructions.join("\n\n") },
      ...closingChatMessages,
      userMessage
    ];
  }, [
    closingChatFollowUp,
    closingChatMessages,
    closingPromptContextItems,
    meditationNotesReference,
    languageInstructionDe
  ]);

  const hasClosingPrompt = closingMessages.length > 0;

  const handleClosingChatGPT = useCallback(async () => {
    if (!hasClosingPrompt) {
      return;
    }

    const userMessage = closingMessages[closingMessages.length - 1];

    setClosingChatError(null);
    setClosingChatLoading(true);

      try {
        const response = await runChatCompletion({ messages: closingMessages });
        setClosingChatResponse(response);
        setClosingChatMessages((previous) => [
          ...previous,
          userMessage,
          { role: "assistant", content: response }
        ]);
        setClosingChatFollowUp("");
      } catch (error) {
        setClosingChatError(formatChatError(error));
      } finally {
        setClosingChatLoading(false);
      }
  }, [closingMessages, formatChatError, hasClosingPrompt]);


  const chatSaveItems = useMemo(
    () => [
      {
        label: "Punkt 1 – Deine Nachricht an ChatGPT",
        value: introDiscussionQuestion
      },
      {
        label: "Punkt 1 – ChatGPT-Antwort (Verwandlung als Kind Gottes)",
        value: introDiscussionAnswer
      },
      {
        label: "Punkt 2 – Was dich beschäftigt",
        value: problem
      },
      {
        label: "Punkt 3 – Ausgewähltes Bedürfnis",
        value: selectedNeed
      },
      {
        label: "Punkt 3 – ChatGPT-Vorschläge für Bedürfnisse",
        value: needSuggestionsNotes
      },
      {
        label: "Punkt 5 – Dein persönlicher Schritt",
        value: personalNeed
      },
      {
        label: "Punkt 6 – Kindheitserinnerung",
        value: childhoodExperience
      },
      {
        label: "Punkt 7 – ChatGPT-Antwort",
        value: jesusChatResponse
      },
      {
        label: "Punkt 8 – Frage an Jesus (deine Notizen)",
        value: meditationNotes
      },
      {
        label: "Punkt 9 – Abschluss von ChatGPT",
        value: closingChatResponse
      }
    ],
    [
      introDiscussionQuestion,
      introDiscussionAnswer,
      problem,
      selectedNeed,
      needSuggestionsNotes,
      personalNeed,
      childhoodExperience,
      jesusChatResponse,
      meditationNotes,
      closingChatResponse
    ]
  );

  const canSaveChat = useMemo(
    () => chatSaveItems.some((item) => item.value.trim().length > 0),
    [chatSaveItems]
  );

  const handleSaveChat = () => {
    const trimmedItems = chatSaveItems.map((item) => ({
      label: item.label,
      value: item.value.trim()
    }));

    if (!trimmedItems.some((item) => item.value.length > 0)) {
      alert("Bitte füge zuerst Inhalte aus den Schritten 2–9 ein.");
      return;
    }

    const newChat: SavedChat = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      items: trimmedItems
    };

    setSavedChats((previous) => [newChat, ...previous]);
    setNeedSuggestionsNotes("");
    setJesusChatResponse("");
    setClosingChatResponse("");
    setIntroDiscussionMessages([]);
    setNeedSuggestionsMessages([]);
    setJesusChatMessages([]);
    setClosingChatMessages([]);
    setNeedSuggestionsFollowUp("");
    setJesusChatFollowUp("");
    setClosingChatFollowUp("");
  };

  const handleDeleteChat = (id: string) => {
    setSavedChats((previous) => previous.filter((chat) => chat.id !== id));
  };

  const createChatPdfBlob = (chat: SavedChat) => {
    const heading = "Gespeicherter Chat";
    const timestamp = new Date(chat.createdAt).toLocaleString("de-DE", {
      dateStyle: "short",
      timeStyle: "short"
    });

    const wrapLine = (text: string, maxLength = 90) => {
      const words = text.split(/\s+/);
      const wrappedLines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        const candidate = currentLine ? `${currentLine} ${word}` : word;

        if (candidate.length <= maxLength) {
          currentLine = candidate;
        } else {
          if (currentLine) {
            wrappedLines.push(currentLine);
          }
          currentLine = word;
        }
      });

      if (currentLine) {
        wrappedLines.push(currentLine);
      }

      return wrappedLines.length > 0 ? wrappedLines : ["—"];
    };

    const pdfDocEncodingMap: Record<string, number> = {
      Ä: 0xc4,
      Ö: 0xd6,
      Ü: 0xdc,
      ä: 0xe4,
      ö: 0xf6,
      ü: 0xfc,
      ß: 0xdf,
      é: 0xe9,
      è: 0xe8,
      á: 0xe1,
      à: 0xe0,
      â: 0xe2,
      ô: 0xf4,
      ç: 0xe7
    };

    const encodePdfDocString = (text: string) => {
      const bytes: number[] = [0x28]; // (

      for (const char of text) {
        if (char === "\\" || char === "(" || char === ")") {
          bytes.push(0x5c, char.charCodeAt(0));
          continue;
        }

        const mapped = pdfDocEncodingMap[char];

        if (mapped !== undefined) {
          bytes.push(mapped);
          continue;
        }

        const code = char.charCodeAt(0);

        if (code <= 0x7f) {
          bytes.push(code);
        } else {
          bytes.push(0x3f); // ? for unsupported characters
        }
      }

      bytes.push(0x29); // )
      return bytes;
    };

    const lines: string[] = [heading, `Gespeichert am: ${timestamp}`, ""];

    chat.items.forEach((item) => {
      const value = item.value?.trim() || "—";
      const valueLines = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      lines.push(`${item.label}:`);

      if (valueLines.length === 0) {
        lines.push("—");
      } else {
        valueLines.forEach((line) => {
          lines.push(...wrapLine(line));
        });
      }

      lines.push("");
    });

    const linesPerPage = 45;
    const paginatedLines: string[][] = [];

    for (let i = 0; i < lines.length; i += linesPerPage) {
      paginatedLines.push(lines.slice(i, i + linesPerPage));
    }

    if (paginatedLines.length === 0) {
      paginatedLines.push([]);
    }

    const headerBytes = Array.from("%PDF-1.4\n").map((char) => char.charCodeAt(0));

    const createContentStream = (pageLines: string[]) => {
      const contentStreamBytes: number[] = [];
      const addTextLine = (line: string) => {
        const encodedLine = encodePdfDocString(line);
        contentStreamBytes.push(...encodedLine, 0x20, 0x54, 0x6a, 0x20, 0x54, 0x2a, 0x0a); // " Tj T*\n"
      };

      const contentStreamPrefix = "BT\n/F1 12 Tf\n16 TL\n50 780 Td\n";
      contentStreamBytes.push(...Array.from(contentStreamPrefix).map((char) => char.charCodeAt(0)));
      pageLines.forEach(addTextLine);
      contentStreamBytes.push(...Array.from("ET\n").map((char) => char.charCodeAt(0)));

      return contentStreamBytes;
    };

    const catalogNumber = 1;
    const pagesNumber = 2;
    const fontNumber = 3;
    const firstPageNumber = 4;
    const firstContentNumber = firstPageNumber + paginatedLines.length;

    const kidsRefs = paginatedLines
      .map((_, index) => `${firstPageNumber + index} 0 R`)
      .join(" ");

    const objects: { number: number; bytes: number[] }[] = [];

    objects.push({
      number: catalogNumber,
      bytes: Array.from(`${catalogNumber} 0 obj << /Type /Catalog /Pages ${pagesNumber} 0 R >> endobj\n`).map((char) =>
        char.charCodeAt(0)
      )
    });
    objects.push({
      number: pagesNumber,
      bytes: Array.from(
        `${pagesNumber} 0 obj << /Type /Pages /Kids [${kidsRefs}] /Count ${paginatedLines.length} >> endobj\n`
      ).map((char) => char.charCodeAt(0))
    });

    objects.push({
      number: fontNumber,
      bytes: Array.from(
        `${fontNumber} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj\n`
      ).map((char) => char.charCodeAt(0))
    });

    paginatedLines.forEach((pageLines, index) => {
      const pageObjNumber = firstPageNumber + index;
      const contentObjNumber = firstContentNumber + index;
      const contentStreamBytes = createContentStream(pageLines);

      objects.push({
        number: pageObjNumber,
        bytes: Array.from(
          `${pageObjNumber} 0 obj << /Type /Page /Parent ${pagesNumber} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontNumber} 0 R >> >> /Contents ${contentObjNumber} 0 R >> endobj\n`
        ).map((char) => char.charCodeAt(0))
      });

      objects.push({
        number: contentObjNumber,
        bytes: [
          ...Array.from(`${contentObjNumber} 0 obj << /Length ${contentStreamBytes.length} >> stream\n`).map((char) =>
            char.charCodeAt(0)
          ),
          ...contentStreamBytes,
          ...Array.from("\nendstream endobj\n").map((char) => char.charCodeAt(0))
        ]
      });
    });

    const sortedObjects = [...objects].sort((a, b) => a.number - b.number);
    const maxObjectNumber = sortedObjects[sortedObjects.length - 1]?.number ?? 0;

    const pdfBytes: number[] = [...headerBytes];
    const offsets: number[] = new Array(maxObjectNumber + 1).fill(0);

    sortedObjects.forEach((object) => {
      offsets[object.number] = pdfBytes.length;
      pdfBytes.push(...object.bytes);
    });

    const xrefPosition = pdfBytes.length;
    const objectCount = maxObjectNumber + 1; // +1 for the xref free object
    const offsetLines = offsets
      .slice(1)
      .map((offset) => `${offset.toString().padStart(10, "0")} 00000 n \n`)
      .join("");

    const trailer =
      `xref\n0 ${objectCount}\n0000000000 65535 f \n${offsetLines}` +
      `trailer << /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF`;

    pdfBytes.push(...Array.from(trailer).map((char) => char.charCodeAt(0)));

    return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  };

  const downloadChatAsPdf = (chat: SavedChat) => {
    const blob = createChatPdfBlob(chat);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-${new Date(chat.createdAt).toISOString()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const shareChatAsPdf = async (chat: SavedChat) => {
    if (shareInProgressRef.current) {
      alert("Es läuft noch ein Teilen-Vorgang. Warte bitte einen Moment und versuche es erneut.");
      return;
    }

    shareInProgressRef.current = true;

    try {
      const pdfBlob = createChatPdfBlob(chat);
      const fileName = `chat-${new Date(chat.createdAt).toISOString()}.pdf`;
      const pdfFile = new File([pdfBlob], fileName, {
        type: "application/pdf"
      });

      const supportsNativeFileShare = typeof navigator.canShare === "function" && navigator.canShare({ files: [pdfFile] });
      const shareData: ShareData = {
        files: supportsNativeFileShare ? [pdfFile] : undefined,
        title: "Gespeicherter Chat",
        text: "Hier ist der gespeicherte Chat als PDF."
      };

      if (navigator.share && supportsNativeFileShare) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          console.error("Teilen abgebrochen oder fehlgeschlagen", error);
          alert(
            "Das Teilen über das System-Menü war nicht möglich. Deine PDF wird stattdessen zum Download bereitgestellt.\n\n" +
              (error instanceof Error ? `Fehlermeldung: ${error.message}` : "Unbekannter Fehler.")
          );
        }
      }

      const pdfUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      const telegramMessage =
        (supportsNativeFileShare
          ? "Das Teilen über das System-Menü ist fehlgeschlagen."
          : "Dein Browser unterstützt das direkte Teilen als Datei nicht.") +
        " Die PDF wurde gespeichert. Öffne Telegram und hänge die Datei aus deinem Download-Ordner an.";
      const telegramShareUrl = `https://t.me/share/url?text=${encodeURIComponent(telegramMessage)}`;
      window.open(telegramShareUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
      alert(telegramMessage);
    } finally {
      shareInProgressRef.current = false;
    }
  };

  const renderChatSaveSection = () => (
    <section
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: 0
      }}
      aria-labelledby="chatSaveHeading"
    >
      <h3 id="chatSaveHeading" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span aria-hidden="true">💾</span> Gesamten Chat speichern
      </h3>
      <p style={{ marginTop: 0 }}>
        Füge hier die drei ChatGPT-Antworten ein und sichere außerdem deine Eingaben aus den Schritten 2 bis 9
        (außer der Bedürfnis-Erklärung in Schritt 4). Der Dialog aus Schritt 1 wird automatisch mitgespeichert,
        sobald du oben deine Fragen und die Antworten von ChatGPT ergänzt hast.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginTop: "1rem"
        }}
      >
        <label htmlFor="chatNeedSuggestions" style={{ display: "block", fontWeight: 600 }}>
          ChatGPT – Vorschläge für Bedürfnisse (Punkt 3)
        </label>
        <button
          type="button"
          aria-pressed={maximizedField === "needSuggestions"}
          onClick={() => toggleMaximizedField("needSuggestions")}
          style={getMaximizeButtonStyle("needSuggestions")}
        >
          {maximizedField === "needSuggestions" ? "Normale Größe" : "Maximieren"}
        </button>
      </div>
      <textarea
        id="chatNeedSuggestions"
        value={needSuggestionsNotes}
        onChange={(event) => setNeedSuggestionsNotes(event.target.value)}
        rows={3}
        placeholder="Füge hier die Impulse von ChatGPT aus Schritt 3 ein..."
        style={{
          width: "100%",
          fontSize: "1rem",
          padding: "0.5rem",
          marginTop: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          ...getTextareaSizing("needSuggestions", "10rem", "22rem")
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginTop: "1rem"
        }}
      >
        <label htmlFor="chatJesusAnswer" style={{ display: "block", fontWeight: 600 }}>
          ChatGPT – Antwort auf deine Frage (Punkt 7)
        </label>
        <button
          type="button"
          aria-pressed={maximizedField === "jesusResponse"}
          onClick={() => toggleMaximizedField("jesusResponse")}
          style={getMaximizeButtonStyle("jesusResponse")}
        >
          {maximizedField === "jesusResponse" ? "Normale Größe" : "Maximieren"}
        </button>
      </div>
      <textarea
        id="chatJesusAnswer"
        value={jesusChatResponse}
        onChange={(event) => setJesusChatResponse(event.target.value)}
        rows={4}
        placeholder="Füge hier die ChatGPT-Antwort aus Schritt 7 ein..."
        style={{
          width: "100%",
          fontSize: "1rem",
          padding: "0.5rem",
          marginTop: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          ...getTextareaSizing("jesusResponse", "12rem", "24rem")
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginTop: "1rem"
        }}
      >
        <label htmlFor="chatClosingAnswer" style={{ display: "block", fontWeight: 600 }}>
          ChatGPT – Abschluss (Punkt 9)
        </label>
        <button
          type="button"
          aria-pressed={maximizedField === "closingResponse"}
          onClick={() => toggleMaximizedField("closingResponse")}
          style={getMaximizeButtonStyle("closingResponse")}
        >
          {maximizedField === "closingResponse" ? "Normale Größe" : "Maximieren"}
        </button>
      </div>
      <textarea
        id="chatClosingAnswer"
        value={closingChatResponse}
        onChange={(event) => setClosingChatResponse(event.target.value)}
        rows={4}
        placeholder="Füge hier den Abschluss von ChatGPT aus Schritt 9 ein..."
        style={{
          width: "100%",
          fontSize: "1rem",
          padding: "0.5rem",
          marginTop: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          ...getTextareaSizing("closingResponse", "12rem", "24rem")
        }}
      />

      <button
        onClick={handleSaveChat}
        style={{
          width: "100%",
          backgroundColor: canSaveChat ? "#3867d6" : "#aac1e8",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0.6rem 1rem",
          cursor: canSaveChat ? "pointer" : "not-allowed",
          fontSize: "1rem",
          marginTop: "1rem"
        }}
        disabled={!canSaveChat}
      >
        💾 Chat sichern
      </button>

      <div
        style={{
          backgroundColor: "#f9fbff",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: "1.5rem",
          border: "1px solid #d6e0f5"
        }}
      >
        <h4 style={{ color: "#2c3e50", marginTop: 0 }}>Gespeicherte Chats</h4>
        {savedChats.length === 0 ? (
          <p style={{ margin: 0 }}>
            Noch keine Chats gespeichert. Füge oben deine ChatGPT-Antworten und Notizen ein.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {savedChats.map((chat) => (
              <li
                key={chat.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  border: "1px solid #e0e8f8"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem"
                }}
              >
                <strong>
                  {new Date(chat.createdAt).toLocaleString("de-DE", {
                    dateStyle: "short",
                    timeStyle: "short"
                  })}
                </strong>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => downloadChatAsPdf(chat)}
                    style={{
                      backgroundColor: "#f0f4ff",
                      color: "#2c3e50",
                      border: "1px solid #d6e0f5",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: "0.35rem 0.6rem"
                    }}
                  >
                    📄 Gespeichertes als PDF herunterladen
                  </button>
                  <button
                    onClick={() => shareChatAsPdf(chat)}
                    style={{
                      backgroundColor: "#e3f6f5",
                      color: "#096c70",
                      border: "1px solid #b8e0df",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: "0.35rem 0.6rem"
                    }}
                  >
                    📲 Als PDF via Telegram teilen
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.id)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#eb3b5a",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    ✖️ Löschen
                  </button>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {chat.items.map((item) => (
                  <li key={`${chat.id}-${item.label}`} style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                    <strong>{item.label}:</strong> {item.value ? item.value : "—"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );

  const handleDictation = useCallback(
    (field: DictationField) => {
      if (!dictationSupported) {
        alert("Spracherkennung wird von diesem Browser nicht unterstützt.");
        return;
      }

      const recognition = recognitionRef.current;
      if (!recognition) {
        alert("Die Spracherkennung konnte nicht gestartet werden.");
        return;
      }

      const currentValue = (() => {
        switch (field) {
          case "problem":
            return problem;
          case "personalNeed":
            return personalNeed;
          case "childhoodExperience":
            return childhoodExperience;
          case "meditationNotes":
            return meditationNotes;
          case "introDiscussionQuestion":
            return introDiscussionQuestion;
          default:
            return "";
        }
      })();

      const trimmed = currentValue.trim();
      const baseValue = trimmed.length > 0 ? `${trimmed} ` : "";

      if (listeningField === field) {
        pendingFieldRef.current = null;
        pendingBaseRef.current = "";
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
        return;
      }

      if (listeningField) {
        pendingFieldRef.current = field;
        pendingBaseRef.current = baseValue;
        try {
          recognition.stop();
        } catch {
          /* ignore */
        }
        return;
      }

      startRecognition(field, baseValue);
    },
    [
      dictationSupported,
      listeningField,
      problem,
      personalNeed,
      childhoodExperience,
      meditationNotes,
      introDiscussionQuestion,
      startRecognition
    ]
  );

  const DictationButton = ({
    field,
    ariaLabel,
    variant = "default"
  }: {
    field: DictationField;
    ariaLabel: string;
    variant?: "default" | "icon";
  }) => {
    const isActive = listeningField === field;
    const isDisabled = !dictationSupported;

    return (
      <button
        type="button"
        onClick={() => handleDictation(field)}
        disabled={isDisabled}
        style={{
          backgroundColor: isDisabled
            ? "#95a5a6"
            : isActive
            ? variant === "icon"
              ? "#0abde3"
              : "#20bf6b"
            : variant === "icon"
            ? "#ff7b54"
            : "#4b7bec",
          color: "#fff",
          border: "none",
          borderRadius: variant === "icon" ? "999px" : "6px",
          padding: variant === "icon" ? 0 : "0 0.75rem",
          cursor: isDisabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: variant === "icon" ? 0 : "0.4rem",
          fontSize: variant === "icon" ? "1.1rem" : "0.95rem",
          fontWeight: 600,
          minWidth: variant === "icon" ? "3rem" : "5.5rem",
          width: variant === "icon" ? "3rem" : undefined,
          height: variant === "icon" ? "3rem" : "100%",
          boxShadow:
            variant === "icon"
              ? "0 8px 16px rgba(255, 123, 84, 0.35)"
              : "none",
          transition: "background-color 0.2s ease-in-out, transform 0.2s ease-in-out",
          transform: variant === "icon" && isActive ? "scale(0.95)" : "none"
        }}
        aria-label={ariaLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          style={{
            width: variant === "icon" ? "1.4rem" : "1.25rem",
            height: variant === "icon" ? "1.4rem" : "1.25rem"
          }}
        >
          <path d="M12 1.5a3 3 0 00-3 3v6a3 3 0 106 0v-6a3 3 0 00-3-3z" />
          <path d="M5.25 10.5a.75.75 0 011.5 0 5.25 5.25 0 0010.5 0 .75.75 0 011.5 0 6.75 6.75 0 01-6 6.708v2.292h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.292a6.75 6.75 0 01-6-6.708z" />
        </svg>
        {variant === "default" && <span>Diktat</span>}
      </button>
    );
  };

  const mobileStepMeta = [
    {
      key: "intro",
      label: "1) Verwandlung als Kind Gottes",
      icon: "🌅",
      background: "linear-gradient(180deg, #fff5e6 0%, #fdebd2 100%)"
    },
    {
      key: "burden",
      label: "2) Was belastet oder bewegt dich?",
      icon: "📝",
      background: "linear-gradient(180deg, #f0f4ff 0%, #fef6ee 100%)"
    },
    {
      key: "need-selection",
      label: "3) Welches Bedürfnis steckt dahinter?",
      icon: "🧭",
      background: "linear-gradient(180deg, #fff6eb 0%, #fff0d9 100%)"
    },
    {
      key: "need",
      label: "4) Bedürfnis-Erklärung",
      icon: "📖",
      background: "linear-gradient(180deg, #fef6ee 0%, #e8f0ff 100%)"
    },
    {
      key: "personal",
      label: "5) Dein persönlicher Schritt",
      icon: "🕊️",
      background: "linear-gradient(180deg, #fef6ee 0%, #f0f7ff 100%)"
    },
    {
      key: "childhood",
      label: "6) Kindheitserinnerung",
      icon: "👶",
      background: "linear-gradient(180deg, #f9f1ff 0%, #eef7ff 100%)"
    },
    {
      key: "jesus-answer",
      label: "7) ChatGPT-Antwort",
      icon: "💬",
      background: "linear-gradient(180deg, #fff3e8 0%, #e8fff7 100%)"
    },
    {
      key: "ask-jesus",
      label: "8) Frage an Jesus",
      icon: "🙏",
      background: "linear-gradient(180deg, #fef6ee 0%, #eaf9f1 100%)"
    },
    {
      key: "closing",
      label: "9) Abschluss von ChatGPT",
      icon: "🌟",
      background: "linear-gradient(180deg, #fef9f3 0%, #eaf3ff 100%)"
    },
    {
      key: "chat-save",
      label: "10) Chat speichern",
      icon: "💾",
      background: "linear-gradient(180deg, #f1f5ff 0%, #e3fcef 100%)"
    }
  ] as const;

  const introEnabled = true;

  const renderIntroSection = ({ hideHeading = false }: { hideHeading?: boolean } = {}) => {
    if (!introEnabled) {
      return null;
    }

    const displayedLeadParagraphs = introLeadParagraphs;

    const renderIntroSectionCard = (section: IntroSection) => {
      if (section.variant === "discussion") {
        const hasQuestion = introDiscussionQuestion.trim().length > 0;

        return (
          <div
            key={section.title}
            style={{
              borderRadius: "18px",
              backgroundColor: "#fff",
              padding: "1.15rem 1rem 1.2rem",
              border: "1px solid rgba(240, 194, 123, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem"
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                color: "#5c3b1f",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <span aria-hidden="true">{section.icon}</span>
              <span>{section.title}</span>
            </h3>

            <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55, color: "#5f4630" }}>
              {section.paragraphs?.[0]}
            </p>
            <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.55, color: "#5f4630" }}>
              {section.paragraphs?.[1]}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <textarea
                aria-label="Deine Frage oder Antwort"
                ref={introDiscussionQuestionRef}
                value={introDiscussionQuestion}
                onChange={(event) => {
                  const { value } = event.target;
                  setIntroDiscussionQuestion(value);
                  try {
                    localStorage.setItem("bibliothekIntroDiscussionQuestion", value);
                  } catch {
                    /* ignore */
                  }
                }}
                placeholder="Deine Frage oder Antwort an ChatGPT"
                rows={3}
                style={{
                  width: "100%",
                  borderRadius: "14px",
                  border: "1px solid rgba(56, 103, 214, 0.18)",
                  padding: "0.75rem 0.85rem",
                  fontSize: "0.95rem",
                  lineHeight: 1.45,
                  color: "#1f2933",
                  backgroundColor: "#fff",
                  boxShadow: "inset 0 1px 4px rgba(36, 53, 103, 0.08)",
                  resize: "vertical",
                  minHeight: "5rem"
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <DictationButton
                  field="introDiscussionQuestion"
                  ariaLabel="Antwort für ChatGPT diktieren"
                  variant="icon"
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() =>
                    handleIntroDiscussion(
                      introDiscussionMessages.length > 0 ? "follow-up" : "initial"
                    )
                  }
                  disabled={!hasQuestion || introDiscussionLoading}
                  style={{
                    backgroundColor: hasQuestion ? "#f4a259" : "#f5d1a8",
                    color: hasQuestion ? "#fff" : "#6f4e37",
                    border: "none",
                    borderRadius: "999px",
                    padding: "0.65rem 1.6rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: hasQuestion && !introDiscussionLoading ? "pointer" : "not-allowed",
                    boxShadow: hasQuestion ? "0 10px 18px rgba(244, 162, 89, 0.35)" : "none"
                  }}
                >
                  {introDiscussionLoading
                    ? "Antwort wird geladen…"
                    : introDiscussionMessages.length > 0
                    ? "Weiter fragen"
                    : "Antwort erhalten"}
                </button>

              </div>

              {introDiscussionError ? (
                <p style={{ margin: 0, color: "#b00020", fontWeight: 600 }}>
                  {introDiscussionError}
                </p>
              ) : null}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    flexWrap: "wrap"
                  }}
                >
                  <label style={{ fontWeight: 700, color: "#5f4630" }} htmlFor="introDiscussionAnswer">
                    ChatGPT-Antwort (Verwandlung als Kind Gottes)
                  </label>
                  <button
                    type="button"
                    aria-pressed={maximizedField === "introAnswer"}
                    onClick={() => toggleMaximizedField("introAnswer")}
                    style={getMaximizeButtonStyle("introAnswer")}
                  >
                    {maximizedField === "introAnswer" ? "Normale Größe" : "Maximieren"}
                  </button>
                </div>
                <textarea
                  id="introDiscussionAnswer"
                  value={introDiscussionAnswer}
                  onChange={(event) => setIntroDiscussionAnswer(event.target.value)}
                  placeholder="Hier erscheint die Antwort von ChatGPT. Du kannst sie anpassen oder ergänzen."
                  rows={4}
                  style={{
                    width: "100%",
                    borderRadius: "14px",
                    border: "1px solid rgba(56, 103, 214, 0.18)",
                    padding: "0.75rem 0.85rem",
                    fontSize: "0.95rem",
                    lineHeight: 1.45,
                    color: "#1f2933",
                    backgroundColor: "#fdfbf7",
                    boxShadow: "inset 0 1px 4px rgba(36, 53, 103, 0.08)",
                    ...getTextareaSizing("introAnswer", "12rem", "24rem")
                  }}
                />
              </div>

            </div>
          </div>
        );
      }

      return (
        <div
          key={section.title}
          style={{
            borderRadius: "18px",
            backgroundColor: "#fff",
            padding: "0.9rem 1rem",
            border: "1px solid rgba(240, 194, 123, 0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}
        >
          <h3 className={styles.subCardHeading}>
            <span aria-hidden="true">{section.icon}</span>
            <span>{section.title}</span>
          </h3>
          {section.paragraphs?.map((paragraph) => (
            <p
              key={paragraph}
              className={styles.bodyText}
            >
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                color: "#4a3524",
                fontSize: "0.92rem"
              }}
            >
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
    };


    return (
      <section
        aria-label="Einführung: Verwandlung als Kind Gottes"
        className={`${styles.cardBase} ${styles.introCard}`}
      >
        <div
          style={{
            width: "100%",
            borderRadius: "20px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #f8e1b3, #f38181)"
          }}
        >
          <img
            src={kindMitPanzerImage}
            alt="Illustration eines Kindes mit Panzer"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {!hideHeading && (
          <div>
            <h2
              className={styles.sectionHeading}
            >
              Verwandlung als Kind Gottes
            </h2>
            <p
              className={styles.sectionSubheading}
            >
              „Selig sind die Trauernden, denn sie werden getröstet werden.“ (Matthäus 5,4)
            </p>
          </div>
        )}

        {displayedLeadParagraphs.map((paragraph) => (
          <p
            key={paragraph}
            className={styles.bodyText}
          >
            {paragraph}
          </p>
        ))}

        {introSections.map(renderIntroSectionCard)}
      </section>
    );
  };

  const renderProblemSection = ({
    attachRef = false,
    sectionLabelId = "problem-heading",
    textareaId = "problem"
  }: {
    attachRef?: boolean;
    sectionLabelId?: string;
    textareaId?: string;
  } = {}) => (
    <section
      ref={attachRef ? formRef : undefined}
      aria-labelledby={sectionLabelId}
      className={`${styles.cardBase} ${styles.problemCard}`}
    >
      <div
        style={{
          width: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f8e1b3, #f38181)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src={childImage}
          alt="Illustration eines Kindes, das seine Last Jesus bringt"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {problemLeadParagraphs.map((paragraph) => (
          <p
            key={paragraph}
            className={styles.problemText}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <label
        id={sectionLabelId}
        htmlFor={textareaId}
        style={{
          display: "block",
          fontSize: "1.65rem",
          lineHeight: 1.2,
          fontWeight: 700,
          color: "#1f2933"
        }}
      >
        Was belastet oder bewegt dich gerade?
      </label>

      <div style={{ position: "relative" }}>
        <textarea
          id={textareaId}
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          rows={4}
          placeholder="Einsprechen oder tippen, was dich gerade bewegt..."
          style={{
            width: "100%",
            minHeight: "8rem",
            borderRadius: "20px",
            border: "1px solid rgba(56, 103, 214, 0.18)",
            padding: "1.15rem 1.15rem 4rem 1.15rem",
            fontSize: "1.05rem",
            lineHeight: 1.5,
            color: "#1f2933",
            backgroundColor: "#fff",
            boxShadow: "inset 0 1px 4px rgba(36, 53, 103, 0.08)",
            resize: "vertical",
            outline: "none"
          }}
        />
        <button
          type="button"
          onClick={() => handleDictation("problem")}
          disabled={!dictationSupported}
          aria-label="Anliegen einsprechen"
          style={{
            position: "absolute",
            right: "1.1rem",
            bottom: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            backgroundColor: !dictationSupported
              ? "#cbd2d9"
              : listeningField === "problem"
              ? "#20bf6b"
              : "#3867d6",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "0.85rem 1.35rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: !dictationSupported ? "not-allowed" : "pointer",
            boxShadow: !dictationSupported
              ? "none"
              : listeningField === "problem"
              ? "0 12px 26px rgba(32, 191, 107, 0.35)"
              : "0 16px 30px rgba(56, 103, 214, 0.25)",
            transition: "background-color 0.2s ease, transform 0.2s ease",
            transform: listeningField === "problem" ? "scale(1.02)" : "none"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            style={{ width: "1.2rem", height: "1.2rem" }}
          >
            <path d="M12 1.5a3 3 0 00-3 3v6a3 3 0 106 0v-6a3 3 0 00-3-3z" />
            <path d="M5.25 10.5a.75.75 0 011.5 0 5.25 5.25 0 0010.5 0 .75.75 0 011.5 0 6.75 6.75 0 01-6 6.708v2.292h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.292a6.75 6.75 0 01-6-6.708z" />
          </svg>
          <span>Einsprechen</span>
        </button>
      </div>

      {!dictationSupported && (
        <p style={{ margin: 0, color: "#c0392b", fontSize: "0.95rem" }}>
          Hinweis: Dein Browser unterstützt keine Spracherkennung. Bitte nutze Chrome oder Edge
          auf dem Desktop, um die Diktierfunktion verwenden zu können.
        </p>
      )}

      <button
        type="button"
        onClick={handleContinueFromStepOne}
        className={styles.primaryButton}
      >
        Weiter
      </button>
    </section>
  );

  const renderNeedSelectionSection = ({ attachRef = false }: { attachRef?: boolean } = {}) => (
    <section ref={attachRef ? stepTwoRef : undefined} className={styles.needWrapper}>
      <div className={`${styles.cardBase} ${styles.needCard}`}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "999px",
              background: "linear-gradient(180deg, #fff2dc 0%, #fbe1b8 100%)",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 16px 24px rgba(231, 162, 73, 0.22)"
            }}
          >
            <img
              src="/assets/need-child.svg"
              alt="Kind hebt die Arme"
              style={{ width: "90px", height: "90px" }}
            />
          </div>
          <div
            style={{
              color: "#914c1c",
              fontWeight: 700,
              fontSize: "1.25rem",
              lineHeight: 1.35
            }}
          >
            Welches Bedürfnis steckt dahinter?
          </div>
        </div>

        <div
          className={styles.needGrid}
        >
          {needOptions.map((option) => {
            const isSelected = selectedNeed === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setSelectedNeed(option.key);
                  setError(null);
                }}
                style={{
                  borderRadius: "16px",
                  padding: "0.75rem 0.9rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: isSelected ? "1px solid #ffcf91" : "1px solid #1a2d68",
                  backgroundColor: isSelected ? "#274f9b" : "#1f3c88",
                  color: "#fff",
                  boxShadow: isSelected
                    ? "0 12px 18px rgba(31, 60, 136, 0.35)"
                    : "0 8px 14px rgba(31, 60, 136, 0.22)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none"
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            width: "100%"
          }}
        >
          <label htmlFor="needSuggestionsFollowUp" style={{ fontWeight: 700, color: "#7a4416" }}>
            Rückfrage an ChatGPT (optional)
          </label>
          <textarea
            id="needSuggestionsFollowUp"
            value={needSuggestionsFollowUp}
            onChange={(event) => setNeedSuggestionsFollowUp(event.target.value)}
            placeholder="Stelle hier eine Rückfrage oder Präzisierung, falls du nach der ersten Antwort weiterfragen möchtest."
            rows={3}
            style={{
              borderRadius: "12px",
              border: "1px solid #e2c9a5",
              padding: "0.7rem 0.85rem",
              fontSize: "0.98rem",
              lineHeight: 1.45,
              background: "#fffdf8",
              color: "#2c3e50",
              boxShadow: "inset 0 1px 3px rgba(122, 68, 22, 0.08)"
            }}
          />
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#7a4416", lineHeight: 1.4 }}>
            Deine Rückfrage wird zusammen mit der ursprünglichen Situation an ChatGPT geschickt, damit du direkt nachhaken kannst.
          </p>
        </div>

        <button
          type="button"
          onClick={handleChatGPT}
          disabled={needSuggestionsLoading}
          style={{
            borderRadius: "18px",
            padding: "0.9rem 1rem",
            fontSize: "1rem",
            fontWeight: 600,
            border: "1px solid #1a2d68",
            background: "linear-gradient(135deg, #1f3c88, #274f9b)",
            color: "#fff",
            boxShadow: "0 12px 20px rgba(31, 60, 136, 0.3)",
            cursor: "pointer"
          }}
        >
          {needSuggestionsLoading ? "ChatGPT denkt nach…" : "Ich weiß es nicht – bitte Vorschläge machen"}
        </button>

        {needSuggestionsError ? (
          <p style={{ color: "#b00020", margin: "0.35rem 0 0" }}>{needSuggestionsError}</p>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              flexWrap: "wrap"
            }}
          >
            <label htmlFor="needSuggestions" style={{ fontWeight: 700, color: "#7a4416" }}>
              ChatGPT-Vorschläge für Bedürfnisse
            </label>
            <button
              type="button"
              aria-pressed={maximizedField === "needSuggestions"}
              onClick={() => toggleMaximizedField("needSuggestions")}
              style={getMaximizeButtonStyle("needSuggestions")}
            >
              {maximizedField === "needSuggestions" ? "Normale Größe" : "Maximieren"}
            </button>
          </div>
          <textarea
            id="needSuggestions"
            value={needSuggestionsNotes}
            onChange={(event) => setNeedSuggestionsNotes(event.target.value)}
            placeholder="Hier erscheinen die Vorschläge von ChatGPT zu deinen Bedürfnissen."
            rows={4}
            style={{
              borderRadius: "12px",
              border: "1px solid #e2c9a5",
              padding: "0.75rem 0.9rem",
              fontSize: "1rem",
              lineHeight: 1.45,
              background: "#fffdf8",
              color: "#2c3e50",
              boxShadow: "inset 0 1px 3px rgba(122, 68, 22, 0.08)",
              ...getTextareaSizing("needSuggestions", "10rem", "22rem")
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleShowResult}
          style={{
            borderRadius: "999px",
            padding: "0.95rem 1.5rem",
            fontSize: "1.05rem",
            fontWeight: 700,
            border: "none",
            background: "linear-gradient(135deg, #f08a24, #f7b733)",
            color: "#fff",
            boxShadow: "0 20px 36px rgba(236, 147, 44, 0.35)",
            cursor: "pointer"
          }}
        >
          Weiter zum nächsten Schritt
        </button>

        {error ? (
          <p style={{ color: "#d24c41", margin: 0, textAlign: "center" }}>{error}</p>
        ) : null}
      </div>
    </section>
  );

  const chatSaveStepIndex = mobileStepMeta.length - 1;

  const renderMobileStepContent = (): JSX.Element => {
    const baseCardStyle: CSSProperties = {
      background: "transparent",
      borderRadius: 0,
      padding: "0.5rem 0 1.5rem",
      boxShadow: "none",
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    };

    const listStyle: CSSProperties = {
      margin: 0,
      paddingLeft: "1.2rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem"
    };

    switch (activeMobileStep) {
      case 0: {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {renderIntroSection()}
          </div>
        );
      }
      case 1: {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {renderProblemSection({
              sectionLabelId: "mobile-problem-heading",
              textareaId: "mobile-problem"
            })}
          </div>
        );
      }
      case 2: {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {renderNeedSelectionSection()}
          </div>
        );
      }
      case 3: {
        if (!selectedNeedData) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <section style={baseCardStyle} aria-labelledby="mobileNeedTitle">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <h1
                    id="mobileNeedTitle"
                    style={{
                      fontSize: "1.6rem",
                      margin: 0,
                      color: "#2c3e50"
                    }}
                  >
                    {selectedNeed || "Bedürfnis"}
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                      lineHeight: 1.5,
                      color: "#344767"
                    }}
                  >
                    Wähle zuerst ein Bedürfnis in der Desktop-Ansicht, damit die Erklärung angezeigt wird.
                  </p>
                </div>
              </section>
            </div>
          );
        }

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <section style={baseCardStyle} aria-labelledby="mobileNeedTitle">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <h1
                  id="mobileNeedTitle"
                  style={{
                    fontSize: "1.6rem",
                    margin: 0,
                    color: "#2c3e50"
                  }}
                >
                  {selectedNeed}
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.5,
                    color: "#344767"
                  }}
                >
                  Diese Impulse helfen dir, das Bedürfnis tiefer zu verstehen.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      color: "#2c3e50"
                    }}
                  >
                    🌱 Resonanz-Hypothesen
                  </h2>
                  <ul style={listStyle}>
                    {selectedNeedData.resonance.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      color: "#2c3e50"
                    }}
                  >
                    🗣️ Dialog-Impulse an Jesus
                  </h2>
                  <ul style={listStyle}>
                    {selectedNeedData.dialog.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      color: "#2c3e50"
                    }}
                  >
                    ✝️ Jesus-Antwort
                  </h2>
                  <blockquote
                    style={{
                      margin: 0,
                      padding: "18px 20px",
                      borderLeft: "4px solid #4b7bec",
                      background: "rgba(72, 103, 214, 0.12)",
                      borderRadius: "20px",
                      fontStyle: "italic",
                      color: "#1f3c88"
                    }}
                  >
                    {selectedNeedData.jesus || "Noch keine Antwort vorhanden."}
                  </blockquote>
                </div>
              </div>
            </section>
          </div>
        );
      }
      case 4: {
        const isListening = listeningField === "personalNeed";
        const status = !dictationSupported
          ? "Nicht verfügbar"
          : isListening
          ? "Hört zu …"
          : "Bereit";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <section style={baseCardStyle} aria-labelledby="mobilePersonalStep">
              <h1
                id="mobilePersonalStep"
                style={{ fontSize: "1.6rem", margin: 0, color: "#2c3e50" }}
              >
                🕊️ Dein persönlicher Schritt
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  color: "#344767",
                  textAlign: "center",
                  fontWeight: 600
                }}
              >
                {selectedNeed
                  ? `Wie würdest du „${selectedNeed}" mit deinen eigenen Worten beschreiben?`
                  : "Wie würdest du dieses Bedürfnis mit deinen eigenen Worten beschreiben?"}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "16px",
                  alignItems: "center",
                  justifyItems: "center"
                }}
              >
                <img
                  src="/Bedürfnisse/personal-step-child.svg"
                  alt="Ein Kind streckt weinend die Hände aus"
                  style={{ width: "120px", height: "120px" }}
                />
                <img
                  src="/Bedürfnisse/personal-step-guide.svg"
                  alt="Ein Begleiter lächelt warm und hört zu"
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
              <label htmlFor="personalNeed" style={{ fontSize: "1rem", fontWeight: 600, color: "#1f2933" }}>
                Antwort eingeben
              </label>
              <textarea
                id="personalNeed"
                value={personalNeed}
                onChange={(event) => setPersonalNeed(event.target.value)}
                placeholder="Wie würdest du dieses Bedürfnis mit eigenen Worten beschreiben?"
                style={{
                  width: "100%",
                  minHeight: "140px",
                  borderRadius: "20px",
                  border: "1px solid rgba(56, 103, 214, 0.25)",
                  padding: "16px",
                  fontSize: "1.05rem",
                  lineHeight: 1.5,
                  resize: "vertical",
                  boxShadow: "inset 0 1px 4px rgba(31, 61, 116, 0.12)"
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => handleDictation("personalNeed")}
                  disabled={!dictationSupported}
                  style={{
                    flex: "0 0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    background: !dictationSupported
                      ? "#b0b9c6"
                      : isListening
                      ? "linear-gradient(135deg, #20bf6b, #1e9f5a)"
                      : "linear-gradient(135deg, #ff8a5c, #ff6f61)",
                    color: "#fff",
                    cursor: dictationSupported ? "pointer" : "not-allowed",
                    boxShadow: !dictationSupported
                      ? "none"
                      : isListening
                      ? "0 8px 18px rgba(255, 112, 97, 0.35)"
                      : "0 14px 28px rgba(255, 112, 97, 0.28)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    transform: isListening ? "scale(0.96)" : "none"
                  }}
                  aria-label="Antwort einsprechen"
                >
                  🎙️ Einsprechen
                </button>
                <span style={{ fontSize: "0.9rem", color: "#5b728f", fontWeight: 600 }}>{status}</span>
              </div>
              {!dictationSupported && (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#c0392b",
                    background: "rgba(255, 235, 230, 0.9)",
                    padding: "12px 14px",
                    borderRadius: "16px"
                  }}
                >
                  Dein Browser unterstützt keine Spracherkennung. Verwende Chrome oder Edge, um die Diktierfunktion zu nutzen.
                </p>
              )}
            </section>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                lineHeight: 1.5,
                color: "#4c5d73",
                textAlign: "center"
              }}
            >
              Deine Eingabe wird automatisch auf diesem Gerät gespeichert. Sie erscheint auch in der Desktop-Ansicht unter „Dein persönlicher Schritt“.
            </p>
          </div>
        );
      }
      case 5: {
        const isListening = listeningField === "childhoodExperience";
        const status = !dictationSupported
          ? "Nicht verfügbar"
          : isListening
          ? "Hört zu …"
          : "Bereit";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <section style={baseCardStyle} aria-labelledby="mobileChildhoodStep">
              <h1
                id="mobileChildhoodStep"
                style={{ fontSize: "1.6rem", margin: 0, color: "#2c3e50" }}
              >
                👶 Kindheitserinnerung
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  color: "#344767",
                  textAlign: "center",
                  fontWeight: 600
                }}
              >
                Schließe für einen Moment die Augen.
                <br />
                Dieses Gefühl, das du gerade hast …
                <br />
                Kannst du dich an eine Situation in deiner Kindheit erinnern,
                <br />
                in der du dich genauso gefühlt hast – traurig, allein, überfordert, beschämt oder nicht sicher?
                <br />
                Was ist damals passiert?
                <br />
                Wenn du nichts erinnerst, kann du diesen Punkt überspringen.
              </p>
              <label
                htmlFor="childhoodExperience"
                style={{ fontSize: "1rem", fontWeight: 600, color: "#1f2933" }}
              >
                Antwort eingeben
              </label>
              <textarea
                id="childhoodExperience"
                value={childhoodExperience}
                onChange={(event) => setChildhoodExperience(event.target.value)}
                placeholder="Beschreibe hier deine Erinnerungen aus der Kindheit."
                style={{
                  width: "100%",
                  minHeight: "160px",
                  borderRadius: "20px",
                  border: "1px solid rgba(56, 103, 214, 0.25)",
                  padding: "16px",
                  fontSize: "1.05rem",
                  lineHeight: 1.5,
                  resize: "vertical",
                  boxShadow: "inset 0 1px 4px rgba(31, 61, 116, 0.12)"
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => handleDictation("childhoodExperience")}
                  disabled={!dictationSupported}
                  style={{
                    flex: "0 0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    background: !dictationSupported
                      ? "#b0b9c6"
                      : isListening
                      ? "linear-gradient(135deg, #20bf6b, #1e9f5a)"
                      : "linear-gradient(135deg, #8f72ff, #5c6cff)",
                    color: "#fff",
                    cursor: dictationSupported ? "pointer" : "not-allowed",
                    boxShadow: !dictationSupported
                      ? "none"
                      : isListening
                      ? "0 8px 18px rgba(112, 125, 255, 0.35)"
                      : "0 14px 28px rgba(112, 125, 255, 0.28)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    transform: isListening ? "scale(0.96)" : "none"
                  }}
                  aria-label="Antwort einsprechen"
                >
                  🎙️ Einsprechen
                </button>
                <span style={{ fontSize: "0.9rem", color: "#5b728f", fontWeight: 600 }}>{status}</span>
              </div>
              {!dictationSupported && (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#c0392b",
                    background: "rgba(255, 235, 230, 0.9)",
                    padding: "12px 14px",
                    borderRadius: "16px"
                  }}
                >
                  Dein Browser unterstützt keine Spracherkennung. Verwende Chrome oder Edge, um die Diktierfunktion zu nutzen.
                </p>
              )}
            </section>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                lineHeight: 1.5,
                color: "#4c5d73",
                textAlign: "center"
              }}
            >
              Deine Eingabe wird automatisch auf diesem Gerät gespeichert. Sie erscheint auch in der Desktop-Ansicht unter „Kindheitserinnerung“.
            </p>
          </div>
        );
      }
      case 6: {
        const summaryItems = [
          { label: "Was dich beschäftigt", value: problem },
          { label: "Ausgewähltes Bedürfnis", value: selectedNeed },
          { label: "Deine Beschreibung", value: personalNeed },
          { label: "Kindheitserinnerung", value: childhoodExperience }
        ].filter(({ value }) => value && value.trim().length > 0);

        const canAskJesus = summaryItems.length > 0 || Boolean(selectedNeedData);

        const needSections = selectedNeedData
          ? [
              { title: "🌱 Resonanz-Hypothesen", items: selectedNeedData.resonance },
              { title: "🗣️ Dialog-Impulse an Jesus", items: selectedNeedData.dialog },
              {
                title: "✝️ Jesus-Antwort",
                items: selectedNeedData.jesus ? [selectedNeedData.jesus] : []
              }
            ]
              .map((section) => ({
                ...section,
                items: section.items.filter((entry) => entry && entry.trim().length > 0)
              }))
              .filter((section) => section.items.length > 0)
          : [];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <section style={baseCardStyle} aria-labelledby="mobileAskJesusStep">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "36px",
                    background: "linear-gradient(135deg, #ffe0c7, #d5f9e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 38px rgba(75, 123, 236, 0.18)",
                    overflow: "hidden"
                  }}
                >
                  <img
                    src="/Images/jesus.png"
                    alt="Jesus breitet tröstend die Arme aus"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <h1
                  id="mobileAskJesusStep"
                  style={{ fontSize: "1.5rem", margin: 0, color: "#2c3e50" }}
                >
                  💬 Frage Jesus, wie er dein Bedürfnis stillen könnte
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Die Antwort von ChatGPT berücksichtigt dein aktuelles Anliegen, deine Bedürfniswahl,
                  deine eigene Beschreibung und deine Kindheitserinnerung.
                </p>
              </div>

              {summaryItems.length > 0 && (
                <div
                  style={{
                    background: "rgba(75, 123, 236, 0.08)",
                    borderRadius: "20px",
                    padding: "1.1rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem"
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      color: "#1f3c88"
                    }}
                  >
                    Dein Anliegen im Überblick
                  </h2>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      color: "#2c3e50"
                    }}
                  >
                    {summaryItems.map((item) => (
                      <li key={item.label} style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}>
                        <strong>{item.label}:</strong> {item.value.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {needSections.length > 0 && (
                <div
                  style={{
                    background: "rgba(32, 191, 107, 0.08)",
                    borderRadius: "20px",
                    padding: "1.1rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      color: "#177245"
                    }}
                  >
                    Aus der Bedürfnis-Erklärung
                  </h2>
                  {needSections.map((section) => (
                    <div key={section.title} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1rem", color: "#1f3c88" }}>{section.title}</h3>
                      {section.title === "✝️ Jesus-Antwort" ? (
                        <blockquote
                          style={{
                            margin: 0,
                            padding: "0.9rem 1rem",
                            borderLeft: "4px solid #4b7bec",
                            background: "rgba(75, 123, 236, 0.1)",
                            borderRadius: "16px",
                            color: "#1f3c88",
                            fontStyle: "italic"
                          }}
                        >
                          {section.items[0]}
                        </blockquote>
                      ) : (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "1.1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                            color: "#2c3e50"
                          }}
                        >
                          {section.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    width: "100%"
                  }}
                >
                  <label htmlFor="jesusChatFollowUp" style={{ fontWeight: 700, color: "#1f3c88" }}>
                    Rückfrage an ChatGPT (optional)
                  </label>
                  <textarea
                    id="jesusChatFollowUp"
                    value={jesusChatFollowUp}
                    onChange={(event) => setJesusChatFollowUp(event.target.value)}
                    placeholder="Formuliere eine Rückfrage, falls du nach der ersten Antwort noch etwas vertiefen möchtest."
                    rows={3}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #c8d4f4",
                      padding: "0.75rem 0.9rem",
                      fontSize: "0.98rem",
                      lineHeight: 1.45,
                      background: "#f8faff",
                      color: "#1f3c88",
                      boxShadow: "inset 0 1px 3px rgba(31, 60, 136, 0.1)"
                    }}
                  />
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#1f3c88", lineHeight: 1.4 }}>
                    Deine Rückfrage wird zusammen mit dem bisherigen Kontext an ChatGPT geschickt, damit das Gespräch weitergehen kann.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={handleAskJesus}
                  disabled={!canAskJesus || jesusChatLoading}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "0.85rem 1.35rem",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                    background: canAskJesus
                      ? "linear-gradient(135deg, #4b7bec, #20bf6b)"
                      : "#cbd2d9",
                    color: canAskJesus ? "#fff" : "#5b728f",
                    cursor: canAskJesus && !jesusChatLoading ? "pointer" : "not-allowed",
                    boxShadow: canAskJesus
                      ? "0 18px 34px rgba(75, 123, 236, 0.3)"
                      : "none",
                    transition: "background-color 0.2s ease, transform 0.2s ease"
                  }}
                >
                  {jesusChatLoading ? "ChatGPT antwortet…" : "💬 ChatGPT-Antwort abrufen"}
                </button>

                {jesusChatError ? (
                  <p style={{ margin: 0, color: "#b00020", fontWeight: 600 }}>{jesusChatError}</p>
                ) : null}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      flexWrap: "wrap"
                    }}
                  >
                    <label htmlFor="jesusChatResponse" style={{ fontWeight: 700, color: "#1f3c88" }}>
                      ChatGPT-Antwort für dich
                    </label>
                    <button
                      type="button"
                      aria-pressed={maximizedField === "jesusResponse"}
                      onClick={() => toggleMaximizedField("jesusResponse")}
                      style={getMaximizeButtonStyle("jesusResponse")}
                    >
                      {maximizedField === "jesusResponse" ? "Normale Größe" : "Maximieren"}
                    </button>
                  </div>
                  <textarea
                    id="jesusChatResponse"
                    value={jesusChatResponse}
                    onChange={(event) => setJesusChatResponse(event.target.value)}
                    placeholder="Hier erscheint die Antwort, wie Jesus dein Bedürfnis stillen könnte."
                    rows={6}
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #c8d4f4",
                    padding: "0.9rem 1rem",
                    fontSize: "1rem",
                    lineHeight: 1.55,
                    background: "#f8fbff",
                    color: "#1f3c88",
                    boxShadow: "inset 0 1px 4px rgba(75, 123, 236, 0.12)",
                    ...getTextareaSizing("jesusResponse", "12rem", "24rem")
                  }}
                />
                </div>
              </div>
            </section>
          </div>
        );
      }
      case 7: {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <section style={baseCardStyle} aria-labelledby="mobileAskJesusPrompt">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    width: "320px",
                    height: "320px",
                    borderRadius: "36px",
                    background: "linear-gradient(135deg, #ffe7d6, #d9f5ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 38px rgba(32, 128, 118, 0.18)",
                    overflow: "hidden"
                  }}
                >
                  {isHighPriestImageAvailable && highPriestImageSrc ? (
                    <img
                      src={highPriestImageSrc}
                      alt="Jesus als barmherziger Hohepriester"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center"
                      }}
                      onError={() => {
                        setHighPriestImageSrc(null);
                        setHighPriestImageAvailable(false);
                      }}
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 160 160"
                      role="img"
                      aria-label="Skizze: Jesus hält ein Kind im Arm"
                      style={{ width: "260px", height: "260px" }}
                    >
                      <defs>
                        <linearGradient id="robeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#cfe7ff" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      <circle cx="86" cy="40" r="22" fill="#f5c6aa" opacity="0.95" />
                      <path
                        d="M60 70 C45 100 55 135 86 135 C117 135 127 100 112 70"
                        fill="url(#robeGradient)"
                        stroke="#9fb8d3"
                        strokeWidth="3"
                      />
                      <circle cx="56" cy="78" r="16" fill="#f7d9c4" opacity="0.95" />
                      <path
                        d="M70 92 C64 118 80 132 96 128"
                        fill="none"
                        stroke="#f5c6aa"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M108 92 C112 120 100 134 84 132"
                        fill="none"
                        stroke="#f5c6aa"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
                <h1
                  id="mobileAskJesusPrompt"
                  style={{ fontSize: "1.5rem", margin: 0, color: "#2c3e50" }}
                >
                  🙏 Frage an Jesus – als barmherziger Hohepriester
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Stell dir vor, du bist jetzt Jesus, der auf dem Gnadenthron sitzt – der barmherzige Hohepriester aus Hebräer
                  4. Schau auf dich selbst hinunter, wie ein liebevoller Hohepriester auf einen Menschen, der Hilfe braucht.
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Frage an dich selbst:
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Wenn du Jesus bist – voller Erbarmen, Geduld und Gnade – was würdest du der Person da unten sagen, die jetzt
                  du bist?
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Nimm 1–2 Minuten, um innerlich zu hören.
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Dann schreibe auf, was du als Jesus antwortest.
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Halte fest, welche Worte der Barmherzigkeit, Ermutigung oder Wahrheit du empfangen hast.
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Bibelwort Hebräer 4, 16 :
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  „So lasst uns nun mit Zuversicht hinzutreten zum Thron der Gnade,<br />damit wir Barmherzigkeit empfangen und
                  Gnade finden zu rechtzeitiger Hilfe."
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginTop: "0.5rem"
                }}
              >
                <label htmlFor="mobileMeditationNotes" style={{ fontWeight: 600, color: "#1f3c88" }}>
                  Was hat Jesus dir in dieser Meditation gesagt?
                </label>
                <textarea
                  id="mobileMeditationNotes"
                  value={meditationNotes}
                  onChange={(event) => setMeditationNotes(event.target.value)}
                  rows={4}
                  placeholder="Beschreibe hier Jesu Worte oder diktiere sie."
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    border: "1px solid rgba(31, 60, 136, 0.2)",
                    padding: "1rem",
                    fontSize: "1.05rem",
                    lineHeight: 1.5,
                    color: "#1f2933",
                    backgroundColor: "#fff",
                    boxShadow: "inset 0 1px 4px rgba(36, 53, 103, 0.08)",
                    resize: "vertical",
                    outline: "none"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <DictationButton field="meditationNotes" ariaLabel="Antwort an Jesus diktieren" />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                    color: "#4c5d73"
                  }}
                >
                  Deine Worte bleiben auf diesem Gerät gespeichert und erscheinen auch in der Desktop-Ansicht im Feld
                  „Worte Jesu aus der Meditation“.
                </p>
              </div>
            </section>
          </div>
        );
      }
      case 8: {
        const hasContext = closingPromptContextItems.length > 0;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <section style={baseCardStyle} aria-labelledby="mobileClosingHeading">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  textAlign: "center",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "36px",
                    background: "linear-gradient(135deg, #ffe8cc, #dfe9ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 38px rgba(111, 148, 214, 0.2)",
                    fontSize: "3.5rem"
                  }}
                  aria-hidden="true"
                >
                  🤍
                </div>
                <h1
                  id="mobileClosingHeading"
                  style={{ fontSize: "1.5rem", margin: 0, color: "#2c3e50" }}
                >
                  🌟 Abschluss von ChatGPT
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Danke, dass du dich auf diesen inneren Weg eingelassen hast. Würdige, was du mit
                  Jesus durchlebt und ausgesprochen hast.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    width: "100%"
                  }}
                >
                  <label htmlFor="closingChatFollowUp" style={{ fontWeight: 700, color: "#4b7bec" }}>
                    Rückfrage an ChatGPT (optional)
                  </label>
                  <textarea
                    id="closingChatFollowUp"
                    value={closingChatFollowUp}
                    onChange={(event) => setClosingChatFollowUp(event.target.value)}
                    placeholder="Falls du nach dem Abschluss noch etwas klären möchtest, formuliere es hier."
                    rows={3}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #d2d9ff",
                      padding: "0.75rem 0.9rem",
                      fontSize: "0.98rem",
                      lineHeight: 1.45,
                      background: "#f8f9ff",
                      color: "#1f3c88",
                      boxShadow: "inset 0 1px 3px rgba(77, 97, 214, 0.12)"
                    }}
                  />
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#4b7bec", lineHeight: 1.4 }}>
                    Deine Rückfrage wird gemeinsam mit den vorherigen Angaben geschickt, damit ChatGPT auf deinen Weg eingehen kann.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClosingChatGPT}
                  disabled={!hasClosingPrompt || closingChatLoading}
                  style={{
                    border: "none",
                    borderRadius: "999px",
                    padding: "0.85rem 1.35rem",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    background: hasClosingPrompt
                      ? "linear-gradient(135deg, #7d5fff, #4b7bec)"
                      : "#cbd2d9",
                    color: hasClosingPrompt ? "#fff" : "#5b728f",
                    cursor: hasClosingPrompt && !closingChatLoading ? "pointer" : "not-allowed",
                    boxShadow: hasClosingPrompt
                      ? "0 18px 34px rgba(75, 123, 236, 0.3)"
                      : "none",
                    transition: "background-color 0.2s ease, transform 0.2s ease"
                  }}
                >
                  {closingChatLoading ? "ChatGPT erstellt den Abschluss…" : "✨ Abschluss von ChatGPT abrufen"}
                </button>

                {!hasClosingPrompt && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      color: "#4c5d73"
                    }}
                  >
                    Sobald deine Angaben aus den vorherigen Schritten vollständig sind, kannst du hier die
                    Abschlussantwort mit ChatGPT öffnen.
                  </p>
                )}

                {closingChatError ? (
                  <p style={{ margin: 0, color: "#b00020", fontWeight: 600 }}>{closingChatError}</p>
                ) : null}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      flexWrap: "wrap"
                    }}
                  >
                    <label htmlFor="closingChatResponse" style={{ fontWeight: 700, color: "#4b7bec" }}>
                      Abschluss von ChatGPT
                    </label>
                    <button
                      type="button"
                      aria-pressed={maximizedField === "closingResponse"}
                      onClick={() => toggleMaximizedField("closingResponse")}
                      style={getMaximizeButtonStyle("closingResponse")}
                    >
                      {maximizedField === "closingResponse" ? "Normale Größe" : "Maximieren"}
                    </button>
                  </div>
                  <textarea
                    id="closingChatResponse"
                    value={closingChatResponse}
                    onChange={(event) => setClosingChatResponse(event.target.value)}
                    placeholder="Hier erscheint der Abschluss-Kommentar von ChatGPT."
                    rows={6}
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #d2d9ff",
                    padding: "0.9rem 1rem",
                    fontSize: "1rem",
                    lineHeight: 1.55,
                    background: "#f8f9ff",
                    color: "#1f3c88",
                    boxShadow: "inset 0 1px 4px rgba(77, 97, 214, 0.12)",
                    ...getTextareaSizing("closingResponse", "12rem", "24rem")
                  }}
                />
                </div>
              </div>

              {hasContext && (
                <div aria-hidden="true" style={{ display: "none" }}>
                  <h2>Diese Angaben fließen im Hintergrund in den Prompt ein</h2>
                  <ul>
                    {closingPromptContextItems.map((item) => (
                      <li key={item.label}>
                        <strong>{item.label}:</strong> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: "#4c5d73",
                  textAlign: "left"
                }}
              >
                Deine Notizen bleiben nur auf diesem Gerät gespeichert und sind auch in der
                Desktop-Ansicht unter „Abschlusskommentar von ChatGPT“ sichtbar.
              </p>
            </section>
          </div>
        );
      }
      default:
        return <div />;
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7f9",
        margin: 0,
        padding: "2rem",
        fontFamily: "\"Segoe UI\", sans-serif",
        color: "#222"
      }}
    >
      <button
        onClick={() => nav("/")}
        style={{
          marginBottom: "1.5rem",
          backgroundColor: "#4b7bec",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0.6rem 1rem",
          cursor: "pointer",
          fontSize: "1rem"
        }}
      >
        ← Zurück zum Hauptmenü
      </button>

      <section style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #dfe7fb",
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            boxShadow: "0 6px 14px rgba(31, 60, 136, 0.08)"
          }}
        >
          <h2 style={{ margin: "0 0 0.35rem", color: "#1f3c88" }}>Sprachstil auswählen</h2>
          <p style={{ margin: "0 0 0.75rem", color: "#4c5d73", lineHeight: 1.5 }}>
            Entscheide, ob die Antworten nur christliche Sprache nutzen oder zusätzlich psychologische und
            wissenschaftliche Begriffe einbinden dürfen.
          </p>
          <div
            style={{
              display: "grid",
              gap: "0.65rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
            }}
          >
            <button
              type="button"
              onClick={() => setLanguageMode("christian")}
              style={getLanguageButtonStyle("christian")}
              aria-pressed={languageMode === "christian"}
            >
              Nur christliche Sprache
            </button>
            <button
              type="button"
              onClick={() => setLanguageMode("combined")}
              style={getLanguageButtonStyle("combined")}
              aria-pressed={languageMode === "combined"}
            >
              Christlich + psychologisch / wissenschaftlich
            </button>
          </div>
          <p style={{ margin: "0.85rem 0 0", color: "#1f2933", fontWeight: 600, lineHeight: 1.4 }}>
            {languageMode === "combined"
              ? "Aktuell werden biblische Formulierungen mit psychologischer und wissenschaftlicher Sprache verbunden, wenn du das möchtest."
              : "Aktuell bleiben die Antworten bewusst in biblischer Sprache und vermeiden psychologische Fachbegriffe."}
          </p>
        </div>
        <div>
          {!showResult && (
            <>
              {renderProblemSection({ attachRef: true })}
              {renderNeedSelectionSection({ attachRef: true })}
            </>
          )}
          {showResult ? (
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  marginTop: "0.75rem"
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.6rem"
                  }}
                >
                  {mobileStepMeta.map((step, index) => {
                    const isActive = activeMobileStep === index;
                    return (
                      <button
                        key={step.key}
                        type="button"
                        onClick={() => setActiveMobileStep(index)}
                        style={{
                          width: "100%",
                          borderRadius: "14px",
                          border: isActive ? "2px solid #4b7bec" : "1px solid #c7d2fe",
                          padding: "0.7rem 1rem",
                          cursor: "pointer",
                          background: "#fff",
                          color: "#1f3c88",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.45rem",
                          textAlign: "left",
                          boxShadow: "none",
                          transition: "border-color 0.15s ease, transform 0.15s ease",
                          transform: isActive ? "translateY(-2px)" : "none"
                        }}
                      >
                        <span aria-hidden="true">{step.icon}</span>
                        <span>{step.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div
                  style={{
                    borderRadius: 0,
                    overflow: "visible",
                    padding: "0.25rem 0 0.5rem",
                    background: "transparent",
                    boxShadow: "none"
                  }}
                >
                  {activeMobileStep === chatSaveStepIndex
                    ? renderChatSaveSection()
                    : renderMobileStepContent()}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem"
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMobileStep((previous) => Math.max(0, previous - 1))
                    }
                    disabled={activeMobileStep === 0}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "0.5rem 1.1rem",
                      fontWeight: 600,
                      cursor: activeMobileStep === 0 ? "not-allowed" : "pointer",
                      background: activeMobileStep === 0 ? "#dfe6f3" : "#4b7bec",
                      color: activeMobileStep === 0 ? "#5b728f" : "#fff",
                      boxShadow:
                        activeMobileStep === 0
                          ? "none"
                          : "0 10px 22px rgba(75, 123, 236, 0.2)"
                    }}
                  >
                    ← Zurück
                  </button>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#344767",
                      textAlign: "center",
                      flex: "1 1 auto"
                    }}
                  >
                    {mobileStepMeta[activeMobileStep].label}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMobileStep((previous) =>
                        Math.min(mobileStepMeta.length - 1, previous + 1)
                      )
                    }
                    disabled={activeMobileStep === mobileStepMeta.length - 1}
                    style={{
                      border: "none",
                      borderRadius: "999px",
                      padding: "0.5rem 1.1rem",
                      fontWeight: 600,
                      cursor:
                        activeMobileStep === mobileStepMeta.length - 1
                          ? "not-allowed"
                          : "pointer",
                      background:
                        activeMobileStep === mobileStepMeta.length - 1
                          ? "#dfe6f3"
                          : "#4b7bec",
                      color:
                        activeMobileStep === mobileStepMeta.length - 1 ? "#5b728f" : "#fff",
                      boxShadow:
                        activeMobileStep === mobileStepMeta.length - 1
                          ? "none"
                          : "0 10px 22px rgba(75, 123, 236, 0.2)"
                    }}
                  >
                    Weiter →
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

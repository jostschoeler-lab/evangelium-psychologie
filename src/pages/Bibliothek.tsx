import { useNavigate } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties
} from "react";

type NeedContent = {
  resonance: string[];
  dialog: string[];
  jesus: string;
};

type SavedChat = {
  id: string;
  userInput: string;
  assistantResponse: string;
  createdAt: string;
};

type DictationField = "problem" | "personalNeed" | "childhoodExperience" | "meditationNotes";

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
};

const introLeadParagraphs: string[] = [
  "Um wirklich von Jesus getröstet zu werden, müssen wir trauern.",
  "Wenn ich das Himmelreich bekommen will, muss ich mich arm fühlen, hilflos, wie ein Kind.",
  "Das Reich Gottes gehört den Kindern, nicht den Starken. (Matthäus 5,3; Markus 10,15)",
  "Paulus sagt: „Gottes Kraft wird in der Schwachheit vollkommen.“ (2. Korinther 12,9)",
  "Er wollte seine Schwachheit sogar wegbeten und nannte sie einen „Engel Satans“. (2. Korinther 12,7–8)",
  "Aber genau diese Schwachheit war der Ort, wo Gottes Kraft offenbar wurde. Dort lag die Verwandlung."
];

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
    icon: "✅",
    title: "Abschluss",
    paragraphs: [
      "Wenn du bereit bist, kannst du jetzt dein Gefühl oder dein Problem eingeben."
    ]
  }
];

type IntroCardProps = {
  onStart: () => void;
};

const IntroCard = ({ onStart }: IntroCardProps) => {
  return (
    <section
      aria-label="Verwandlung als Gotteskind"
      style={{
        margin: "0 auto 2rem",
        maxWidth: "380px",
        backgroundColor: "#fdf6ec",
        borderRadius: "28px",
        padding: "1.75rem 1.5rem",
        boxShadow: "0 20px 45px rgba(32, 40, 52, 0.18)",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "22px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f8e1b3, #f38181)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src="/bibliothek/verwandlung-intro.svg"
          alt="Jesus hält ein weinendes Kind im Arm"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.6rem",
              lineHeight: 1.2,
              color: "#3a2a18",
              fontWeight: 700
            }}
          >
            Verwandlung als Gotteskind
          </h2>
          <p
            style={{
              margin: "0.5rem 0 0",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#5f4630",
              fontStyle: "italic"
            }}
          >
            „Selig sind die Trauernden, denn sie werden getröstet werden.“ (Matthäus 5,4)
          </p>
        </div>

        {introLeadParagraphs.map((paragraph) => (
          <p
            key={paragraph}
            style={{ margin: 0, fontSize: "0.98rem", lineHeight: 1.6, color: "#463626" }}
          >
            {paragraph}
          </p>
        ))}

        {introSections.map((section) => (
          <div
            key={section.title}
            style={{
              borderRadius: "18px",
              backgroundColor: "#fff8f0",
              padding: "1rem",
              border: "1px solid rgba(240, 194, 123, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem"
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.05rem",
                color: "#3a2a18",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <span aria-hidden="true">{section.icon}</span>
              <span>{section.title}</span>
            </h3>
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.55, color: "#5f4630" }}
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
                  fontSize: "0.95rem"
                }}
              >
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          alignSelf: "center",
          marginTop: "0.5rem",
          background: "linear-gradient(135deg, #f4b860, #d98c3f)",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          padding: "0.85rem 2.5rem",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 12px 24px rgba(212, 136, 65, 0.35)"
        }}
      >
        Starten
      </button>
    </section>
  );
};

export default function Bibliothek() {
  const nav = useNavigate();
  const [problem, setProblem] = useState("");
  const [selectedNeed, setSelectedNeed] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [personalNeed, setPersonalNeed] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [meditationNotes, setMeditationNotes] = useState("");
  const [listeningField, setListeningField] = useState<DictationField | null>(null);
  const [childhoodExperience, setChildhoodExperience] = useState("");
  const [chatUserInput, setChatUserInput] = useState("");
  const [chatAssistantResponse, setChatAssistantResponse] = useState("");
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [introVisible, setIntroVisible] = useState(true);
  const [activeMobileStep, setActiveMobileStep] = useState(0);

  const dictationSupported =
    typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const recognitionRef = useRef<any>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const stepTwoRef = useRef<HTMLDivElement | null>(null);
  const activeFieldRef = useRef<DictationField | null>(null);
  const pendingFieldRef = useRef<DictationField | null>(null);
  const pendingBaseRef = useRef<string>("");
  const dictationBaseRef = useRef<Record<DictationField, string>>({
    problem: "",
    personalNeed: "",
    childhoodExperience: "",
    meditationNotes: ""
  });

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
        default:
          break;
      }
    },
    [setProblem, setPersonalNeed, setChildhoodExperience, setMeditationNotes]
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

      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      const base = dictationBaseRef.current[field] ?? "";
      if (!transcript && !base) {
        return;
      }
      const combined = `${base}${transcript}`.trim();
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
      const parsed = JSON.parse(stored) as SavedChat[];
      if (Array.isArray(parsed)) {
        setSavedChats(parsed);
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
      setShowResult(false);
      return;
    }
    setError(null);
    setShowResult(true);
  };

  const handleStartIntro = useCallback(() => {
    setIntroVisible(false);
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [setIntroVisible]);

  const handleContinueFromStepOne = useCallback(() => {
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        stepTwoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [stepTwoRef]);

  const handleChatGPT = () => {
    const prompt = encodeURIComponent(
      "Analysiere die folgende Situation mit einem einfühlsamen, psychologisch-christlichen Blick. Das Ziel ist, zu erkennen, welches Bedürfnis hinter der beschriebenen Reaktion oder dem Konflikt steckt. " +
        "Orientiere dich dabei an diesen acht zentralen Bedürfnissen: 1) Gesehen / gehört / gewürdigt werden, 2) Sicherheit & Vorhersagbarkeit, 3) Würde / Respekt / Unversehrtheit, 4) Autonomie & Einfluss, 5) Fairness / Gerechtigkeit, 6) Nähe / Verbundenheit, 7) Kompetenz / Wirksamkeit, 8) Leichtigkeit / Entlastung. " +
        "Bitte wähle 1–3 passende Bedürfnisse aus dieser Liste, erkläre kurz warum, und schlage anschließend einen kurzen Jesus-Impuls vor. " +
        "Situation: " +
        problem
    );
    window.open(`https://chat.openai.com/?q=${prompt}`, "_blank", "noopener,noreferrer");
  };

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

  const handleAskJesus = () => {
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

    const promptText = promptLines.join("\n");

    const prompt = encodeURIComponent(promptText);
    window.open(`https://chat.openai.com/?q=${prompt}`, "_blank", "noopener,noreferrer");
  };


  const handleSaveChat = () => {
    const trimmedInput = chatUserInput.trim();
    const trimmedResponse = chatAssistantResponse.trim();

    if (!trimmedInput && !trimmedResponse) {
      alert("Bitte füge zuerst deine Eingabe oder die Antwort von ChatGPT ein.");
      return;
    }

    const newChat: SavedChat = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userInput: trimmedInput,
      assistantResponse: trimmedResponse,
      createdAt: new Date().toISOString()
    };

    setSavedChats((previous) => [newChat, ...previous]);
    setChatUserInput("");
    setChatAssistantResponse("");
  };

  const handleDeleteChat = (id: string) => {
    setSavedChats((previous) => previous.filter((chat) => chat.id !== id));
  };

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
    [dictationSupported, listeningField, problem, personalNeed, childhoodExperience, meditationNotes, startRecognition]
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
      key: "transformation",
      label: "1) Verwandlung als Gotteskind",
      icon: "✨",
      background: "linear-gradient(180deg, #fff4e8 0%, #fdf6ec 100%)"
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
  ] as const;

  const renderIntroSection = () => {
    if (introVisible) {
      return <IntroCard onStart={handleStartIntro} />;
    }

    return (
      <button
        type="button"
        onClick={() => {
          setIntroVisible(true);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        style={{
          background: "none",
          border: "none",
          color: "#3867d6",
          textDecoration: "underline",
          cursor: "pointer",
          padding: 0,
          fontSize: "0.95rem",
          marginBottom: "1.5rem"
        }}
      >
        Einführung erneut ansehen
      </button>
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
      style={{
        margin: "0 auto 2rem",
        maxWidth: "420px",
        background: "linear-gradient(180deg, #fdf0d5 0%, #f3e8ff 100%)",
        borderRadius: "32px",
        padding: "2.25rem 1.75rem 2.5rem",
        boxShadow: "0 26px 60px rgba(45, 64, 102, 0.18)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}
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
          src="/bibliothek/verwandlung-intro.svg"
          alt="Illustration: Jesus tröstet ein Kind"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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
        style={{
          alignSelf: "center",
          marginTop: "0.5rem",
          backgroundColor: "#3867d6",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          padding: "0.85rem 2.75rem",
          fontSize: "1.05rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 18px 32px rgba(56, 103, 214, 0.28)"
        }}
      >
        Weiter
      </button>
    </section>
  );

  const renderNeedSelectionSection = ({ attachRef = false }: { attachRef?: boolean } = {}) => (
    <section
      ref={attachRef ? stepTwoRef : undefined}
      style={{
        marginTop: "3rem",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fdf2e4",
          borderRadius: "28px",
          padding: "2.5rem 1.75rem",
          boxShadow: "0 28px 40px rgba(198, 134, 66, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
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
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.75rem"
          }}
        >
          {needOptions.map((option) => {
            const isSelected = selectedNeed === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setSelectedNeed(option.key);
                  setShowResult(false);
                  setError(null);
                }}
                style={{
                  borderRadius: "18px",
                  padding: "0.85rem 1rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: isSelected ? "2px solid #eb8c2d" : "2px solid transparent",
                  backgroundColor: isSelected ? "#ffe8c8" : "#fff4e5",
                  color: "#7a4416",
                  boxShadow: isSelected
                    ? "0 16px 30px rgba(235, 140, 45, 0.35)"
                    : "0 10px 24px rgba(214, 171, 116, 0.22)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleChatGPT}
          style={{
            borderRadius: "18px",
            padding: "0.9rem 1rem",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            backgroundColor: "#fff",
            color: "#7a4416",
            boxShadow: "0 10px 24px rgba(214, 171, 116, 0.22)",
            cursor: "pointer"
          }}
        >
          Ich weiß es nicht – bitte Vorschläge machen
        </button>

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

  const renderMobileStepContent = (): JSX.Element => {
    const baseCardStyle: CSSProperties = {
      background: "#ffffffcc",
      backdropFilter: "blur(6px)",
      borderRadius: "28px",
      padding: "28px 22px",
      boxShadow: "0 24px 48px rgba(31, 61, 116, 0.16)",
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
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
                  src="/bibliothek/personal-step-child.svg"
                  alt="Ein Kind streckt weinend die Hände aus"
                  style={{ width: "120px", height: "120px" }}
                />
                <img
                  src="/bibliothek/personal-step-guide.svg"
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
                {selectedNeed
                  ? `Hast du „${selectedNeed}" schon in deiner Kindheit gespürt?`
                  : "Hast du dieses Gefühl oder Bedürfnis schon einmal in der Kindheit erlebt?"}
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
              Deine Eingabe wird automatisch auf diesem Gerät gespeichert. Sie erscheint auch in der Desktop-Ansicht unter „Hast du dieses Gefühl in der Kindheit erlebt?“.
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
                    src="/bibliothek/jesus-traegt-weinendes-kind.svg"
                    alt="Jesus hält ein weinendes Kind tröstend im Arm"
                    style={{ width: "140px", height: "140px", objectFit: "contain" }}
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

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleAskJesus}
                  disabled={!canAskJesus}
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
                    cursor: canAskJesus ? "pointer" : "not-allowed",
                    boxShadow: canAskJesus
                      ? "0 18px 34px rgba(75, 123, 236, 0.3)"
                      : "none",
                    transition: "background-color 0.2s ease, transform 0.2s ease"
                  }}
                >
                  💬 ChatGPT-Antwort öffnen
                </button>
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
                    width: "160px",
                    height: "160px",
                    borderRadius: "36px",
                    background: "linear-gradient(135deg, #ffe7d6, #d9f5ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 38px rgba(32, 128, 118, 0.18)",
                    overflow: "hidden"
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 160 160"
                    role="img"
                    aria-label="Skizze: Jesus hält ein Kind im Arm"
                    style={{ width: "130px", height: "130px" }}
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
                </div>
                <h1
                  id="mobileAskJesusPrompt"
                  style={{ fontSize: "1.5rem", margin: 0, color: "#2c3e50" }}
                >
                  🙏 Frage an Jesus
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Setze dich im Glauben auf den Gnadenthron, wo Jesus als barmherziger Hohepriester sitzt. Stell dir vor, wie
                  er dich ansieht und dir jetzt Gnade schenkt.
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    color: "#344767"
                  }}
                >
                  Meditiere 1–2 Minuten über seine Gegenwart. Sprich dann laut oder schriftlich aus, was du Jesus antwortest,
                  und halte fest, was er dir zuspricht.
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
                  Was hat Jesus dir in dieser Meditation zugesprochen?
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

      <section style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "1.5rem" }}>Verwandlung als Gotteskind</h1>

        {renderIntroSection()}

        <div style={{ display: introVisible ? "none" : "block" }}>
          {renderProblemSection({ attachRef: true })}

          {renderNeedSelectionSection({ attachRef: true })}
          {showResult && selectedNeedData ? (
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.5rem",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginTop: "1.5rem"
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
                    display: "flex",
                    flexWrap: "wrap",
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
                          flex: "1 1 180px",
                          borderRadius: "999px",
                          border: "none",
                          padding: "0.55rem 1rem",
                          cursor: "pointer",
                          background: isActive ? "#4b7bec" : "#e1e9ff",
                          color: isActive ? "#fff" : "#1f3c88",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          boxShadow: isActive
                            ? "0 12px 28px rgba(75, 123, 236, 0.25)"
                            : "none",
                          transition: "background-color 0.2s ease, box-shadow 0.2s ease"
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
                    borderRadius: "36px",
                    overflow: "hidden",
                    padding: "1.5rem",
                    background: mobileStepMeta[activeMobileStep].background,
                    boxShadow: "0 24px 48px rgba(31, 61, 116, 0.18)"
                  }}
                >
                  {renderMobileStepContent()}
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
              <h3 style={{ color: "#2c3e50", marginTop: "1.5rem" }}>
                💾 Gesamten Chat speichern
              </h3>
              <p>
                Füge hier deine Eingabe und die Antwort von ChatGPT ein, um sie für spätere Reflexionen zu sichern.
              </p>
              <label
                htmlFor="chatUserInput"
                style={{ display: "block", fontWeight: 600, marginTop: "1rem" }}
              >
                Deine Eingabe an ChatGPT
              </label>
              <textarea
                id="chatUserInput"
                value={chatUserInput}
                onChange={(event) => setChatUserInput(event.target.value)}
                rows={3}
                placeholder="Füge hier deinen Prompt oder deine Frage ein..."
                style={{
                  width: "100%",
                  fontSize: "1rem",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
              <label
                htmlFor="chatAssistantResponse"
                style={{ display: "block", fontWeight: 600, marginTop: "1rem" }}
              >
                Antwort von ChatGPT
              </label>
              <textarea
                id="chatAssistantResponse"
                value={chatAssistantResponse}
                onChange={(event) => setChatAssistantResponse(event.target.value)}
                rows={5}
                placeholder="Füge hier die Antwort von ChatGPT ein..."
                style={{
                  width: "100%",
                  fontSize: "1rem",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
              <button
                onClick={handleSaveChat}
                style={{
                  width: "100%",
                  backgroundColor:
                    chatUserInput.trim() || chatAssistantResponse.trim()
                      ? "#3867d6"
                      : "#aac1e8",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.6rem 1rem",
                  cursor:
                    chatUserInput.trim() || chatAssistantResponse.trim()
                      ? "pointer"
                      : "not-allowed",
                  fontSize: "1rem",
                  marginTop: "1rem"
                }}
                disabled={!chatUserInput.trim() && !chatAssistantResponse.trim()}
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
                    Noch keine Chats gespeichert. Füge oben deine ersten Notizen hinzu.
                  </p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {savedChats.map((chat) => (
                      <li
                        key={chat.id}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          padding: "0.75rem",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          border: "1px solid #e0e8f8",
                          marginBottom: "0.75rem"
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
                        {chat.userInput ? (
                          <p style={{ whiteSpace: "pre-wrap", marginBottom: "0.5rem" }}>
                            <strong>Du:</strong> {chat.userInput}
                          </p>
                        ) : null}
                        {chat.assistantResponse ? (
                          <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                            <strong>ChatGPT:</strong> {chat.assistantResponse}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  const dictationSupported =
    typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const recognitionRef = useRef<any>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const activeFieldRef = useRef<DictationField | null>(null);
  const pendingFieldRef = useRef<DictationField | null>(null);
  const pendingBaseRef = useRef<string>("");
  const dictationBaseRef = useRef<Record<DictationField, string>>({
    problem: "",
    personalNeed: "",
    childhoodExperience: "",
    meditationNotes: ""
  });

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

  const handlePersonalJesus = () => {
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

    const promptText = `
Lies den folgenden Text, in dem ein Mensch sein inneres Bedürfnis beschreibt.
Antworte als Jesus – liebevoll, wahrhaftig, ermutigend.
Zeige, wie dieses Bedürfnis in der Beziehung zu mir gestillt wird,
nicht durch äußere Umstände, sondern durch die Gemeinschaft mit mir.
Schlage außerdem 2–3 Bibelverse vor, die unterstützen, wie ich dieses Bedürfnis mit dir erlebe, und nenne die genaue Bibelstelle.
Sprich in der Du-Form, sanft und persönlich, mit Wärme.

Angaben der Person:
${contextDetails}
`.trim();

    const prompt = encodeURIComponent(promptText);
    window.open(`https://chat.openai.com/?q=${prompt}`, "_blank", "noopener,noreferrer");
  };

  const handleClosingComment = () => {
    if (!meditationNotes.trim()) {
      alert("Bitte schreibe zuerst auf, was Jesus dir gesagt hat.");
      return;
    }

    const closingDetails = buildDetailList([
      { label: "Was die Person gerade beschäftigt", value: problem },
      { label: "Ausgewähltes Bedürfnis", value: selectedNeed },
      {
        label: "Persönliche Beschreibung des Bedürfnisses",
        value: personalNeed
      },
      {
        label: "Kindheitserfahrungen zu diesem Gefühl/Bedürfnis",
        value: childhoodExperience
      },
      { label: "Worte Jesu aus der Meditation", value: meditationNotes }
    ]);

    const promptText = `
Du bist geistliche*r Begleiter*in, der/die eine kurze Würdigung und einen praktischen Tipp gibt.
Lies die Angaben einer Person und antworte mit einem Abschlusskommentar.
1) Bedanke dich bei Jesus und anerkenne voller Wertschätzung, was er der Person zugesprochen hat.
2) Gib einen konkreten, warmen Vorschlag, wie die Person diese Worte im Alltag wachhalten kann – z.B. durch kleine Erinnerungen, kurze Gebete, Meditationen, das Bitten um den Geist der Weisheit und Offenbarung oder die Augen des Herzens.
3) Verknüpfe Anerkennung und Alltagstipp ausdrücklich mit ihrer persönlichen Bedürfnisbeschreibung, den Kindheitserfahrungen und den Worten, wie Jesus das Bedürfnis stillt.
Erkläre, dass unser Verstand Jesu Worte sofort verstehen kann, während Unbewusstes und Gefühle manchmal länger brauchen – so können Leid und schwere Gefühle vorerst bleiben, ähnlich wie bei Paulus und seinem Pfahl im Fleisch, bis Gottes Gnade ihre Kraft zeigt.
Baue mehrere Bibelverse ein (z.B. aus Römer 8, 2. Korinther 12, 1. Petrus 4, Hebräer 4 oder andere passende Stellen), die das Mitleiden mit Jesus, Glauben, Geduld und das Reifen durch Leid betonen.
Schreibe maximal zwei kurze Absätze und sprich die Person in der Du-Form an.

Angaben der Person:
${closingDetails}
    `.trim();

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

  const DictationButton = ({ field, ariaLabel }: { field: DictationField; ariaLabel: string }) => {
    const isActive = listeningField === field;
    const isDisabled = !dictationSupported;

    return (
      <button
        type="button"
        onClick={() => handleDictation(field)}
        disabled={isDisabled}
        style={{
          backgroundColor: isDisabled ? "#95a5a6" : isActive ? "#20bf6b" : "#4b7bec",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0 0.75rem",
          cursor: isDisabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          minWidth: "5.5rem",
          height: "100%",
          transition: "background-color 0.2s ease-in-out"
        }}
        aria-label={ariaLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          style={{ width: "1.25rem", height: "1.25rem" }}
        >
          <path d="M12 1.5a3 3 0 00-3 3v6a3 3 0 106 0v-6a3 3 0 00-3-3z" />
          <path d="M5.25 10.5a.75.75 0 011.5 0 5.25 5.25 0 0010.5 0 .75.75 0 011.5 0 6.75 6.75 0 01-6 6.708v2.292h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.292a6.75 6.75 0 01-6-6.708z" />
        </svg>
        <span>Diktat</span>
      </button>
    );
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

        {introVisible ? (
          <IntroCard onStart={handleStartIntro} />
        ) : (
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
        )}

        <div ref={formRef} style={{ display: introVisible ? "none" : "block" }}>
          <label htmlFor="problem" style={{ display: "block", fontWeight: 600 }}>
            1️⃣ Was beschäftigt dich gerade?
          </label>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "stretch",
              marginTop: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            <textarea
              id="problem"
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              rows={3}
              placeholder="Schreibe hier dein Anliegen..."
              style={{
                flex: 1,
                fontSize: "1rem",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
            <DictationButton field="problem" ariaLabel="Anliegen diktieren" />
          </div>
          {!dictationSupported && (
            <p style={{ marginTop: "-0.5rem", marginBottom: "1.5rem", color: "#c0392b" }}>
              Hinweis: Dein Browser unterstützt keine Spracherkennung. Bitte nutze Chrome oder Edge
              auf dem Desktop, um die Diktierfunktion verwenden zu können.
            </p>
          )}

          <label htmlFor="need" style={{ display: "block", fontWeight: 600 }}>
            2️⃣ Welches Bedürfnis ist betroffen?
          </label>
          <select
            id="need"
            value={selectedNeed}
            onChange={(event) => {
              setSelectedNeed(event.target.value);
              setShowResult(false);
              setError(null);
            }}
            style={{
              width: "100%",
              fontSize: "1rem",
              padding: "0.5rem",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          >
            <option value="">Bitte auswählen...</option>
            {Object.keys(needs).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={handleShowResult}
              style={{
                flexGrow: 1,
                backgroundColor: "#4b7bec",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.6rem 1rem",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              💫 Weiter
            </button>
            <button
              onClick={handleChatGPT}
              style={{
                flexGrow: 1,
                backgroundColor: "#3867d6",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.6rem 1rem",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              💬 Bedürfnisvorschlag mit ChatGPT
            </button>
          </div>

          {error ? (
            <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
          ) : null}

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
            <h2 style={{ color: "#2c3e50" }}>{selectedNeed}</h2>

            <h3 style={{ color: "#2c3e50" }}>🌿 Resonanz-Hypothesen</h3>
            <ul style={{ paddingLeft: "1.2rem" }}>
              {selectedNeedData.resonance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3 style={{ color: "#2c3e50" }}>💬 Dialog-Impulse an Jesus</h3>
            <ul style={{ paddingLeft: "1.2rem" }}>
              {selectedNeedData.dialog.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3 style={{ color: "#2c3e50" }}>✝️ Jesus-Antwort</h3>
            <div
              style={{
                backgroundColor: "#f0f8ff",
                borderLeft: "4px solid #4b7bec",
                padding: "1rem",
                borderRadius: "6px",
                fontStyle: "italic"
              }}
            >
              {selectedNeedData.jesus}
            </div>

            <h3 style={{ color: "#2c3e50" }}>🕊️ Dein persönlicher Schritt</h3>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "stretch",
                marginTop: "0.5rem",
                marginBottom: "1rem"
              }}
            >
              <textarea
                id="personalNeed"
                value={personalNeed}
                onChange={(event) => setPersonalNeed(event.target.value)}
                rows={3}
                placeholder="Wie würdest du dein Bedürfnis mit eigenen Worten beschreiben?"
                style={{
                  flex: 1,
                  fontSize: "1rem",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
              <DictationButton field="personalNeed" ariaLabel="Persönlichen Schritt diktieren" />
            </div>
          <p style={{ marginTop: "1rem", fontWeight: 600 }}>
            Hast du dieses Gefühl oder Bedürfnis schon einmal in der Kindheit erlebt?
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "stretch",
              marginTop: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            <textarea
              id="childhoodExperience"
              value={childhoodExperience}
              onChange={(event) => setChildhoodExperience(event.target.value)}
              rows={3}
              placeholder="Beschreibe hier deine Erinnerungen aus der Kindheit."
              style={{
                flex: 1,
                fontSize: "1rem",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
            <DictationButton
              field="childhoodExperience"
              ariaLabel="Kindheitserinnerungen diktieren"
            />
          </div>
          <button
            onClick={handlePersonalJesus}
            style={{
              width: "100%",
                backgroundColor: "#4b7bec",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.6rem 1rem",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              💬 Frage Jesus, wie er dein Bedürfnis stillt
            </button>
            <p style={{ marginTop: "1rem" }}>
              🙏 Setze dich im Glauben auf den Gnadenthron, wo Jesus als barmherziger
              Hohepriester sitzt. Stell dir vor, was er dir als Hohepriester sagt und
              wie er dir jetzt Gnade schenkt. Meditiere 1–2 Minuten über seine Worte
              und schreibe auf, was Jesus dir gesagt hat.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "stretch",
                marginTop: "0.5rem",
                marginBottom: "1rem"
              }}
            >
              <textarea
                id="meditationNotes"
                value={meditationNotes}
                onChange={(event) => setMeditationNotes(event.target.value)}
                rows={4}
                placeholder="Was hat Jesus dir in dieser Meditation zugesprochen?"
                style={{
                  flex: 1,
                  fontSize: "1rem",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
              <DictationButton field="meditationNotes" ariaLabel="Meditationsnotizen diktieren" />
            </div>
            <h3 style={{ color: "#2c3e50", marginTop: "1.5rem" }}>📝 Schlusskommentar</h3>
            <p>
              Bitte Jesus dafür, was er dir gesagt hat, und lass dir von ChatGPT einen
              warmen Abschlussimpuls schenken, wie du seine Worte im Alltag wachhalten
              kannst.
            </p>
            <button
              onClick={handleClosingComment}
              style={{
                width: "100%",
                backgroundColor: meditationNotes.trim() ? "#20bf6b" : "#aacfbf",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.6rem 1rem",
                cursor: meditationNotes.trim() ? "pointer" : "not-allowed",
                fontSize: "1rem"
              }}
              disabled={!meditationNotes.trim()}
            >
              🌟 Anerkennung & Alltagstipp anfordern
            </button>

            <h3 style={{ color: "#2c3e50", marginTop: "1.5rem" }}>
              💾 Gesamten Chat speichern
            </h3>
            <p>
              Füge hier deine Eingabe und die Antwort von ChatGPT ein, um sie für
              spätere Reflexionen zu sichern.
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
              disabled={
                !chatUserInput.trim() && !chatAssistantResponse.trim()
              }
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

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

  const dictationSupported =
    typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const recognitionRef = useRef<any>(null);
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

  const handlePersonalJesus = () => {
    const prompt = encodeURIComponent(
      "Lies den folgenden Text, in dem ein Mensch sein inneres Bedürfnis beschreibt. " +
        "Antworte als Jesus – liebevoll, wahrhaftig, ermutigend. " +
        "Zeige, wie dieses Bedürfnis in der Beziehung zu mir gestillt wird, " +
        "nicht durch äußere Umstände, sondern durch die Gemeinschaft mit mir. " +
        "Schlage außerdem 2–3 Bibelverse vor, die unterstützen, wie ich dieses Bedürfnis mit dir erlebe, und nenne die genaue Bibelstelle. " +
        "Sprich in der Du-Form, sanft und persönlich, mit Wärme. " +
        "Beschreibung des Bedürfnisses: " +
        personalNeed
    );
    window.open(`https://chat.openai.com/?q=${prompt}`, "_blank", "noopener,noreferrer");
  };

  const handleClosingComment = () => {
    if (!meditationNotes.trim()) {
      alert("Bitte schreibe zuerst auf, was Jesus dir gesagt hat.");
      return;
    }

    const closingDetails = [
      problem.trim() ? `Was die Person gerade beschäftigt: ${problem.trim()}` : "",
      selectedNeed ? `Ausgewähltes Bedürfnis: ${selectedNeed}` : "",
      personalNeed.trim()
        ? `Persönliche Beschreibung des Bedürfnisses: ${personalNeed.trim()}`
        : "",
      childhoodExperience.trim()
        ? `Kindheitserfahrungen zu diesem Gefühl/Bedürfnis: ${childhoodExperience.trim()}`
        : "",
      `Worte Jesu aus der Meditation: ${meditationNotes.trim()}`
    ].filter(Boolean);

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
${closingDetails.map((detail) => `- ${detail}`).join("\n")}
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
        <h1 style={{ color: "#2c3e50" }}>🕊️ 7-Minuten-Debrief – Jesus antwortet dir</h1>
        <p>Beschreibe kurz dein Thema, wähle dein Bedürfnis – und erlebe den Dialog mit Jesus.</p>

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
      </section>
    </main>
  );
}

import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

type NeedContent = {
  resonance: string[];
  dialog: string[];
  jesus: string;
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

export default function Bibliothek() {
  const nav = useNavigate();
  const [problem, setProblem] = useState("");
  const [selectedNeed, setSelectedNeed] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [personalNeed, setPersonalNeed] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [meditationNotes, setMeditationNotes] = useState("");

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

    const prompt = encodeURIComponent(
      "Du bist geistliche*r Begleiter*in, der/die eine kurze Würdigung und einen praktischen Tipp gibt. " +
        "Lies die Notizen, was eine Person von Jesus gehört hat, und antworte mit einem Abschlusskommentar. " +
        "1) Bedanke dich bei Jesus und anerkenne voller Wertschätzung, was er der Person zugesprochen hat. " +
        "2) Gib einen konkreten, warmen Vorschlag, wie die Person diese Worte im Alltag wachhalten kann – z.B. durch kleine Erinnerungen, kurze Gebete, Meditationen, das Bitten um den Geist der Weisheit und Offenbarung oder die Augen des Herzens. " +
        "Schreibe maximal zwei kurze Absätze und sprich die Person in der Du-Form an. " +
        "Notizen der Person: " +
        meditationNotes +
        (personalNeed.trim()
          ? " Zusätzliche Beschreibung des Bedürfnisses: " + personalNeed.trim()
          : "")
    );

    window.open(`https://chat.openai.com/?q=${prompt}`, "_blank", "noopener,noreferrer");
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
        <textarea
          id="problem"
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          rows={3}
          placeholder="Schreibe hier dein Anliegen..."
          style={{
            width: "100%",
            fontSize: "1rem",
            padding: "0.5rem",
            marginTop: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

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
            <textarea
              id="personalNeed"
              value={personalNeed}
              onChange={(event) => setPersonalNeed(event.target.value)}
              rows={3}
              placeholder="Wie würdest du dein Bedürfnis mit eigenen Worten beschreiben?"
              style={{
                width: "100%",
                fontSize: "1rem",
                padding: "0.5rem",
                marginTop: "0.5rem",
                marginBottom: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
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
            <textarea
              id="meditationNotes"
              value={meditationNotes}
              onChange={(event) => setMeditationNotes(event.target.value)}
              rows={4}
              placeholder="Was hat Jesus dir in dieser Meditation zugesprochen?"
              style={{
                width: "100%",
                fontSize: "1rem",
                padding: "0.5rem",
                marginTop: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
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
          </div>
        ) : null}
      </section>
    </main>
  );
}

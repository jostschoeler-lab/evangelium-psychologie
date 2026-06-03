import { Link, useNavigate } from "react-router-dom";

const sections = [
  {
    eyebrow: "01 · Wahrnehmen",
    title: "Was wird gerade unterdrückt?",
    text:
      "Repression beginnt oft leise: ein Gefühl wird weggeschoben, ein Bedürfnis bleibt namenlos, ein innerer Anteil wird kontrolliert statt verstanden.",
  },
  {
    eyebrow: "02 · Begegnen",
    title: "Welcher Anteil braucht Beziehung?",
    text:
      "Transformation entsteht, wenn Schmerz, Schutz und Sehnsucht einen sicheren Raum bekommen. Nicht alles muss sofort gelöst werden – manches will zuerst gehört werden.",
  },
  {
    eyebrow: "03 · Verwandeln",
    title: "Was kann neu werden?",
    text:
      "Aus Abwehr kann Fürsorge werden, aus Kontrolle Orientierung und aus erstarrter Angst eine Bewegung hin zu Wahrheit, Trost und Lebendigkeit.",
  },
];

const practices = [
  "Benenne das Gefühl, ohne es zu bewerten.",
  "Frage: Welches Bedürfnis schützt die Repression?",
  "Unterscheide zwischen kurzfristiger Entlastung und echter Verwandlung.",
  "Lade einen heilsamen inneren oder geistlichen Blick auf den Anteil ein.",
];

export default function RepressionOrTransformation() {
  const nav = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#132238",
        background:
          "radial-gradient(circle at 12% 18%, rgba(122, 92, 255, 0.18), transparent 28%), linear-gradient(135deg, #f9fbff 0%, #eef4ff 46%, #f8efe4 100%)",
        padding: "clamp(18px, 5vw, 56px)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 28 }}>
        <nav
          aria-label="Seitennavigation"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}
        >
          <button
            onClick={() => nav("/")}
            style={{
              border: 0,
              borderRadius: 999,
              padding: "10px 16px",
              background: "rgba(255,255,255,0.82)",
              color: "#243756",
              fontWeight: 700,
              boxShadow: "0 12px 28px rgba(31, 45, 77, 0.12)",
              cursor: "pointer",
            }}
          >
            ← Zurück
          </button>
          <Link
            to="/stuhldialog"
            style={{
              color: "#334f86",
              fontWeight: 700,
              textDecoration: "none",
              background: "rgba(255,255,255,0.64)",
              borderRadius: 999,
              padding: "10px 16px",
            }}
          >
            Zum Stuhldialog
          </Link>
        </nav>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.86)",
              borderRadius: 32,
              padding: "clamp(24px, 5vw, 52px)",
              boxShadow: "0 30px 80px rgba(31, 45, 77, 0.14)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p style={{ margin: 0, color: "#80612b", fontWeight: 800, letterSpacing: "0.12em" }}>
              REPRESSION OR TRANSFORMATION
            </p>
            <h1
              style={{
                margin: "12px 0 18px",
                fontSize: "clamp(2.5rem, 8vw, 5.8rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
              }}
            >
              Unterdrücken oder verwandeln?
            </h1>
            <p style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)", lineHeight: 1.7, color: "#41516b" }}>
              Eine Reflexionsseite über innere Schutzmechanismen, verdrängte Bedürfnisse und den Weg von Kontrolle
              zu heilsamer Integration.
            </p>
          </div>

          <aside
            style={{
              borderRadius: 32,
              padding: 26,
              background: "linear-gradient(160deg, #1c2d4f, #4f3f88 58%, #b97842)",
              color: "#fff",
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 30px 80px rgba(31, 45, 77, 0.2)",
            }}
          >
            <div>
              <p style={{ margin: 0, opacity: 0.72, fontWeight: 700 }}>Leitfrage</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", lineHeight: 1.05, margin: "14px 0" }}>
                Was will dein Inneres nicht nur überleben, sondern verwandeln?
              </h2>
            </div>
            <p style={{ lineHeight: 1.65, opacity: 0.86 }}>
              Repression schützt vor Überforderung. Transformation führt behutsam in Beziehung, Wahrheit und neue
              Handlungsfreiheit.
            </p>
          </aside>
        </section>

        <section
          aria-label="Drei Schritte"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}
        >
          {sections.map((section) => (
            <article
              key={section.eyebrow}
              style={{
                background: "rgba(255,255,255,0.78)",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 18px 44px rgba(31, 45, 77, 0.1)",
              }}
            >
              <p style={{ margin: 0, color: "#7b5b25", fontSize: 13, fontWeight: 800 }}>{section.eyebrow}</p>
              <h2 style={{ margin: "10px 0", fontSize: "1.35rem" }}>{section.title}</h2>
              <p style={{ margin: 0, lineHeight: 1.65, color: "#526177" }}>{section.text}</p>
            </article>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              borderRadius: 26,
              padding: 24,
              background: "rgba(255,255,255,0.8)",
              boxShadow: "0 18px 44px rgba(31, 45, 77, 0.1)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Mini-Übung</h2>
            <p style={{ lineHeight: 1.7, color: "#526177" }}>
              Nimm dir zwei Minuten. Lege eine Hand auf die Brust, atme langsam aus und frage: „Was versuche ich
              gerade nicht zu fühlen?“ Schreibe ein einziges Wort auf. Dieses Wort ist der Anfang eines Dialogs.
            </p>
          </div>
          <div
            style={{
              borderRadius: 26,
              padding: 24,
              background: "rgba(19,34,56,0.92)",
              color: "#fff",
              boxShadow: "0 18px 44px rgba(31, 45, 77, 0.16)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Impulse für Transformation</h2>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
              {practices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

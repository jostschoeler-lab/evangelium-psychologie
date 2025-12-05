import type { CSSProperties, MouseEvent } from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  const pageStyle: CSSProperties = {
    padding: "clamp(16px, 6vw, 48px)",
    fontFamily: "Arial, sans-serif",
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  };
  const heroStyle: CSSProperties = {
    background: "rgba(255,255,255,0.85)",
    padding: "clamp(18px, 5vw, 28px)",
    borderRadius: 22,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
    backdropFilter: "blur(6px)",
  };
  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14,
    marginTop: 18,
  };
  const btnStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "16px 18px",
    borderRadius: 16,
    background: "linear-gradient(135deg, #f7f9fc, #eef2ff)",
    color: "#0f172a",
    fontWeight: 700,
    textDecoration: "none",
    boxShadow: "0 14px 32px rgba(20, 47, 99, 0.12)",
    minHeight: 94,
    transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
  };

  const accentBar: CSSProperties = {
    width: 42,
    height: 6,
    borderRadius: 99,
    background: "linear-gradient(90deg, #2b4a8f, #4368c8)",
  };

  const subtitle: CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: "#475569",
  };

  const handleHover = (event: MouseEvent<HTMLAnchorElement>, isHover: boolean) => {
    const target = event.currentTarget;
    target.style.transform = isHover ? "translateY(-2px)" : "translateY(0)";
    target.style.boxShadow = isHover
      ? "0 18px 36px rgba(20, 47, 99, 0.18)"
      : "0 14px 32px rgba(20, 47, 99, 0.12)";
  };

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={accentBar} aria-hidden />
        <h1>Kombination Evangelium und Psychologie</h1>
        <p style={subtitle}>
          Mobile-first gedacht, mit klarer Typografie und weichen Flächen statt harter Rahmen.
          Wähle einen Bereich, um direkt zu starten.
        </p>
      </section>

      <div style={gridStyle}>
        <Link
          to="/Bedürfnisse"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <span>Bedürfnisse</span>
          <span style={subtitle}>Bibliothek &amp; Tools</span>
        </Link>

        <Link
          to="/nbj"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <span>Meditation</span>
          <span style={subtitle}>Geführte Einheit starten</span>
        </Link>

        <Link
          to="/spannungsmodell"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <span>Spannungsmodell</span>
          <span style={subtitle}>Rollen &amp; Bedürfnisse</span>
        </Link>

        <Link
          to="/ep"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <span>Crosslinks</span>
          <span style={subtitle}>Bibel &amp; Psychologie verbinden</span>
        </Link>

        <Link
          to="/stuhldialog"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <span>Stuhldialog</span>
          <span style={subtitle}>Dialog-Modus öffnen</span>
        </Link>
      </div>
    </main>
  );
}

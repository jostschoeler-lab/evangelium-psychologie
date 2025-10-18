import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  const pageStyle: CSSProperties = { padding: 40, fontFamily: "Arial, sans-serif" };
  const rowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 };
  const btnStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 15px",
    borderRadius: 8,
    background: "#2b4a8f",
    color: "#fff",
    fontWeight: 700,
    textDecoration: "none",
  };

  const externalBtnStyle: CSSProperties = { ...btnStyle, background: "#2563eb" };

  return (
    <main style={pageStyle}>
      <h1>NBJ – Suite • v4</h1>

      <div style={rowStyle}>
        <Link to="/nbj" style={btnStyle}>
          Meditation (NBJ)
        </Link>
        <Link to="/spannungsmodell" style={btnStyle}>
          Spannungsmodell
        </Link>
        <Link to="/bibliothek" style={btnStyle}>
          Bibliothek
        </Link>
        <Link to="/ep" style={btnStyle}>
          Formular (EP)
        </Link>
        <Link to="/stuhldialog" style={btnStyle}>
          Stuhldialog
        </Link>

        {/* Sandbox bleibt optional erreichbar */}
        <a
          href="https://dzr1l7z.csb.app/?v=4"
          target="_blank"
          rel="noopener"
          style={externalBtnStyle}
        >
          Stuhldialog (Sandbox)
        </a>
      </div>
    </main>
  );
}

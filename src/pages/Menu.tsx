import { Link } from "react-router-dom";

export default function Menu() {
  const pageStyle: React.CSSProperties = { padding: 40, fontFamily: "Arial, sans-serif" };
  const rowStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 };
  const btnStyle: React.CSSProperties = {
    display: "inline-block", padding: "10px 15px", borderRadius: 8,
    background: "#2b4a8f", color: "#fff", fontWeight: 700, textDecoration: "none"
  };

  return (
    <main style={pageStyle}>
      <h1>NBJ – Suite • v4</h1>

      <div style={rowStyle}>
        <Link to="/nbj" style={btnStyle}>Meditation (NBJ)</Link>
        <Link to="/spannungsmodell" style={btnStyle}>Spannungsmodell</Link>
        <Link to="/bibliothek" style={btnStyle}>Bibliothek</Link>
        <Link to="/ep" style={btnStyle}>Formular (EP)</Link>

        {/* Stuhldialog: Sandbox in neuem Tab */}
        <a
          href="https://dzr1l7z.csb.app/?v=4"
          target="_blank"
          rel="noopener"
          style={btnStyle}
        >
          Stuhldialog (Sandbox)
        </a>
      </div>
    </main>
  );
}

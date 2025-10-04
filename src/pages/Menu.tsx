export default function Menu() {
  const pageStyle: React.CSSProperties = { padding: 40, fontFamily: "Arial, sans-serif" };
  const rowStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 };
  const btnStyle: React.CSSProperties = {
    display: "inline-block", padding: "10px 15px", borderRadius: 8,
    background: "#2b4a8f", color: "#fff", fontWeight: 700, textDecoration: "none"
  };

  return (
    <main style={pageStyle}>
      <h1>NBJ – Suite • v3</h1>

      <div style={rowStyle}>
        <a href="/nbj/" style={btnStyle}>Meditation (NBJ)</a>
        <a href="/spannungsmodell/" style={btnStyle}>Spannungsmodell</a>
        <a href="/bibliothek/" style={btnStyle}>Bibliothek</a>
        <a href="#/ep" style={btnStyle}>Formular (EP)</a>

        {/* Stuhldialog: direkt absoluter Link in neuem Tab (ohne onClick-JS) */}
        <a
          href="https://dzr1l7z.csb.app/?v=1"
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

export default function Menu() {
  const pageStyle: React.CSSProperties = {
    padding: 40,
    fontFamily: "Arial, sans-serif",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  };

  const btnStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 15px",
    borderRadius: 8,
    background: "#2b4a8f",
    color: "#fff",
    fontWeight: 700,
    textDecoration: "none",
  };

  return (
    <main style={pageStyle}>
      <h1>NBJ – Suite</h1>

      <div style={rowStyle}>
        {/* Statische Seiten im Projekt */}
        <a href="/nbj/" style={btnStyle}>Meditation (NBJ)</a>

        {/* Formular bleibt auf deiner Hash-Route */}
        <a href="#/ep" style={btnStyle}>Formular (EP)</a>

        <a href="/spannungsmodell/" style={btnStyle}>Spannungsmodell</a>

        {/* HIER: Direkt zur Sandbox im neuen Tab */}
        <a
          href="https://dzr1l7z.csb.app/"
          target="_blank"
          rel="noopener"
          style={btnStyle}
        >
          Stuhldialog
        </a>

        <a href="/bibliothek/" style={btnStyle}>Bibliothek</a>
      </div>
    </main>
  );
}

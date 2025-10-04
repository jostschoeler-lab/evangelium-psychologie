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
        {/* Meditation: statische Seite unter /nbj/ */}
        <a href="/nbj/" style={btnStyle}>Meditation (NBJ)</a>

        {/* Formular: HashRouter-Route #/ep */}
        <a href="#/ep" style={btnStyle}>Formular (EP)</a>

        {/* Statische Module unter public/… */}
        <a href="/spannungsmodell/" style={btnStyle}>Spannungsmodell</a>
        <a href="/stuhldialog/" style={btnStyle}>Stuhldialog</a>
        <a href="/bibliothek/" style={btnStyle}>Bibliothek</a>
      </div>
    </main>
  );
}

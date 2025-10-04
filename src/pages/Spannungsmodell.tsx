export default function Spannungsmodell() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Spannungsmodell</h1>
      <p>Hier kannst du das Spannungsmodell darstellen oder bearbeiten.</p>
      <button onClick={() => (window.location.hash = "#/")}>
        ← Zurück zum Hauptmenü
      </button>
    </main>
  );
}

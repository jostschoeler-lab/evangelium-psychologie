export default function Bibliothek() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Bibliothek</h1>
      <p>Gespeicherte Texte, Bilder und Ressourcen.</p>
      <button onClick={() => (window.location.hash = "#/")}>
        ← Zurück zum Hauptmenü
      </button>
    </main>
  );
}

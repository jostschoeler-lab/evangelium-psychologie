export default function Stuhldialog() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Stuhldialog</h1>
      <p>Hier bereitest du den Stuhldialog vor oder führst ihn durch.</p>
      <button onClick={() => (window.location.hash = "#/")}>
        ← Zurück zum Hauptmenü
      </button>
    </main>
  );
}

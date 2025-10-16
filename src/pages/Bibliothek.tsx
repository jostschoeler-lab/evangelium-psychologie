import { useNavigate } from "react-router-dom";

export default function Bibliothek() {
  const nav = useNavigate();
  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Bibliothek</h1>
      <p>Gespeicherte Texte, Bilder und Ressourcen.</p>
      <button onClick={() => nav("/")}>Zurück zum Hauptmenü</button>
    </main>
  );
}


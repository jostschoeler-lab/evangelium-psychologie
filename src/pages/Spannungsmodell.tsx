import { useNavigate } from "react-router-dom";

export default function Spannungsmodell() {
  const nav = useNavigate();
  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Spannungsmodell</h1>
      <p>Hier kannst du das Spannungsmodell darstellen oder bearbeiten.</p>
      <button onClick={() => nav("/")}>Zurück zum Hauptmenü</button>
    </main>
  );
}


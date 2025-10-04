export default function Menu() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>NBJ – Suite</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
        <button onClick={() => (window.location.hash = "#/nbj")}>
          Meditation (NBJ)
        </button>
        <button onClick={() => (window.location.hash = "#/ep")}>
          Formular (EP)
        </button>
        <button onClick={() => (window.location.hash = "#/spannungsmodell")}>
          Spannungsmodell
        </button>
       <button onClick={() => (window.location.href = "/stuhldialog/")}>
  Stuhldialog
</button>

          Stuhldialog
        </button>
        <button onClick={() => (window.location.hash = "#/bibliothek")}>
          Bibliothek
        </button>
      </div>
    </main>
  );
}

import { useNavigate } from "react-router-dom";

export default function NBJ() {
  const nav = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "linear-gradient(180deg, #f8fbff 0%, #eef2ff 60%, #f8fbff 100%)",
        padding: "8px",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "none",
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 12px 26px rgba(15, 23, 42, 0.08)",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          gap: 10,
          backdropFilter: "blur(6px)",
        }}
      >
        <button onClick={() => nav("/")}>Zurück</button>
        <div style={{ fontWeight: 700, color: "#1b2f63" }}>Meditation</div>
      </div>
      <iframe
        src="/nbj/index.html"
        title="NBJ"
        style={{
          flex: "1 1 auto",
          width: "100%",
          border: 0,
          borderRadius: 16,
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          background: "#fff",
        }}
      />
    </div>
  );
}

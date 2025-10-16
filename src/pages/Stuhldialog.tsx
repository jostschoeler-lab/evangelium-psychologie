import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type RoleKey = "ICH" | "KIND" | "ANKLAEGER" | "JESUS" | "COPING";

type RoleMeta = {
  label: string;
  color: string;
  defaultImg: string;
  desc: string;
  subpoints: string[];
};

const asset = (file: string) => `/stuhldialog/${file}`;

const ROLES: Record<RoleKey, RoleMeta> = {
  JESUS: {
    label: "Jesus – Hohepriester / Gnadenstuhl",
    color: "#059669",
    defaultImg: asset("jesus.png"),
    desc: "Liebe, Wahrheit, Gnade, Trost, Hoffnung, Verwandlung.",
    subpoints: ["Liebe", "Wahrheit", "Gnade", "Trost", "Hoffnung", "Verwandlung"],
  },
  ANKLAEGER: {
    label: "Ankläger / Strenge Eltern",
    color: "#DC2626",
    defaultImg: asset("anklaeger.png"),
    desc: "Kritisch, strafend, fordernd – ohne Verdammnis transformieren.",
    subpoints: ["Kritisch", "Strafend", "Überfordernd", "Fordernd", "Introjekt", "Modell"],
  },
  KIND: {
    label: "Inneres Kind & Bedürfnisse",
    color: "#2563EB",
    defaultImg: asset("kind.png"),
    desc: "Roh & echt; braucht Sicherheit, Trost, Verbundenheit.",
    subpoints: ["Verletzlich", "Wütend", "Impulsiv", "Ängstlich", "Sensitiv", "Spielerisch"],
  },
  ICH: {
    label: "Ich / Erwachsener",
    color: "#EAB308",
    defaultImg: asset("erwachsener.png"),
    desc: "Integration, Selbstregulation, Grenzen, Neubewertung.",
    subpoints: ["Selbstregulation", "Distanzierung", "Kooperation", "Selbstfürsorge", "Grenzen setzen", "Neubewertung"],
  },
  COPING: {
    label: "Bewältigungsstrategien",
    color: "#8B5CF6",
    defaultImg: asset("coping.png"),
    desc: "Unterwerfung, Vermeidung, Selbstberuhigung, Überkompensation …",
    subpoints: ["Unterwerfung", "Vermeidung", "Selbstberuhigung", "Überkompensation", "Perfektionismus", "Rückzug"],
  },
};

const GRID_POSITIONS: Record<RoleKey, { row: number; column: number }> = {
  JESUS: { row: 1, column: 2 },
  ANKLAEGER: { row: 2, column: 1 },
  KIND: { row: 2, column: 2 },
  ICH: { row: 2, column: 3 },
  COPING: { row: 3, column: 2 },
};

const CARD_WIDTH = 220;
const GRID_COLUMN_GAP = 48;
const GRID_ROW_GAP = 56;

export default function Stuhldialog() {
  const [active, setActive] = useState<RoleKey>("JESUS");
  const meta = useMemo(() => ROLES[active], [active]);
  const [nbjFeel, setNbjFeel] = useState<{ value: string; ts?: number } | null>(null);

  const loadNbjFeel = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("nbj_entries");
      if (!raw) {
        setNbjFeel(null);
        return;
      }
      const entries = JSON.parse(raw);
      if (!Array.isArray(entries) || entries.length === 0) {
        setNbjFeel(null);
        return;
      }
      const preferred = entries.find((entry: any) => entry && !entry.draft);
      const current = (preferred ?? entries[0]) as { f?: string; ts?: number } | undefined;
      const value = (current?.f ?? "").trim();
      if (!value) {
        setNbjFeel(null);
        return;
      }
      setNbjFeel({ value, ts: current?.ts });
    } catch {
      setNbjFeel(null);
    }
  }, []);

  useEffect(() => {
    loadNbjFeel();
    if (typeof window === "undefined") return;
    const handler = (event: StorageEvent) => {
      if (event.key === "nbj_entries") {
        loadNbjFeel();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [loadNbjFeel]);

  return (
    <main
      style={{
        fontFamily: "Inter, system-ui, Arial",
        padding: 16,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#2563EB",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <span aria-hidden="true">←</span> Zurück
        </Link>
      </div>

      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          textAlign: "center",
          margin: 0,
        }}
      >
        Modus-Board – fünf Bilder frei angeordnet
      </h1>
      <p style={{ textAlign: "center", color: "#6B7280", margin: "6px 0 18px" }}>
        Wähle eine Karte, um Beschreibung und Stichpunkte zu sehen.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, minmax(${CARD_WIDTH}px, 1fr))`,
          gridTemplateRows: "repeat(3, minmax(160px, 1fr))",
          columnGap: GRID_COLUMN_GAP,
          rowGap: GRID_ROW_GAP,
          justifyItems: "center",
          alignItems: "center",
          padding: "16px 0",
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        {(Object.keys(ROLES) as RoleKey[]).map((role) => {
          const info = ROLES[role];
          const isActive = active === role;
          const placement = GRID_POSITIONS[role];

          return (
            <article
              key={role}
              onClick={() => setActive(role)}
              style={{
                gridRow: placement.row,
                gridColumn: placement.column,
                width: CARD_WIDTH,
                justifySelf: "center",
                padding: 16,
                borderRadius: 18,
                background: "#FFF",
                border: isActive ? `3px solid ${info.color}` : "2px solid #CBD5E1",
                boxShadow: isActive
                  ? `0 12px 24px rgba(0,0,0,0.14), 0 0 0 4px ${hexToRgba(info.color, 0.1)}`
                  : "0 8px 18px rgba(0,0,0,0.08)",
                cursor: "pointer",
                userSelect: "none",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                alignItems: "center",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                transform: isActive ? "translateY(-6px)" : "translateY(0)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#F8FAFC",
                }}
              >
                <img
                  src={info.defaultImg}
                  alt={info.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  color: isActive ? info.color : "#374151",
                  lineHeight: 1.2,
                }}
              >
                {info.label}
              </div>
            </article>
          );
        })}
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 16,
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          background: "#F3F4F6",
        }}
      >
        <div style={{ fontWeight: 700, color: meta.color }}>Aktiv: {meta.label}</div>
        <p style={{ color: "#374151", marginTop: 8 }}>{meta.desc}</p>
        <ul
          style={{
            marginTop: 8,
            paddingLeft: 18,
            color: "#1F2937",
            lineHeight: 1.4,
          }}
        >
          {meta.subpoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 16,
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          background: "#FFF9F4",
        }}
      >
        <div style={{ fontWeight: 700, color: "#DC2626" }}>Gefühl(e) aus NBJ</div>
        {nbjFeel ? (
          <>
            <p style={{ color: "#1F2937", marginTop: 8, whiteSpace: "pre-wrap" }}>{nbjFeel.value}</p>
            {nbjFeel.ts ? (
              <p style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
                Zuletzt aktualisiert: {new Date(nbjFeel.ts).toLocaleString()}
              </p>
            ) : null}
          </>
        ) : (
          <p style={{ color: "#64748B", marginTop: 8 }}>Noch kein Gefühlseintrag gespeichert.</p>
        )}
      </section>
    </main>
  );
}

function hexToRgba(hex: string, alpha = 1) {
  const normalized = hex.replace("#", "");
  const numeric = parseInt(normalized, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

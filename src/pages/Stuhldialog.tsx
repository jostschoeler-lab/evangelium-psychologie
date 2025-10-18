import React, { useMemo, useState } from "react";

/**
 * Modus-Board (ohne Kreis & Stuhl)
 * - 5 Karten: Erwachsener, Kind, Ankläger, Jesus, Bewältigungsstrategien
 * - Bild + Label unten + Menü (•••) oben rechts
 * - Position X/Y, Elementgröße (0.4–1.4), Bildgröße/Offsets, Labelgröße/Offset
 * - Bildquelle: /public-Pfad oder Datei-Upload (Data-URL)
 */

type RoleKey = "ICH" | "KIND" | "ANKLAEGER" | "JESUS" | "COPING";

type RoleMeta = {
  label: string;
  color: string;
  defaultImg: string;
  desc: string;
  subpoints: string[];
};

type NodeState = {
  x: number;
  y: number;
  cardScale: number; // 0.4..1.4
  imgScale: number; // 0.6..1.6
  imgOffX: number; // -150..150
  imgOffY: number; // -150..150
  textSize: number; // 12..28
  textOffX: number; // -200..200
  menuOpen: boolean;
  selectedSub: number | null;
};

// Bühne
const STAGE_W = 1100;
const STAGE_H = 700;

// Karten-Basis
const CARD_W = 280;
const CARD_H = 280;
const IMG_BOX = 220;

const ROLES: Record<RoleKey, RoleMeta> = {
  ICH: {
    label: "Ich / Erwachsener",
    color: "#EAB308",
    defaultImg: "/erwachsener.png",
    desc: "Integration, Selbstregulation, Grenzen, Neubewertung.",
    subpoints: [
      "Selbstregulation",
      "Distanzierung",
      "Kooperation",
      "Selbstfürsorge",
      "Grenzen setzen",
      "Neubewertung",
    ],
  },
  KIND: {
    label: "Inneres Kind & Bedürfnisse",
    color: "#2563EB",
    defaultImg: "/kind.png",
    desc: "Roh & echt; braucht Sicherheit, Trost, Verbundenheit.",
    subpoints: [
      "Verletzlich",
      "Wütend",
      "Impulsiv",
      "Ängstlich",
      "Sensitiv",
      "Spielerisch",
    ],
  },
  ANKLAEGER: {
    label: "Ankläger / Strenge Eltern",
    color: "#DC2626",
    defaultImg: "/anklaeger.png",
    desc: "Kritisch, strafend, fordernd – ohne Verdammnis transformieren.",
    subpoints: [
      "Kritisch",
      "Strafend",
      "Überfordernd",
      "Fordernd",
      "Introjekt",
      "Modell",
    ],
  },
  JESUS: {
    label: "Jesus – Hohepriester / Gnadenstuhl",
    color: "#059669",
    defaultImg: "/jesus.png",
    desc: "Liebe, Wahrheit, Gnade, Trost, Hoffnung, Verwandlung.",
    subpoints: [
      "Liebe",
      "Wahrheit",
      "Gnade",
      "Trost",
      "Hoffnung",
      "Verwandlung",
    ],
  },
  COPING: {
    label: "Bewältigungsstrategien",
    color: "#8B5CF6",
    defaultImg: "/coping.png",
    desc: "Unterwerfung, Vermeidung, Selbstberuhigung, Überkompensation …",
    subpoints: [
      "Unterwerfung",
      "Vermeidung",
      "Selbstberuhigung",
      "Überkompensation",
      "Perfektionismus",
      "Rückzug",
    ],
  },
};

// ------- Deine zuletzt genutzten Standardwerte (aus Screenshots) -------

const DEFAULTS: Record<RoleKey, NodeState> = {
  JESUS: {
    x: 296,
    y: 166,
    cardScale: 0.56,
    imgScale: 0.93,
    imgOffX: -1,
    imgOffY: -23,
    textSize: 15,
    textOffX: 0,
    menuOpen: false,
    selectedSub: null,
  },
  ANKLAEGER: {
    x: 93,
    y: 414,
    cardScale: 0.44,
    imgScale: 0.98,
    imgOffX: 0,
    imgOffY: -18,
    textSize: 15,
    textOffX: 0,
    menuOpen: false,
    selectedSub: null,
  },
  KIND: {
    x: 296,
    y: 391,
    cardScale: 0.58,
    imgScale: 1.04,
    imgOffX: 1,
    imgOffY: -11,
    textSize: 15,
    textOffX: 0,
    menuOpen: false,
    selectedSub: null,
  },
  ICH: {
    x: 500,
    y: 408,
    cardScale: 0.42,
    imgScale: 1.0,
    imgOffX: 0,
    imgOffY: -10,
    textSize: 15,
    textOffX: -10,
    menuOpen: false,
    selectedSub: null,
  },
  COPING: {
    x: 296,
    y: 611,
    cardScale: 0.4,
    imgScale: 1.08,
    imgOffX: -1,
    imgOffY: -8,
    textSize: 12,
    textOffX: -15,
    menuOpen: false,
    selectedSub: null,
  },
};

// ----------------------------------------------------------------------

export default function App() {
  const [active, setActive] = useState<RoleKey>("JESUS");

  // Karten-Zustände starten mit deinen Defaults
  const [nodes, setNodes] = useState<Record<RoleKey, NodeState>>({
    ICH: { ...DEFAULTS.ICH },
    KIND: { ...DEFAULTS.KIND },
    ANKLAEGER: { ...DEFAULTS.ANKLAEGER },
    JESUS: { ...DEFAULTS.JESUS },
    COPING: { ...DEFAULTS.COPING },
  });

  // Bildquellen (dauerhaft /public)
  const [imgSrc, setImgSrc] = useState<Record<RoleKey, string>>({
    ICH: ROLES.ICH.defaultImg,
    KIND: ROLES.KIND.defaultImg,
    ANKLAEGER: ROLES.ANKLAEGER.defaultImg,
    JESUS: ROLES.JESUS.defaultImg,
    COPING: ROLES.COPING.defaultImg,
  });

  const meta = useMemo(() => ROLES[active], [active]);
  const st = nodes[active];

  const setNode = (k: RoleKey, patch: Partial<NodeState>) =>
    setNodes((prev) => ({ ...prev, [k]: { ...prev[k], ...patch } }));

  const toggleMenu = (k: RoleKey) =>
    setNodes((prev) => {
      const next = { ...prev };
      (Object.keys(next) as RoleKey[]).forEach((rk) => {
        next[rk] = {
          ...next[rk],
          menuOpen: rk === k ? !prev[k].menuOpen : false,
        };
      });
      return next;
    });

  const onPickFile = (role: RoleKey, f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () =>
      setImgSrc((s) => ({ ...s, [role]: String(reader.result || "") }));
    reader.readAsDataURL(f); // Data-URL zeigt zuverlässig an
  };

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, Arial",
        padding: 16,
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          textAlign: "center",
          margin: 0,
        }}
      >
        Modus-Board – fünf Bilder frei anordnen
      </h1>
      <div
        style={{ textAlign: "center", color: "#6B7280", margin: "6px 0 14px" }}
      >
        Klick auf eine Karte zum Aktivieren. (•••) öffnet 6 Unterpunkte.
      </div>

      {/* Bühne */}
      <div
        style={{
          position: "relative",
          width: STAGE_W,
          height: STAGE_H,
          margin: "0 auto",
          border: "1px dashed #E5E7EB",
          borderRadius: 12,
          background: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {(Object.keys(ROLES) as RoleKey[]).map((role) => {
          const m = ROLES[role];
          const s = nodes[role];
          const isActive = active === role;

          const cardW = CARD_W * s.cardScale;
          const cardH = CARD_H * s.cardScale;
          const imgBox = IMG_BOX * s.cardScale;

          return (
            <div
              key={role}
              onClick={() => {
                setActive(role);
                // Beim Aktivieren andere Menüs schließen (dieses bleibt wie es ist)
                setNodes((prev) => {
                  const n = { ...prev };
                  (Object.keys(n) as RoleKey[]).forEach((rk) => {
                    if (rk !== role) n[rk] = { ...n[rk], menuOpen: false };
                  });
                  return n;
                });
              }}
              title={m.label}
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                transform: "translate(-50%, -50%)",
                width: cardW,
                height: cardH + 44,
                borderRadius: 16,
                background: "#FFF",
                border: isActive ? `3px solid ${m.color}` : "2px solid #CBD5E1",
                boxShadow: isActive
                  ? `0 12px 24px rgba(0,0,0,0.14), 0 0 0 4px ${hexToRgba(
                      m.color,
                      0.1
                    )}`
                  : "0 8px 18px rgba(0,0,0,0.08)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {/* Kopfzeile – nur Menü rechts */}
              <div
                style={{
                  height: 34,
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  borderBottom: "1px solid #F1F5F9",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    toggleMenu(role);
                  }}
                  title="Unterpunkte"
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 18,
                    lineHeight: 1,
                    padding: "2px 4px",
                    cursor: "pointer",
                  }}
                >
                  •••
                </button>
              </div>

              {/* Bildfläche */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: cardH - 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "visible",
                }}
              >
                <img
                  src={imgSrc[role]}
                  alt={m.label}
                  style={{
                    width: imgBox,
                    height: imgBox,
                    objectFit: "contain",
                    transform: `translate(${s.imgOffX}px, ${s.imgOffY}px) scale(${s.imgScale})`,
                  }}
                  onError={(e) => (e.currentTarget.style.opacity = "0")}
                />

                {/* Dropdown-Menü */}
                {s.menuOpen && (
                  <div
                    onClick={(ev) => ev.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      minWidth: 180,
                      background: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: 10,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                      padding: 6,
                      zIndex: 5,
                    }}
                  >
                    {m.subpoints.map((sp, idx) => {
                      const selected = s.selectedSub === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            setNode(role, { selectedSub: idx, menuOpen: false })
                          }
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            background: selected
                              ? hexToRgba(m.color, 0.12)
                              : "transparent",
                            color: "#111827",
                            border: "none",
                            padding: "8px 10px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          {sp}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Label (nur unten) */}
              <div
                style={{
                  position: "absolute",
                  left: cardW / 2 + s.textOffX,
                  bottom: 6,
                  transform: "translate(-50%, 0)",
                  fontSize: s.textSize,
                  fontWeight: 700,
                  color: isActive ? m.color : "#374151",
                  pointerEvents: "none",
                  lineHeight: 1.12,
                  textAlign: "center",
                  whiteSpace: "normal",
                  width: "90%",
                }}
              >
                {m.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel */}
      <div
        style={{
          marginTop: 14,
          padding: 12,
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          background: "#F3F4F6",
        }}
      >
        <div style={{ fontWeight: 700, color: meta.color }}>
          Aktiv: {meta.label}
          {st.selectedSub != null ? ` — ${meta.subpoints[st.selectedSub]}` : ""}
        </div>

        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {/* Position & Größe */}
          <Group title="Position & Gesamtgröße">
            <Range
              label="X"
              min={0}
              max={STAGE_W}
              value={st.x}
              onChange={(v) => setNode(active, { x: v })}
            />
            <Range
              label="Y"
              min={0}
              max={STAGE_H}
              value={st.y}
              onChange={(v) => setNode(active, { y: v })}
            />
            <Range
              label="Elementgröße"
              min={0.4}
              max={1.4}
              step={0.01}
              value={st.cardScale}
              onChange={(v) => setNode(active, { cardScale: v })}
            />
          </Group>

          {/* Bild */}
          <Group title="Bild – Größe & Position">
            <Range
              label="Bildgröße"
              min={0.6}
              max={1.6}
              step={0.01}
              value={st.imgScale}
              onChange={(v) => setNode(active, { imgScale: v })}
            />
            <Range
              label="Bild X"
              min={-150}
              max={150}
              value={st.imgOffX}
              onChange={(v) => setNode(active, { imgOffX: v })}
            />
            <Range
              label="Bild Y"
              min={-150}
              max={150}
              value={st.imgOffY}
              onChange={(v) => setNode(active, { imgOffY: v })}
            />
          </Group>

          {/* Label */}
          <Group title="Label – Größe & X-Position">
            <Range
              label="Textgröße"
              min={12}
              max={28}
              value={st.textSize}
              onChange={(v) => setNode(active, { textSize: v })}
            />
            <Range
              label="Text X"
              min={-200}
              max={200}
              value={st.textOffX}
              onChange={(v) => setNode(active, { textOffX: v })}
            />
          </Group>

          {/* Bildquelle */}
          <Group title="Bildquelle">
            <div style={{ display: "grid", gap: 8 }}>
              <input
                type="text"
                value={imgSrc[active]}
                onChange={(e) =>
                  setImgSrc((s) => ({ ...s, [active]: e.target.value }))
                }
                placeholder="/jesus.png oder https://…"
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                }}
              />
              <input
                key={active} // reset beim Rollenwechsel
                type="file"
                accept="image/*"
                onChange={(e) =>
                  onPickFile(active, e.target.files?.[0] ?? null)
                }
              />
              <div style={{ fontSize: 12, color: "#64748B" }}>
                Für dauerhaft: Dateien in <code>/public</code> (z. B.{" "}
                <code>/kind.png</code>) und oben den Pfad eintragen.
              </div>
            </div>
          </Group>
        </div>

        <div style={{ color: "#374151", marginTop: 8 }}>{meta.desc}</div>
      </div>
    </div>
  );
}

/* ---------- UI-Helfer ---------- */

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#FFF",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#0F172A" }}>
        {title}
      </div>
      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </div>
  );
}

function Range({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr 70px",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ color: "#334155" }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span style={{ fontVariantNumeric: "tabular-nums", color: "#0F172A" }}>
        {value}
      </span>
    </label>
  );
}

/* ---------- Utility ---------- */
function hexToRgba(hex: string, alpha = 1) {
  const m = hex.replace("#", "");
  const n = parseInt(m, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

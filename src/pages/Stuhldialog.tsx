import { useMemo, useState } from "react";

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
  cardScale: number;
  imgScale: number;
  imgOffX: number;
  imgOffY: number;
  textSize: number;
  textOffX: number;
  menuOpen: boolean;
  selectedSub: number | null;
};

const STAGE_W = 1100;
const STAGE_H = 700;
const CARD_W = 280;
const CARD_H = 280;
const IMG_BOX = 220;

const asset = (file: string) => `/stuhldialog/${file}`;

const ROLES: Record<RoleKey, RoleMeta> = {
  ICH: {
    label: "Ich / Erwachsener",
    color: "#EAB308",
    defaultImg: asset("erwachsener.png"),
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
    defaultImg: asset("kind.png"),
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
    defaultImg: asset("anklaeger.png"),
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
    defaultImg: asset("jesus.png"),
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
    defaultImg: asset("coping.png"),
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
    imgScale: 1,
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

export default function Stuhldialog() {
  const [active, setActive] = useState<RoleKey>("JESUS");

  const [nodes, setNodes] = useState<Record<RoleKey, NodeState>>({
    ICH: { ...DEFAULTS.ICH },
    KIND: { ...DEFAULTS.KIND },
    ANKLAEGER: { ...DEFAULTS.ANKLAEGER },
    JESUS: { ...DEFAULTS.JESUS },
    COPING: { ...DEFAULTS.COPING },
  });

  const [imgSrc, setImgSrc] = useState<Record<RoleKey, string>>({
    ICH: ROLES.ICH.defaultImg,
    KIND: ROLES.KIND.defaultImg,
    ANKLAEGER: ROLES.ANKLAEGER.defaultImg,
    JESUS: ROLES.JESUS.defaultImg,
    COPING: ROLES.COPING.defaultImg,
  });

  const meta = useMemo(() => ROLES[active], [active]);
  const state = nodes[active];

  const setNode = (key: RoleKey, patch: Partial<NodeState>) => {
    setNodes((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const toggleMenu = (key: RoleKey) => {
    setNodes((prev) => {
      const next = { ...prev };
      (Object.keys(next) as RoleKey[]).forEach((role) => {
        next[role] = {
          ...next[role],
          menuOpen: role === key ? !prev[key].menuOpen : false,
        };
      });
      return next;
    });
  };

  const onPickFile = (role: RoleKey, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc((prev) => ({ ...prev, [role]: String(reader.result ?? "") }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <main
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
      <div style={{ textAlign: "center", color: "#6B7280", margin: "6px 0 14px" }}>
        Klick auf eine Karte zum Aktivieren. (•••) öffnet 6 Unterpunkte.
      </div>

      <section
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
          const info = ROLES[role];
          const node = nodes[role];
          const isActive = active === role;

          const cardW = CARD_W * node.cardScale;
          const cardH = CARD_H * node.cardScale;
          const imgBox = IMG_BOX * node.cardScale;

          return (
            <article
              key={role}
              onClick={() => {
                setActive(role);
                setNodes((prev) => {
                  const next = { ...prev };
                  (Object.keys(next) as RoleKey[]).forEach((rk) => {
                    if (rk !== role) next[rk] = { ...next[rk], menuOpen: false };
                  });
                  return next;
                });
              }}
              title={info.label}
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                transform: "translate(-50%, -50%)",
                width: cardW,
                height: cardH + 44,
                borderRadius: 16,
                background: "#FFF",
                border: isActive ? `3px solid ${info.color}` : "2px solid #CBD5E1",
                boxShadow: isActive
                  ? `0 12px 24px rgba(0,0,0,0.14), 0 0 0 4px ${hexToRgba(info.color, 0.1)}`
                  : "0 8px 18px rgba(0,0,0,0.08)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <header
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
                  onClick={(event) => {
                    event.stopPropagation();
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
              </header>

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
                  alt={info.label}
                  style={{
                    width: imgBox,
                    height: imgBox,
                    objectFit: "contain",
                    transform: `translate(${node.imgOffX}px, ${node.imgOffY}px) scale(${node.imgScale})`,
                  }}
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />

                {node.menuOpen && (
                  <menu
                    onClick={(event) => event.stopPropagation()}
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
                    {info.subpoints.map((point, idx) => {
                      const selected = node.selectedSub === idx;
                      return (
                        <button
                          key={point}
                          onClick={() => setNode(role, { selectedSub: idx, menuOpen: false })}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            background: selected ? hexToRgba(info.color, 0.12) : "transparent",
                            color: "#111827",
                            border: "none",
                            padding: "8px 10px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          {point}
                        </button>
                      );
                    })}
                  </menu>
                )}
              </div>

              <footer
                style={{
                  position: "absolute",
                  left: cardW / 2 + node.textOffX,
                  bottom: 6,
                  transform: "translate(-50%, 0)",
                  fontSize: node.textSize,
                  fontWeight: 700,
                  color: isActive ? info.color : "#374151",
                  pointerEvents: "none",
                  lineHeight: 1.12,
                  textAlign: "center",
                  whiteSpace: "normal",
                  width: "90%",
                }}
              >
                {info.label}
              </footer>
            </article>
          );
        })}
      </section>

      <section
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
          {state.selectedSub != null ? ` — ${meta.subpoints[state.selectedSub]}` : ""}
        </div>

        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          <Group title="Position & Gesamtgröße">
            <Range label="X" min={0} max={STAGE_W} value={state.x} onChange={(value) => setNode(active, { x: value })} />
            <Range label="Y" min={0} max={STAGE_H} value={state.y} onChange={(value) => setNode(active, { y: value })} />
            <Range
              label="Elementgröße"
              min={0.4}
              max={1.4}
              step={0.01}
              value={state.cardScale}
              onChange={(value) => setNode(active, { cardScale: value })}
            />
          </Group>

          <Group title="Bild – Größe & Position">
            <Range
              label="Bildgröße"
              min={0.6}
              max={1.6}
              step={0.01}
              value={state.imgScale}
              onChange={(value) => setNode(active, { imgScale: value })}
            />
            <Range
              label="Bild X"
              min={-150}
              max={150}
              value={state.imgOffX}
              onChange={(value) => setNode(active, { imgOffX: value })}
            />
            <Range
              label="Bild Y"
              min={-150}
              max={150}
              value={state.imgOffY}
              onChange={(value) => setNode(active, { imgOffY: value })}
            />
          </Group>

          <Group title="Label – Größe & X-Position">
            <Range
              label="Textgröße"
              min={12}
              max={28}
              value={state.textSize}
              onChange={(value) => setNode(active, { textSize: value })}
            />
            <Range
              label="Text X"
              min={-200}
              max={200}
              value={state.textOffX}
              onChange={(value) => setNode(active, { textOffX: value })}
            />
          </Group>

          <Group title="Bildquelle">
            <div style={{ display: "grid", gap: 8 }}>
              <input
                type="text"
                value={imgSrc[active]}
                onChange={(event) =>
                  setImgSrc((prev) => ({ ...prev, [active]: event.target.value }))
                }
                placeholder="/stuhldialog/jesus.png oder https://…"
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                }}
              />
              <input
                key={active}
                type="file"
                accept="image/*"
                onChange={(event) => onPickFile(active, event.target.files?.[0] ?? null)}
              />
              <div style={{ fontSize: 12, color: "#64748B" }}>
                Für dauerhaft: Dateien in <code>/stuhldialog</code> oder eigene URLs verwenden.
              </div>
            </div>
          </Group>
        </div>

        <p style={{ color: "#374151", marginTop: 8 }}>{meta.desc}</p>
      </section>
    </main>
  );
}

type GroupProps = {
  title: string;
  children: React.ReactNode;
};

function Group({ title, children }: GroupProps) {
  return (
    <div
      style={{
        background: "#FFF",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#0F172A" }}>{title}</div>
      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </div>
  );
}

type RangeProps = {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
};

function Range({ label, min, max, value, step = 1, onChange }: RangeProps) {
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
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span style={{ fontVariantNumeric: "tabular-nums", color: "#0F172A" }}>{value}</span>
    </label>
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

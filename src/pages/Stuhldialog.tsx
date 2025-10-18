import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { presetDialogues, type PresetKey } from "../data/stuhldialogPreset";

type RoleKey = "ICH" | "KIND" | "ANKLAEGER" | "JESUS" | "COPING";

type RoleMeta = {
  label: string;
  color: string;
  defaultImg: string;
};

type ChatEntry = {
  id: string;
  role: RoleKey;
  text: string;
  ts: number;
};

type MeditationEntry = {
  ts?: number;
  f?: string;
  n?: string;
  j?: string;
  o?: string;
  draft?: boolean;
};

const asset = (file: string) => `/stuhldialog/${file}`;

const ROLES: Record<RoleKey, RoleMeta> = {
  JESUS: {
    label: "Jesus – Hohepriester / Gnadenstuhl",
    color: "#059669",
    defaultImg: asset("jesus.png"),
  },
  ANKLAEGER: {
    label: "Ankläger / Strenge Eltern",
    color: "#DC2626",
    defaultImg: asset("anklaeger.png"),
  },
  KIND: {
    label: "Inneres Kind & Bedürfnisse",
    color: "#2563EB",
    defaultImg: asset("kind.png"),
  },
  ICH: {
    label: "Ich / Erwachsener",
    color: "#EAB308",
    defaultImg: asset("erwachsener.png"),
  },
  COPING: {
    label: "Bewältigungsstrategien",
    color: "#8B5CF6",
    defaultImg: asset("coping.png"),
  },
};

const ROLE_VOICE_SETTINGS: Record<RoleKey, { lang: string; pitch: number; rate: number }> = {
  JESUS: { lang: "de-DE", pitch: 0.9, rate: 0.95 },
  ANKLAEGER: { lang: "de-DE", pitch: 0.85, rate: 1.05 },
  KIND: { lang: "de-DE", pitch: 1.2, rate: 1.05 },
  ICH: { lang: "de-DE", pitch: 1.0, rate: 1.0 },
  COPING: { lang: "de-DE", pitch: 1.0, rate: 1.05 },
};

const GRID_POSITIONS: Record<RoleKey, { row: number; column: number }> = {
  JESUS: { row: 1, column: 2 },
  ANKLAEGER: { row: 2, column: 1 },
  KIND: { row: 2, column: 2 },
  ICH: { row: 2, column: 3 },
  COPING: { row: 3, column: 2 },
};

const CARD_WIDTH = 210;
const GRID_COLUMN_GAP = 48;
const GRID_ROW_GAP = 56;
const CHAT_STORAGE_KEY = "stuhldialog_chat_entries";
const NBJ_STORAGE_KEY = "nbj_entries";

export default function Stuhldialog() {
  const [active, setActive] = useState<RoleKey | null>(null);
  const [draft, setDraft] = useState("");
  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("angst");
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((entry) => entry && typeof entry.text === "string");
    } catch {
      return [];
    }
  });
  const [meditations, setMeditations] = useState<MeditationEntry[]>([]);

  const loadMeditations = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(NBJ_STORAGE_KEY);
      if (!raw) {
        setMeditations([]);
        return;
      }
      const entries = JSON.parse(raw);
      if (!Array.isArray(entries)) {
        setMeditations([]);
        return;
      }
      const filtered = (entries as MeditationEntry[]).filter((entry) => entry && !entry.draft);
      setMeditations(filtered);
    } catch {
      setMeditations([]);
    }
  }, []);

  useEffect(() => {
    loadMeditations();
    if (typeof window === "undefined") return;
    const handler = (event: StorageEvent) => {
      if (event.key === NBJ_STORAGE_KEY) {
        loadMeditations();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [loadMeditations]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatEntries));
  }, [chatEntries]);

  const handleSubmit = () => {
    if (!active) return;
    const text = draft.trim();
    if (!text) return;
    const entry: ChatEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: active,
      text,
      ts: Date.now(),
    };
    setChatEntries((prev) => [entry, ...prev]);
    setDraft("");
    setActive(null);
  };

  const handleCancel = () => {
    setDraft("");
    setActive(null);
  };

  const activeRole = active ? ROLES[active] : null;
  const isSubmitDisabled = !activeRole || draft.trim().length === 0;

  const presetOptions = useMemo(
    () => Object.entries(presetDialogues) as Array<[PresetKey, (typeof presetDialogues)[PresetKey]]>,
    []
  );

  useEffect(() => {
    if (!presetDialogues[selectedPreset] && presetOptions.length > 0) {
      setSelectedPreset(presetOptions[0][0]);
    }
  }, [selectedPreset, presetOptions]);

  const currentPreset = presetDialogues[selectedPreset];

  const presetEntries = useMemo<ChatEntry[]>(() => {
    if (!currentPreset) return [];
    const base = Date.now();
    const { entries } = currentPreset;
    return entries.map((entry, index) => ({
      id: entry.id,
      role: entry.role,
      text: entry.text,
      ts: base - (entries.length - index) * 60_000,
    }));
  }, [currentPreset]);

  const dictationSupported =
    typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const speechSynthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const recognitionRef = useRef<any>(null);
  const dictationBaseRef = useRef<string>("");
  const [isDictating, setIsDictating] = useState(false);

  useEffect(() => {
    if (!dictationSupported || typeof window === "undefined") return;
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setDraft(dictationBaseRef.current + transcript.trim());
    };
    recognition.onend = () => setIsDictating(false);
    recognition.onerror = () => setIsDictating(false);
    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, [dictationSupported]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  const toggleDictation = useCallback(() => {
    if (!dictationSupported) return;
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (!isDictating) {
      const trimmed = draft.trim();
      dictationBaseRef.current = trimmed.length > 0 ? `${trimmed} ` : "";
      try {
        recognition.start();
        setIsDictating(true);
      } catch {
        /* ignore */
      }
    } else {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    }
  }, [dictationSupported, draft, isDictating]);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  useEffect(() => {
    if (!speechSynthesisSupported || typeof window === "undefined") return;
    const synth = window.speechSynthesis as any;
    const loadVoices = () => {
      const voices: SpeechSynthesisVoice[] = synth.getVoices?.() ?? [];
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    loadVoices();
    if (typeof synth.addEventListener === "function") {
      synth.addEventListener("voiceschanged", loadVoices);
      return () => synth.removeEventListener("voiceschanged", loadVoices);
    }
    const original = synth.onvoiceschanged;
    synth.onvoiceschanged = loadVoices;
    return () => {
      synth.onvoiceschanged = original;
    };
  }, [speechSynthesisSupported]);

  const speakEntry = useCallback(
    (entry: ChatEntry) => {
      if (!speechSynthesisSupported || typeof window === "undefined" || !entry.text) return;
      const synth = window.speechSynthesis;
      const settings = ROLE_VOICE_SETTINGS[entry.role];
      const voice =
        availableVoices.find((v) =>
          v.lang?.toLowerCase().startsWith(settings.lang.toLowerCase())
        ) ??
        availableVoices.find((v) => v.lang?.toLowerCase().startsWith("de")) ??
        availableVoices[0];

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(entry.text);
      utterance.lang = settings.lang;
      utterance.pitch = settings.pitch;
      utterance.rate = settings.rate;
      if (voice) {
        utterance.voice = voice;
      }
      synth.speak(utterance);
    },
    [availableVoices, speechSynthesisSupported]
  );

  const visibleEntries = activeTab === "preset" ? presetEntries : chatEntries;

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
        Wähle eine Karte und schreibe einen Modus-Dialog – oder nutze den Beispiel-Verlauf.
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
              onClick={() => setActive((prev) => (prev === role ? null : role))}
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "12px auto 14px",
        }}
      >
      <div
        style={{
          display: "inline-flex",
          borderRadius: 14,
          background: "#E2E8F0",
          padding: 4,
          gap: 4,
        }}
      >
        <button
          onClick={() => setActiveTab("preset")}
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background: activeTab === "preset" ? "#1D4ED8" : "transparent",
            color: activeTab === "preset" ? "#FFF" : "#1E293B",
          }}
        >
          Beispiel
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background: activeTab === "custom" ? "#1D4ED8" : "transparent",
            color: activeTab === "custom" ? "#FFF" : "#1E293B",
          }}
        >
          Eigenen Dialog erstellen
        </button>
      </div>

        {activeTab === "preset" && (
          <select
            value={selectedPreset}
            onChange={(event) => setSelectedPreset(event.target.value as PresetKey)}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid #CBD5E1",
              background: "#FFF",
              fontSize: 14,
              minWidth: 220,
            }}
          >
            {presetOptions.map(([key, config]) => (
              <option value={key} key={key}>
                {config.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {activeTab === "custom" && (
        <section
          style={{
            marginTop: 10,
            padding: 16,
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
          }}
        >
          {activeRole ? (
            <div style={{ display: "flex", gap: 16, width: "100%", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: `3px solid ${activeRole.color}`,
                  background: "#F8FAFC",
                }}
              >
                <img
                  src={activeRole.defaultImg}
                  alt={activeRole.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontWeight: 700, color: activeRole.color }}>{activeRole.label}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Schreibe hier, was dieser Modus sagt oder fühlt…"
                    style={{
                      border: `2px solid ${activeRole.color}`,
                      borderRadius: 12,
                      padding: 12,
                      minHeight: 110,
                      fontSize: 15,
                      lineHeight: 1.4,
                      outline: "none",
                      resize: "vertical",
                      flex: 1,
                    }}
                  />
                  <button
                    onClick={toggleDictation}
                    disabled={!dictationSupported}
                    style={{
                      width: 48,
                      borderRadius: 12,
                      border: "1px solid #CBD5E1",
                      background: dictationSupported
                        ? isDictating
                          ? "#FDE68A"
                          : "#FFF"
                        : "#E2E8F0",
                      cursor: dictationSupported ? "pointer" : "not-allowed",
                      fontSize: 18,
                    }}
                    title={
                      dictationSupported
                        ? isDictating
                          ? "Diktat beenden"
                          : "Per Mikrofon diktieren"
                        : "Spracherkennung wird nicht unterstützt"
                    }
                    aria-pressed={isDictating}
                  >
                    {isDictating ? "■" : "🎤"}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      border: "1px solid #CBD5E1",
                      background: "#F1F5F9",
                      cursor: "pointer",
                    }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 10,
                      border: "none",
                      background: isSubmitDisabled ? "#CBD5E1" : activeRole.color,
                      color: "#FFF",
                      cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      transition: "background 0.2s ease",
                    }}
                  >
                    Speichern
                  </button>
                </div>
                {dictationSupported ? (
                  <div style={{ color: "#64748B", fontSize: 12 }}>
                    {isDictating
                      ? "Diktat läuft … tippe erneut auf das Mikrofon, um zu stoppen."
                      : "Klicke auf das Mikrofon, um zu diktieren."}
                  </div>
                ) : (
                  <div style={{ color: "#94A3B8", fontSize: 12 }}>
                    Spracherkennung wird von deinem Browser nicht unterstützt.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", width: "100%", color: "#64748B" }}>
              Wähle eine Karte aus, um eine Nachricht zu verfassen.
            </div>
          )}
        </section>
      )}

      <section
        style={{
          marginTop: 18,
          padding: 16,
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          background: "#FFFFFF",
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 700, color: "#0F172A" }}>
          {activeTab === "preset"
            ? `Beispiel – ${currentPreset?.label ?? "Auswahl"}`
            : "Verlauf"}
        </div>
        {visibleEntries.length === 0 ? (
          <p style={{ color: "#64748B", margin: 0 }}>Noch keine Einträge gespeichert.</p>
        ) : (
          visibleEntries.map((entry) => {
            const info = ROLES[entry.role];
            return (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: 12,
                  borderRadius: 12,
                  border:
                    activeSpeechId === entry.id ? `1px solid ${info.color}` : "1px solid #E2E8F0",
                  background: activeSpeechId === entry.id ? "#DBEAFE" : "#F8FAFC",
                  boxShadow:
                    activeSpeechId === entry.id ? `0 0 0 3px ${hexToRgba(info.color, 0.18)}` : "none",
                  transition: "background 0.2s ease, box-shadow 0.2s ease, border 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `3px solid ${info.color}`,
                    flexShrink: 0,
                    background: "#FFF",
                  }}
                >
                  <img
                    src={info.defaultImg}
                    alt={info.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: info.color }}>{info.label}</span>
                    {speechSynthesisSupported && (
                      <button
                        onClick={() => speakEntry(entry)}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: 20,
                          lineHeight: 1,
                          padding: 4,
                        }}
                        title="Vorlesen"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                  <p style={{ margin: "6px 0 4px", whiteSpace: "pre-wrap", color: "#1F2937" }}>{entry.text}</p>
                  <div style={{ color: "#94A3B8", fontSize: 12 }}>{new Date(entry.ts).toLocaleString()}</div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {activeTab === "custom" && (
        <section
          style={{
            marginTop: 18,
            padding: 16,
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            background: "#FFF9F4",
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 700, color: "#DC2626" }}>Meditationen</div>
          {meditations.length === 0 ? (
            <p style={{ color: "#64748B", margin: 0 }}>Noch keine Meditationseinträge gespeichert.</p>
          ) : (
            meditations.map((entry) => (
              <div
                key={entry.ts ?? Math.random()}
                style={{
                  border: "1px solid #FECACA",
                  borderRadius: 12,
                  padding: 12,
                  background: "#FFF",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ color: "#DC2626", fontWeight: 600 }}>
                  {entry.ts ? new Date(entry.ts).toLocaleString() : "Entwurf"}
                </div>
                <div style={{ color: "#1F2937", whiteSpace: "pre-wrap" }}>
                  <strong>Gefühl(e):</strong> {entry.f?.trim() || "—"}
                </div>
                <div style={{ color: "#1F2937", whiteSpace: "pre-wrap" }}>
                  <strong>Bedürfnis(se):</strong> {entry.n?.trim() || "—"}
                </div>
                <div style={{ color: "#1F2937", whiteSpace: "pre-wrap" }}>
                  <strong>Mit Jesus erlebt:</strong> {entry.j?.trim() || "—"}
                </div>
                {entry.o?.trim() ? (
                  <div style={{ color: "#1F2937", whiteSpace: "pre-wrap" }}>
                    <strong>Weitere Notizen:</strong> {entry.o.trim()}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </section>
      )}
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

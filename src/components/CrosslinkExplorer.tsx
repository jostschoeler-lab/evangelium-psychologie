import React, { useEffect, useMemo, useState } from "react";

const arrowByDirection: Record<string, string> = {
  outgoing: "→",
  incoming: "←",
};

type ViewState = "index" | "detail";

type CrosslinkDirection = "outgoing" | "incoming";

type Crosslink = {
  targetId: string;
  targetTitle: string;
  snippet: string;
  bridge: string;
  direction: CrosslinkDirection;
};

type Concept = {
  id: string;
  title: string;
  summary: string;
  crosslinks: Crosslink[];
};

const conceptsCsvUrl = new URL(
  "../../crosslinks/evangelium psychologie crosslinks - konsepter.csv",
  import.meta.url,
).href;

const crosslinksCsvUrl = new URL(
  "../../crosslinks/evangelium psychologie crosslinks - crosslinks.csv",
  import.meta.url,
).href;

type ConceptsCsvRow = {
  id: string;
  Tittel: string;
  Content: string;
};

type CrosslinksCsvRow = {
  "fra concept id": string;
  "til concept id": string;
  Bridge: string;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      currentRow.push(field);
      rows.push(currentRow);
      currentRow = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || currentRow.length > 0) {
    currentRow.push(field);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0));
}

function parseCsvToObjects<T>(text: string): T[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] ?? "";
    });
    return obj as T;
  });
}

function buildConcepts(conceptRows: ConceptsCsvRow[], crosslinkRows: CrosslinksCsvRow[]): Concept[] {
  const map = new Map<string, Concept>();

  conceptRows.forEach((row) => {
    const id = row.id.trim();
    map.set(id, {
      id,
      title: row.Tittel.trim(),
      summary: row.Content.trim(),
      crosslinks: [],
    });
  });

  crosslinkRows.forEach((row) => {
    const sourceId = row["fra concept id"]?.trim();
    const targetId = row["til concept id"]?.trim();
    if (!sourceId || !targetId) return;
    const bridge = row.Bridge?.trim() ?? "";
    const source = map.get(sourceId);
    const target = map.get(targetId);
    if (!source || !target) return;

    source.crosslinks.push({
      targetId: target.id,
      targetTitle: target.title,
      snippet: target.summary,
      bridge,
      direction: "outgoing",
    });

    target.crosslinks.push({
      targetId: source.id,
      targetTitle: source.title,
      snippet: source.summary,
      bridge,
      direction: "incoming",
    });
  });

  return conceptRows
    .map((row) => map.get(row.id.trim()))
    .filter((concept): concept is Concept => Boolean(concept));
}

export default function CrosslinkExplorer() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>("index");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [conceptCsvText, crosslinkCsvText] = await Promise.all([
          fetch(conceptsCsvUrl).then((res) => {
            if (!res.ok) throw new Error(`Konzepte CSV fehlgeschlagen (${res.status})`);
            return res.text();
          }),
          fetch(crosslinksCsvUrl).then((res) => {
            if (!res.ok) throw new Error(`Crosslinks CSV fehlgeschlagen (${res.status})`);
            return res.text();
          }),
        ]);

        const conceptRows = parseCsvToObjects<ConceptsCsvRow>(conceptCsvText);
        const crosslinkRows = parseCsvToObjects<CrosslinksCsvRow>(crosslinkCsvText);
        const builtConcepts = buildConcepts(conceptRows, crosslinkRows);

        if (isMounted) {
          setConcepts(builtConcepts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unbekannter Fehler beim Laden der CSV-Daten.");
          setConcepts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeId && !concepts.some((concept) => concept.id === activeId)) {
      setActiveId(null);
      setView("index");
    }
  }, [activeId, concepts]);

  const conceptMap = useMemo(() => {
    const map: Record<string, Concept> = {};
    concepts.forEach((concept) => {
      map[concept.id] = concept;
    });
    return map;
  }, [concepts]);

  const activeConcept = useMemo(() => {
    if (!activeId) return null;
    return conceptMap[activeId] ?? null;
  }, [activeId, conceptMap]);

  const handleSelect = (conceptId: string) => {
    setActiveId(conceptId);
    setView("detail");
  };

  const handleBack = () => {
    setView("index");
    setActiveId(null);
  };

  if (loading) {
    return <p style={{ marginTop: 12 }}>Lade Konzepte …</p>;
  }

  if (error) {
    return (
      <div style={{ marginTop: 12, color: "#b91c1c" }}>
        Fehler beim Laden der Crosslink-Daten: {error}
      </div>
    );
  }

  if (!concepts.length) {
    return <p style={{ marginTop: 12 }}>Keine Konzepte hinterlegt.</p>;
  }

  if (view === "index") {
    return (
      <div style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 16px" }}>Alle Konzepte</h2>
        <p style={{ margin: "0 0 18px", color: "#4b5563", lineHeight: 1.5 }}>
          <strong>Aktualisierung der Daten:</strong> Öffne die Google-Tabelle&nbsp;
          <a
            href="https://docs.google.com/spreadsheets/d/1BCLE5Y-pUMQ1cQ0ecuTBGZGBJkl0V0-jC5brHUCUBvw/edit?gid=274408047#gid=274408047"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#1d4ed8" }}
          >
            hier
          </a>
          . Lade dort im Reiter <em>„konsepter“</em> über <em>Datei → Herunterladen → Kommagetrennte Werte (.csv)</em> die Datei herunter,
          lade sie hoch und ersetze im Projektordner <code>crosslinks</code> die bestehende Datei. Wiederhole denselben Schritt für den
          Reiter <em>„crosslinks“</em> (ebenfalls als CSV herunterladen, hochladen und im Ordner ersetzen).
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
          {concepts.map((concept) => (
            <li
              key={concept.id}
              style={{
                border: "1px solid #d4def2",
                borderRadius: 12,
                padding: "18px 20px",
                background: "#ffffff",
                boxShadow: "0 6px 14px rgba(21, 61, 111, 0.06)",
              }}
            >
              <button
                type="button"
                onClick={() => handleSelect(concept.id)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "block",
                  color: "#1f2937",
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700 }}>{concept.title}</div>
                <div style={{ marginTop: 6, color: "#4b5563" }}>{concept.summary}</div>
                <div style={{ marginTop: 12, fontWeight: 600, color: "#1f5fd1" }}>
                  {concept.crosslinks.length} Crosslink(s)
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          style={{
            border: "none",
            background: "none",
            color: "#1f5fd1",
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span aria-hidden>←</span>
          Zurück zur Übersicht
        </button>

        {activeConcept && (
          <div style={{ fontWeight: 600, color: "#475569" }}>
            {activeConcept.crosslinks.length} Crosslink(s)
          </div>
        )}
      </div>

      {activeConcept ? (
        <section
          style={{
            border: "1px solid #d4def2",
            borderRadius: 12,
            padding: "18px 20px",
            background: "#ffffff",
            boxShadow: "0 8px 16px rgba(21, 61, 111, 0.08)",
            maxWidth: 900,
          }}
        >
          <header>
            <h2 style={{ margin: 0 }}>{activeConcept.title}</h2>
              <p style={{ margin: "8px 0 0", color: "#4a5568" }}>{activeConcept.summary}</p>
          </header>

          <div style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 8 }}>Crosslinks</h3>
            {activeConcept.crosslinks.length === 0 ? (
              <p style={{ margin: 0, color: "#6b7280" }}>Keine weiteren Crosslinks verknüpft.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {activeConcept.crosslinks.map((link, index) => (
                  <li
                    key={`${activeConcept.id}-${link.targetId}-${link.direction}-${index}`}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                      padding: "12px 14px",
                      marginBottom: 12,
                      background: "#f8fafc",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {arrowByDirection[link.direction] ?? "↔"}
                      </span>
                      <div>
                        <a
                          href={`#${link.targetId}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            handleSelect(link.targetId);
                          }}
                          style={{ fontWeight: 700, color: "#1d4ed8", textDecoration: "none" }}
                        >
                          {link.targetTitle}
                        </a>
                        <div style={{ color: "#4b5563", marginTop: 4, fontStyle: "italic" }}>{link.snippet}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        padding: "10px 12px",
                        background: "#eef2ff",
                        borderRadius: 8,
                        color: "#1f2937",
                        fontWeight: 500,
                      }}
                    >
                      {link.bridge}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <p style={{ marginTop: 12 }}>Bitte ein Konzept auswählen.</p>
      )}
    </div>
  );
}

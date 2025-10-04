import React from "react";
import UnifiedEditor from "../components/UnifiedEditor";

export default function EpEditorPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Bibel ↔ Psychologie – Unified Editor</h1>
      <div style={{background:"#e6fffb",border:"1px solid #00b8a9",padding:8,margin:"8px 0"}}>
        *** MARKER B: EpEditorPage aktiv ***
      </div>
      <UnifiedEditor />
    </div>
  );
}

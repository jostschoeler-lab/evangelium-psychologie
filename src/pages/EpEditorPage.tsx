import React from "react";
import UnifiedEditor from "../components/UnifiedEditor";

export default function EpEditorPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Bibel ↔ Psychologie – Unified Editor</h1>
      <UnifiedEditor />
    </div>
  );
}

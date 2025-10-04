import React from "react";
import { useEpEntries } from "../hooks/useEpEntries";
import EpEntryForm from "../components/EpEntryForm";

export default function EpEditorPage() {
  const { items, create, save, remove } = useEpEntries();

  return (
    <div style={{maxWidth:900, margin:"0 auto", padding:16}}>
      <h1>Bibel ↔ Psychologie – Neuer Editor (EP)</h1>
      <div style={{margin:"12px 0"}}>
        <button onClick={create}>+ Neuer Eintrag</button>
      </div>

      {items.length === 0 && <div>Noch keine Einträge. Klicke auf „Neuer Eintrag“.</div>}

      {items.map(e => (
        <EpEntryForm
          key={e.id}
          value={e}
          onChange={save}
          onDelete={() => remove(e.id)}
        />
      ))}
    </div>
  );
}

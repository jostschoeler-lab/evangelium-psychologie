import { useNavigate } from "react-router-dom";
import UnifiedEditor from "../components/UnifiedEditor";
import EpEntryForm from "../components/EpEntryForm";

export default function EP() {
  const nav = useNavigate();
  return (
    <div style={{padding:12}}>
      <button onClick={()=>nav("/")}>&larr; Zurück</button>
      <div style={{marginTop:12}}>
        {/* Wähle eins von beiden, je nach Bedarf */}
        <UnifiedEditor />
        {/* oder: <EpEntryForm /> */}
      </div>
    </div>
  );
}

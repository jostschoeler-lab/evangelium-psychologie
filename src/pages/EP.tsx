import { useNavigate } from "react-router-dom";
import CrosslinkExplorer from "../components/CrosslinkExplorer";

export default function EP() {
  const nav = useNavigate();
  return (
    <div style={{padding:12}}>
      <button onClick={()=>nav("/")}>&larr; Zurück</button>
      <div style={{marginTop:12}}>
        <h1 style={{ margin: "0 0 12px" }}>Crosslink Explorer (EP)</h1>
        <p style={{ maxWidth: 720, margin: "0 0 16px", color: "#4b5563" }}>
          Durchstöbere Bibelstellen, psychologische Begriffe und ihre Brückentexte in einem kompakten Überblick.
        </p>
        <CrosslinkExplorer />
      </div>
    </div>
  );
}

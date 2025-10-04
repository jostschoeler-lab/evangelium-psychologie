import { useNavigate } from "react-router-dom";

export default function Menu() {
  const nav = useNavigate();
  return (
    <div style={{maxWidth:920, margin:"24px auto", padding:"16px"}}>
      <h1>NBJ – Suite</h1>
      <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:12}}>
        <button onClick={()=>nav("/nbj")} style={{padding:"10px 16px", fontWeight:700}}>
          Meditation (NBJ)
        </button>
        <button onClick={()=>nav("/ep")} style={{padding:"10px 16px", fontWeight:700}}>
          Formular / Bibliothek (EP)
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function NBJ() {
  const nav = useNavigate();
  return (
    <div style={{height:"100vh", display:"flex", flexDirection:"column"}}>
      <div style={{padding:8, borderBottom:"1px solid #ddd"}}>
        <button onClick={()=>nav("/")}>&larr; Zurück</button>
      </div>
      <iframe
        src="/nbj/index.html"
        title="NBJ"
        style={{flex:"1 1 auto", width:"100%", border:0}}
      />
    </div>
  );
}

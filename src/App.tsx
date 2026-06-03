import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./pages/Menu";
import NBJ from "./pages/NBJ";
import Spannungsmodell from "./pages/Spannungsmodell";
import Bibliothek from "./pages/Bibliothek";
import EP from "./pages/EP";
import Stuhldialog from "./pages/Stuhldialog";
import RepressionOrTransformation from "./pages/RepressionOrTransformation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/nbj/*" element={<NBJ />} />
      <Route path="/spannungsmodell" element={<Spannungsmodell />} />
      <Route path="/Bedürfnisse" element={<Bibliothek />} />
      <Route path="/ep" element={<EP />} />
      <Route path="/stuhldialog" element={<Stuhldialog />} />
      <Route path="/repression-or-transformation" element={<RepressionOrTransformation />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

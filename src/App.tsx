import { HashRouter, Routes, Route } from "react-router-dom";

// Seiten importieren
import Menu from "./pages/Menu";
import NBJ from "./pages/NBJ";
import EP from "./pages/EP";
import Spannungsmodell from "./pages/Spannungsmodell";
import Stuhldialog from "./pages/Stuhldialog";
import Bibliothek from "./pages/Bibliothek";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Startmenü */}
        <Route path="/" element={<Menu />} />

        {/* Module */}
        <Route path="/nbj" element={<NBJ />} />
        <Route path="/ep" element={<EP />} />
        <Route path="/spannungsmodell" element={<Spannungsmodell />} />
        <Route path="/stuhldialog" element={<Stuhldialog />} />
        <Route path="/bibliothek" element={<Bibliothek />} />
      </Routes>
    </HashRouter>
  );
}

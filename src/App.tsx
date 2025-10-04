import { HashRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import NBJ from "./pages/NBJ";
import EP from "./pages/EP";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/nbj" element={<NBJ />} />
        <Route path="/ep" element={<EP />} />
      </Routes>
    </HashRouter>
  );
}

import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/comun/Header";
import EstadoOffline from "./components/comun/EstadoOffline";
import NavInferior from "./components/comun/NavInferior";
import ListaCatalogo from "./components/catalogo/ListaCatalogo";
import FichaEspecie from "./components/ficha/FichaEspecie";
import CapturaFoto from "./components/identificar-foto/CapturaFoto";
import ListaAvistamientos from "./components/avistamientos/ListaAvistamientos";
import MapaEstatico from "./components/mapa/MapaEstatico";
import SeccionEcosistema from "./components/ecosistema/SeccionEcosistema";

export default function App() {
  return (
    <HashRouter>
      <EstadoOffline />
      <Header titulo="Delta del Azul Explorer" subtitulo="Flora y fauna del Parque Nacional Lago Puelo" />
      <Routes>
        <Route path="/" element={<ListaCatalogo />} />
        <Route path="/especie/:id" element={<FichaEspecie />} />
        <Route path="/foto" element={<CapturaFoto />} />
        <Route path="/avistamientos" element={<ListaAvistamientos />} />
        <Route path="/mapa" element={<MapaEstatico />} />
        <Route path="/ecosistema" element={<SeccionEcosistema />} />
      </Routes>
      <NavInferior />
    </HashRouter>
  );
}

import { useState } from "react";
import Buscador from "../buscador/Buscador";
import FiltrosCatalogo from "./FiltrosCatalogo";
import TarjetaEspecie from "./TarjetaEspecie";
import { useCatalogo } from "../../hooks/useCatalogo";

export default function ListaCatalogo() {
  const { especies, categoria, setCategoria, ecosistema, setEcosistema, texto, setTexto } =
    useCatalogo();

  return (
    <div className="pantalla">
      <Buscador valor={texto} onChange={setTexto} />
      <FiltrosCatalogo
        categoria={categoria}
        setCategoria={setCategoria}
        ecosistema={ecosistema}
        setEcosistema={setEcosistema}
      />
      <p style={{ color: "#666", fontSize: "0.85rem" }}>{especies.length} especies</p>
      {especies.map((e) => (
        <TarjetaEspecie key={e.id} especie={e} />
      ))}
      {especies.length === 0 && <p>No encontramos especies con esos filtros.</p>}
    </div>
  );
}

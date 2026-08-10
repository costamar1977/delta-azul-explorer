import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarAvistamientos } from "./dexieDB";
import { obtenerEspeciePorId } from "../../hooks/useCatalogo";

export default function ListaAvistamientos() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    listarAvistamientos().then(setItems);
  }, []);

  return (
    <div className="pantalla">
      <h2>Mis avistamientos</h2>
      <p style={{ color: "#666", fontSize: "0.9rem" }}>
        Se guardan solo en este celular, no se suben a ningún servidor.
      </p>
      {items.length === 0 && <p>Todavía no marcaste ninguna especie. Andá a una ficha y tocá "Marcar como avistada".</p>}
      {items
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .map((item) => {
          const especie = obtenerEspeciePorId(item.especieId);
          if (!especie) return null;
          return (
            <Link key={item.especieId} to={`/especie/${especie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="tarjeta">
                <div style={{ fontWeight: 700 }}>{especie.nombreComun}</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  Avistada el {new Date(item.fecha).toLocaleDateString("es-AR")}
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}

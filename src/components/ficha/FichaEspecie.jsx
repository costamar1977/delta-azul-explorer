import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerEspeciePorId } from "../../hooks/useCatalogo";
import { marcarAvistamiento, estaAvistada } from "../avistamientos/dexieDB";

export default function FichaEspecie() {
  const { id } = useParams();
  const especie = obtenerEspeciePorId(id);
  const [avistada, setAvistada] = useState(false);

  useEffect(() => {
    if (especie) estaAvistada(especie.id).then(setAvistada);
  }, [especie]);

  if (!especie) {
    return (
      <div className="pantalla">
        <p>No encontramos esa especie.</p>
        <Link to="/">Volver al catálogo</Link>
      </div>
    );
  }

  async function toggleAvistamiento() {
    const marcado = await marcarAvistamiento(especie.id);
    setAvistada(marcado);
  }

  return (
    <div className="pantalla">
      <Link to="/" style={{ fontSize: "0.9rem" }}>
        ← Volver al catálogo
      </Link>

      <div
        style={{
          height: 180,
          background: "var(--color-borde)",
          borderRadius: "var(--radio)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "12px 0",
          color: "#888",
        }}
      >
        Foto pendiente: {especie.fotoUrl}
      </div>

      <h2 style={{ margin: "0 0 2px" }}>{especie.nombreComun}</h2>
      <p style={{ fontStyle: "italic", color: "#666", margin: "0 0 10px" }}>
        {especie.nombreCientifico} · {especie.familia}
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <span className="etiqueta">{especie.categoria}</span>
        {especie.indicadoraDe && (
          <span className={especie.indicadoraDe === "valdiviano" ? "etiqueta valdiviano" : "etiqueta"}>
            indicadora: {especie.indicadoraDe}
          </span>
        )}
        {especie.estadoConservacion && (
          <span className="etiqueta" style={{ background: "var(--color-alerta)" }}>
            {especie.estadoConservacion}
          </span>
        )}
      </div>

      <p>{especie.descripcionBreve}</p>

      <h3>Cómo reconocerla</h3>
      <ul>
        {especie.rasgosDistintivos.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h3>Dónde es probable verla</h3>
      <p>{especie.habitat.join(", ")}</p>
      <p style={{ color: "#666", fontSize: "0.9rem" }}>Temporada: {especie.temporada}</p>

      <button className="boton-grande" style={{ width: "100%", marginTop: 16 }} onClick={toggleAvistamiento}>
        {avistada ? "✅ Marcada como avistada — tocá para quitar" : "Marcar como avistada"}
      </button>
    </div>
  );
}

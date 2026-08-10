import { Link } from "react-router-dom";
import especies from "../../data/especies.json";

function buscarEnCatalogo(nombreCientifico) {
  if (!nombreCientifico) return null;
  return especies.find((e) =>
    e.nombreCientifico.toLowerCase().includes(nombreCientifico.toLowerCase().split(" ")[0])
  );
}

export default function ResultadoIA({ resultados, fuente }) {
  if (!resultados || resultados.length === 0) {
    return <p>No pudimos sugerir ninguna especie para esta foto. Probá con el catálogo manual.</p>;
  }

  return (
    <div>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Sugerencias de {fuente === "plantnet" ? "Pl@ntNet" : "iNaturalist"} — no es una identificación
        certera, es una ayuda para guiarte en el catálogo.
      </p>
      {resultados.map((r, i) => {
        const especieLocal = buscarEnCatalogo(r.nombreCientifico);
        return (
          <div key={i} className="tarjeta">
            <div style={{ fontWeight: 700 }}>{r.nombreComun || r.nombreCientifico}</div>
            <div style={{ fontStyle: "italic", fontSize: "0.85rem", color: "#666" }}>
              {r.nombreCientifico}
            </div>
            {r.score && (
              <div style={{ fontSize: "0.8rem", color: "#888" }}>
                Confianza aproximada: {Math.round(r.score * 100)}%
              </div>
            )}
            {especieLocal ? (
              <Link to={`/especie/${especieLocal.id}`} className="boton-grande secundario" style={{ marginTop: 8, display: "inline-block" }}>
                Ver ficha en el catálogo
              </Link>
            ) : (
              <p style={{ fontSize: "0.8rem", color: "#888" }}>
                No está en el catálogo local del camping todavía.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

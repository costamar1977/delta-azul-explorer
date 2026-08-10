import { Link } from "react-router-dom";

export default function TarjetaEspecie({ especie }) {
  return (
    <Link to={`/especie/${especie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="tarjeta" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            background: "var(--color-borde)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
          }}
          aria-hidden
        >
          {iconoPorCategoria(especie.categoria)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>{especie.nombreComun}</div>
          <div style={{ fontSize: "0.82rem", fontStyle: "italic", color: "#666" }}>
            {especie.nombreCientifico}
          </div>
          {especie.indicadoraDe === "valdiviano" && (
            <span className="etiqueta valdiviano" style={{ marginTop: 4 }}>
              indicadora valdiviana
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function iconoPorCategoria(categoria) {
  switch (categoria) {
    case "arbol":
      return "🌳";
    case "arbusto":
      return "🌿";
    case "planta":
      return "🌱";
    case "ave":
      return "🐦";
    case "mamifero":
      return "🦊";
    default:
      return "🔎";
  }
}

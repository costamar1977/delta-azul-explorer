import puntos from "../../data/puntos-mapa.json";
import { obtenerEspeciePorId } from "../../hooks/useCatalogo";
import { useState } from "react";

export default function MapaEstatico() {
  const [seleccionado, setSeleccionado] = useState(null);
  const punto = puntos.find((p) => p.id === seleccionado);

  return (
    <div className="pantalla">
      <h2>Mapa del camping</h2>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Tocá un punto para ver qué especies es más probable encontrar ahí.
      </p>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          background: "var(--color-borde)",
          borderRadius: "var(--radio)",
          overflow: "hidden",
        }}
      >
        {/* Reemplazar el fondo por /mapa-camping.png cuando esté disponible */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: "0.85rem",
            padding: 8,
            textAlign: "center",
          }}
        >
          Imagen del mapa pendiente (public/mapa-camping.png)
        </div>
        {puntos.map((p) => (
          <button
            key={p.id}
            onClick={() => setSeleccionado(p.id)}
            title={p.nombre}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: "translate(-50%, -50%)",
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "3px solid white",
              background: "var(--color-acento)",
              boxShadow: "var(--sombra)",
            }}
          />
        ))}
      </div>

      {punto && (
        <div className="tarjeta" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700 }}>{punto.nombre}</div>
          {punto.especiesFrecuentes.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "#666" }}>Punto de referencia general.</p>
          ) : (
            <ul>
              {punto.especiesFrecuentes.map((id) => {
                const e = obtenerEspeciePorId(id);
                return e ? <li key={id}>{e.nombreComun}</li> : null;
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

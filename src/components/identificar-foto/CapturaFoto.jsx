import { useState } from "react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { identificarFlora, plantNetDisponible } from "./clientePlantNet";
import { identificarFauna, inaturalistDisponible } from "./clienteINaturalist";
import ResultadoIA from "./ResultadoIA";

export default function CapturaFoto() {
  const online = useOnlineStatus();
  const [tipo, setTipo] = useState("flora"); // flora | fauna
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  async function manejarArchivo(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setError(null);
    setResultados(null);
    setCargando(true);
    try {
      const res = tipo === "flora" ? await identificarFlora(archivo) : await identificarFauna(archivo);
      setResultados(res);
    } catch (err) {
      if (err.message === "MODO_DEMO_SIN_API_KEY") {
        setError(
          "Esta función todavía no tiene la API key configurada (ver README). Por ahora usá el catálogo manual."
        );
      } else {
        setError("No pudimos consultar el servicio de identificación. Probá de nuevo o usá el catálogo.");
      }
    } finally {
      setCargando(false);
    }
  }

  const disponible = tipo === "flora" ? plantNetDisponible() : inaturalistDisponible();

  return (
    <div className="pantalla">
      <h2>Identificar por foto</h2>

      {!online && (
        <p style={{ color: "var(--color-alerta)" }}>
          Sin señal ahora mismo — esta función necesita conexión. Usá el catálogo mientras tanto.
        </p>
      )}

      <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
        <button
          className={tipo === "flora" ? "boton-grande" : "boton-grande secundario"}
          onClick={() => setTipo("flora")}
        >
          🌳 Planta / árbol
        </button>
        <button
          className={tipo === "fauna" ? "boton-grande" : "boton-grande secundario"}
          onClick={() => setTipo("fauna")}
        >
          🦊 Animal / ave
        </button>
      </div>

      {!disponible && (
        <p style={{ fontSize: "0.85rem", color: "#888" }}>
          Modo demo: todavía no está configurada la API key de {tipo === "flora" ? "Pl@ntNet" : "iNaturalist"}.
        </p>
      )}

      <label className="boton-grande" style={{ width: "100%", display: "block", textAlign: "center" }}>
        📷 Sacar o subir foto
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={manejarArchivo}
          disabled={!online}
          style={{ display: "none" }}
        />
      </label>

      {cargando && <p>Analizando la foto...</p>}
      {error && <p style={{ color: "var(--color-alerta)" }}>{error}</p>}
      {resultados && <ResultadoIA resultados={resultados} fuente={tipo === "flora" ? "plantnet" : "inaturalist"} />}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { identificarFlora, plantNetDisponible } from "./clientePlantNet";
import { identificarFauna, inaturalistDisponible } from "./clienteINaturalist";
import ResultadoIA from "./ResultadoIA";

/**
 * IMPORTANTE: en el celular, si usamos <input type="file" capture> para sacar
 * la foto, el navegador abre la app de Cámara del sistema y deja la pestaña
 * en segundo plano. En muchos Android eso hace que el navegador "mate" la
 * pestaña para liberar memoria, y al volver la app se recarga desde cero,
 * perdiendo el estado (por eso mandaba de nuevo al catálogo sin resultado).
 *
 * Para evitar ese problema, la cámara en vivo se abre DENTRO de la página
 * con getUserMedia — nunca se sale de la app, así que no hay riesgo de que
 * el sistema operativo la recargue. Queda "Elegir de la galería" como
 * alternativa para fotos ya sacadas antes.
 */
export default function CapturaFoto() {
  const online = useOnlineStatus();
  const [tipo, setTipo] = useState("flora"); // flora | fauna
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => detenerCamara();
  }, []);

  async function activarCamara() {
    setErrorCamara(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCamaraActiva(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setErrorCamara(
        "No pudimos acceder a la cámara (¿le diste permiso al navegador?). Probá con 'Elegir de la galería'."
      );
    }
  }

  function detenerCamara() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamaraActiva(false);
  }

  function sacarFoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        detenerCamara();
        if (blob) analizarImagen(blob);
      },
      "image/jpeg",
      0.9
    );
  }

  function manejarArchivoGaleria(e) {
    const archivo = e.target.files?.[0];
    if (archivo) analizarImagen(archivo);
  }

  async function analizarImagen(archivo) {
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
          onClick={() => {
            setTipo("flora");
            detenerCamara();
          }}
        >
          🌳 Planta / árbol
        </button>
        <button
          className={tipo === "fauna" ? "boton-grande" : "boton-grande secundario"}
          onClick={() => {
            setTipo("fauna");
            detenerCamara();
          }}
        >
          🦊 Animal / ave
        </button>
      </div>

      {!disponible && (
        <p style={{ fontSize: "0.85rem", color: "#888" }}>
          Modo demo: todavía no está configurada la API key de {tipo === "flora" ? "Pl@ntNet" : "iNaturalist"}.
        </p>
      )}

      {camaraActiva ? (
        <div>
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ width: "100%", borderRadius: "var(--radio)", background: "#000" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="boton-grande" style={{ flex: 1 }} onClick={sacarFoto} disabled={!online}>
              📸 Sacar foto
            </button>
            <button className="boton-grande secundario" onClick={detenerCamara}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="boton-grande" onClick={activarCamara} disabled={!online}>
            📷 Usar la cámara
          </button>
          <label className="boton-grande secundario" style={{ textAlign: "center" }}>
            🖼️ Elegir de la galería
            <input
              type="file"
              accept="image/*"
              onChange={manejarArchivoGaleria}
              disabled={!online}
              style={{ display: "none" }}
            />
          </label>
          {errorCamara && <p style={{ color: "var(--color-alerta)", fontSize: "0.85rem" }}>{errorCamara}</p>}
        </div>
      )}

      {cargando && <p>Analizando la foto...</p>}
      {error && <p style={{ color: "var(--color-alerta)" }}>{error}</p>}
      {resultados && <ResultadoIA resultados={resultados} fuente={tipo === "flora" ? "plantnet" : "inaturalist"} />}
    </div>
  );
}

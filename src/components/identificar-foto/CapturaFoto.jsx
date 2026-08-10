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
 * con getUserMedia — nunca se sale de la app. El botón de disparo va
 * SUPERPUESTO sobre el video (dentro de un contenedor de altura fija), como
 * una app de cámara real, para que nunca dependa de cuánto mida la pantalla
 * ni de cuánto contenido haya arriba — así no puede quedar "empujado" fuera
 * de vista por la barra de navegación inferior ni nada por el estilo.
 */
export default function CapturaFoto() {
  const online = useOnlineStatus();
  const [tipo, setTipo] = useState("flora"); // flora | fauna
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [errorCamara, setErrorCamara] = useState(null);
  const [organo, setOrgano] = useState("leaf");

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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamaraActiva(true);
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
      const res = tipo === "flora" ? await identificarFlora(archivo, organo) : await identificarFauna(archivo);
      setResultados(res);
    } catch (err) {
      if (err.message === "MODO_DEMO_SIN_API_KEY") {
        setError(
          "Esta función todavía no tiene la API key configurada (ver README). Por ahora usá el catálogo manual."
        );
      } else {
        // TEMPORAL: mostramos el detalle técnico en pantalla para
        // diagnosticar por qué falla en producción. Sacar esto después.
        setError(
          `No pudimos consultar el servicio de identificación. Detalle técnico (mandale una captura a Claude): ${err.message}`
        );
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

      {tipo === "flora" && !camaraActiva && (
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 6px" }}>
            ¿Qué parte de la planta vas a fotografiar?
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { valor: "leaf", etiqueta: "Hoja" },
              { valor: "flower", etiqueta: "Flor" },
              { valor: "fruit", etiqueta: "Fruto" },
              { valor: "bark", etiqueta: "Corteza" },
              { valor: "habit", etiqueta: "Planta entera" },
            ].map((o) => (
              <button
                key={o.valor}
                onClick={() => setOrgano(o.valor)}
                className={organo === o.valor ? "boton-grande" : "boton-grande secundario"}
                style={{ padding: "6px 12px", fontSize: "0.8rem" }}
              >
                {o.etiqueta}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenedor de altura FIJA (no depende del alto natural del video ni
          de cuánto contenido haya arriba). Los botones van superpuestos
          adentro, así siempre están a la vista sin scrollear. */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: camaraActiva ? "min(65vh, 480px)" : 0,
          borderRadius: "var(--radio)",
          overflow: "hidden",
          background: "#000",
          transition: "height 0.15s ease",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: camaraActiva ? "block" : "none",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {camaraActiva && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 12px calc(14px + env(safe-area-inset-bottom, 0px))",
              background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
            }}
          >
            <button
              onClick={sacarFoto}
              disabled={!online}
              aria-label="Sacar foto"
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                border: "4px solid white",
                background: "var(--color-acento)",
                fontSize: "1.6rem",
              }}
            >
              📸
            </button>
            <button
              onClick={detenerCamara}
              style={{
                position: "absolute",
                right: 14,
                bottom: 22,
                padding: "8px 14px",
                borderRadius: 999,
                border: "none",
                background: "rgba(255,255,255,0.9)",
                color: "var(--color-primario)",
                fontWeight: 600,
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {!camaraActiva && (
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

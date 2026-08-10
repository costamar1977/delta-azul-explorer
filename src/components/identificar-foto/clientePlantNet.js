/**
 * Cliente para Pl@ntNet API (identificación de flora).
 * Requiere una API key gratuita para uso limitado/sin fines de lucro:
 * pedirla en https://my.plantnet.org/  (hay que escribirles describiendo
 * el uso del camping para confirmar que califica para el tier gratuito).
 *
 * La key se lee de una variable de entorno de Vite: VITE_PLANTNET_API_KEY
 * Si no está configurada, la función devuelve null y la UI cae a "modo demo".
 *
 * IMPORTANTE: la API de Pl@ntNet NO acepta "auto" como órgano — hay que
 * indicar qué parte de la planta se fotografió. Valores válidos:
 * leaf, flower, fruit, bark, habit, branch, seed, bud, other.
 * (ver https://docs.plantnet.org/en/reference/organs)
 */
const PLANTNET_API_KEY = import.meta.env.VITE_PLANTNET_API_KEY;
const PLANTNET_PROYECTO = "all"; // proyecto genérico de Pl@ntNet, cubre flora sudamericana

export function plantNetDisponible() {
  return Boolean(PLANTNET_API_KEY);
}

export async function identificarFlora(archivoImagen, organo = "leaf") {
  if (!PLANTNET_API_KEY) {
    throw new Error("MODO_DEMO_SIN_API_KEY");
  }

  const formData = new FormData();
  formData.append("images", archivoImagen);
  formData.append("organs", organo);

  const url = `https://my-api.plantnet.org/v2/identify/${PLANTNET_PROYECTO}?api-key=${PLANTNET_API_KEY}&lang=es`;

  let respuesta;
  try {
    respuesta = await fetch(url, { method: "POST", body: formData });
  } catch (errorRed) {
    // fetch no llegó a completarse: problema de red, o el navegador lo
    // bloqueó (ej. CORS). Esto NO es un error que devuelva Pl@ntNet.
    console.error("Pl@ntNet: fallo de red/CORS", errorRed);
    const detalle = new Error(
      `ERROR_RED: ${errorRed.message || "no se pudo conectar con Pl@ntNet"}`
    );
    detalle.tipoError = "red";
    throw detalle;
  }

  if (!respuesta.ok) {
    const textoError = await respuesta.text().catch(() => "");
    console.error("Pl@ntNet error HTTP", respuesta.status, textoError);
    const detalle = new Error(
      `ERROR_HTTP: Pl@ntNet respondió ${respuesta.status} — ${textoError.slice(0, 200)}`
    );
    detalle.tipoError = "http";
    detalle.status = respuesta.status;
    throw detalle;
  }

  const datos = await respuesta.json();

  return (datos.results || []).slice(0, 3).map((r) => ({
    nombreCientifico: r.species?.scientificNameWithoutAuthor,
    nombreComun: r.species?.commonNames?.[0],
    score: r.score,
  }));
}

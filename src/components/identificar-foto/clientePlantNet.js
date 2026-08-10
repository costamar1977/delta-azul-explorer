/**
 * Cliente para Pl@ntNet API (identificación de flora).
 * Requiere una API key gratuita para uso limitado/sin fines de lucro:
 * pedirla en https://my.plantnet.org/  (hay que escribirles describiendo
 * el uso del camping para confirmar que califica para el tier gratuito).
 *
 * La key se lee de una variable de entorno de Vite: VITE_PLANTNET_API_KEY
 * Si no está configurada, la función devuelve null y la UI cae a "modo demo".
 */
const PLANTNET_API_KEY = import.meta.env.VITE_PLANTNET_API_KEY;
const PLANTNET_PROYECTO = "all"; // proyecto genérico de Pl@ntNet, cubre flora sudamericana

export function plantNetDisponible() {
  return Boolean(PLANTNET_API_KEY);
}

export async function identificarFlora(archivoImagen) {
  if (!PLANTNET_API_KEY) {
    throw new Error("MODO_DEMO_SIN_API_KEY");
  }

  const formData = new FormData();
  formData.append("images", archivoImagen);
  formData.append("organs", "auto");

  const url = `https://my-api.plantnet.org/v2/identify/${PLANTNET_PROYECTO}?api-key=${PLANTNET_API_KEY}&lang=es`;

  const respuesta = await fetch(url, { method: "POST", body: formData });
  if (!respuesta.ok) {
    throw new Error(`Pl@ntNet respondió ${respuesta.status}`);
  }
  const datos = await respuesta.json();

  // Nos quedamos con los primeros 3 resultados, normalizados
  return (datos.results || []).slice(0, 3).map((r) => ({
    nombreCientifico: r.species?.scientificNameWithoutAuthor,
    nombreComun: r.species?.commonNames?.[0],
    score: r.score,
  }));
}

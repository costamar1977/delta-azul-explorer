/**
 * Cliente para el endpoint de sugerencias de iNaturalist Computer Vision.
 * Es gratuito para apps de terceros en modo inferencia (no entrenamiento),
 * con límite blando de ~60 req/min y 10.000/día. Requiere token de acceso
 * de un usuario de iNaturalist (OAuth) — ver README para el paso a paso.
 * Hay que atribuir "Identificación asistida por iNaturalist" en la UI,
 * como se hace en ResultadoIA.jsx.
 *
 * La key se lee de VITE_INATURALIST_TOKEN. Si no está configurada,
 * la función devuelve null y la UI cae a "modo demo".
 */
const INAT_TOKEN = import.meta.env.VITE_INATURALIST_TOKEN;

export function inaturalistDisponible() {
  return Boolean(INAT_TOKEN);
}

export async function identificarFauna(archivoImagen) {
  if (!INAT_TOKEN) {
    throw new Error("MODO_DEMO_SIN_API_KEY");
  }

  const formData = new FormData();
  formData.append("image", archivoImagen);

  const respuesta = await fetch("https://api.inaturalist.org/v1/computervision/score_image", {
    method: "POST",
    headers: { Authorization: `Bearer ${INAT_TOKEN}` },
    body: formData,
  });
  if (!respuesta.ok) {
    throw new Error(`iNaturalist respondió ${respuesta.status}`);
  }
  const datos = await respuesta.json();

  return (datos.results || []).slice(0, 3).map((r) => ({
    nombreCientifico: r.taxon?.name,
    nombreComun: r.taxon?.preferred_common_name,
    score: r.combined_score ? r.combined_score / 100 : null,
  }));
}

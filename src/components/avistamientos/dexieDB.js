import Dexie from "dexie";

/**
 * Base local (IndexedDB vía Dexie) solo para datos generados por el usuario:
 * avistamientos marcados y favoritos. El catálogo de especies NO vive acá:
 * es JSON estático embebido y cacheado por el service worker.
 */
export const db = new Dexie("deltaAzulExplorer");

db.version(1).stores({
  avistamientos: "especieId, fecha",
});

export async function marcarAvistamiento(especieId) {
  const existente = await db.avistamientos.get(especieId);
  if (existente) {
    await db.avistamientos.delete(especieId);
    return false; // se desmarcó
  }
  await db.avistamientos.add({ especieId, fecha: new Date().toISOString() });
  return true; // se marcó
}

export async function estaAvistada(especieId) {
  const existente = await db.avistamientos.get(especieId);
  return !!existente;
}

export async function listarAvistamientos() {
  return db.avistamientos.toArray();
}

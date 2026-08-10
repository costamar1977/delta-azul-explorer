import { useMemo, useState } from "react";
import especies from "../data/especies.json";

/**
 * Catálogo en memoria (viene embebido en el bundle y precacheado por el
 * service worker, así que funciona 100% offline sin necesidad de IndexedDB).
 * Expone filtros simples por categoría, ecosistema y texto de búsqueda.
 */
export function useCatalogo() {
  const [categoria, setCategoria] = useState("todas");
  const [ecosistema, setEcosistema] = useState("todos");
  const [texto, setTexto] = useState("");

  const resultado = useMemo(() => {
    return especies.filter((e) => {
      if (categoria !== "todas" && e.categoria !== categoria) return false;
      if (ecosistema !== "todos" && e.ecosistema !== ecosistema && e.ecosistema !== "ambos") {
        return false;
      }
      if (texto.trim()) {
        const t = texto.trim().toLowerCase();
        const enNombre = e.nombreComun.toLowerCase().includes(t);
        const enCientifico = e.nombreCientifico.toLowerCase().includes(t);
        if (!enNombre && !enCientifico) return false;
      }
      return true;
    });
  }, [categoria, ecosistema, texto]);

  return {
    especies: resultado,
    todas: especies,
    categoria,
    setCategoria,
    ecosistema,
    setEcosistema,
    texto,
    setTexto,
  };
}

export function obtenerEspeciePorId(id) {
  return especies.find((e) => e.id === id) || null;
}

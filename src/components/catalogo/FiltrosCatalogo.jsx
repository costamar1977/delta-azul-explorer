const CATEGORIAS = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "arbol", etiqueta: "Árboles" },
  { valor: "arbusto", etiqueta: "Arbustos" },
  { valor: "planta", etiqueta: "Plantas" },
  { valor: "ave", etiqueta: "Aves" },
  { valor: "mamifero", etiqueta: "Mamíferos" },
  { valor: "otro", etiqueta: "Otros" },
];

const ECOSISTEMAS = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "andino-patagonico", etiqueta: "Andino-patagónico" },
  { valor: "valdiviano", etiqueta: "Selva valdiviana" },
];

export default function FiltrosCatalogo({ categoria, setCategoria, ecosistema, setEcosistema }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
        {CATEGORIAS.map((c) => (
          <button
            key={c.valor}
            onClick={() => setCategoria(c.valor)}
            className={categoria === c.valor ? "boton-grande" : "boton-grande secundario"}
            style={{ padding: "8px 14px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
          >
            {c.etiqueta}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6, overflowX: "auto" }}>
        {ECOSISTEMAS.map((e) => (
          <button
            key={e.valor}
            onClick={() => setEcosistema(e.valor)}
            className={ecosistema === e.valor ? "boton-grande" : "boton-grande secundario"}
            style={{ padding: "6px 12px", fontSize: "0.78rem", whiteSpace: "nowrap" }}
          >
            {e.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}

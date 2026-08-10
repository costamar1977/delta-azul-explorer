export default function Buscador({ valor, onChange }) {
  return (
    <input
      type="search"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar por nombre común o científico..."
      style={{
        width: "100%",
        padding: "12px 14px",
        borderRadius: "var(--radio)",
        border: "1px solid var(--color-borde)",
        fontSize: "1rem",
        marginBottom: "10px",
      }}
    />
  );
}

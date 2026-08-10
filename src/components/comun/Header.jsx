export default function Header({ titulo, subtitulo }) {
  return (
    <header style={{ padding: "18px 16px 10px", textAlign: "center" }}>
      <h1 style={{ margin: 0, fontSize: "1.4rem", color: "var(--color-primario)" }}>{titulo}</h1>
      {subtitulo && <p style={{ margin: "4px 0 0", color: "#555" }}>{subtitulo}</p>}
    </header>
  );
}

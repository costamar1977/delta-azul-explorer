import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Catálogo", icon: "🌿" },
  { to: "/foto", label: "Foto", icon: "📷" },
  { to: "/avistamientos", label: "Mis avistamientos", icon: "✅" },
  { to: "/mapa", label: "Mapa", icon: "🗺️" },
  { to: "/ecosistema", label: "Ecosistema", icon: "ℹ️" },
];

export default function NavInferior() {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "var(--color-superficie)",
        borderTop: "1px solid var(--color-borde)",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            flex: 1,
            textAlign: "center",
            padding: "8px 4px",
            fontSize: "0.72rem",
            textDecoration: "none",
            color: isActive ? "var(--color-primario)" : "#777",
            fontWeight: isActive ? 700 : 400,
          })}
        >
          <div style={{ fontSize: "1.2rem" }}>{item.icon}</div>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

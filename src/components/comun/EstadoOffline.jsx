import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export default function EstadoOffline() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      style={{
        background: "var(--color-alerta)",
        color: "white",
        textAlign: "center",
        padding: "8px 12px",
        fontSize: "0.9rem",
      }}
    >
      Sin señal — estás viendo el catálogo offline. El modo foto con IA no está disponible ahora.
    </div>
  );
}

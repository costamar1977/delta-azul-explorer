import { useEffect, useState } from "react";

/**
 * Hook simple que refleja el estado de conexión del navegador.
 * Se usa para mostrar el banner offline y para deshabilitar el modo foto con IA.
 */
export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const marcarOnline = () => setOnline(true);
    const marcarOffline = () => setOnline(false);
    window.addEventListener("online", marcarOnline);
    window.addEventListener("offline", marcarOffline);
    return () => {
      window.removeEventListener("online", marcarOnline);
      window.removeEventListener("offline", marcarOffline);
    };
  }, []);

  return online;
}

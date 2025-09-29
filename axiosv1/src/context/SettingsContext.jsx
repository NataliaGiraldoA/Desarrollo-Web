/**
 * SettingsContext.jsx
 * -------------------
 * Context API para estado "global" sencillo:
 * - type: "characters" | "episodes" | "locations"
 * - pageSize: cantidad de tarjetas a mostrar
 *
 * Ventaja: cualquier componente puede leer/cambiar estas preferencias
 * sin pasar props por toda la jerarquía (evitas "prop drilling").
 */
import { createContext, useContext, useMemo, useState } from "react";

const SettingsCtx = createContext(null);

export function SettingsProvider({ children }) {
  const [type, setType] = useState("characters");
  const [pageSize, setPageSize] = useState(24);

  // useMemo evita recrear el objeto si no cambian los valores
  const value = useMemo(() => ({ type, setType, pageSize, setPageSize }), [type, pageSize]);

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error("useSettings debe usarse dentro de <SettingsProvider>");
  return ctx;
}

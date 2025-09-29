import { createContext, useContext, useMemo, useState } from "react";
const SettingsContext = createContext(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings debe usarse dentro de <SettingsProvider>");
    return context;
};

export function SettingsProvider({ children }) {
  const [pageSize, setPageSize] = useState(12); 

  const value = {
    pageSize,
    setPageSize,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

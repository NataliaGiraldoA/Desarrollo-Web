/**
 * useSimpsons.js
 * --------------
 * Custom Hook que encapsula la lógica de:
 * - pedir datos a la API (una o varias páginas)
 * - normalizar items (para que la UI no dependa del shape exacto del backend)
 * - estados de loading/error
 *
 * Reutilizable en cualquier pantalla que necesite estos datos.
 */
import { useEffect, useState } from "react";
import { API_PAGE_SIZE, listMany, listResources, normalizeItem } from "../api/simpsons";

export function useSimpsons({ type, page, pageSize }) {
  const [items, setItems] = useState([]);
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoad(true);
        setError("");

        // ¿Cuántas páginas pedir según el pageSize vs API_PAGE_SIZE?
        const pagesNeeded = Math.max(1, Math.ceil(pageSize / API_PAGE_SIZE));

        const raw =
          pagesNeeded > 1
            ? await listMany(type, page, pagesNeeded, controller.signal)
            : await listResources(type, page, controller.signal);

        setItems(raw.map((it) => normalizeItem(type, it)).slice(0, pageSize));
      } catch (e) {
        if (!e?.canceled) setError(e?.message || "No se pudo cargar la lista.");
      } finally {
        setLoad(false);
      }
    })();
    return () => controller.abort();
  }, [type, page, pageSize]);

  return { items, loading, error };
}

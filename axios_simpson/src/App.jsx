import { useEffect, useMemo, useState } from "react";
import {
  API_PAGE_SIZE,
  listMany,
  listResources,
  normalizeItem,
} from "./api/simpsons";
import CharacterCard from "./components/CharacterCard";
import "./app.css"; // Importamos los estilos externos

export default function App() {
  // --------- ESTADOS PRINCIPALES ---------
  const [type, setType] = useState("characters"); // "characters" | "episodes" | "locations"
  const [page, setPage] = useState(1);            // página base (la API devuelve ~20 por página)
  const [pageSize, setPageSize] = useState(24);   // cuántas tarjetas mostrar (selector)
  const [items, setItems] = useState([]);         // items crudos (normalizados) para la vista actual
  const [q, setQ] = useState("");                 // texto de búsqueda
  const [loading, setLoading] = useState(false);  // bandera de carga
  const [error, setError] = useState("");         // mensaje de error para mostrar en UI

  // --------- EFECTO: CARGAR SEGÚN type, page, pageSize ---------
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");

        // ¿Cuántas páginas pedir según el "pageSize" elegido?
        // p.ej. si API_PAGE_SIZE=20: 24 → 2 páginas (mostramos 24, no 40)
        const pagesNeeded = Math.max(1, Math.ceil(pageSize / API_PAGE_SIZE));

        // Estrategia:
        // - Si pagesNeeded > 1, pedimos varias páginas desde "page" y aplanamos.
        // - Si pagesNeeded === 1, pedimos solo una página.
        const raw =
          pagesNeeded > 1
            ? await listMany(type, page, pagesNeeded, controller.signal)
            : await listResources(type, page, controller.signal);

        // Normalizamos todos los elementos a la forma que consume <CharacterCard />
        const normalized = raw.map((it) => normalizeItem(type, it));

        // Si pedimos de más (ej. 60 para mostrar 24), recortamos a "pageSize".
        setItems(normalized.slice(0, pageSize));
      } catch (e) {
        // Ignoramos cancelaciones (StrictMode en dev puede disparar dobles efectos)
        if (e?.canceled) return;
        setError(e?.message || "No se pudo cargar la lista.");
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup: cancela la petición en curso si cambia dependencia o se desmonta el componente
    return () => controller.abort();
  }, [type, page, pageSize]);

  // --------- FILTRO POR TEXTO (useMemo para evitar recomputar sin cambios) ---------
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k ? items.filter((c) => c.name?.toLowerCase().includes(k)) : items;
  }, [items, q]);

  // --------- HANDLERS (pequeñas funciones para claridad) ---------
  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => p + 1);
  const onTypeChange = (e) => {
    setType(e.target.value);
    setPage(1); // al cambiar type, reiniciamos a página 1
  };
  const onPageSizeChange = (e) => setPageSize(Number(e.target.value));

  // --------- RENDER ---------
  return (
    <main className="app">
      <h1 className="app__title">Explorador de Los Simpson</h1>

      {/* Controles superiores: búsqueda + selects */}
      <div className="toolbar">
        {/* Búsqueda */}
        <input
          className="toolbar__search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre/título…"
          aria-label="Buscar por nombre o título"
        />

        {/* Tipo de recurso */}
        <select
          className="toolbar__select"
          value={type}
          onChange={onTypeChange}
          title="Elige qué explorar"
          aria-label="Tipo de recurso"
        >
          <option value="characters">Personajes</option>
          <option value="episodes">Episodios</option>
          <option value="locations">Locaciones</option>
        </select>

        {/* Tarjetas por página */}
        <select
          className="toolbar__select"
          value={pageSize}
          onChange={onPageSizeChange}
          title="Cuántas tarjetas mostrar"
          aria-label="Tarjetas por página"
        >
          {/* Escalas comunes para grids: 12, 24, 48, 96 */}
          <option value={12}>12 por página</option>
          <option value={24}>24 por página</option>
          <option value={48}>48 por página</option>
          <option value={96}>96 por página</option>
        </select>
      </div>

      {/* Paginación simple */}
      <div className="pagination">
        <button className="btn" disabled={page === 1 || loading} onClick={onPrev}>
          ◀ Anterior
        </button>
        <span className="pagination__label">
          {type} · Página {page} · Mostrando {filtered.length}/{pageSize}
        </span>
        <button className="btn" disabled={loading} onClick={onNext}>
          Siguiente ▶
        </button>
      </div>

      {/* Estados de red / feedback al usuario */}
      {error && <p className="status status--error">{error}</p>}
      {loading && <p className="status">Cargando…</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="status">Sin resultados para “{q}”.</p>
      )}

      {/* Grid de tarjetas */}
      <ul className="grid">
        {filtered.map((c) => (
          <CharacterCard key={c.id} c={c} onClick={() => console.log("click en", c.name)} />
        ))}
      </ul>
    </main>
  );
}

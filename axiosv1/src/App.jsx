/**
 * App.jsx
 * -------
 * Pantalla principal con:
 *  - Toolbar (búsqueda, tipo, pageSize)
 *  - Paginación
 *  - Grid con tarjetas
 *  - Lifting state up: estado "selected" en el padre (para resaltar)
 *
 * Lee/escribe preferencias globales (type/pageSize) desde Context.
 * Usa el custom hook useSimpsons para la carga/normalización.
 */
import { useEffect, useMemo, useState } from "react";
import { useSettings } from "./context/SettingsContext";
import { useSimpsons } from "./hooks/useSimpsons";
import CharacterCard from "./components/CharacterCard";

export default function App({ initialType }) {
  // Context global: type y pageSize compartidos en toda la app
  const { type, setType, pageSize, setPageSize } = useSettings();

  // Estado local: página actual y texto de búsqueda
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  // Lifting state up: tarjeta seleccionada (para resaltar/acciones)
  const [selected, setSelected] = useState(null);

  // Si la ruta cambió (characters/episodes/locations), inicializa el type
  useEffect(() => {
    if (initialType) setType(initialType);
    setPage(1); // al entrar por ruta, arranca en página 1
  }, [initialType, setType]);

  // Carga de datos con custom hook
  const { items, loading, error } = useSimpsons({ type, page, pageSize });

  // Filtro en memoria por texto (simple)
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k ? items.filter((c) => c.name?.toLowerCase().includes(k)) : items;
  }, [items, q]);

  // Handlers básicos
  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => p + 1);
  const onTypeChange = (e) => { setType(e.target.value); setPage(1); setSelected(null); };
  const onPageSizeChange = (e) => setPageSize(Number(e.target.value));

  return (
    <main className="app">
      <h1 className="app__title">Explorador de Los Simpson</h1>

      {/* Toolbar superior */}
      <div className="toolbar">
        <input
          className="toolbar__search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre/título…"
          aria-label="Buscar por nombre o título"
        />

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

        <select
          className="toolbar__select"
          value={pageSize}
          onChange={onPageSizeChange}
          title="Cuántas tarjetas mostrar"
          aria-label="Tarjetas por página"
        >
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

      {/* Estados */}
      {error && <p className="status status--error">{error}</p>}
      {loading && <p className="status">Cargando…</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="status">Sin resultados para “{q}”.</p>
      )}

      {/* Grid de tarjetas */}
      <ul className="grid">
        {filtered.map((c) => (
          <div
            key={c.id}
            className={selected?.id === c.id ? "grid__item grid__item--selected" : "grid__item"}
            onMouseDown={() => setSelected(c)} // selecciona/ilumina (lifting state up visible)
          >
            <CharacterCard c={c} onClick={() => setSelected(c)} />
          </div>
        ))}
      </ul>
    </main>
  );
}

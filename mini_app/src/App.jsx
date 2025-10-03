import { useEffect, useMemo, useState } from "react";
import useGot from "./hooks/usegot";
import { useSettings } from "./context/SettingsContext";
import CharacterCard from "./components/Characters";
import usePagination from "./hooks/pagination";
import ContinentCard from "./components/Continents";
import "./css/App.css";

export default function App() {
  const { pageSize: ctxPageSize, setPageSize: setCtxPageSize } = useSettings();
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceType, setResourceType] = useState("characters");


  const endpoint = resourceType === "characters" ? "/Characters" : "/Continents";

 
  const { data: allData = [], loading, error, get } = useGot(endpoint, {
    defaultData: [],
    lazy: true,
  });

  // Filtrar por búsqueda
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return allData;
    const query = searchQuery.toLowerCase().trim();
    return allData.filter((item) => {
      const name = item?.fullName || item?.name || "";
      const title = item?.title || "";
      const family = item?.family || "";
      return (
        name.toLowerCase().includes(query) ||
        title.toLowerCase().includes(query) ||
        family.toLowerCase().includes(query)
      );
    });
  }, [allData, searchQuery]);

  const {
    page,
    setPage,
    totalPages,
    pageItems,
    next,
    prev
  } = usePagination(filteredData, ctxPageSize);

  // Recargar datos cuando cambia el tipo en el filtro
  useEffect(() => {
    if (visible) {
      get().catch(() => {});
      setPage(1);
      setSearchQuery("");
    }
  }, [resourceType]);

  const toggleShow = async () => {
    if (!visible && allData.length === 0) {
      try {
        await get();
        setPage(1);
      } catch {}
    }
    setVisible(v => !v);
  };

  const onChangePageSize = (e) => {
    const val = Number(e.target.value) || 1;
    setCtxPageSize(val);
  };

  const onChangeResourceType = (e) => {
    setResourceType(e.target.value);
    setSelected(null);
  };

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Volver a página 1 al buscar
  };

  return (
    <main className="app">
      <h1 className="app__title">Personajes de Game of Thrones</h1>

      <div className="toolbar">
        <input
          className="toolbar__search"
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar por nombre, título o casa..."
          disabled={!visible || loading}
          aria-label="Buscar"
        />

        <label>
          Tipo:{" "}
          <select 
            value={resourceType} 
            onChange={onChangeResourceType}
            disabled={loading}
          >
            <option value="characters">Personajes</option>
            <option value="continents">Continentes</option>
          </select>
        </label>

        <label>
          Por página:{" "}
          <select value={ctxPageSize} onChange={onChangePageSize} disabled={loading}>
            <option value={15}>12</option>
            <option value={30}>24</option>
            <option value={45}>53</option>
          </select>
        </label>
      </div>

      <button onClick={toggleShow}>
        {visible ? "Ocultar" : "Mostrar"} {resourceType === "characters" ? "personajes" : "continentes"}
      </button>

      {visible && (
        <div className="pagination">
          <button className="btn" disabled={loading || page <= 1} onClick={prev}>
            ◀ Anterior
          </button>
          <span className="page-indicator">
            Página {totalPages === 0 ? 0 : page} de {totalPages}
          </span>
          <button className="btn" disabled={loading || page >= totalPages} onClick={next}>
            Siguiente ▶
          </button>
        </div>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}

      {visible && (
        <ul className="grid">
          {pageItems.length > 0 ? (
            pageItems.map((c) => (
              <li
                key={c.id ?? c._id ?? c.name}
                className={selected?.id === c.id ? "grid__item grid__item--selected" : "grid__item"}
                onMouseDown={() => setSelected(c)}
              >
                {resourceType === "characters" ? (
                  <CharacterCard c={c} onClick={() => setSelected(c)} />
                ) : (
                  <ContinentCard c={c} onClick={() => setSelected(c)} />
                )}
              </li>
            ))
          ) : (
            !loading && (
              <li>
                {searchQuery 
                  ? `No se encontraron resultados para "${searchQuery}"` 
                  : `No se encontraron ${resourceType === "characters" ? "personajes" : "continentes"}.`
                }
              </li>
            )
          )}
        </ul>
      )}
    </main>
  );
}
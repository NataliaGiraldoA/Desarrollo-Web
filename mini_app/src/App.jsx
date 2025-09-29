import { useEffect, useState } from "react";
import useGot from "./hooks/usegot";
import { useSettings } from "./context/SettingsContext";
import CharacterCard from "./components/Characters";
import usePagination from "./hooks/pagination";
import "./css/App.css";

export default function App() {
  const { pageSize: ctxPageSize, setPageSize: setCtxPageSize } = useSettings();
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);

  //cargar al hacer click
  const { data: characters = [], loading, error, get } = useGot("/Characters", {
    defaultData: [],
    lazy: true,
  });

  const {
    page,
    setPage,
    pageSize,          // del hook
    setPageSize,      
    totalPages,
    pageItems,
    next,
    prev,
    reset,
  } = usePagination(characters, ctxPageSize); 

  // actualizar hook
  useEffect(() => {
    setPageSize(ctxPageSize);
    reset();
  }, [ctxPageSize, setPageSize, reset]);


  const toggleShow = async () => {
    if (!visible && characters.length === 0) {
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

  return (
    <main className="app">
      <h1 className="app__title">Personajes de Game of Thrones</h1>

      <label>
        Cantidad de personajes por página:{" "}
        <select value={ctxPageSize} onChange={onChangePageSize} disabled={loading}>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={53}>53</option>
        </select>
      </label>

      <button onClick={toggleShow}>
        {visible ? "Ocultar personajes" : "Mostrar personajes"}
      </button>

      {visible && (
        <div className="pagination">
          <button className="btn" disabled={loading || page <= 1} onClick={prev}>
            ◀ Anterior
          </button>
          <span className="page-indicator">Página {totalPages === 0 ? 0 : page} de {totalPages}</span>
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
                <CharacterCard c={c} onClick={() => setSelected(c)} />
              </li>
            ))
          ) : (
            !loading && <li>No se encontraron personajes.</li>
          )}
        </ul>
      )}
    </main>
  );
}

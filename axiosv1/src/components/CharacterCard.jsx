import { useEffect, useMemo, useState } from "react";
import useGot from "./hooks/usegot";
import { useSettings } from "./context/SettingsContext";
import CharacterCard from "./components/Characters";
import {pagination} from "./hooks/pagination";

export default function App() {
  const { pageSize, setPageSize } = useSettings();
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  

  // usar lazy para cargar solo al hacer click
  const { data: characters = [], loading, error, get } = useGot("/Characters", {
    defaultData: [],
    lazy: true
  });

  const toggleShow = async () => {
    // si vamos a mostrar y no hay datos, los cargamos
    if (!visible && (!characters || characters.length === 0)) {
      try {
        await get(); // obtiene /characters
      } catch (e) {
        // ignore, error se muestra en UI
      }
    }
    setVisible((v) => !v);
  };

  return (
    <main className="app">
      <h1 className="app__title">Personajes de Game of Thrones</h1>
      <div className="pagination">
        <button className="btn" disabled={page === 1 || loading} onClick={onPrev}>
          ◀ Anterior
        </button>

        <button className="btn" disabled={loading} onClick={onNext}>
          Siguiente ▶
        </button>
      </div>
      <label>
        Por página:
        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value) || 1)}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={53}>53</option>
        </select>
      </label>

      <button onClick={toggleShow}>
        {visible ? "Ocultar personajes" : "Mostrar personajes"}
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Grid de tarjetas solo si visible */}
      {visible && (
        <ul className="grid">
          {(characters ?? []).slice(0, pageSize).map((c) => (
            <li key={c.id ?? c._id ?? c.name} className={selected?.id === c.id ? "grid__item grid__item--selected" : "grid__item"}
              onMouseDown={() => setSelected(c)}>
              <CharacterCard c={c} onClick={() => setSelected(c)} />
            </li>
          ))}
          {!loading && (!characters || characters.length === 0) && <li>No se encontraron personajes.</li>}
        </ul>
      )}
    </main>
  );
}
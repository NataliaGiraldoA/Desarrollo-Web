import { useEffect, useState, useMemo } from "react";

import { listCharacters } from "./api/simpson";

import CharacterCard from "./components/CharacterCard";

export default function App() {

    const [page, setPage] = useState(1); //Número de página actual (1) al cambiar página se actualiza
    const [items, setItems] = useState([]); //array de personajes que vienen en la API (pag actual)
    const [q, setQ] = useState(""); //texto del buscador (input controlado)
    const [loading, setLoading] = useState(false); //estado de carga (mientras viene la API) -- Bandera booleana: true mientras esperamos la respuesta de API
    const [error, setError] = useState(null); //texto con el msg de error si falla la API

    useEffect(() => {
        const controller = new AbortController(); //para abortar la petición fetch si el usuario cambia de página antes de que llegue la respuesta

        (async () => {
            try {
                setLoading(true); //ponemos la bandera de carga a true
                setError(""); //limpiamos errores previos

                const data = await listCharacters(page, controller.signal); //llamamos a la API con la página actual y el texto del buscador
                if (import.meta.env.NODE_ENV === "development" && data?.length === 0) {
                    console.log("[DEBUG] ejemplo item", data[0]);
                }

                setItems(data); //guardamos los personajes en el estado
            }
            catch (e) {
                //Si el interceptor marcó que fue cancelado, no mostramos nada
                if (e?.canceled) return;

                //si fue otro error
                const msg = e?.message || "No se pudo cargar";
                const st = e?.status != null ? ` (${e.status})` : "";
                setError(msg + st); //guardamos el error en el estado

                if (import.meta.env.NODE_ENV === "development") {
                    console.error("[HTTP ERROR]", e);
                }

            }
            finally {
                //Apaga el indicador de carga pase lo que pase
                setLoading(false);
            }
        })();
    }, [page]);//Dependencia si la page cambia / repetimos todo el efecto

    //----------------filtro por nombre--------------------
    const filtered = useMemo(() => {
        const k = q.trim().toLowerCase(); //q es el texto del input
        return k ? items.filter((c) => c.name?.toLowerCase().includes(k)) : items;
    }, [items, q]); //si cambia items o q, recalculamos el filtro

    return(
        <>
            <main>
                <h1>Personajes de los Simpson</h1>
                <div style={{display: "flex", gap: "8", margin: "12px 0"}}>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Buscar por nombre"
                        className="searching input"
                    />
                    <button
                        disabled={page === 1 || loading} //desactivado si estamos en la primera página o cargando
                        onClick={() => setPage((p) => Math.max(1, p - 1))} //decrementa la página pero no baja de 1
                        className="btn"
                    >
                        ◀
                    </button>
                    <span>Page{page}</span>
                    <button
                        disabled={loading} //desactivado si estamos en la primera página o cargando
                        onClick={() => setPage((p) => Math.max(1, p + 1))} //decrementa la página pero no baja de 1
                        className="btn"
                    >
                        ▶
                    </button>
                </div>

                {error && <p className="msgError">Error: {error}</p>}
                {loading && <p className="msgLoading">Cargando...</p>}
                {!loading && !error && filtered.length === 0 && (<p>No hay resultados para "{q}"</p>)}

                {/* Lista de personajes - Tarjetas */}

                <ul className="cardGrid">
                {filtered.map((c) => (
                    <CharacterCard key={c.id} c={c} onClick={() => console.log("click en", c.name)} />
                ))}
                </ul>

            </main>
        </>    
    )
}

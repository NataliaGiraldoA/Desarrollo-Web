import { useEffect, useState, useMemo } from "react";

import { listCharacters } from "./api/simpson";

import { listEpisodes } from "./api/simpson";

import { listLocations } from "./api/simpson";

import EpisodeCard from "./components/EpisodeCard";

import CharacterCard from "./components/CharacterCard";

import LocationsChard from "./components/LocationsCard";

export default function App() {

    const [page, setPage] = useState(1); //Número de página actual (1) al cambiar página se actualiza
    const [items, setItems] = useState([]); //array de personajes que vienen en la API (pag actual)
    const [q, setQ] = useState(""); //texto del buscador (input controlado)
    const [loading, setLoading] = useState(false); //estado de carga (mientras viene la API) -- Bandera booleana: true mientras esperamos la respuesta de API
    const [error, setError] = useState(null); //texto con el msg de error si falla la API
    const [filterParam, setFilterParam] = useState("Character");
    const [perPage, setPerPage] = useState(10); //número de elementos por página

    useEffect(() => {
        const controller = new AbortController(); //para abortar la petición fetch si el usuario cambia de página antes de que llegue la respuesta

        (async () => {
            try {
                setLoading(true); //ponemos la bandera de carga a true
                setError(""); //limpiamos errores previos

                let data = [];

                const detectType = (item) => {
                    // Si tiene 'phrases' o 'occupation', es un personaje
                    if (item.phrases || item.occupation) {
                        return "character";
                    }
                    // Si tiene 'airdate' o 'synopsis', es un episodio
                    if (item.airdate || item.synopsis) {
                        return "episode";
                    }
                    if (item.town || item.use) {
                        return "location";
                    }
                    return "unknown";
                };

                const addTypeToItems = (items) => {
                    return items.map(item => ({
                        ...item,
                        type: detectType(item)
                    }));
                };

                if (filterParam === "Character") {
                    const rawData = await listCharacters(page, controller.signal, perPage);
                    data = addTypeToItems(rawData);

                } else if (filterParam === "Episode") {
                    const rawData = await listEpisodes(page, controller.signal, perPage);
                    data = addTypeToItems(rawData);
                } else if (filterParam === "Location") {
                    const rawData = await listLocations(page, controller.signal, perPage);
                    data = addTypeToItems(rawData);
                }


                if (import.meta.env.NODE_ENV === "development" && data?.length === 0) {
                    console.log("[DEBUG] ejemplo item", data[0]);
                }

                setItems(Array.isArray(data) ? data : []); //guardamos los personajes en el estado
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
    }, [page, filterParam, perPage]);//Dependencia si la page cambia, repetimos todo el efecto

    //----------------filtro por nombre--------------------
    const filtered = useMemo(() => {
        const k = q.trim().toLowerCase();
        return items.filter((item) => {
            const typeOk =
                (filterParam === "Character" && item?.type === "character") ||
                (filterParam === "Location" && item?.type === "location") ||
                (filterParam === "Episode" && item?.type === "episode");

            if (!typeOk) return false;

            if (!k) return true;
            return item?.name?.toLowerCase().includes(k);
        });
    }, [items, q, filterParam]);



    return (
        <>
            <main>
                <h1>Personajes de los Simpson</h1>
                <div style={{ display: "flex", gap: "8", margin: "12px 0" }}>
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
                <div>
                    <select
                        onChange={(e) => {
                            setFilterParam(e.target.value);
                            setPage(1); //resetea la página al cambiar el filtro
                        }}
                        className="custom-select"
                        aria-label="Filter info">
                        <option value="Character">Character</option>
                        <option value="Location">Location</option>
                        <option value="Episode">Episode</option>
                    </select>

                </div>
                <div style={{ marginTop: 8, marginBottom: 8 }}>
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1); 
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                {error && <p className="msgError">Error: {error}</p>}
                {loading && <p className="msgLoading">Cargando...</p>}
                {!loading && !error && filtered.length === 0 && (<p>No hay resultados para "{q}"</p>)}

                {/* Lista de personajes - Tarjetas */}

                <ul className="cardGrid">
                    {filtered.map((c) => {
                        if (c.type === "character") {
                            return <CharacterCard key={`character-${c.id}`} c={c} onClick={() => console.log("click en", c.name)} />;
                        }
                        if (c.type === "episode") {
                            return <EpisodeCard key={`episode-${c.id}`} c={c} onClick={() => console.log("click en", c.name)} />;
                        }
                        if (c.type === "location") {
                            return <LocationsChard key={`location-${c.id}`} c={c} onClick={() => console.log("click en", c.name)} />;
                        }
                        return null;
                    })}
                </ul>

            </main>
        </>
    )
}

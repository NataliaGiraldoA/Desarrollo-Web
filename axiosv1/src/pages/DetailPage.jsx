/**
 * DetailPage.jsx
 * --------------
 * Página de detalle. Lee parámetros de ruta :type y :id.
 * Preferimos usar el objeto completo pasado en Link.state (si existe)
 * para evitar un segundo fetch. Si no llega (p. ej., acceso directo),
 * hacemos fetch solo para "characters" (ejemplo simple).
 *
 * Puedes extenderlo con getEpisode/getLocation si tu API lo soporta.
 */
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { getCharacter, imageUrl } from "../api/simpsons";

export default function DetailPage() {
  const { type, id } = useParams();           // /detail/:type/:id
  const { state } = useLocation();            // Link state (item ya cargado)
  const [item, setItem] = useState(state?.item || null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si no llegó item en state y es un personaje, intentamos fetch por id
    if (!item && type === "characters") {
      (async () => {
        try {
          const data = await getCharacter(id);
          setItem(data);
        } catch (e) {
          setError(e?.message || "No se pudo cargar el detalle.");
        }
      })();
    }
  }, [type, id, item]);

  if (error) return <main className="app"><p className="status status--error">{error}</p></main>;
  if (!item)   return <main className="app"><p className="status">Cargando…</p></main>;

  // Armamos imagen grande si hay ruta (para detalle queda mejor 1280 cuando aplique)
  const portraitRel =
    item?.portrait_path || item?.portrait || item?.image || item?.imageUrl || item?.img || "";
  const src = portraitRel ? imageUrl(portraitRel, 1280) : "";

  return (
    <main className="app">
      <Link to={`/${type}`} className="btn" style={{ marginBottom: 8 }}>← Volver</Link>
      <h1 className="app__title">{item.name || item.title || `${type} ${id}`}</h1>

      {src ? (
        <img
          src={src}
          alt={item.name || "Detalle"}
          style={{ width: "100%", maxWidth: 800, borderRadius: 12 }}
        />
      ) : (
        <p className="status">Sin imagen.</p>
      )}

      <p className="status" style={{ marginTop: 8 }}>
        {item.occupation || item.type || "—"}
      </p>
    </main>
  );
}

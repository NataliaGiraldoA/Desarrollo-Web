import { useEffect, useMemo } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import useGot from "../hooks/usegot";
import { imageUrl } from "../api/game_of_thrones";
import "../css/DetailPage.css";

export default function CharacterDetail() {
  const { id } = useParams();
  const location = useLocation();

  // Si venimos desde la lista, el Link ya envió el item en state
  const initialItem = location.state?.item ?? null;

  // no pide nada hasta el get
  const {
    data: item = initialItem,
    loading,
    error,
    get,
  } = useGot("", { lazy: true, defaultData: initialItem });

  useEffect(() => {
    if (!item && id) {
      // GET /Characters/:id
      get(`/Characters/${id}`).catch(() => {});
    }
  }, [id, item, get]);

  const portraitRel = item?.imageUrl || item?.image || item?.thumbnail || "";
  const src = useMemo(() => (portraitRel ? imageUrl(portraitRel) : ""), [portraitRel]);

  return (
    <main className="detail">
      <header className="detail__header">
        <Link to="/" className="detail__back">← Volver</Link>
        <h1 className="detail__title">
          {item?.fullName ?? item?.name ?? "Detalle de personaje"}
        </h1>
      </header>

      {loading && <p>Cargando detalle…</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && !item && <p>No se encontró el personaje.</p>}

      {!loading && !error && item && (
        <article className="detail__card">
          {src ? (
            <img
              className="detail__img"
              src={src}
              alt={item?.fullName ?? item?.name ?? "Personaje"}
              loading="lazy"
            />
          ) : (
            <div className="detail__img--placeholder">Sin imagen</div>
          )}

          <section className="detail__info">
            <p><strong>Nombre:</strong> {item?.fullName ?? item?.name ?? "—"}</p>
            <p><strong>Título:</strong> {item?.title ?? "—"}</p>
            <p><strong>Casa:</strong> {item?.family ?? "—"}</p>
            {item?.firstName && <p><strong>Nombre:</strong> {item.firstName}</p>}
            {item?.lastName && <p><strong>Apellido:</strong> {item.lastName}</p>}
          </section>
        </article>
      )}
    </main>
  );
}

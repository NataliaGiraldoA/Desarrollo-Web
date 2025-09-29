/**
 * CharacterCard.jsx — versión CDN (optimizada, sin CSS inline)
 * -----------------------------------------------------------
 * Componente que muestra una tarjeta con:
 *  - Imagen (patrón CDN) + nombre + ocupación + (opcional) primera frase.
 *  - Accesible con teclado (role="button", tabIndex, Enter).
 *
 * Claves de la API:
 *  - La imagen suele venir como RUTA RELATIVA (ej: "/character/1.webp").
 *  - imageUrl(path) (../api/simpsons) construye: https://cdn.thesimpsonsapi.com/{size}{path}
 *    * size se infiere por tipo (/character → 500, /episode → 200, /location → 1280).
 *
 * Props:
 *  @param {object}   c        Item normalizado (id, name, occupation, portrait_path, phrases[]).
 *  @param {function} onClick  (opcional) Se ejecuta al click o al presionar Enter.
 */

import { useEffect, useMemo, useState } from "react";
import { imageUrl } from "../api/simpsons";
import "./CharacterCard.css"; // 👈 estilos externos

export default function CharacterCard({ c, onClick }) {
  /**
   * 1) Elegimos la mejor "fuente" de imagen posible.
   *    Las APIs cambian; por eso probamos varias claves y tomamos la primera válida.
   */
  const portraitRel =
    c?.portrait_path || c?.portrait || c?.image || c?.imageUrl || c?.img || c?.thumbnail || "";

  /**
   * 2) Calculamos la URL FINAL del CDN (o "" si no hay path).
   *    - useMemo evita recomputar si portraitRel no cambia (micro-optimización).
   */
  const src = useMemo(() => (portraitRel ? imageUrl(portraitRel) : ""), [portraitRel]);

  /**
   * 3) Estado para manejar fallos de imagen:
   *    - imgOk = true  → intentamos mostrar la imagen.
   *    - imgOk = false → mostramos un placeholder con ayuda para depurar.
   */
  const [imgOk, setImgOk] = useState(true);

  /**
   * 4) Si cambia `src`, reseteamos el estado de carga de imagen.
   *    (Por ejemplo, al cambiar de página o de tipo de recurso.)
   */
  useEffect(() => {
    setImgOk(true);
  }, [src]);

  /**
   * 5) Manejador de teclado: si el usuario presiona Enter con foco en la tarjeta,
   *    ejecutamos el mismo callback que el click (si existe).
   */
  const onKey = (e) => {
    if (e.key === "Enter") onClick?.();
  };

  return (
    /**
     * Estructura semántica:
     *  - <li> porque la tarjeta vive dentro de una lista <ul>.
     *  - Accesibilidad: role="button", tabIndex={0}, onKeyDown para Enter.
     *  - Las clases CSS controlan visual (hover, bordes, espaciado, etc.).
     */
    <li
      className="card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKey}
      aria-label={c?.name ? `Ver ${c.name}` : "Tarjeta"}
    >
      {/* BLOQUE DE IMAGEN: si hay src y no ha fallado, renderizamos <img>; si falla, placeholder */}
      {src && imgOk ? (
        <img
          className="card__img"
          src={src}                         // URL final del CDN
          alt={c?.name ?? "Personaje"}      // texto alternativo (accesibilidad)
          loading="lazy"                    // carga diferida (mejora rendimiento)
          onError={() => setImgOk(false)}   // si falla, cambiamos a placeholder
          // Si tu entorno bloquea por Referer, puedes descomentar:
          // referrerPolicy="no-referrer"
        />
      ) : (
        <div className="card__placeholder">
          <div className="card__placeholderText">Sin imagen</div>
          {/* En desarrollo es útil abrir la URL para depurar (404/403/200) */}
          {process.env.NODE_ENV === "development" && src && (
            <a
              className="card__link"
              href={src}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir URL de imagen en nueva pestaña"
            >
              Abrir URL
            </a>
          )}
        </div>
      )}

      {/* TEXTO: nombre + ocupación (fallback "—") */}
      <h3 className="card__title">{c?.name}</h3>
      <small className="card__subtitle">{c?.occupation || "—"}</small>

      {/* FRASE (opcional): mostramos la primera si existe */}
      {Array.isArray(c?.phrases) && c.phrases[0] && (
        <p className="card__quote">“{c.phrases[0]}”</p>
      )}
    </li>
  );
}

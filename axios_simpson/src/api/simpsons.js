import { http } from "./http"; 

/**
 * Tamaño de página estándar que devuelve la API por endpoint (la mayoría: 20).
 * Lo usamos para calcular cuántas páginas pedir cuando el usuario elige 40 tarjetas, etc.
 */
export const API_PAGE_SIZE = 20;

/* Extra: tipos válidos para evitar typos y sanitizar el parámetro `type` */
export const VALID_TYPES = new Set(["characters", "episodes", "locations"]);

/* Extra: util para sanear `type` y evitar caer en rutas inexistentes */
function sanitizeType(type) {
  return VALID_TYPES.has(type) ? type : "characters";
}

/* Extra: util para sanear números de página (mínimo 1) */
function pageInt(n, def = 1) {
  const x = Number(n);
  return Number.isFinite(x) && x >= 1 ? Math.floor(x) : def;
}

/**
 * Lista recursos por tipo:
 *   type: "characters" | "episodes" | "locations"
 *   page: 1..n
 */
export async function listResources(type = "characters", page = 1, signal) {
  /* saneamos `type` y `page` para mayor robustez */
  const safeType = sanitizeType(type);
  const safePage = pageInt(page, 1);

  const res = await http.get(`/${safeType}`, { params: { page: safePage }, signal });
  const data = res.data;
  return Array.isArray(data) ? data : data?.results ?? data?.items ?? [];
}

/**
 * Trae varias páginas seguidas y las concatena.
 * Ej.: si el usuario elige "40 tarjetas", pedimos 2 páginas (20 + 20).
 *
 * @param {("characters"|"episodes"|"locations")} type
 * @param {number} startPage  primera página a pedir (ej. 1)
 * @param {number} pages      cuántas páginas en total (ej. 2)
 * @param {AbortSignal} signal
 * @returns {Promise<Array>}  items concatenados
 */
export async function listMany(type, startPage, pages, signal) {
  /* saneamos entradas y evitamos casos borde (pages < 1) */
  const safeType = sanitizeType(type);
  const first = pageInt(startPage, 1);
  const count = Math.max(1, pageInt(pages, 1));

  /* pedimos en paralelo para mejor latencia */
  const tasks = Array.from({ length: count }, (_, i) =>
    listResources(safeType, first + i, signal)
  );
  const chunks = await Promise.all(tasks);
  return chunks.flat();
}

/**
 * SUGERENCIA DE TAMAÑO DEL CDN SEGÚN LA RUTA
 * - /character/  → 500  (tarjetas)
 * - /episode/    → 200  (thumbnails)
 * - /location/   → 1280 (vistas grandes)
 */
export function cdnSizeForImagePath(imagePath) {
  const p = String(imagePath || "");
  if (p.includes("/episode/")) return 200;
  if (p.includes("/location/")) return 1280;
  return 500;
}

/**
 * Construye la URL final del CDN:
 *   https://cdn.thesimpsonsapi.com/{size}{image_path}
 *
 * @param {string} path  ruta relativa devuelta por la API (p. ej. "/character/1.webp")
 * @param {number} [size] tamaño deseado; si no se pasa, se infiere por la ruta
 */
export function imageUrl(path, size) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;     // ya es absoluta
  if (/^\/\//.test(path)) return "https:" + path;  // esquema omitido

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const chosen = String(size ?? cdnSizeForImagePath(cleanPath)).replace(/\/+$/g, "");
  return `https://cdn.thesimpsonsapi.com/${chosen}${cleanPath}`;
}

/* Extra: util pequeño para asegurar que devolvemos siempre strings como id */
function toIdString(v, fallback) {
  if (v === 0 || (typeof v === "number" && Number.isFinite(v))) return String(v);
  if (typeof v === "string" && v.trim()) return v;
  return String(fallback ?? "");
}

/**
 * Normaliza un item de cualquier tipo a la forma que espera <CharacterCard />:
 *  - name: título visible
 *  - occupation: subtítulo (cuando aplique)
 *  - portrait_path: ruta relativa de imagen (para imageUrl)
 *  - phrases: array de strings (si aplica)
 */
export function normalizeItem(type, item) {
  const t = sanitizeType(type);

  if (t === "characters") {
    return {
      id: toIdString(item.id, item.name),
      name: item.name,
      occupation: item.occupation,
      // las APIs pueden usar muchos nombres; probamos varios:
      portrait_path:
        item.portrait_path || item.portrait || item.image || item.imageUrl || item.img || "",
      phrases: Array.isArray(item.phrases) ? item.phrases : [],
    };
  }

  if (t === "episodes") {
    /* --------- OPTIMIZACIÓN/ARREGLO IMPORTANTE ---------
       Si la API no trae ruta explícita de imagen, construimos una
       a partir del id del episodio para NO caer siempre en "/episode/1.webp".
    ----------------------------------------------------- */
    const epId =
      item.id ??
      item.episode_id ??
      (typeof item.episode === "number" ? item.episode : undefined);

    const explicitPath =
      item.thumbnail_path ||
      item.image_path ||
      item.image ||
      item.imageUrl ||
      item.img ||
      "";

    const portrait_path = explicitPath || (epId != null ? `/episode/${epId}.webp` : "");

    return {
      id: toIdString(epId, `${item.season ?? "?"}-${item.episode ?? "?"}`),
      name: item.title || item.name || `S${item.season ?? "?"}E${item.episode ?? "?"}`,
      occupation: `Temporada ${item.season ?? "?"} · Episodio ${item.episode ?? "?"}`,
      portrait_path,
      phrases: item.quote ? [item.quote] : [], // por si algún endpoint trae quotes
    };
  }

  // locations
  const locId = item.id || item.location_id || item.slug || item.name;
  const locExplicit =
    item.image_path || item.image || item.imageUrl || item.img || "";

  /* Si no viene imagen de locación, intentamos construirla por id para evitar un único fallback fijo */
  const locPortrait = locExplicit || (locId ? `/location/${locId}.webp` : "");

  return {
    id: toIdString(locId, item.name || "location"),
    name: item.name || item.title || "Location",
    occupation: item.type ? `Tipo: ${item.type}` : "Locación",
    portrait_path: locPortrait,
    phrases: [],
  };
}

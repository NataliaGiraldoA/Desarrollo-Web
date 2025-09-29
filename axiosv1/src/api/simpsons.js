/**
 * simpsons.js
 * -----------
 * Capa de acceso a datos para "The Simpsons API".
 * Aquí centralizamos:
 *  - Fetch de listados (1 o varias páginas)
 *  - Fetch de detalle por id
 *  - Normalización de datos a un shape estable para la UI
 *  - Construcción de URLs de imagen usando el CDN oficial
 *
 * Ventajas:
 *  - Los componentes de React no dependen de cómo viene el JSON exacto del backend.
 *  - Si la API cambia nombres de campos, solo tocamos aquí.
 *  - Reutilizable en cualquier pantalla (App, DetailPage, etc.).
 */

import { http } from "./http"; 

/**
 * Tamaño de página estándar que devuelve la API por endpoint (casi siempre 20).
 * Lo usamos para calcular cuántas páginas pedir cuando el usuario elige 40, 48, 96, etc.
 */
export const API_PAGE_SIZE = 20;

/* Conjunto de tipos válidos: ayuda a evitar typos o rutas inexistentes */
export const VALID_TYPES = new Set(["characters", "episodes", "locations"]);

/* Sanea `type`: si no es válido, volvemos a "characters" */
function sanitizeType(type) {
  return VALID_TYPES.has(type) ? type : "characters";
}

/* Sanea números de página (mínimo 1, entero) */
function pageInt(n, def = 1) {
  const x = Number(n);
  return Number.isFinite(x) && x >= 1 ? Math.floor(x) : def;
}

/* Convierte potenciales IDs a string (React keys más predecibles) */
function toIdString(v, fallback) {
  if (v === 0 || (typeof v === "number" && Number.isFinite(v))) return String(v);
  if (typeof v === "string" && v.trim()) return v;
  return String(fallback ?? "");
}

/* ===========================
 *  Listados (una o varias páginas)
 * =========================== */

/**
 * Lista recursos por tipo:
 *   type: "characters" | "episodes" | "locations"
 *   page: 1..n
 *
 * Devuelve SIEMPRE un array (normalizamos para no romper la UI).
 */
export async function listResources(type = "characters", page = 1, signal) {
  const safeType = sanitizeType(type);
  const safePage = pageInt(page, 1);

  const res = await http.get(`/${safeType}`, { params: { page: safePage }, signal });
  const data = res.data;
  // Algunas APIs devuelven array; otras { results: [...] } o { items: [...] }
  return Array.isArray(data) ? data : data?.results ?? data?.items ?? [];
}

/**
 * Trae varias páginas seguidas y las concatena.
 * Ej.: si el usuario elige "48 tarjetas" y la API da 20 por página,
 * pedimos 3 páginas (60) y luego cortamos a 48.
 *
 * @param {"characters"|"episodes"|"locations"} type
 * @param {number} startPage  primera página (ej. 1)
 * @param {number} pages      cantidad de páginas (ej. 3)
 * @param {AbortSignal} signal
 * @returns {Promise<Array>}  items concatenados
 */
export async function listMany(type, startPage, pages, signal) {
  const safeType = sanitizeType(type);
  const first = pageInt(startPage, 1);
  const count = Math.max(1, pageInt(pages, 1));

  const tasks = Array.from({ length: count }, (_, i) =>
    listResources(safeType, first + i, signal)
  );
  const chunks = await Promise.all(tasks);
  return chunks.flat();
}

/* ===========================
 *  CDN de imágenes
 *  https://cdn.thesimpsonsapi.com/{size}{image_path}
 * =========================== */

/**
 * Sugerencia de tamaño según la RUTA:
 * - /character/  → 500   (tarjetas / perfiles)
 * - /episode/    → 200   (thumbnails en listados)
 * - /location/   → 1280  (detalle con alta resolución)
 */
export function cdnSizeForImagePath(imagePath) {
  const p = String(imagePath || "");
  if (p.includes("/episode/")) return 200;
  if (p.includes("/location/")) return 1280;
  return 500; // defecto
}

/**
 * Construye la URL final del CDN:
 *   https://cdn.thesimpsonsapi.com/{size}{image_path}
 *
 * Reglas:
 *  - Si `path` ya es absoluta (http/https) → la devolvemos tal cual (podría venir del CDN).
 *  - Si `path` empieza con // → forzamos https:
 *  - Sino, garantizamos que empiece por "/" y armamos la URL con el size elegido
 *    (o inferido por cdnSizeForImagePath).
 *
 * @param {string} path                ruta relativa (p. ej. "/character/1.webp")
 * @param {number|string} [size]       tamaño del CDN; si se omite, se infiere por la ruta
 * @returns {string}                   URL absoluta lista para <img src="...">
 */
export function imageUrl(path, size) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;     // ya es absoluta
  if (/^\/\//.test(path)) return "https:" + path;  // esquema omitido → https:

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const chosen = String(size ?? cdnSizeForImagePath(cleanPath)).replace(/\/+$/g, "");
  return `https://cdn.thesimpsonsapi.com/${chosen}${cleanPath}`;
}

/* ===========================
 *  Normalización a shape de UI
 * =========================== */

/**
 * Normaliza un item a la forma que esperan las tarjetas:
 *  - id: string (para keys estables)
 *  - name: título visible
 *  - occupation: subtítulo (si aplica)
 *  - portrait_path: RUTA relativa de imagen (imageUrl la vuelve absoluta)
 *  - phrases: array de strings (si aplica)
 */
export function normalizeItem(type, item) {
  const t = sanitizeType(type);

  if (t === "characters") {
    return {
      id: toIdString(item.id, item.name),
      name: item.name,
      occupation: item.occupation,
      portrait_path:
        item.portrait_path || item.portrait || item.image || item.imageUrl || item.img || "",
      phrases: Array.isArray(item.phrases) ? item.phrases : [],
    };
  }

  if (t === "episodes") {
    // Si falta imagen, la construimos por ID para NO caer siempre en "/episode/1.webp".
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
      phrases: item.quote ? [item.quote] : [],
    };
  }

  // locations
  const locId = item.id || item.location_id || item.slug || item.name;
  const locExplicit = item.image_path || item.image || item.imageUrl || item.img || "";
  const locPortrait = locExplicit || (locId ? `/location/${locId}.webp` : "");

  return {
    id: toIdString(locId, item.name || "location"),
    name: item.name || item.title || "Location",
    occupation: item.type ? `Tipo: ${item.type}` : "Locación",
    portrait_path: locPortrait,
    phrases: [],
  };
}

/* ===========================
 *  Detalle por ID (GET /:type/:id)
 * =========================== */

/**
 * Comodín: obtiene detalle por tipo+id (por si quieres un solo entrypoint).
 * Ejemplos:
 *  - getResourceById("characters", 1)
 *  - getResourceById("episodes",  23)
 *  - getResourceById("locations", 5)
 */
export async function getResourceById(type, id, signal) {
  const safeType = sanitizeType(type);
  const res = await http.get(`/${safeType}/${id}`, { signal });
  return res.data;
}

/** Detalle de PERSONAJE por id  → GET /characters/:id */
export async function getCharacter(id, signal) {
  const res = await http.get(`/characters/${id}`, { signal });
  return res.data;
}

/** Detalle de EPISODIO por id   → GET /episodes/:id */
export async function getEpisode(id, signal) {
  const res = await http.get(`/episodes/${id}`, { signal });
  return res.data;
}

/** Detalle de LOCACIÓN por id   → GET /locations/:id */
export async function getLocation(id, signal) {
  const res = await http.get(`/locations/${id}`, { signal });
  return res.data;
}

/* ===========================
 *  Helpers opcionales para detalle normalizado
 *  (útiles si tu DetailPage quiere el mismo shape que la tarjeta)
 * =========================== */

/**
 * Obtiene y NORMALIZA un detalle por tipo+id.
 * Si el backend de detalle trae campos diferentes al listado,
 * esta función te evita condicionar en el componente.
 */
export async function getNormalizedDetail(type, id, signal) {
  const raw = await getResourceById(type, id, signal);
  return normalizeItem(type, raw);
}

/**
 * http.js
 * -------
 * Crea y exporta una **instancia de Axios** con configuración común
 * para todas tus llamadas HTTP (baseURL, timeout, interceptores, etc.).
 *
 * ¿Por qué usar una instancia?
 * - Centralizas opciones (baseURL, cabeceras, timeouts).
 * - Agregas "interceptores" para manejar respuestas/errores en un solo lugar.
 * - Mantienes tu código de componentes limpio (solo importas `http` y haces http.get/post/...).
 *
 * Requisitos:
 * - `npm i axios`
 *
 * Notas sobre Vite y variables de entorno:
 * - En Vite, las variables que quieras usar en el navegador deben empezar por `VITE_`.
 * - Crea un archivo `.env` en la raíz del proyecto (mismo nivel que `package.json`) y agrega:
 *     VITE_SIMPSONS_API_BASE=https://thesimpsonsapi.com/api
 * - Si no existe o no la defines, usaremos esa misma URL como valor por defecto en este archivo.
 */

import axios from "axios";

/**
 * Creamos la instancia `http` con:
 * - baseURL: URL base de la API (prefiere la de `.env`, si existe).
 * - timeout: tiempo máximo para abortar una petición (en milisegundos).
 *
 * IMPORTANTE:
 * - `import.meta.env.VITE_SIMPSONS_API_BASE` solo existe en proyectos con Vite.
 * - Si no quieres usar `.env`, puedes cambiar `baseURL` directamente aquí.
 */
export const http = axios.create({
  baseURL:
    import.meta.env.VITE_SIMPSONS_API_BASE || "https://thesimpsonsapi.com/api",
  timeout: 10000, // 10 segundos: si la API tarda más, Axios lanza un error de timeout
});

/**
 * Interceptor de RESPUESTA
 * ------------------------
 * Este interceptor se ejecuta DESPUÉS de que la API responde.
 *
 * - Si la respuesta es OK (códigos 2xx), devolvemos la respuesta tal cual (`res`).
 * - Si hay error (red, timeout, 4xx, 5xx), "normalizamos" el error para que
 *   todos los catch manejen el mismo formato: `{ status, message }`.
 *
 * Beneficios:
 * - Estandarizas el manejo de errores en toda la app.
 * - Evitas repetir `try/catch` complicados en cada llamada.
 *
 * Tip: Si deseas capturar también el request anterior a la respuesta (para logs),
 * puedes usar `error.config` (contiene método, URL, headers, etc.).
 */
http.interceptors.response.use(
  // Caso éxito: dejamos pasar la respuesta
  (res) => res,

  // Caso error: construimos un objeto de error consistente
  (error) => {
    /**
     * `error.response` existe cuando el servidor respondió con un código no-2xx.
     * `error.message` incluye mensajes de Axios (timeout, cancelación, etc.).
     */

    // 👇 Detecta cancelación por AbortController
    if (axios.isCancel?.(error) || error.code === "ERR_CANCELED" || error.name === "CanceledError") {
      // Rechazamos con un "marcador" para que el componente lo ignore
      return Promise.reject({ canceled: true });
    }

    const status = error.response?.status ?? 0; // 0 si no hay respuesta del servidor (p. ej., sin conexión)
    const message =
      // Si el backend envía un mensaje de error en JSON, lo priorizamos
      error.response?.data?.message ||
      // Si no, usamos el mensaje estándar de Axios (timeout, cancel, network error…)
      error.message ||
      // Último recurso: un texto genérico
      "Error de red.";

    // Rechazamos con un objeto simple y predecible
    return Promise.reject({ status, message });
  }
);

/**
 * EJEMPLOS DE USO (en tus servicios o componentes):
 *
 * import { http } from "./api/http";
 *
 * // GET simple
 * const res = await http.get("/characters", { params: { page: 1 } });
 * console.log(res.data);
 *
 * // Pasar AbortController.signal para poder cancelar peticiones
 * const controller = new AbortController();
 * try {
 *   const res = await http.get("/characters", { signal: controller.signal });
 *   // ...
 * } finally {
 *   controller.abort(); // cancela si ya no la necesitas
 * }
 *
 * // POST con cuerpo JSON
 * const res = await http.post("/algo", { foo: "bar" });
 *
 * // Errores normalizados
 * try {
 *   const res = await http.get("/ruta-que-falla");
 * } catch (e) {
 *   // e tiene la forma { status, message }
 *   console.error(e.status, e.message);
 * }
 */

/**
 * OPCIONAL: Interceptor de REQUEST (ejemplo)
 * ------------------------------------------
 * Si quieres añadir cabeceras comunes (Accept, Authorization, etc.), descomenta:
 *
 * http.interceptors.request.use((config) => {
 *   config.headers = config.headers ?? {};
 *   config.headers.Accept = "application/json";
 *   // Si tuvieras un token:
 *   // const token = localStorage.getItem("token");
 *   // if (token) config.headers.Authorization = `Bearer ${token}`;
 *   return config;
 * });
 */

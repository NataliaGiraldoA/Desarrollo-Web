import { http } from "./http";


export async function listCharacters(page=1, signal){
    const response = await http.get('/Characters', {params: {page}, signal});
    const data = response.data;
    return Array.isArray(data) ? data : data?.results ?? data?.items ?? [];
}

export function cdnSizeForImagePath(imagePath, size="200px"){
    return "500px"; //por defecto character / otras img van a tener 500px
}

export function imageUrl(path,size){
    if(!path) return "";
    //1. absoluta se usa tal cual
    if(/^https?:\/\//i.test(path)) return path;
    //omitir el esquema
    if(/^\/\//.test(path)) return "https:" + path;

    //normalizarlo
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    //si no te pasan el size, lo calculamos
    const chosen = String(size ?? cdnSizeForImagePath(cleanPath).replace(/\/+$/g, ""));
    //nos asegura de que termine con una sola / cuando agregamos la url

    //armamos nuestra url

    return `https://cdn.thronesapi.com/${chosen}${cleanPath}`;
}
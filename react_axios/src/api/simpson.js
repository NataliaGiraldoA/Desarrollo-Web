import http from "./http";

export async function listCharacters(page=1, signal){
    const response = await http.get('/characters', {params: {page}, signal});
    const data = response.data;
    return Array.isArray(data) ? data : data?.results ?? data?.items ?? [];
}

//detalle de un personaje por id

export async function getCharacter(id, signal){
    const response = await http.get(`/characters/${id}`, {signal});
    return response.data;
}

/*
characters/500px
episode/200px
location/1280px
*/

export function cdnSizeForImagePath(imagePath, size="200px"){
    const p = String(imagePath);

    if (p.includes("/episode/")) return 200;
    if (p.includes("/location/")) return 1280;
    return 500; //por defecto character / otras img van a tener 500px

}

/*
Construir la url final del CDN:
  https://cdn.thesimpsonsapi.com/{size}{image_path}

  reglas:
  si ya por defecto viene con un esquema
  https://cdn.thesimpsonsapi.com/{size}{cleanPath}
*/

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

    return `https://cdn.thesimpsonsapi.com/${chosen}${cleanPath}`;
}
// src/hooks/useRadios.js
import { useState, useCallback } from "react";
import axios from "axios";

const RB = "/rb/json";
const TI = "/ti";

export default function useRadios() {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByCountry = useCallback(async (country = "Colombia") => {
    setLoading(true);
    setError(null);

    // 1) Radio Browser (proxied)
    try {
      const rb = await axios.get(
        `${RB}/stations/bycountry/${encodeURIComponent(country)}`,
        { timeout: 12000 }
      );
      if (Array.isArray(rb.data) && rb.data.length) {
        setRadios(
          rb.data.map((r) => ({
            id: r.stationuuid,
            name: r.name,
            country: r.country,
            streamUrls: [r.url_resolved].filter(Boolean),
            logo: r.favicon || null,
            tags: typeof r.tags === "string" ? r.tags : "",
            source: "RadioBrowser",
          }))
        );
        setLoading(false);
        return;
      }
    } catch (e) {
      // sigue a TuneIn
    }

    // 2) TuneIn (proxied)
    try {
      const ti = await axios.get(`${TI}/Search.ashx`, {
        params: { query: country, render: "json", formats: "mp3,aac" },
        timeout: 12000,
      });
      const body = ti?.data?.body || [];
      const audios = body.filter((x) => x.type === "audio");
      if (audios.length) {
        setRadios(
          audios.map((s) => ({
            id: s.guide_id,
            name: s.text,
            country,
            streamUrls: [s.URL].filter(Boolean),
            logo: s.image || null,
            tags: s.subtext || "",
            source: "TuneIn",
          }))
        );
        setLoading(false);
        return;
      }
    } catch (e) {
      // sigue al fallback
    }

    // 3) Fallback local (deja tu objeto aquí)
    const FALLBACK = {
      Colombia: [
        { id: "1", name: "Caracol Radio", country: "Colombia", streamUrls: ["https://18673.live.streamtheworld.com/CARACOL_RADIOAAC.aac"], logo: "https://cdn-profiles.tunein.com/s8442/images/logog.png", tags: "news", source: "Fallback" },
        { id: "2", name: "La Mega", country: "Colombia", streamUrls: ["https://19183.live.streamtheworld.com/LA_MEGAAAC.aac"], logo: "https://cdn-profiles.tunein.com/s47749/images/logog.png", tags: "pop", source: "Fallback" },
      ],
    };

    const fb = FALLBACK[country];
    if (fb) {
      setRadios(fb);
      setError("Usando radios predefinidas (APIs no disponibles)");
    } else {
      setRadios([]);
      setError(`No hay radios para "${country}".`);
    }
    setLoading(false);
  }, []);

  const fetchByName = useCallback(async (name = "La Mega") => {
    setLoading(true);
    setError(null);

    // 1) Radio Browser (proxied)
    try {
      const rb = await axios.get(
        `${RB}/stations/byname/${encodeURIComponent(name)}`,
        { timeout: 12000 }
      );
      if (Array.isArray(rb.data) && rb.data.length) {
        setRadios(
          rb.data.map((r) => ({
            id: r.stationuuid,
            name: r.name,
            country: r.country,
            streamUrls: [r.url_resolved].filter(Boolean),
            logo: r.favicon || null,
            tags: typeof r.tags === "string" ? r.tags : "",
            source: "RadioBrowser",
          }))
        );
        setLoading(false);
        return;
      }
    } catch (e) {
      // sigue a TuneIn
    }

    // 2) TuneIn (proxied)
    try {
      const ti = await axios.get(`${TI}/Search.ashx`, {
        params: { query: name, render: "json", formats: "mp3,aac" },
        timeout: 12000,
      });
      const body = ti?.data?.body || [];
      const audios = body.filter((x) => x.type === "audio");
      if (audios.length) {
        setRadios(
          audios.map((s) => ({
            id: s.guide_id,
            name: s.text,
            streamUrls: [s.URL].filter(Boolean),
            logo: s.image || null,
            tags: s.subtext || "",
            source: "TuneIn",
          }))
        );
        setLoading(false);
        return;
      }
    } catch (e) {
      // sigue al fallback
    }

    // 3) Fallback local (deja tu objeto aquí)
    const FALLBACK = {
      Colombia: [
        { id: "1", name: "Caracol Radio", country: "Colombia", streamUrls: ["https://18673.live.streamtheworld.com/CARACOL_RADIOAAC.aac"], logo: "https://cdn-profiles.tunein.com/s8442/images/logog.png", tags: "news", source: "Fallback" },
        { id: "2", name: "La Mega", country: "Colombia", streamUrls: ["https://19183.live.streamtheworld.com/LA_MEGAAAC.aac"], logo: "https://cdn-profiles.tunein.com/s47749/images/logog.png", tags: "pop", source: "Fallback" },
      ],
    };

    const fb = FALLBACK[name];
    if (fb) {
      setRadios(fb);
      setError("Usando radios predefinidas (APIs no disponibles)");
    } else {
      setRadios([]);
      setError(`No hay radios para "${name}".`);
    }
    setLoading(false);
  }, []);

  return { radios, loading, error, fetchByCountry, fetchByName };
}

import { useMemo, useState } from "react"
import { imageUrl } from "../api/simpson"

export default function EpisodeCard({ c, onClick }) {
    const imageRel = c?.image || c?.imageUrl || c?.thumbnail || "";

    const src = useMemo(() => (imageRel ? imageUrl(imageRel) : ""), [imageRel]);

    const [imgOk, setImgOk] = useState(true);

    return (
        <li
            role="button"
            tabIndex={0}
            onClick={() => onClick?.(c)}
            onKeyDown={(e) => (e.key === "Enter" ? onClick?.(c) : null)}

            style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                cursor: "pointer",
                background: "#fff",
                transition: "box-shadow .15s ease",
            }}
            // Efecto visual de hover (sombra)
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
            {src && imgOk ? (
                <img                    // clave única para forzar recarga si la URL cambia
                    src={src}                         // URL final del CDN
                    alt={c?.name ?? "Episodio"}      // texto alternativo (accesibilidad)
                    loading="lazy"                    // carga diferida para mejorar rendimiento
                    style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 8,
                        background: "#f6f7fb",
                    }}
                    onError={() => setImgOk(false)}
                />

            ) : (
                <div
                    style={{
                        height: 180,
                        borderRadius: 8,
                        background:
                            "repeating-linear-gradient(45deg, #eef2ff 0 10px, #e0e7ff 10px 20px)",
                        display: "grid",
                        placeItems: "center",
                        color: "#475569",
                        fontSize: 12,
                        textAlign: "center",
                        padding: 8,
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>Sin imagen</div>
                        {import.meta.env.DEV && src && (
                            <a
                                href={src}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#2563eb", textDecoration: "underline" }}
                            >
                                Abrir URL
                            </a>
                        )}
                    </div>
                </div>
            )}

            <h3 style={{fontWeight: "bold", color: "black"}}>{c?.name}</h3>
            <small style={{ color: "#475569" }}>Airdate: {c?.airdate || "—"}</small>
            <p style={{color:"black"}}>{c?.synopsis}</p>
        </li>
    );
}
import { use, useMemo, useState } from "react"
import { imageUrl } from "../api/simpson"

export default function CharacterCard({ c, onClick }) {
    const portraitRel = c?.portraitRel || c?.portrait || c?.image || c?.imageUrl || c?.thumbnail || "";

    //si potraitreal existe devuelve la url final /usememo evita recalcular la url para mejorar el rendimiento
    const src = useMemo(() => (portraitRel ? imageUrl(portraitRel) : ""), [portraitRel]);

    const [imgOk, setImgOk] = useState(true);
    return (
        <li
            role="button"
            tabIndex={0}
            onClick={() => onClick?.(c)}
            onKeyDown={(e) => (e.key === "Enter" ? onClick?.(c) : null)}
            /**
             * Estilos inline minimalistas (puedes moverlos a .css o Tailwind si quieres):
             */
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
                <img
                    src={src}                         // URL final del CDN
                    alt={c?.name ?? "Personaje"}      // texto alternativo (accesibilidad)
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
            <small style={{ color: "#475569" }}>{c?.occupation || "—"}</small>
            {console.log(c?.name)}

            {Array.isArray(c?.phrases) && c.phrases[0] && (
                <p style={{ margin: "6px 0 0", fontStyle: "italic", color: "#334155" }}>
                    “{c.phrases[0]}”
                </p>
            )}
        </li>
    );
}

import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../api/game_of_thrones";
import "../css/Characters.css";

export default function CharacterCard({ c, onClick }) {
    const portraitRel = c?.imageUrl || c?.image || c?.thumbnail || "";
    const src = useMemo(() => (portraitRel ? imageUrl(portraitRel) : ""), [portraitRel]);
    const [imgOk, setImgOk] = useState(true);
    
    useEffect(() => setImgOk(true), [src]);

    const onKey = (e) => {
        if (e.key === "Enter") onClick?.();
    };

    return (
        <div
            className="card"
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={onKey}
        >
            <Link className="card__wrap" to={`/detail/character/${c.id}`} state={{ item: c }}>
                {src && imgOk ? (
                    <img
                        className="card__img"
                        src={src}
                        alt={c?.fullName ?? c?.name ?? "Personaje"}
                        loading="lazy"
                        onError={() => setImgOk(false)}
                    />
                ) : (
                    <div className="card__placeholder">
                        <div className="card__placeholderText">Sin imagen</div>
                        {process.env.NODE_ENV === "development" && src && (
                            <a 
                                className="card__link" 
                                href={src} 
                                target="_blank" 
                                rel="noreferrer"
                            >
                                Abrir URL
                            </a>
                        )}
                    </div>
                )}
                <h3 className="card__title">{c?.fullName ?? c?.name}</h3>
                <small className="card__subtitle">Title: {c?.title || "—"}</small>
                <p className="card__house">House: {c?.family || "—"}</p>
            </Link>
        </div>
    );
}
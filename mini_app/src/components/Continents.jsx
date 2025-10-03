import { Link } from "react-router-dom";
import "../css/Characters.css";

export default function ContinentCard({ c, onClick }) {
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
            <Link className="card__wrap" to={`/detail/continent/${c.id}`} state={{ item: c }}>
                <h3 className="card__title">{c?.name ?? "Continente"}</h3>
                <small className="card__subtitle">ID: {c?.id || "—"}</small>
            </Link>
        </div>
    );
}
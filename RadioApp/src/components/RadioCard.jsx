import { useContext } from "react";
import { RadioContext } from "../contexts/RadioContext.jsx";
import "../css/RadioCard.css";
import defaultLogo from "../assets/record_player.avif";
export default function RadioCard({ radio }) {
  const { currentStation, setCurrentStation, setIsPlaying } = useContext(RadioContext);
  
  const isCurrentStation = currentStation?.id === radio.id;

  const handlePlay = () => {
    setCurrentStation(radio);
    setIsPlaying(true);
  };


  const logoSrc = radio.logo && radio.logo.trim() !== "" ? radio.logo : defaultLogo;

  return (
    <div className={`card ${isCurrentStation ? "card--active" : ""}`}>
      <img
        src={logoSrc}
        alt={radio.name}
        className="card__img"
        onError={(e) => (e.target.src = defaultLogo)}
      />
      <h3 className="card__title">{radio.name}</h3>
      <p className="card__subtitle">{radio.country}</p>

      <button className="btn" onClick={handlePlay}>
        {isCurrentStation ? "Reproduciendo" : "▶ Reproducir"}
      </button>
    </div>
  );
}
import RadioCard from "./RadioCard.jsx";

export default function RadioList({ radios }) {
  if (!radios?.length) return <p className="status">No hay radios cargadas.</p>;

  return (
    <div className="grid">
      {radios.map((radio) => (
        <RadioCard key={radio.stationuuid || radio.id} radio={radio} />
      ))}
    </div>
  );
}
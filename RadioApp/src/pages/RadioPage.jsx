import { useEffect, useState } from "react";
import useRadios from "../hooks/useRadios.js";
import RadioList from "../components/RadioList.jsx";

export default function RadioPage() {
  const { radios, loading, error, fetchByCountry, fetchByName } = useRadios();
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [searchType, setSearchType] = useState("country");

  useEffect(() => {
    fetchByCountry("Colombia");
  }, [fetchByCountry]);

  const handleCountrySearch = () => {
    setSearchType("country");
    fetchByCountry(country);
  };

  const handleNameSearch = () => {
    setSearchType("name");
    fetchByName(name);
  };

  const handleQuickCountry = (countryName) => {
    setCountry(countryName);
    setSearchType("country");
    fetchByCountry(countryName);
  };

  const filteredRadios = () => {
    if (searchType === "country" && name) {
      return radios.filter((radio) =>
        radio.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    return radios;
  };

  return (
    <section className="panel">

      <div className="search-controls">
        <label>
          País:
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <button onClick={handleCountrySearch}>Buscar por país</button>

        <label>
          Emisora:
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button onClick={handleNameSearch}>Buscar por emisora</button>
      </div>

      <div className="quick-buttons">
        <button onClick={() => handleQuickCountry("Colombia")}>Colombia</button>
        <button onClick={() => handleQuickCountry("The United States of America")}>USA</button>
        <button onClick={() => handleQuickCountry("Italy")}>Italia</button>
        <button onClick={() => handleQuickCountry("United Kingdom")}>United Kingdom</button>
        <button onClick={() => handleQuickCountry("Argentina")}>Argentina</button>
        <button onClick={() => handleQuickCountry("Venezuela")}>Venezuela</button>
        <button onClick={() => handleQuickCountry("Spain")}>España</button>
        <button onClick={() => handleQuickCountry("Polony")}>Polonia</button>
        <button onClick={() => handleQuickCountry("Portugal")}>Portugal</button>
        <button onClick={() => handleQuickCountry("Brazil")}>Brasil</button>
        <button onClick={() => handleQuickCountry("Switzerland")}>Suiza</button>
        <button onClick={() => handleQuickCountry("Monaco")}>Monaco</button>
      </div>

      {loading && <p className="status">Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <RadioList radios={filteredRadios().slice(0, 10)} />
      )}
    </section>
  );
}
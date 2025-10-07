import { Routes, Route, Link } from "react-router-dom";
import { RadioProvider } from "./contexts/RadioContext.jsx";
import Home from "./pages/Home.jsx";
import RadioPage from "./pages/RadioPage.jsx";
import PlayBar from "./components/PlayBar.jsx";
import "./App.css";

export default function App() {
  return (
    <RadioProvider>
      <div className="container">
        <header className="header">
          <h1>RadioFy</h1>
          <nav className="nav">
            <Link to="/">Inicio</Link> | <Link to="/radios">Radios</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/radios" element={<RadioPage />} />
        </Routes>

        <PlayBar />
      </div>
    </RadioProvider>
  );
}
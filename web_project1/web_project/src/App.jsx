import React from "react";
import Encabezado from "./components/Encabezado"
import Home from "./components/Home"
import Cards from "./components/Cards";
import Footer from "./components/Footer";

function App(){
//const saludo = "Holi";
  return(
  <div>
    <Encabezado />
    <Home />
    <Cards />
    <Footer />
  </div>
  );
}

export default App
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cards from "./components/Cards";
import Login from "./components/Login";
import ToDo from "./components/ToDo";

export default function App() {
  const [sessionActive, setSessionActive] = useState(false)
  const [user, setUser] = useState(null)


  //Tema
  const [theme, setTheme] = useState("light");

  //Cargamos los estados del localStorage al iniciar

  useEffect(() => {
    const ses = localStorage.getItem("sesion") === "activa";
    const usu = JSON.parse(localStorage.getItem("usuario") || "null");
    setSessionActive(ses);
    setUser(usu);
  }, []);

  //Tema
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);


  const handleLoginSucces = () => {
    setSessionActive(true);
    setUser(JSON.parse(localStorage.getItem("usuario") || "null"));
  };

  const handleLogout = () => {
    setSessionActive(false);
    localStorage.removeItem("sesion");
    localStorage.removeItem("usuario");
    setUser(null)
  };

  //Tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!sessionActive) {
    //Muestra el login si no hay sesión
    return <Login onLogin={handleLoginSucces} />

  }
  return (
    <>
      <Navbar 
      user={user}
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
      
      />
      <main className="main-content">

        {/*ToDo por usuario*/}
        <ToDo user={user}/>

        <Cards titulo={"TS12"} descripcion={"The life of a showgirl"} />
        <Cards titulo={"TS11"} descripcion={"The tortured poets departmen"} />
        <Cards titulo={"TS10"} descripcion={"Midnights"} />


      </main>

      <footer>
        <Footer />
      </footer>

    </>

  );
}


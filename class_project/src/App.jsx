import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cards from "./components/Cards";
import Login from "./components/Login";

export default function App() {
  const [sessionActive, setSessionActive] = useState(false)
  const [user, setUser] = useState(null)

  //Cargamos los estados del localStorage al iniciar

  useEffect(() => {
    const ses = localStorage.getItem("sesion") === "activa";
    const usu = JSON.parse(localStorage.getItem("usuario") || "null");
    setSessionActive(ses);
    setUser(usu);
  }, []);
  const handleLoginSucces = () =>{
    setSessionActive(true);
    setUser(JSON.parse(localStorage.getItem("usuario") || "null"));
  };

  const handleLogout = () => {
    setSessionActive(false);
    localStorage.removeItem("sesion");
    setUser(null)
  };

  if(!sessionActive){
    //Muestra el login si no hay sesión
    return <Login onLogin={handleLoginSucces}/>



  }
  return (
    <>
    <Navbar user={user} onLogout={handleLogout}/>
    <main className="main-content">
      <Cards titulo={"TS12"} descripcion={"The life of a showgirl"}/>
      <Cards titulo={"TS11"} descripcion={"The tortured poets departmen"}/>
      <Cards titulo={"TS1"} descripcion={"Midnights"}/>

    </main>

    <footer>
      <Footer />
    </footer>

    </>

  );
}


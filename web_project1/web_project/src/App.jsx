import React, { useEffect } from "react";
import Encabezado from "./components/Encabezado"
import Home from "./components/Home"
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import { useState } from "react";
import Login from "./components/Login";
import Form from "./components/Form";

export default function App(){
  const [sessionActive, setSessionActive] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const ses = localStorage.getItem("Session") === "active";
    const usu = JSON.parse(localStorage.getItem("user") || "null");
    setSessionActive(ses);
    setUser(usu);
  }, []);

  const handleLoginSuccess = () => {
    setSessionActive(true);
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  };
  const handleLogout = () => {
    setSessionActive(false);
    localStorage.removeItem("Session");
    setUser(null);
  };

  if (!sessionActive) {
    // Show login if no session is active
    return <Login onLogin={handleLoginSuccess} />;
  }

//const saludo = "Holi";
  return(
  <div>
    <Encabezado user={user} onLogout={handleLogout} />
    <main className="main-content"> 
      <Home />
      <Cards />
      <Form />
    </main>
    
    <footer><Footer /></footer>
    
  </div>
  );
}


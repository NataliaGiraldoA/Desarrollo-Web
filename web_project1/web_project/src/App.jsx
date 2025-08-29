import React, { useEffect } from "react";
import Encabezado from "./components/Encabezado"
import Home from "./components/Home"
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import { useState } from "react";
import Login from "./components/Login";
import Form from "./components/Form";
import ToDo from "./components/ToDo";
import Dashboard from "./components/Dashboard";

export default function App(){
  const [sessionActive, setSessionActive] = useState(false);
  const [user, setUser] = useState(null);

  //Theme
  const [theme, setTheme] = useState("light");

  //Load states from localStorage on start
  useEffect(() => {
    const ses = localStorage.getItem("Session") === "active";
    const usu = JSON.parse(localStorage.getItem("usuario") || "null");
    setSessionActive(ses);
    setUser(usu);
  }, []);

  //Theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const handleLoginSuccess = (u) => {
    setSessionActive(true);
    setUser(u);
  };
  const handleLogout = () => {
    setSessionActive(false);
    localStorage.removeItem("Session");
    localStorage.removeItem("usuario");
    setUser(null);
  };

  //Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!sessionActive) {
    // Show login if no session is active
    return <Login onLogin={handleLoginSuccess} />;
  }

//const saludo = "Holi";
  return(
  <div>
    <Encabezado user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
    <main className="main-content"> 
      <Home user={user}/>
      <ToDo user={user}/>
      <Dashboard user={user}/>
      <Cards />
      <Form />
    </main>
    
    <footer><Footer /></footer>
    
  </div>
  );
}


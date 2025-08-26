import React, { useEffect } from "react";
import Encabezado from "./components/Encabezado"
import Home from "./components/Home"
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import { useState } from "react";
import Login from "./components/Login";
import Form from "./components/Form";
import ToDo from "./components/ToDo";

export default function App(){
  const [sessionActive, setSessionActive] = useState(false);
  const [user, setUser] = useState(null);

  //Theme
  const [theme, setTheme] = useState("light");

  //Load states from localStorage on start
  useEffect(() => {
    const ses = localStorage.getItem("Session") === "active";
    const usu = JSON.parse(localStorage.getItem("user") || "null");
    setSessionActive(ses);
    setUser(usu);
  }, []);

  //Theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const handleLoginSuccess = () => {
    setSessionActive(true);
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  };
  const handleLogout = () => {
    setSessionActive(false);
    localStorage.removeItem("Session");
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
      <Home />
      <ToDo user={user}/>
      <Cards />
      <Form />
    </main>
    
    <footer><Footer /></footer>
    
  </div>
  );
}


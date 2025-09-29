/**
 * main.jsx
 * --------
 * Punto de entrada de la app. Monta:
 * - React Router para rutas SPA.
 * - SettingsProvider (Context) para compartir type/pageSize globalmente.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import App from "./App";
import DetailPage from "./pages/DetailPage";
import "./app.css"; // estilos globales base (layout, toolbar, grid)

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirige "/" a /characters */}
          <Route path="/" element={<Navigate to="/characters" replace />} />

          {/* Misma App reutilizada; el tipo inicial lo setea cada ruta */}
          <Route path="/characters" element={<App initialType="characters" />} />
          <Route path="/episodes"   element={<App initialType="episodes" />} />
          <Route path="/locations"  element={<App initialType="locations" />} />

          {/* Detalle por tipo/id */}
          <Route path="/detail/:type/:id" element={<DetailPage />} />

          {/* 404 simple */}
          <Route path="*" element={<div className="app"><h2>404</h2><p>Ruta no encontrada.</p></div>} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </React.StrictMode>
);

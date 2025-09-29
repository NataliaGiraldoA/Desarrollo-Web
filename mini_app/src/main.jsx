// main.jsx / index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import App from './App';
import CharacterDetail from './pages/DetailPage';
import './index.css';

function Root() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/detail/character/:id" element={<CharacterDetail />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

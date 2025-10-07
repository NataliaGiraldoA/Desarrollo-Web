import { createContext, useState, useRef } from "react";
/* eslint-disable react-refresh/only-export-components */
export const RadioContext = createContext();

export function RadioProvider({ children }) {
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  const value = {
    currentStation,
    setCurrentStation,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    audioRef,
  };

  return (
    <RadioContext.Provider value={value}>
      {children}
    </RadioContext.Provider>
  );
}
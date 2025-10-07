import { useEffect, useContext, useState } from "react";
import { RadioContext } from "../contexts/RadioContext.jsx";
import "../css/PlayBar.css";

export default function PlayBar() {
  const {
    currentStation,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    audioRef,
  } = useContext(RadioContext);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Manejar play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioRef.current.play().catch((err) => {
        console.error("Error al reproducir:", err);
        setIsPlaying(false);
      });
    }
  };

  // Manejar cambio de volumen
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Manejar click en la barra de progreso
  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration || !isFinite(duration) || duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Sincronizar eventos del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      const audioDuration = audio.duration;
      console.log('Audio duration:', audioDuration, 'isFinite:', isFinite(audioDuration));
      
      // Para streams de radio en vivo, duration puede ser Infinity o NaN
      if (isFinite(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
        console.log('Setting duration to:', audioDuration);
      } else {
        // Para streams en vivo, no mostramos barra de progreso funcional
        setDuration(0);
        console.log('Live stream detected, setting duration to 0');
      }
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const handleCanPlay = () => {
      const audioDuration = audio.duration;
      console.log('CanPlay - Audio duration:', audioDuration);
      
      if (isFinite(audioDuration) && audioDuration > 0) {
        setDuration(audioDuration);
      } else {
        setDuration(0);
      }
    };
    const handleError = (e) => {
      console.error("Error al cargar el stream:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("error", handleError);
    };
  }, [setIsPlaying]);

  // Auto-reproducir cuando cambia la estación
  useEffect(() => {
    if (currentStation && audioRef.current) {
      const audio = audioRef.current;
      audio.volume = volume;
      setCurrentTime(0);
      setDuration(0);
      audio.play().catch((err) => {
        console.error("Error al reproducir:", err);
        setIsPlaying(false);
      });
    }
  }, [currentStation, volume, setIsPlaying]);

  if (!currentStation) return null;

  return (
    <div className="player-bar">
      {/* Barra de reproducción superior */}
      <div className={`progress-bar ${!duration || !isFinite(duration) || duration === 0 ? 'progress-bar--live' : ''}`} onClick={handleProgressClick}>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ 
              width: duration > 0 && isFinite(duration) ? `${(currentTime / duration) * 100}%` : (isPlaying ? '100%' : '0%')
            }}
          ></div>
        </div>
      </div>
      
      {/* Contenido principal de la barra */}
      <div className="player-content">
        {/* Información de la estación (izquierda) */}
        <div className="player-info">
          {currentStation.logo && (
            <img
              src={currentStation.logo}
              alt={currentStation.name}
              className="player-logo"
            />
          )}
          <div className="player-text">
            <span className="player-title">{currentStation.name}</span>
            <span className="player-country">{currentStation.country}</span>
          </div>
        </div>

        {/* Controles de reproducción (centro) */}
        <div className="player-controls">
          <button
            className="player-btn player-btn--play"
            onClick={togglePlay}
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Controles de volumen (derecha) */}
        <div className="player-volume">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="volume-icon"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            title={`Volumen: ${Math.round(volume * 100)}%`}
          />
          <span className="volume-label">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentStation.streamUrls?.[0]}
        preload="none"
      />
    </div>
  );
}
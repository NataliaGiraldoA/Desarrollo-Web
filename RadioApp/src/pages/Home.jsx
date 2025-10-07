import { Link} from 'react-router-dom';
import '../css/Home.css';

export default function Home() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Radio<span className="accent">Fy</span>
          </h1>
          <p className="hero-subtitle">
            Descubre el mundo a través de las ondas
          </p>
          <p className="hero-description">
            Conecta con estaciones de radio de todo el mundo. Disfruta de música, noticias y cultura 
            sin límites. Tu ventana al universo radiofónico está aquí.
          </p>
          
          <div className="cta-buttons">
            <Link to="/radios" className="btn-primary">
              Explorar Radios
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Estaciones</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Países</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Disponible</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">¿Por qué elegir RadioFy?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">G</div>
              <h3 className="feature-title">Global</h3>
              <p className="feature-description">
                Accede a miles de estaciones de radio de todos los continentes. 
                Explora culturas y descubre nueva música.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">HD</div>
              <h3 className="feature-title">Alta Calidad</h3>
              <p className="feature-description">
                Transmisión en alta calidad para una experiencia auditiva excepcional. 
                Disfruta de tu música favorita con sonido cristalino.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">F</div>
              <h3 className="feature-title">Rápido</h3>
              <p className="feature-description">
                Conexión rápida y sin interrupciones. Cambia entre estaciones 
                de forma fluida y sin demoras.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

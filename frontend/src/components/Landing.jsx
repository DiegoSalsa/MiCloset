import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  if (isLoggedIn) {
    navigate('/outfits');
    return null;
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="logo-title">MiCloset</h1>
          <nav className="landing-nav">
            <button onClick={() => navigate('/login')} className="nav-btn login-btn">
              Iniciar Sesión
            </button>
            <button onClick={() => navigate('/register')} className="nav-btn register-btn">
              Crear Cuenta
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Tu Asistente Personal de Moda</h2>
          <p>Descubre outfits perfectos basados en tu estilo, preferencias y lo que tienes en tu closet</p>
          
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')} className="cta-btn primary">
              Comenzar Ahora
            </button>
            <button onClick={() => navigate('/login')} className="cta-btn secondary">
              Ya tengo cuenta
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="fashion-icon">👗</div>
        </div>
      </section>

      <section className="features">
        <h3>¿Cómo funciona?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">1</div>
            <h4>Agrega tus prendas</h4>
            <p>Carga las fotos de tu closet y organiza tu ropa por categorías</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">2</div>
            <h4>Selecciona ocasión</h4>
            <p>Elige para qué ocasión necesitas un outfit (casual, formal, playa, etc.)</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">3</div>
            <h4>Recibe recomendaciones</h4>
            <p>Nuestro algoritmo genera outfits inteligentes en base a tu estilo</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">4</div>
            <h4>Califica y aprende</h4>
            <p>El sistema aprende de tus gustos y mejora sus recomendaciones</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h3>Ventajas</h3>
        <div className="benefits-list">
          <div className="benefit">
            <span className="check">✓</span>
            <p>Ahorra tiempo decidiendo qué ponerte cada día</p>
          </div>
          <div className="benefit">
            <span className="check">✓</span>
            <p>Aprende qué combinaciones te funcionan mejor</p>
          </div>
          <div className="benefit">
            <span className="check">✓</span>
            <p>Descubre nuevas formas de usar tu ropa</p>
          </div>
          <div className="benefit">
            <span className="check">✓</span>
            <p>Sistema inteligente que se adapta a ti</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>MiCloset - Tu asistente de moda personal</p>
      </footer>
    </div>
  );
};

export default Landing;

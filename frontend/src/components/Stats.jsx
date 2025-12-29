import React, { useEffect, useState } from 'react';
import { outfitService } from '../services/api';
import Navbar from './Navbar';
import './Stats.css';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await outfitService.getStats(token);
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stats-container loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="stats-container error">{error}</div>;
  }

  if (!stats) {
    return <div className="stats-container">No hay datos disponibles</div>;
  }

  const getRejectColor = (percentage) => {
    if (percentage >= 75) return '#ff4444'; // Rojo
    if (percentage >= 50) return '#ff8844'; // Naranja
    if (percentage >= 25) return '#ffbb44'; // Amarillo
    return '#44cc44'; // Verde
  };

  return (
    <>
      <Navbar />
      <div className="stats-container">
        <h1>Mis Estadísticas</h1>

      {/* Resumen General */}
      <section className="stats-section">
        <h2>Resumen General</h2>
        <div className="summary-cards">
          <div className="card">
            <div className="card-label">Total de Outfits</div>
            <div className="card-value">{stats.ratings?.total || 0}</div>
          </div>
          <div className="card success">
            <div className="card-label">Me Encantaron</div>
            <div className="card-value">{stats.ratings?.liked || 0}</div>
          </div>
          <div className="card danger">
            <div className="card-label">No Me Gustaron</div>
            <div className="card-value">{stats.ratings?.disliked || 0}</div>
          </div>
        </div>
      </section>

      {/* Prendas Favoritas */}
      <section className="stats-section">
        <h2>Prendas Favoritas</h2>
        {stats.favoriteGarments && stats.favoriteGarments.length > 0 ? (
          <div className="items-grid">
            {stats.favoriteGarments.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <span className="category-badge">{item.category}</span>
                </div>
                <div className="item-stats">
                  <div className="stat">
                    <span className="label">Positivos:</span>
                    <span className="value">{item.positive_count}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Negativos:</span>
                    <span className="value">{item.negative_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Aún no tienes prendas favoritas. ¡Crea outfits y califica!</p>
        )}
      </section>

      {/* Prendas Problemáticas */}
      <section className="stats-section warning">
        <h2>Prendas Frecuentemente Rechazadas</h2>
        {stats.problematicGarments && stats.problematicGarments.length > 0 ? (
          <div className="items-grid">
            {stats.problematicGarments.map((item) => (
              <div key={item.id} className="item-card problematic">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <span className="category-badge">{item.category}</span>
                </div>
                <div className="rejection-bar">
                  <div
                    className="rejection-fill"
                    style={{
                      width: `${Number(item.reject_percentage)}%`,
                      backgroundColor: getRejectColor(Number(item.reject_percentage)),
                    }}
                  ></div>
                </div>
                <div className="item-stats">
                  <div className="stat">
                    <span className="label">% Rechazo:</span>
                    <span 
                      className="value reject-percentage"
                      style={{ color: getRejectColor(Number(item.reject_percentage)) }}
                    >
                      {Number(item.reject_percentage).toFixed(1)}%
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Rechazos/Aceptados:</span>
                    <span className="value">{item.reject_count}/{item.accept_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">¡Excelente! Todas tus prendas tienen buena aceptación.</p>
        )}
      </section>

      {/* Ocasiones Favoritas */}
      <section className="stats-section">
        <h2>Ocasiones Preferidas</h2>
        {stats.favoriteOccasions && stats.favoriteOccasions.length > 0 ? (
          <div className="preference-list">
            {stats.favoriteOccasions.map((item, idx) => (
              <div key={idx} className="preference-item">
                <div className="preference-label">{item.occasion}</div>
                <div className="preference-bar-container">
                  <div className="preference-bar">
                    <div
                      className="preference-fill"
                      style={{ width: `${Number(item.percentage)}%` }}
                    ></div>
                  </div>
                  <div className="preference-percentage">{Number(item.percentage).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Aún no tienes datos de ocasiones.</p>
        )}
      </section>

      {/* Climas Favoritos */}
      <section className="stats-section">
        <h2>Climas Preferidos</h2>
        {stats.favoriteWeather && stats.favoriteWeather.length > 0 ? (
          <div className="preference-list">
            {stats.favoriteWeather.map((item, idx) => (
              <div key={idx} className="preference-item">
                <div className="preference-label">{item.weather}</div>
                <div className="preference-bar-container">
                  <div className="preference-bar">
                    <div
                      className="preference-fill"
                      style={{ width: `${Number(item.percentage)}%` }}
                    ></div>
                  </div>
                  <div className="preference-percentage">{Number(item.percentage).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Aún no tienes datos de climas.</p>
        )}
      </section>

      {/* Colores Favoritos */}
      <section className="stats-section">
        <h2>Colores Favoritos</h2>
        {stats.favoriteColors && stats.favoriteColors.length > 0 ? (
          <div className="colors-grid">
            {stats.favoriteColors.map((color, idx) => (
              <div key={idx} className="color-item">
                <div
                  className="color-box"
                  style={{
                    backgroundColor: getColorByName(color),
                  }}
                ></div>
                <div className="color-name">{color}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Aún no tienes colores favoritos registrados.</p>
        )}
      </section>

      {/* Botón de Actualizar */}
      <button className="refresh-button" onClick={fetchStats}>
        🔄 Actualizar Estadísticas
      </button>
    </div>
    </>
  );
}

// Función auxiliar para mapear colores
function getColorByName(colorName) {
  const colorMap = {
    'negro': '#000000',
    'blanco': '#ffffff',
    'gris': '#808080',
    'rojo': '#ff0000',
    'azul': '#0000ff',
    'verde': '#00aa00',
    'amarillo': '#ffff00',
    'naranja': '#ff8800',
    'morado': '#aa00ff',
    'rosa': '#ff69b4',
    'marron': '#8b4513',
    'beige': '#f5f5dc',
    'caqui': '#bdb76b',
    'turquesa': '#40e0d0',
  };
  return colorMap[colorName?.toLowerCase()] || '#cccccc';
}

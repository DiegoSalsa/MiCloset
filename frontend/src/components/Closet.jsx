import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { garmentService } from '../services/api';
import Navbar from './Navbar';
import './Closet.css';

// Función para asignar emojis según categoría
const getEmojiForCategory = (categoryName) => {
  const emojiMap = {
    'Blusas': '👕',
    'Camisetas': '👕',
    'Pantalones': '👖',
    'Shorts': '👖',
    'Faldas': '👗',
    'Vestidos': '💃',
    'Hoodies': '🧥',
    'Sudaderas': '🧥',
    'Chaquetas': '🧥',
    'Abrigos': '🧥',
    'Zapatillas': '👟',
    'Zapatos': '👟',
    'Accesorios': '👜',
    'Cinturones': '👜',
    'Gorras': '🎩',
    'Sombreros': '🎩',
    'Bolsos': '👜',
    'Mochilas': '👜',
  };
  return emojiMap[categoryName] || '👔';
};

const Closet = () => {
  const [garments, setGarments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedGarments, setGroupedGarments] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        // Cargar prendas
        const garmentsRes = await garmentService.getGarments(token);
        const allGarments = garmentsRes.data.garments;
        setGarments(allGarments);

        // Cargar categorías
        const categoriesRes = await garmentService.getCategories(token);
        setCategories(categoriesRes.data.categories);

        // Agrupar prendas por categoría
        const grouped = {};
        categoriesRes.data.categories.forEach(category => {
          grouped[category.id] = {
            name: category.name,
            garments: allGarments.filter(g => g.category_id === category.id)
          };
        });
        setGroupedGarments(grouped);

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleDeleteGarment = async (garmentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta prenda?')) {
      try {
        const token = localStorage.getItem('token');
        await garmentService.deleteGarment(token, garmentId);
        
        // Actualizar la lista
        setGarments(garments.filter(g => g.id !== garmentId));
        
        // Reagrupar
        const grouped = {};
        categories.forEach(category => {
          grouped[category.id] = {
            name: category.name,
            garments: garments.filter(g => g.category_id === category.id && g.id !== garmentId)
          };
        });
        setGroupedGarments(grouped);
      } catch (error) {
        alert('Error al eliminar la prenda');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="closet-container">
          <div className="loading">Cargando tu closet...</div>
        </div>
      </>
    );
  }

  const totalGarments = Object.values(groupedGarments).reduce(
    (sum, cat) => sum + cat.garments.length, 
    0
  );

  return (
    <>
      <Navbar />
      <div className="closet-container">
        <div className="closet-header">
          <h2>📂 Mi Closet Digital</h2>
          <p className="closet-stats">Total de prendas: <strong>{totalGarments}</strong></p>
          <button className="add-garment-btn" onClick={() => navigate('/outfits')}>
            ➕ Agregar Prenda
          </button>
        </div>

        <div className="categories-container">
          {Object.entries(groupedGarments).map(([categoryId, categoryData]) => (
            <div key={categoryId} className="category-section">
              <div className="category-header">
                <span className="category-emoji">
                  {getEmojiForCategory(categoryData.name)}
                </span>
                <h3 className="category-name">{categoryData.name}</h3>
                <span className="category-count">({categoryData.garments.length})</span>
              </div>

              {categoryData.garments.length > 0 ? (
                <div className="garments-grid">
                  {categoryData.garments.map(garment => (
                    <div key={garment.id} className="garment-card">
                      <div className="garment-image">
                        <img 
                          src={garment.image_url || 'https://via.placeholder.com/200x250?text=' + encodeURIComponent(garment.name)}
                          alt={garment.name}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/200x250?text=Sin+imagen'}
                        />
                      </div>
                      <div className="garment-info">
                        <h4 className="garment-name">{garment.name}</h4>
                        {garment.color && (
                          <p className="garment-detail">
                            <span className="label">Color:</span> {garment.color}
                          </p>
                        )}
                        {garment.brand && (
                          <p className="garment-detail">
                            <span className="label">Marca:</span> {garment.brand}
                          </p>
                        )}
                        {garment.season && (
                          <p className="garment-detail">
                            <span className="label">Temporada:</span> {garment.season}
                          </p>
                        )}
                        {garment.condition && (
                          <p className="garment-detail">
                            <span className="label">Condición:</span> {garment.condition}
                          </p>
                        )}
                        {garment.tags && garment.tags.length > 0 && (
                          <div className="garment-tags">
                            {garment.tags.map((tag, idx) => (
                              <span key={idx} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="garment-actions">
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteGarment(garment.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-category">
                  <p>No tienes prendas en esta categoría</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {totalGarments === 0 && (
          <div className="empty-closet">
            <p>Tu closet está vacío</p>
            <p className="empty-message">¡Comienza agregando tus primeras prendas!</p>
            <button 
              className="primary-btn"
              onClick={() => navigate('/dashboard')}
            >
              Agregar Primera Prenda
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Closet;

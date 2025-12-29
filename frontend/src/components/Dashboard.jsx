import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { garmentService, outfitService } from '../services/api';
import Navbar from './Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [garments, setGarments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [occasion, setOccasion] = useState('casual');
  const [weather, setWeather] = useState('templado');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectedGarmentId, setRejectedGarmentId] = useState(null);
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
        setGarments(garmentsRes.data.garments);

        // Cargar categorías
        const categoriesRes = await garmentService.getCategories(token);
        setCategories(categoriesRes.data.categories);

      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleAddGarment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formData = new FormData(e.target);
    
    try {
      const response = await garmentService.createGarment(token, formData);
      setGarments([response.data.garment, ...garments]);
      setShowAddForm(false);
      e.target.reset();
    } catch (error) {
      alert('Error al agregar prenda: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  const handleGenerateOutfit = async () => {
    const token = localStorage.getItem('token');
    
    if (selectedCategories.length === 0) {
      alert('Selecciona al menos una categoría de prendas');
      return;
    }
    
    try {
      const response = await outfitService.generateRecommendation(
        token,
        occasion,
        weather,
        null,
        selectedCategories
      );
      setRecommendation(response.data.recommendations[0]);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'No se pudo generar recomendación'));
    }
  };

  const handleRateOutfit = async (liked) => {
    if (!recommendation) return;
    
    if (!liked) {
      // Si no gustó, mostrar modal para seleccionar prenda problemática
      setShowRejectionModal(true);
      return;
    }
    
    // Si gustó, guardar directamente
    const token = localStorage.getItem('token');
    try {
      await outfitService.rateOutfit(token, recommendation.id, {
        liked: true,
        garmentIds: recommendation.items.map(item => item.id),
        occasion,
        weather,
        rejectedGarmentId: null
      });
      
      alert('¡Excelente! Aprenderemos de tu gusto');
      setRecommendation(null);
    } catch (error) {
      alert('Error al calificar: ' + (error.response?.data?.error || 'Intenta de nuevo'));
    }
  };

  const handleConfirmRejection = async (garmentId) => {
    if (!recommendation) return;
    
    const token = localStorage.getItem('token');
    try {
      await outfitService.rateOutfit(token, recommendation.id, {
        liked: false,
        garmentIds: recommendation.items.map(item => item.id),
        occasion,
        weather,
        rejectedGarmentId: garmentId
      });
      
      alert('Entendido! Evitaremos esa prenda en futuros outfits');
      setRecommendation(null);
      setShowRejectionModal(false);
      setRejectedGarmentId(null);
    } catch (error) {
      alert('Error al calificar: ' + (error.response?.data?.error || 'Intenta de nuevo'));
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDeleteGarment = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta prenda?')) {
      const token = localStorage.getItem('token');
      try {
        await garmentService.deleteGarment(token, id);
        setGarments(garments.filter(g => g.id !== id));
      } catch (error) {
        alert('Error al eliminar prenda');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Cargando...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Agregar Prendas y Generar Outfits</h2>
          <p>Organiza tu closet y encuentra el outfit perfecto</p>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sección de Recomendación */}
        <section className="recommendation-section">
          <h2>Generador de Outfits</h2>
          
          <div className="recommendation-controls">
            <div className="control-group">
              <label>Ocasión:</label>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="playa">Playa</option>
                <option value="frio">Frío</option>
                <option value="calor">Calor</option>
                <option value="noche">Noche</option>
              </select>
            </div>
            
            <div className="control-group">
              <label>Clima:</label>
              <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                <option value="templado">Templado</option>
                <option value="frio">Frío</option>
                <option value="calido">Cálido</option>
              </select>
            </div>
          </div>

          <div className="categories-selection">
            <label>Selecciona tipos de prendas:</label>
            <div className="categories-grid">
              {categories.map(cat => (
                <label key={cat.id} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={handleGenerateOutfit}>
            Generar Outfit
          </button>

          {recommendation && (
            <div className="recommendation-display">
              <h3>Recomendación del día</h3>
              <div className="outfit-items">
                {recommendation.items.map((item) => (
                  <div key={item.id} className="outfit-item">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/200x250?text=' + encodeURIComponent(item.name)} 
                      alt={item.name}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/200x250?text=Sin+imagen'}
                    />
                    <p><strong>{item.name}</strong></p>
                    <p className="category">{item.category}</p>
                    {item.color && <p className="color">Color: {item.color}</p>}
                  </div>
                ))}
              </div>
              <p className="reasoning">{recommendation.reasoning}</p>
              <div className="confidence-score">Confianza: {recommendation.score}%</div>
              
              <div className="rating-buttons">
                <button 
                  className="rating-btn thumbs-up" 
                  onClick={() => handleRateOutfit(true)}
                  title="Me encantó este outfit"
                >
                  Me encanta
                </button>
                <button 
                  className="rating-btn thumbs-down" 
                  onClick={() => handleRateOutfit(false)}
                  title="No me gustó este outfit"
                >
                  No me gusta
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Sección de Prendas */}
        <section className="garments-section">
          <div className="section-header">
            <h2>Mi Closet ({garments.length} prendas)</h2>
            <button 
              className="add-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancelar' : 'Agregar Prenda'}
            </button>
          </div>

          {showAddForm && (
            <form className="add-form" onSubmit={handleAddGarment}>
              <input type="text" name="name" placeholder="Nombre de la prenda" required />
              
              <select name="categoryId" required>
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              
              <input type="text" name="color" placeholder="Color" />
              <input type="text" name="size" placeholder="Talla" />
              <input type="text" name="brand" placeholder="Marca" />
              
              <select name="style">
                <option value="">Estilo (opcional)</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="deportivo">Deportivo</option>
                <option value="bohemio">Bohemio</option>
                <option value="clasico">Clásico</option>
                <option value="moderno">Moderno</option>
                <option value="elegante">Elegante</option>
              </select>
              
              <select name="season">
                <option value="">Temporada (opcional)</option>
                <option value="primavera">Primavera</option>
                <option value="verano">Verano</option>
                <option value="otoño">Otoño</option>
                <option value="invierno">Invierno</option>
                <option value="todo_ano">Todo el año</option>
              </select>
              
              <div className="file-input-wrapper">
                <label htmlFor="image-input">Selecciona una imagen (JPG, PNG, WebP)</label>
                <input 
                  id="image-input"
                  type="file" 
                  name="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  required 
                />
              </div>
              
              <textarea name="description" placeholder="Descripción (opcional)" rows="3"></textarea>
              <input type="text" name="tags" placeholder="Tags (separados por comas)" />
              
              <button type="submit">Guardar Prenda</button>
            </form>
          )}

          <div className="garments-grid">
            {garments.length === 0 ? (
              <p className="empty-message">Aún no tienes prendas. ¡Agrega la primera!</p>
            ) : (
              garments.map(garment => (
                <div key={garment.id} className="garment-card">
                  <img src={garment.image_url} alt={garment.name} />
                  <div className="garment-info">
                    <h4>{garment.name}</h4>
                    <p className="category">{garment.category}</p>
                    {garment.color && <p>Color: {garment.color}</p>}
                    {garment.size && <p>Talla: {garment.size}</p>}
                    <div className="garment-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteGarment(garment.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modal de Selección de Prenda Rechazada */}
      {showRejectionModal && recommendation && (
        <div className="modal-overlay" onClick={() => setShowRejectionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>¿Cuál prenda no te gustó?</h3>
            <p>Selecciona la prenda problemática para que la evitemos en futuros outfits:</p>
            
            <div className="rejection-options">
              {recommendation.items.map((item) => (
                <button
                  key={item.id}
                  className="rejection-btn"
                  onClick={() => handleConfirmRejection(item.id)}
                >
                  <img 
                    src={item.image_url || 'https://via.placeholder.com/80x100?text=' + encodeURIComponent(item.name)}
                    alt={item.name}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/80x100?text=Sin+imagen'}
                  />
                  <div className="rejection-info">
                    <strong>{item.name}</strong>
                    <p>{item.category}</p>
                  </div>
                </button>
              ))}
              <button
                className="rejection-btn cancel"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Dashboard;

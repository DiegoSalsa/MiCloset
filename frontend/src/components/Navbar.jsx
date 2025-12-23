import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="brand-title">MiCloset</h1>
        </div>

        <ul className="navbar-menu">
          <li>
            <button 
              className="nav-link" 
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button 
              className="nav-link" 
              onClick={() => navigate('/closet')}
            >
              Mi Closet
            </button>
          </li>
          <li>
            <button 
              className="nav-link" 
              onClick={() => navigate('/outfits')}
            >
              Crear Outfit
            </button>
          </li>
          <li>
            <button 
              className="nav-link" 
              onClick={() => navigate('/stats')}
            >
              Estadísticas
            </button>
          </li>
        </ul>

        <div className="navbar-user">
          <span className="user-name">{user.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

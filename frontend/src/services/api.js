import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api`;

const authService = {
  register: (email, password, username, gender, fullName) =>
    axios.post(`${API_URL}/auth/register`, { email, password, username, gender, fullName }),
  
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),
  
  getProfile: (token) =>
    axios.get(`${API_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
  
  updateProfile: (token, data) =>
    axios.put(`${API_URL}/auth/profile`, data, { headers: { Authorization: `Bearer ${token}` } })
};

const garmentService = {
  getGarments: (token) =>
    axios.get(`${API_URL}/garments`, { headers: { Authorization: `Bearer ${token}` } }),
  
  getCategories: (token) =>
    axios.get(`${API_URL}/garments/categories`, { headers: { Authorization: `Bearer ${token}` } }),
  
  createGarment: (token, data) =>
    axios.post(`${API_URL}/garments`, data, { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      } 
    }),
  
  updateGarment: (token, id, data) =>
    axios.put(`${API_URL}/garments/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  
  deleteGarment: (token, id) =>
    axios.delete(`${API_URL}/garments/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  
  searchGarments: (token, query, category, color) =>
    axios.get(`${API_URL}/garments/search`, {
      params: { query, category, color },
      headers: { Authorization: `Bearer ${token}` }
    })
};

const outfitService = {
  generateRecommendation: (token, occasion, weather, colorPreference, selectedCategories) =>
    axios.post(`${API_URL}/recommendations/generate`, { occasion, weather, colorPreference, selectedCategories }, 
      { headers: { Authorization: `Bearer ${token}` } }),
  
  rateOutfit: (token, recommendationId, data) =>
    axios.post(`${API_URL}/recommendations/${recommendationId}/rate`, data,
      { headers: { Authorization: `Bearer ${token}` } }),
  
  getHistory: (token) =>
    axios.get(`${API_URL}/recommendations/history`, { headers: { Authorization: `Bearer ${token}` } }),
  
  getStats: (token) =>
    axios.get(`${API_URL}/recommendations/stats`, { headers: { Authorization: `Bearer ${token}` } }),
  
  getPreferences: (token) =>
    axios.get(`${API_URL}/recommendations/preferences`, { headers: { Authorization: `Bearer ${token}` } }),
  
  updatePreferences: (token, preferences) =>
    axios.put(`${API_URL}/recommendations/preferences`, preferences,
      { headers: { Authorization: `Bearer ${token}` } }),
  
  getAllOutfits: (token) =>
    axios.get(`${API_URL}/outfits`, { headers: { Authorization: `Bearer ${token}` } }),
  
  getOutfit: (token, id) =>
    axios.get(`${API_URL}/outfits/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  
  createOutfit: (token, data) =>
    axios.post(`${API_URL}/outfits`, data, { headers: { Authorization: `Bearer ${token}` } }),
  
  updateOutfit: (token, id, data) =>
    axios.put(`${API_URL}/outfits/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  
  deleteOutfit: (token, id) =>
    axios.delete(`${API_URL}/outfits/${id}`, { headers: { Authorization: `Bearer ${token}` } })
};

export { authService, garmentService, outfitService };

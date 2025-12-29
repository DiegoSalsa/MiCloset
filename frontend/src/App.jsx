import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Closet from './components/Closet';
import Stats from './components/Stats';
import Dashboard from './components/Dashboard';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/closet" 
          element={
            <PrivateRoute>
              <Closet />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/outfits" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/stats" 
          element={
            <PrivateRoute>
              <Stats />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;

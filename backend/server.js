const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth');
const garmentsRoutes = require('./routes/garments');
const outfitRoutes = require('./routes/outfits');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/garments', garmentsRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Servidor MiCloset ejecutándose en http://localhost:${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Base de datos: ${process.env.DB_NAME}\n`);
});

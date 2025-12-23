const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

// Función helper para procesar tags
const parseTags = (tagsData) => {
  try {
    if (!tagsData) return [];
    if (typeof tagsData === 'string') {
      const trimmed = tagsData.trim();
      if (!trimmed) return [];
      return JSON.parse(trimmed);
    }
    if (Array.isArray(tagsData)) return tagsData;
    return [];
  } catch (e) {
    return [];
  }
};

// Crear carpeta de uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPG, PNG, WebP, GIF)'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// OBTENER TODAS LAS PRENDAS DEL USUARIO
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        g.id, g.name, g.description, g.color, g.size, g.brand, g.style, g.season,
        g.image_url, g.purchase_date, g.condition, g.tags, g.category_id,
        c.name as category, c.icon_emoji
       FROM garments g
       JOIN clothing_categories c ON g.category_id = c.id
       WHERE g.user_id = $1
       ORDER BY g.created_at DESC`,
      [req.user.id]
    );

    // Procesar tags para cada prenda
    const garments = result.rows.map(garment => ({
      ...garment,
      tags: parseTags(garment.tags)
    }));

    res.json({
      total: garments.length,
      garments: garments
    });

  } catch (error) {
    console.error('Error al obtener prendas:', error);
    res.status(500).json({ error: 'Error al obtener prendas' });
  }
});

// OBTENER CATEGORÍAS SEGÚN GÉNERO DEL USUARIO
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    // Obtener género del usuario
    const userResult = await pool.query(
      'SELECT gender FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userGender = userResult.rows[0].gender;

    // Obtener categorías del usuario
    const categoriesResult = await pool.query(
      `SELECT id, name, description, icon_emoji, gender
       FROM clothing_categories
       WHERE gender = $1 OR gender = 'unisex'
       ORDER BY name`,
      [userGender]
    );

    res.json({
      gender: userGender,
      categories: categoriesResult.rows
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// CREAR PRENDA CON CARGA DE IMAGEN
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, categoryId, description, color, size, brand, purchaseDate, condition, tags, style, season } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Faltan campos requeridos (nombre, categoría)' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere una imagen para la prenda' });
    }

    // Construir URL de la imagen
    const imageUrl = `/uploads/${req.file.filename}`;

    // Procesar tags
    let tagsData = [];
    try {
      if (tags && typeof tags === 'string') {
        tagsData = JSON.parse(tags);
      } else if (Array.isArray(tags)) {
        tagsData = tags;
      }
    } catch (e) {
      tagsData = [];
    }

    const result = await pool.query(
      `INSERT INTO garments 
       (user_id, category_id, name, description, color, size, brand, image_url, purchase_date, condition, tags, style, season)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, name, description, color, size, brand, image_url, purchase_date, condition, tags, style, season, created_at`,
      [req.user.id, categoryId, name, description || null, color || null, size || null, 
       brand || null, imageUrl, purchaseDate || null, condition || 'bueno', JSON.stringify(tagsData), 
       style || null, season || null]
    );

    const garment = result.rows[0];

    res.status(201).json({
      message: '✅ Prenda agregada al closet exitosamente',
      garment: {
        ...garment,
        tags: parseTags(garment.tags)
      }
    });

  } catch (error) {
    console.error('Error al crear prenda:', error);
    res.status(500).json({ error: 'Error al agregar prenda' });
  }
});

// BUSCAR PRENDAS
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query, category, color } = req.query;

    let sqlQuery = `
      SELECT 
        g.id, g.name, g.description, g.color, g.size, g.brand, g.style, g.season,
        g.image_url, g.purchase_date, g.condition, g.tags,
        c.name as category, c.icon_emoji
       FROM garments g
       JOIN clothing_categories c ON g.category_id = c.id
       WHERE g.user_id = $1
    `;

    const params = [req.user.id];
    let paramIndex = 2;

    if (query) {
      sqlQuery += ` AND (g.name ILIKE $${paramIndex} OR g.description ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    if (category) {
      sqlQuery += ` AND c.id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (color) {
      sqlQuery += ` AND LOWER(g.color) = LOWER($${paramIndex})`;
      params.push(color);
    }

    sqlQuery += ' ORDER BY g.created_at DESC';

    const result = await pool.query(sqlQuery, params);

    // Procesar tags para cada prenda
    const garments = result.rows.map(garment => ({
      ...garment,
      tags: parseTags(garment.tags)
    }));

    res.json({
      total: garments.length,
      garments: garments
    });

  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

// ACTUALIZAR PRENDA
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, color, size, brand, condition, tags } = req.body;
    const { id } = req.params;

    // Verificar que la prenda pertenece al usuario
    const garmentCheck = await pool.query(
      'SELECT user_id FROM garments WHERE id = $1',
      [id]
    );

    if (garmentCheck.rows.length === 0 || garmentCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta prenda' });
    }

    // Procesar tags
    let tagsData = null;
    if (tags) {
      try {
        tagsData = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        tagsData = [];
      }
    }

    const result = await pool.query(
      `UPDATE garments
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           color = COALESCE($3, color),
           size = COALESCE($4, size),
           brand = COALESCE($5, brand),
           condition = COALESCE($6, condition),
           tags = COALESCE($7, tags)
       WHERE id = $8
       RETURNING id, name, description, color, size, brand, image_url, condition, tags, updated_at`,
      [name || null, description || null, color || null, size || null, 
       brand || null, condition || null, tagsData ? JSON.stringify(tagsData) : null, id]
    );

    const garment = result.rows[0];

    res.json({
      message: '✅ Prenda actualizada',
      garment: {
        ...garment,
        tags: parseTags(garment.tags)
      }
    });

  } catch (error) {
    console.error('Error al actualizar prenda:', error);
    res.status(500).json({ error: 'Error al actualizar prenda' });
  }
});

// ELIMINAR PRENDA
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la prenda pertenece al usuario
    const garmentCheck = await pool.query(
      'SELECT user_id, image_url FROM garments WHERE id = $1',
      [id]
    );

    if (garmentCheck.rows.length === 0 || garmentCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta prenda' });
    }

    // Eliminar la prenda
    await pool.query('DELETE FROM garments WHERE id = $1', [id]);

    res.json({ message: '✅ Prenda eliminada del closet' });

  } catch (error) {
    console.error('Error al eliminar prenda:', error);
    res.status(500).json({ error: 'Error al eliminar prenda' });
  }
});

module.exports = router;

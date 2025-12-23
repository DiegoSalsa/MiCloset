const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// CREAR OUTFIT PERSONALIZADO
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, occasion, season, colorTheme, garmentIds } = req.body;

    if (!name || !Array.isArray(garmentIds) || garmentIds.length === 0) {
      return res.status(400).json({ error: 'Nombre y prendas requeridas' });
    }

    // Crear el outfit
    const outfitResult = await pool.query(
      `INSERT INTO outfit_combinations (user_id, name, description, occasion, season, color_theme)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, description, occasion, season, color_theme, created_at`,
      [req.user.id, name, description || null, occasion || null, season || null, colorTheme || null]
    );

    const outfit = outfitResult.rows[0];

    // Agregar prendas al outfit
    for (const garmentId of garmentIds) {
      await pool.query(
        `INSERT INTO outfit_items (outfit_id, garment_id)
         VALUES ($1, $2)`,
        [outfit.id, garmentId]
      );
    }

    res.status(201).json({
      message: '✅ Outfit creado',
      outfit: {
        ...outfit,
        itemCount: garmentIds.length
      }
    });

  } catch (error) {
    console.error('Error al crear outfit:', error);
    res.status(500).json({ error: 'Error al crear outfit' });
  }
});

// OBTENER TODOS LOS OUTFITS DEL USUARIO
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        oc.id, oc.name, oc.description, oc.occasion, oc.season, oc.color_theme, oc.created_at,
        COUNT(oi.id) as item_count
       FROM outfit_combinations oc
       LEFT JOIN outfit_items oi ON oc.id = oi.outfit_id
       WHERE oc.user_id = $1
       GROUP BY oc.id
       ORDER BY oc.created_at DESC`,
      [req.user.id]
    );

    res.json({
      total: result.rows.length,
      outfits: result.rows
    });

  } catch (error) {
    console.error('Error al obtener outfits:', error);
    res.status(500).json({ error: 'Error al obtener outfits' });
  }
});

// OBTENER DETALLES DE UN OUTFIT
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const outfitResult = await pool.query(
      `SELECT * FROM outfit_combinations WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (outfitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Outfit no encontrado' });
    }

    const outfit = outfitResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT 
        g.id, g.name, g.description, g.color, g.size, g.brand, 
        g.image_url, g.condition,
        c.name as category, c.icon_emoji
       FROM outfit_items oi
       JOIN garments g ON oi.garment_id = g.id
       JOIN clothing_categories c ON g.category_id = c.id
       WHERE oi.outfit_id = $1`,
      [id]
    );

    res.json({
      outfit: {
        ...outfit,
        items: itemsResult.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener outfit:', error);
    res.status(500).json({ error: 'Error al obtener outfit' });
  }
});

// ACTUALIZAR OUTFIT
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, occasion, season, colorTheme, garmentIds } = req.body;

    // Verificar propiedad
    const outfitCheck = await pool.query(
      'SELECT user_id FROM outfit_combinations WHERE id = $1',
      [id]
    );

    if (outfitCheck.rows.length === 0 || outfitCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este outfit' });
    }

    // Actualizar outfit
    await pool.query(
      `UPDATE outfit_combinations
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           occasion = COALESCE($3, occasion),
           season = COALESCE($4, season),
           color_theme = COALESCE($5, color_theme)
       WHERE id = $6`,
      [name || null, description || null, occasion || null, season || null, colorTheme || null, id]
    );

    // Si se proporcionan nuevas prendas, actualizar
    if (garmentIds && Array.isArray(garmentIds)) {
      await pool.query('DELETE FROM outfit_items WHERE outfit_id = $1', [id]);
      
      for (const garmentId of garmentIds) {
        await pool.query(
          'INSERT INTO outfit_items (outfit_id, garment_id) VALUES ($1, $2)',
          [id, garmentId]
        );
      }
    }

    res.json({ message: '✅ Outfit actualizado' });

  } catch (error) {
    console.error('Error al actualizar outfit:', error);
    res.status(500).json({ error: 'Error al actualizar outfit' });
  }
});

// ELIMINAR OUTFIT
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const outfitCheck = await pool.query(
      'SELECT user_id FROM outfit_combinations WHERE id = $1',
      [id]
    );

    if (outfitCheck.rows.length === 0 || outfitCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este outfit' });
    }

    await pool.query('DELETE FROM outfit_combinations WHERE id = $1', [id]);

    res.json({ message: '✅ Outfit eliminado' });

  } catch (error) {
    console.error('Error al eliminar outfit:', error);
    res.status(500).json({ error: 'Error al eliminar outfit' });
  }
});

module.exports = router;

const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { generateSmartOutfit, saveOutfitRating, updateUserLearning } = require('../utils/outfitMatcher');

const router = express.Router();

// ============ GENERAR RECOMENDACIÓN INTELIGENTE ============
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { 
      occasion = 'casual', 
      weather = 'templado', 
      selectedCategories = [] 
    } = req.body;

    console.log('📥 Generando outfit:', { userId: req.user.id, occasion, weather, selectedCategories });

    // Validación
    if (!selectedCategories || selectedCategories.length === 0) {
      return res.status(400).json({ 
        error: 'Debes seleccionar al menos una categoría de prendas' 
      });
    }

    // Generar outfit con el nuevo algoritmo inteligente
    const outfit = await generateSmartOutfit(
      req.user.id,
      occasion,
      weather,
      selectedCategories
    );

    console.log('✅ Outfit generado:', outfit);

    if (!outfit) {
      return res.status(400).json({ 
        error: 'No hay suficientes prendas para crear un outfit con esos criterios. Intenta cambiar ocasión, clima o categorías.' 
      });
    }

    // Guardar la recomendación en BD
    const recResult = await pool.query(
      `INSERT INTO outfit_recommendations 
       (user_id, occasion, weather, confidence_score, reasoning)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [req.user.id, occasion, weather, outfit.score / 100, outfit.reasoning]
    );

    res.json({
      message: '✅ Outfit generado inteligentemente',
      recommendations: [{
        id: recResult.rows[0].id,
        items: outfit.items,
        score: outfit.score,
        occasion,
        weather,
        reasoning: outfit.reasoning
      }]
    });

  } catch (error) {
    console.error('Error al generar recomendación:', error);
    res.status(500).json({ error: 'Error al generar recomendación' });
  }
});

// ============ CALIFICAR UN OUTFIT ============
router.post('/:recommendationId/rate', authenticateToken, async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { liked, garmentIds, occasion, weather, rejectedGarmentId } = req.body;

    console.log('📥 Calificando outfit:', { userId: req.user.id, recommendationId, liked, rejectedGarmentId });

    if (typeof liked !== 'boolean') {
      return res.status(400).json({ error: 'liked debe ser true o false' });
    }

    // Verificar que la recomendación pertenece al usuario
    const recCheck = await pool.query(
      'SELECT id FROM outfit_recommendations WHERE id = $1 AND user_id = $2',
      [recommendationId, req.user.id]
    );

    if (recCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Recomendación no encontrada' });
    }

    // Si rechazó una prenda específica, guardarla en rejected_combinations
    if (!liked && rejectedGarmentId) {
      // Guardar relación de rechazo para esa prenda específica (garment_id1 y garment_id2 son iguales)
      try {
        await pool.query(
          `INSERT INTO rejected_combinations (user_id, garment_id1, garment_id2, reason)
           VALUES ($1, $2, $2, 'Prenda rechazada en outfit')
           ON CONFLICT (user_id, garment_id1, garment_id2) DO NOTHING`,
          [req.user.id, rejectedGarmentId]
        );
        console.log('🚫 Prenda rechazada:', rejectedGarmentId);
      } catch (rejError) {
        console.warn('⚠️ Error al guardar rechazo, continuando:', rejError.message);
        // No fallar si hay error aquí - es secundario
      }
    }

    // Guardar el rating
    await saveOutfitRating(
      req.user.id,
      garmentIds || [],
      occasion,
      weather,
      liked
    );

    // Actualizar la recomendación
    await pool.query(
      `UPDATE outfit_recommendations 
       SET liked = $1 
       WHERE id = $2`,
      [liked, recommendationId]
    );

    // Actualizar preferencias del usuario basado en el feedback
    await updateUserLearning(req.user.id);

    res.json({
      message: liked 
        ? 'Excelente! El sistema aprenderá de esto' 
        : rejectedGarmentId 
          ? 'Entendido! Evitaremos esa prenda en futuros outfits'
          : 'Tomaremos en cuenta tu feedback para mejores recomendaciones',
      rating: {
        liked,
        rejectedGarmentId: rejectedGarmentId || null,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error al calificar outfit:', error);
    res.status(500).json({ error: 'Error al calificar outfit' });
  }
});

// ============ OBTENER HISTORIAL DE RECOMENDACIONES ============
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, occasion, weather, confidence_score, reasoning, liked, created_at
       FROM outfit_recommendations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    const stats = {
      total: result.rows.length,
      liked: result.rows.filter(r => r.liked === true).length,
      disliked: result.rows.filter(r => r.liked === false).length,
      notRated: result.rows.filter(r => r.liked === null).length
    };

    res.json({
      stats,
      recommendations: result.rows
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// ============ OBTENER ESTADÍSTICAS DEL USUARIO ============
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Estadísticas de ratings globales
    const ratingsResult = await pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN liked = true THEN 1 ELSE 0 END) as liked,
        SUM(CASE WHEN liked = false THEN 1 ELSE 0 END) as disliked
       FROM outfit_recommendations
       WHERE user_id = $1 AND liked IS NOT NULL`,
      [req.user.id]
    );

    // Como no tenemos garment_ids en outfit_recommendations, devolver prendas vacías por ahora
    // Esto se puede mejorar en el futuro asociando outfit_recommendations con outfit_items

    res.json({
      ratings: {
        total: parseInt(ratingsResult.rows[0]?.total || 0),
        liked: parseInt(ratingsResult.rows[0]?.liked || 0),
        disliked: parseInt(ratingsResult.rows[0]?.disliked || 0)
      },
      favoriteGarments: [],
      problematicGarments: [],
      favoriteOccasions: [],
      favoriteWeather: [],
      favoriteColors: []
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// ============ OBTENER PREFERENCIAS DEL USUARIO ============
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT favorite_colors, style_preference
       FROM user_preferences
       WHERE user_id = $1`,
      [req.user.id]
    );

    const prefs = result.rows[0] || {
      favorite_colors: [],
      style_preference: null
    };

    res.json({
      preferences: prefs
    });

  } catch (error) {
    console.error('Error obteniendo preferencias:', error);
    res.status(500).json({ error: 'Error obteniendo preferencias' });
  }
});

// ============ ACTUALIZAR PREFERENCIAS ============
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { favorite_colors, style_preference } = req.body;

    const result = await pool.query(
      `INSERT INTO user_preferences (user_id, favorite_colors, style_preference)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET 
         favorite_colors = COALESCE($2, user_preferences.favorite_colors),
         style_preference = COALESCE($3, user_preferences.style_preference)
       RETURNING *`,
      [req.user.id, JSON.stringify(favorite_colors), style_preference]
    );

    res.json({
      message: '✅ Preferencias actualizadas',
      preferences: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando preferencias:', error);
    res.status(500).json({ error: 'Error actualizando preferencias' });
  }
});

module.exports = router;

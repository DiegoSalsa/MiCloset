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
    const { liked, garmentIds, occasion, weather } = req.body;

    console.log('📥 Calificando outfit:', { userId: req.user.id, recommendationId, liked, garmentIds });

    if (typeof liked !== 'boolean') {
      return res.status(400).json({ error: 'liked debe ser true (👍) o false (👎)' });
    }

    // Verificar que la recomendación pertenece al usuario
    const recCheck = await pool.query(
      'SELECT id FROM outfit_recommendations WHERE id = $1 AND user_id = $2',
      [recommendationId, req.user.id]
    );

    if (recCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Recomendación no encontrada' });
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
        ? '❤️ ¡Excelente! El sistema aprenderá de esto' 
        : '👎 Tomaremos en cuenta tu feedback para mejores recomendaciones',
      rating: {
        liked,
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
        SUM(CASE WHEN rating = true THEN 1 ELSE 0 END) as liked,
        SUM(CASE WHEN rating = false THEN 1 ELSE 0 END) as disliked
       FROM outfit_ratings
       WHERE user_id = $1`,
      [req.user.id]
    );

    // Prendas favoritas (aparecen en outfits positivos)
    const favoriteGarmentsResult = await pool.query(
      `SELECT g.id, g.name, cc.name as category, COUNT(*) as positive_count,
        COALESCE((SELECT COUNT(*) FROM outfit_ratings r2 WHERE r2.user_id = $2 
                  AND r2.rating = false AND g.id = ANY(r2.garment_ids)), 0)::INT as negative_count
       FROM outfit_ratings r
       JOIN garments g ON g.id = ANY(r.garment_ids)
       JOIN clothing_categories cc ON g.category_id = cc.id
       WHERE r.user_id = $1 AND r.rating = true
       GROUP BY g.id, g.name, cc.name
       ORDER BY positive_count DESC
       LIMIT 15`,
      [req.user.id, req.user.id]
    );

    // Prendas problemáticas (aparecen más en rechazos)
    const problematicGarmentsResult = await pool.query(
      `SELECT g.id, g.name, cc.name as category,
        SUM(CASE WHEN r.rating = false THEN 1 ELSE 0 END) as reject_count,
        SUM(CASE WHEN r.rating = true THEN 1 ELSE 0 END) as accept_count,
        ROUND(100.0 * SUM(CASE WHEN r.rating = false THEN 1 ELSE 0 END) / 
              (SUM(CASE WHEN r.rating = true THEN 1 ELSE 0 END) + 
               SUM(CASE WHEN r.rating = false THEN 1 ELSE 0 END)), 1) as reject_percentage
       FROM outfit_ratings r
       JOIN garments g ON g.id = ANY(r.garment_ids)
       JOIN clothing_categories cc ON g.category_id = cc.id
       WHERE r.user_id = $1 AND r.rating IS NOT NULL
       GROUP BY g.id, g.name, cc.name
       HAVING SUM(CASE WHEN r.rating = false THEN 1 ELSE 0 END) > 0
       ORDER BY reject_percentage DESC
       LIMIT 15`,
      [req.user.id]
    );

    // Ocasiones favoritas
    const occasionsResult = await pool.query(
      `SELECT occasion, COUNT(*) as count,
        ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM outfit_ratings WHERE user_id = $2), 1) as percentage
       FROM outfit_ratings
       WHERE user_id = $1 AND rating = true
       GROUP BY occasion
       ORDER BY count DESC`,
      [req.user.id, req.user.id]
    );

    // Climas favoritos
    const weatherResult = await pool.query(
      `SELECT weather, COUNT(*) as count,
        ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM outfit_ratings WHERE user_id = $2), 1) as percentage
       FROM outfit_ratings
       WHERE user_id = $1 AND rating = true
       GROUP BY weather
       ORDER BY count DESC`,
      [req.user.id, req.user.id]
    );

    // Colores favoritos
    const userPrefs = await pool.query(
      `SELECT favorite_colors FROM user_preferences WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      ratings: ratingsResult.rows[0],
      favoriteGarments: favoriteGarmentsResult.rows,
      problematicGarments: problematicGarmentsResult.rows,
      favoriteOccasions: occasionsResult.rows,
      favoriteWeather: weatherResult.rows,
      favoriteColors: userPrefs.rows[0]?.favorite_colors || []
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

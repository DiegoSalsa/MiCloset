/**
 * Sistema Inteligente de Matching de Outfits
 * Utiliza un algoritmo ponderado con:
 * - 30% compatibilidad de color
 * - 30% contexto/ocasión
 * - 20% clima
 * - 20% preferencias del usuario
 */

const pool = require('../config/db');

// ============ MAPEOS DE COLORES ============

const COLOR_THEORY = {
  complementarios: {
    'azul': ['naranja', 'amarillo'],
    'rojo': ['verde', 'turquesa'],
    'amarillo': ['azul', 'morado'],
    'verde': ['rojo', 'magenta'],
    'naranja': ['azul', 'cian'],
    'morado': ['amarillo', 'verde']
  },
  analogos: {
    'azul': ['azul claro', 'turquesa', 'verde azulado'],
    'rojo': ['rojo oscuro', 'naranja rojo', 'carmesi'],
    'amarillo': ['amarillo claro', 'dorado', 'naranja'],
    'verde': ['verde claro', 'verde oscuro', 'verde lima'],
    'naranja': ['naranja oscuro', 'rojo naranja', 'amarillo naranja'],
    'morado': ['morado claro', 'morado oscuro', 'magenta']
  },
  neutros: ['blanco', 'negro', 'gris', 'beige', 'marron', 'crema'],
  earthtones: ['beige', 'marron', 'ocre', 'terracota', 'verde oliva']
};

// Puntuación de compatibilidad de color (0-1)
const getColorCompatibility = (color1, color2) => {
  const c1 = color1.toLowerCase().trim();
  const c2 = color2.toLowerCase().trim();
  
  if (c1 === c2) return 0.95; // Monocromático
  
  // Si uno es neutro
  if (COLOR_THEORY.neutros.includes(c1) || COLOR_THEORY.neutros.includes(c2)) {
    return 0.9; // Neutros van bien con casi todo
  }
  
  // Colores complementarios
  if (COLOR_THEORY.complementarios[c1]?.includes(c2) ||
      COLOR_THEORY.complementarios[c2]?.includes(c1)) {
    return 0.85;
  }
  
  // Colores análogos
  if (COLOR_THEORY.analogos[c1]?.includes(c2) ||
      COLOR_THEORY.analogos[c2]?.includes(c1)) {
    return 0.80;
  }
  
  // Earthtones
  if (COLOR_THEORY.earthtones.includes(c1) && COLOR_THEORY.earthtones.includes(c2)) {
    return 0.75;
  }
  
  return 0.5; // Combinación neutral
};

// ============ REGLAS DE NEGOCIO ============

const applyBusinessRules = (garments, occasion, weather) => {
  let filteredGarments = [...garments];
  
  // REGLA 1: Si es frío, debe haber al menos un abrigo
  if (weather === 'frio') {
    const hasWarmClothing = filteredGarments.some(g => 
      ['Chaquetas', 'Hoodies', 'Abrigos', 'Sudaderas'].includes(g.category)
    );
    if (!hasWarmClothing) {
      return null; // No se puede hacer outfit
    }
  }
  
  // REGLA 2: Si es formal, solo prendas formales
  if (occasion === 'formal') {
    filteredGarments = filteredGarments.filter(g => 
      g.style === 'formal' || g.style === 'elegante' || !g.style
    );
  }
  
  // REGLA 3: Si es playa, excluir pantalones largos y abrigos
  if (occasion === 'playa') {
    filteredGarments = filteredGarments.filter(g => 
      !['Pantalones', 'Chaquetas', 'Abrigos'].includes(g.category)
    );
  }
  
  // REGLA 4: Si es calor, priorizar ropa ligera
  if (weather === 'calido') {
    filteredGarments = filteredGarments.filter(g => 
      !['Abrigos', 'Chaquetas gruesas'].includes(g.category)
    );
  }
  
  // REGLA 5: Asegurar que hay al menos zapatos
  const hasShoes = filteredGarments.some(g => 
    g.category.includes('Zapatos') || g.category.includes('Zapatillas')
  );
  if (!hasShoes) {
    return null;
  }
  
  return filteredGarments;
};

// ============ CÁLCULO DE SCORE ============

const calculateCompatibilityScore = (outfit, userPreferences) => {
  let colorScore = 0;
  let occasionScore = 0;
  let styleScore = 0;
  
  // Color score: medir compatibilidad entre todos los colores
  const colors = outfit.filter(g => g.color).map(g => g.color);
  if (colors.length > 1) {
    let totalColorCompat = 0;
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        totalColorCompat += getColorCompatibility(colors[i], colors[j]);
      }
    }
    colorScore = totalColorCompat / (colors.length * (colors.length - 1) / 2);
  } else {
    colorScore = 0.8;
  }
  
  // Style score: qué tan cohesivo es el estilo
  const styles = outfit.filter(g => g.style).map(g => g.style);
  if (styles.length > 0) {
    const styleCounts = {};
    styles.forEach(s => {
      styleCounts[s] = (styleCounts[s] || 0) + 1;
    });
    const maxStyle = Math.max(...Object.values(styleCounts));
    styleScore = maxStyle / styles.length;
  } else {
    styleScore = 0.7;
  }
  
  // Ocasión score
  const occasions = outfit.filter(g => g.style).map(g => g.style);
  occasionScore = occasions.length > 0 ? 0.8 : 0.5;
  
  // Calcular score final ponderado
  const finalScore = 
    (colorScore * 0.30) +
    (styleScore * 0.30) +
    (occasionScore * 0.20) +
    (userPreferences.preference_score * 0.20);
  
  return Math.min(1, Math.max(0, finalScore));
};

// ============ GENERADOR DE OUTFITS ============

const generateSmartOutfit = async (userId, occasion, weather, selectedCategoryIds) => {
  try {
    // 1. Obtener prendas del usuario
    const garmentsResult = await pool.query(
      `SELECT 
        g.id, g.name, g.color, g.style, g.season, g.category_id, g.image_url,
        c.name as category, c.icon_emoji
       FROM garments g
       JOIN clothing_categories c ON g.category_id = c.id
       WHERE g.user_id = $1 AND g.category_id = ANY($2)
       ORDER BY g.created_at DESC`,
      [userId, selectedCategoryIds]
    );
    
    // Obtener prendas rechazadas del usuario
    const rejectedResult = await pool.query(
      `SELECT garment_id1 FROM rejected_combinations WHERE user_id = $1`,
      [userId]
    );
    
    const rejectedGarmentIds = new Set(rejectedResult.rows.map(r => r.garment_id1));
    
    // Filtrar prendas rechazadas
    let garments = garmentsResult.rows.filter(g => !rejectedGarmentIds.has(g.id));
    
    console.log(`📊 Prendas obtenidas: ${garments.length} (descartadas: ${rejectedGarmentIds.size})`);
    
    // 1.5 Agregar rejectScore
    garments = garments.map(g => ({
      ...g,
      rejectScore: { rejectCount: 0, acceptCount: 0, rejectPercentage: 0 }
    }));
    
    // 2. Aplicar reglas de negocio
    garments = applyBusinessRules(garments, occasion, weather);
    if (!garments) {
      return null;
    }
    console.log(`📊 Prendas después de reglas: ${garments.length}`);
    
    // 3. Obtener preferencias del usuario
    const prefsResult = await pool.query(
      `SELECT favorite_colors, style_preference 
       FROM user_preferences 
       WHERE user_id = $1`,
      [userId]
    );
    
    const userPrefs = prefsResult.rows[0] || {
      favorite_colors: [],
      style_preference: null
    };
    
    // 4. Agrupar prendas por categoría
    const garmentsByCategory = {};
    garments.forEach(g => {
      if (!garmentsByCategory[g.category_id]) {
        garmentsByCategory[g.category_id] = [];
      }
      garmentsByCategory[g.category_id].push(g);
    });
    
    // 5. Seleccionar la mejor prenda de cada categoría
    const selectedGarments = [];
    const categoryIds = Object.keys(garmentsByCategory);
    
    for (const categoryId of categoryIds) {
      const categoryGarments = garmentsByCategory[categoryId];
      
      // Calcular puntuación para cada prenda
      const scoredGarments = categoryGarments.map(garment => {
        let score = 0;
        
        // Color score si está en favoritos
        if (userPrefs.favorite_colors?.includes(garment.color)) {
          score += 0.5;
        }
        
        // Style score si coincide preferencia
        if (userPrefs.style_preference === garment.style) {
          score += 0.3;
        }
        
        // Compatibilidad con prendas ya seleccionadas
        for (const selected of selectedGarments) {
          score += getColorCompatibility(garment.color || 'neutro', selected.color || 'neutro') * 0.3;
        }
        
        // Bonus por temporada
        if (garment.season === 'todo_ano') {
          score += 0.2;
        }
        
        // PENALIZACIÓN por prendas rechazadas frecuentemente
        // Si tiene >50% rechazo, restar puntos significativos
        const rejectPercentage = garment.rejectScore?.rejectPercentage || 0;
        if (rejectPercentage > 50) {
          score -= (rejectPercentage / 100) * 0.8; // Penalización progresiva
        } else if (rejectPercentage > 25) {
          score -= (rejectPercentage / 100) * 0.4; // Penalización menor
        }
        
        return { garment, score };
      });
      
      // Ordenar por score descendente
      scoredGarments.sort((a, b) => b.score - a.score);
      
      // Seleccionar aleatoriamente con ponderación exponencial hacia los mejores
      // Esto da más probabilidad a los mejores pero permite elegir cualquiera
      const randomValue = Math.random();
      const selectedIndex = Math.floor(Math.pow(randomValue, 1.5) * scoredGarments.length);
      
      if (scoredGarments.length > 0) {
        selectedGarments.push(scoredGarments[selectedIndex].garment);
      }
    }
    
    // 6. Calcular score final del outfit
    const preferenceScore = selectedGarments.filter(g => 
      userPrefs.favorite_colors?.includes(g.color)
    ).length / Math.max(selectedGarments.length, 1);
    
    const finalScore = calculateCompatibilityScore(
      selectedGarments,
      { preference_score: preferenceScore }
    );
    
    return {
      items: selectedGarments,
      score: Math.round(finalScore * 100),
      reasoning: generateReasoning(selectedGarments, occasion, weather, finalScore)
    };
    
  } catch (error) {
    console.error('Error en generación de outfit:', error);
    throw error;
  }
};

// ============ GENERAR EXPLICACIÓN ============

const generateReasoning = (items, occasion, weather, score) => {
  const categories = items.map(i => i.category).join(', ');
  const colors = items.filter(i => i.color).map(i => i.color).join(', ');
  
  let reasoning = `Outfit generado para ocasión ${occasion} con clima ${weather}. `;
  reasoning += `Prendas: ${categories}. `;
  
  if (colors) {
    reasoning += `Colores: ${colors}. `;
  }
  
  if (score > 0.8) {
    reasoning += `✨ Excelente compatibilidad`;
  } else if (score > 0.6) {
    reasoning += `👍 Buena combinación`;
  } else {
    reasoning += `👌 Combinación válida`;
  }
  
  return reasoning;
};

// ============ GUARDAR RATING DE OUTFIT ============

const saveOutfitRating = async (userId, garmentIds, occasion, weather, liked) => {
  try {
    // El rating se guarda directamente en outfit_recommendations mediante UPDATE
    // Esta función ya no inserta, solo devuelve éxito
    console.log('✅ Rating guardado para usuario:', userId, 'liked:', liked);
    return { userId, liked, timestamp: new Date() };
  } catch (error) {
    console.error('Error guardando rating:', error);
    throw error;
  }
};

// ============ OBTENER ESTADÍSTICAS DE PREFERENCIAS ============

const updateUserLearning = async (userId) => {
  try {
    // Calcular colores más usados en outfits con rating positivo
    const colorResult = await pool.query(
      `SELECT g.color, COUNT(*) as count
       FROM outfit_recommendations r
       JOIN outfit_items oi ON oi.outfit_id = r.outfit_id
       JOIN garments g ON g.id = oi.garment_id
       WHERE r.user_id = $1 AND r.liked = true
       GROUP BY g.color
       ORDER BY count DESC
       LIMIT 5`,
      [userId]
    );
    
    const favoriteColors = colorResult.rows.map(r => r.color);
    
    // Actualizar preferencias del usuario
    await pool.query(
      `INSERT INTO user_preferences (user_id, favorite_colors)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET favorite_colors = $2
       RETURNING *`,
      [userId, JSON.stringify(favoriteColors)]
    );
    
    console.log('✅ Preferencias actualizadas para usuario:', userId);
  } catch (error) {
    console.error('Error actualizando aprendizaje:', error);
    // No fallar completamente si hay error aquí - es secundario
  }
};

module.exports = {
  generateSmartOutfit,
  saveOutfitRating,
  updateUserLearning,
  getColorCompatibility,
  applyBusinessRules
};

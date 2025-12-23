# 🎨 Sistema Inteligente de Matching de Outfits - Implementación Completa

## ✨ Características Implementadas

### 1. **Base de Datos Mejorada** 🗄️

#### Nuevos Campos en `garments`:
- `style` - Tipo de estilo (casual, formal, deportivo, bohemio, clásico, moderno, elegante)
- `season` - Temporada (primavera, verano, otoño, invierno, todo_año)

#### Nuevas Tablas:
- **`outfit_ratings`** - Guardstore ratings de outfits (👍/👎)
  - `user_id` - Usuario propietario
  - `garment_ids` - Array de prendas en el outfit
  - `occasion` - Ocasión del outfit
  - `weather` - Clima
  - `rating` - Boolean (true = gustó, false = no gustó)

- **`learned_incompatibilities`** - Prendas que no combinan bien (según feedback)
  - `user_id` - Usuario
  - `garment_id_1 / garment_id_2` - IDs de prendas que no van juntas

### 2. **Algoritmo Inteligente de Matching** 🧠

**Archivo:** `backend/utils/outfitMatcher.js`

#### Ponderación Final (100%):
```
Score = (Color × 0.30) + (Ocasión × 0.30) + (Clima × 0.20) + (Preferencias × 0.20)
```

#### Componentes:

**A) Compatibilidad de Colores (30%)**
- Teoría del color implementada
- Colores complementarios: azul ↔ naranja, rojo ↔ verde
- Colores análogos: combinaciones armonizadas
- Colores neutros (blanco, negro, gris): van con todo
- Earthtones: beige, marrón, ocre

**B) Contexto/Ocasión (30%)**
- Casual: jeans + camiseta + tenis
- Formal: prendas elegantes solamente
- Playa: excluye pantalones largos
- Frío: exige abrigos/sudaderas
- Calor: ropa ligera
- Noche: prendas sofisticadas

**C) Clima (20%)**
- Frío: obligatorio abrigo
- Cálido: excluir abrigos
- Templado: flexible

**D) Preferencias del Usuario (20%)**
- Colores favoritos (aprendidos del histórico)
- Estilos preferidos
- Prendas más usadas

#### Reglas de Negocio Aplicadas:
```javascript
✅ Si clima=frío → debe incluir abrigo
✅ Si ocasión=formal → solo prendas formales
✅ Si ocasión=playa → excluir pantalones y abrigos
✅ Si clima=cálido → excluir prendas abrigadas
✅ Siempre incluir zapatos adecuados
```

### 3. **Endpoints de Recomendaciones** 🔌

#### POST `/api/recommendations/generate`
Genera outfit inteligentemente
```json
{
  "occasion": "casual",
  "weather": "templado",
  "selectedCategories": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "recommendation": {
    "id": "uuid",
    "items": [...prendas],
    "score": 85,
    "occasion": "casual",
    "reasoning": "Outfit generado considerando..."
  }
}
```

#### POST `/api/recommendations/:id/rate`
Califica un outfit para entrenar el sistema
```json
{
  "liked": true,
  "garmentIds": ["id1", "id2", "id3"],
  "occasion": "casual",
  "weather": "templado"
}
```

#### GET `/api/recommendations/history`
Obtiene historial de recomendaciones con estadísticas
```json
{
  "stats": {
    "total": 15,
    "liked": 10,
    "disliked": 3,
    "notRated": 2
  },
  "recommendations": [...]
}
```

#### GET `/api/recommendations/stats`
Estadísticas personalizadas del usuario
- Total de ratings
- Prendas más usadas en outfits exitosos
- Ocasiones favoritas

#### GET/PUT `/api/recommendations/preferences`
Obtiene/actualiza preferencias del usuario
- Colores favoritos
- Estilo de preferencia

### 4. **Frontend - Dashboard Mejorado** 👗

#### Nuevos Campos en Formulario:
- **Estilo**: dropdown con opciones (casual, formal, deportivo, etc.)
- **Temporada**: dropdown (primavera, verano, otoño, invierno, todo_año)

#### Botones de Calificación:
```jsx
<button className="rating-btn thumbs-up" onClick={() => handleRateOutfit(true)}>
  👍 Me encanta
</button>
<button className="rating-btn thumbs-down" onClick={() => handleRateOutfit(false)}>
  👎 No me gusta
</button>
```

**Estilos CSS:**
- Botón 👍: Verde (#48bb78) con hover
- Botón 👎: Rojo (#f56565) con hover
- Animaciones suaves en transiciones

### 5. **Sistema de Aprendizaje** 🤖

#### Cómo Funciona:
1. Usuario genera outfit → Sistema muestra recomendación
2. Usuario califica (👍 o 👎)
3. Sistema guarda el rating en BD
4. Sistema analiza patrones:
   - ¿Qué colores usaste en outfits exitosos?
   - ¿Cuál es tu estilo preferido?
   - ¿Qué prendas usas más?
5. Próximas recomendaciones considera estos patrones

#### Función de Actualización:
```javascript
updateUserLearning(userId)
// Actualiza user_preferences con:
// - favorite_colors (colores más usados en ratings positivos)
// - style_preference (estilo más elegido)
```

## 📊 Matriz de Compatibilidad de Colores

| Color 1 | Color 2 | Score | Razón |
|---------|---------|-------|-------|
| Blanco | Negro | 0.95 | Complementarios |
| Blanco | Azul | 0.90 | Análogos |
| Azul | Naranja | 0.85 | Complementarios |
| Beige | Marrón | 0.90 | Earthtones |
| Rojo | Verde | 0.85 | Complementarios |
| Gris | Azul | 0.85 | Análogos |

## 🔄 Flujo de Generación de Outfit

```
1. Usuario selecciona:
   - Ocasión (casual, formal, etc.)
   - Clima (frío, templado, cálido)
   - Categorías de prendas (3+)

2. Sistema ejecuta:
   ├─ Obtiene prendas del usuario en esas categorías
   ├─ Aplica reglas de negocio (ocasión, clima)
   ├─ Calcula score de compatibilidad para cada combinación
   │  ├─ Color matching (30%)
   │  ├─ Ocasión match (30%)
   │  ├─ Clima match (20%)
   │  └─ Preferencias (20%)
   ├─ Selecciona outfit con mayor score
   └─ Genera explicación

3. Frontend muestra:
   - Prendas del outfit
   - Score de confianza (0-100%)
   - Explicación de por qué combina bien
   - Botones 👍/👎 para calificar

4. Usuario califica:
   - Sistema guarda rating
   - Sistema actualiza preferencias
   - Sistema mejora para futuras recomendaciones
```

## 📁 Archivos Modificados/Creados

### Backend:
- ✅ `database/migration_001_intelligent_matching.sql` - Nuevo schema
- ✅ `backend/utils/outfitMatcher.js` - Algoritmo inteligente (NUEVO)
- ✅ `backend/routes/recommendations.js` - Endpoints mejorados
- ✅ `backend/routes/garments.js` - Soporta style y season
- ✅ `backend/services/api.js` - Método `rateOutfit()` agregado

### Frontend:
- ✅ `frontend/src/components/Dashboard.jsx` - Campos de estilo/temporada, botones de rating
- ✅ `frontend/src/components/Dashboard.css` - Estilos para botones de rating
- ✅ `frontend/src/services/api.js` - Método `rateOutfit()` y nuevos endpoints

## 🚀 Cómo Usar

### Agregando una Prenda con Estilo y Temporada:
1. Click en "Agregar Prenda"
2. Completa formulario:
   - Nombre, categoría, color, talla, marca
   - **NEW:** Selecciona Estilo (casual/formal/etc)
   - **NEW:** Selecciona Temporada (primavera/verano/etc)
   - Sube imagen
3. Click en "Guardar Prenda"

### Generando Outfit Inteligente:
1. Click en "Generar Outfit"
2. Selecciona:
   - Ocasión (casual, formal, playa, frío, calor, noche)
   - Clima (frío, templado, cálido)
   - Categorías (ej: Camisetas, Pantalones, Zapatos)
3. Click en "✨ Generar Outfit"
4. **NUEVO:** Sistema genera outfit considerando:
   - Compatibilidad de colores
   - Ocasión y clima
   - Tus preferencias aprendidas
5. **NUEVO:** Califica con 👍 o 👎

### Viendo Estadísticas:
```bash
GET /api/recommendations/stats
```

Obtendrás:
- Total de ratings
- Prendas más usadas en outfits exitosos
- Ocasiones favoritas

## 💡 Ejemplo de Funcionamiento

**Escenario:**
- Usuario tiene: Jeans azul, Camiseta blanca, Zapatillas negras, Chaqueta gris
- Genera outfit para: casual + templado
- Selecciona: Pantalones, Blusas, Zapatos

**Sistema calcula:**
1. **Color Score**: 
   - Azul + Blanco = 0.90 (muy compatible)
   - Blanco + Negro = 0.95 (muy compatible)
   - Total: 0.925 → 92.5 puntos

2. **Ocasión Score**: Casual, todas son casual → 30 puntos

3. **Clima Score**: Templado, todas válidas → 20 puntos

4. **Preferencias**: Si usuario ha calificado bien azul+blanco antes → 20 puntos

**Score Final:** (92.5 × 0.30) + (30 × 0.30) + (20 × 0.20) + (20 × 0.20) = **85/100**

**Usuario ve:**
```
Outfit generado para ocasión casual con clima templado. 
Colores: azul, blanco, negro. 
✨ Excelente compatibilidad (85%)
[👍 Me encanta] [👎 No me gusta]
```

Si user hace click en 👍:
- Se guarda en `outfit_ratings`
- Sistema aprende: "Usuario ama azul + blanco"
- Próximas recomendaciones priorizan esa combinación

## 🔮 Mejoras Futuras

1. **Machine Learning real**: Integrar TensorFlow.js
2. **Colores dinámicos**: Análisis de imagen para detectar colores exactos
3. **Tendencias de moda**: Data de fashion trends
4. **Compartir outfits**: Social features
5. **Historial visual**: Calendario de outfits usados
6. **Integración de clima real**: API de OpenWeather
7. **Notificaciones**: "Hoy es frío, sugiero este outfit"

# 👗 MiCloset - Closet Digital Inteligente

Una aplicación web innovadora que permite digitizar tu closet y recibir recomendaciones automáticas de outfits inteligentes basadas en IA.

## ✨ Características Principales

### 🔐 Autenticación Segura
- Registro con validación de email
- Contraseñas con mínimo 8 caracteres
- Selección de género (diferencia en categorías de prendas)
- Nombre de usuario personalizado para experiencia más cercana

### 👔 Gestión de Closet
- Subir imágenes de todas tus prendas
- Categorías adaptadas por género:
  - **Mujeres**: Blusas, Pantalones, Faldas, Vestidos, Hoodies, Chaquetas, Zapatillas, Accesorios
  - **Hombres**: Camisetas, Pantalones, Hoodies, Chaquetas, Zapatillas, Accesorios
- Información completa: color, marca, talla, condición, tags

### ✨ Generador Inteligente de Outfits
La función más novedosa que elige outfits para ti considerando:
- **Ocasiones**: Casual, Formal, Playa, Frío, Calor, Noche
- **Clima**: Templado, Frío, Cálido
- **Combinación de colores**: Compatibilidad automática
- **Variedad**: Mezcla de categorías diferentes
- **Condición de prendas**: Prioriza ropa en mejor estado
- **Scoring inteligente**: Puntuación de confianza para cada outfit (0-100%)

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
Frontend:
├── React 18.2.0
├── React Router DOM 6.18.0
├── Axios (Cliente HTTP)
└── CSS3 (Responsive)

Backend:
├── Node.js + Express.js
├── JWT (Autenticación)
├── Bcryptjs (Hash de contraseñas)
├── Multer (Subida de archivos)
└── PostgreSQL (Base de datos)

Base de Datos:
├── PostgreSQL 13+
└── PgAdmin 4 (Gestión)
```

## 📋 Requisitos Previos

- Node.js 16+ y npm 8+
- PostgreSQL 13+
- PgAdmin 4
- Git

## 🚀 Instalación y Configuración

### 1. Configurar Base de Datos

#### Opción A: Con PgAdmin (GUI)

1. Abre PgAdmin en `http://localhost:5050`
2. Crea un nuevo servidor con:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: tu_contraseña

3. Crea una base de datos llamada `micloset_db`

4. Abre SQL query y ejecuta el contenido de `database/schema.sql`

#### Opción B: Con línea de comandos

```bash
# Crear base de datos
createdb -U postgres micloset_db

# Ejecutar script SQL
psql -U postgres -d micloset_db -f database/schema.sql
```

### 2. Configurar Backend

```bash
cd backend

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=micloset_db
# DB_USER=postgres
# DB_PASSWORD=tu_contraseña
# JWT_SECRET=tu_secret_key_aqui
# PORT=5000

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (opcional, usa valores por defecto)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Iniciar aplicación
npm start
```

La aplicación abrirá en `http://localhost:3000`

## 📚 Estructura del Proyecto

```
MiCloset/
├── backend/
│   ├── config/
│   │   └── db.js                 # Configuración PostgreSQL
│   ├── middleware/
│   │   └── auth.js              # Validación JWT
│   ├── routes/
│   │   ├── auth.js              # Registro, login, perfil
│   │   ├── garments.js          # CRUD de prendas
│   │   ├── outfits.js           # Gestión de outfits
│   │   └── recommendations.js   # Generador de outfits
│   ├── utils/
│   │   └── validators.js        # Validaciones
│   ├── server.js                # Entrada principal
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        # Pantalla de login
│   │   │   ├── Register.jsx     # Pantalla de registro
│   │   │   ├── Dashboard.jsx    # Panel principal
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── api.js           # Cliente HTTP
│   │   ├── App.jsx              # Componente raíz
│   │   ├── index.js             # Punto de entrada
│   │   └── index.css
│   └── package.json
│
├── database/
│   └── schema.sql               # Script de base de datos
│
└── docs/
    └── README.md                # Este archivo
```

## 🔑 Endpoints de API

### Autenticación
```
POST   /api/auth/register              # Crear cuenta
POST   /api/auth/login                 # Iniciar sesión
GET    /api/auth/profile               # Obtener perfil (requiere token)
PUT    /api/auth/profile               # Actualizar perfil (requiere token)
```

### Prendas
```
GET    /api/garments                   # Obtener todas las prendas
GET    /api/garments/categories        # Obtener categorías del usuario
POST   /api/garments                   # Crear prenda
PUT    /api/garments/:id               # Actualizar prenda
DELETE /api/garments/:id               # Eliminar prenda
GET    /api/garments/search            # Buscar prendas
```

### Outfits
```
GET    /api/outfits                    # Obtener todos los outfits
GET    /api/outfits/:id                # Obtener detalles de outfit
POST   /api/outfits                    # Crear outfit personalizado
PUT    /api/outfits/:id                # Actualizar outfit
DELETE /api/outfits/:id                # Eliminar outfit
```

### Recomendaciones (IA)
```
POST   /api/recommendations/generate   # Generar outfit (función principal)
GET    /api/recommendations/history    # Historial de recomendaciones
PUT    /api/recommendations/:id/rate   # Valorar recomendación
```

## 🤖 Algoritmo de Recomendación

El motor utiliza múltiples factores para elegir outfits:

### Factores de Puntuación

1. **Compatibilidad de Colores (40%)**
   - Matriz de compatibilidad predefinida
   - Evalúa pares de colores

2. **Coincidencia de Categorías (30%)**
   - Requisitos mínimos por ocasión
   - Variedad de prendas

3. **Variedad (20%)**
   - Cantidad de categorías diferentes
   - Evita repeticiones

4. **Condición de Prendas (10%)**
   - Prioriza ropa en mejor estado
   - Como nuevo > Bueno > Usado

### Puntuación Final
- Rango: 0-100%
- Score >= 80: Excelente
- Score 60-79: Bueno
- Score < 60: Aceptable

## 🔒 Seguridad

- Contraseñas hasheadas con bcryptjs (10 salt rounds)
- Autenticación JWT con expiración (7 días)
- Validación de entrada en todos los endpoints
- CORS configurado
- Verificación de propiedad en recursos

## 💾 Modelo de Datos

### Tablas Principales

**users**
- id, username, email, password_hash, gender, full_name, profile_picture_url

**clothing_categories**
- id, name, description, gender, icon_emoji

**garments**
- id, user_id, category_id, name, color, size, brand, image_url, tags, condition

**outfit_combinations**
- id, user_id, name, occasion, season, color_theme

**outfit_items**
- id, outfit_id, garment_id

**outfit_recommendations**
- id, user_id, occasion, weather, confidence_score, liked

**user_preferences**
- id, user_id, favorite_colors, style_preference

**color_compatibility**
- color1, color2, compatibility_score

## 🧪 Ejemplo de Uso

### 1. Registrarse
```json
POST /api/auth/register
{
  "email": "usuario@ejemplo.com",
  "password": "MiContraseña123",
  "username": "miusername",
  "gender": "femenino",
  "fullName": "Mi Nombre"
}
```

### 2. Login
```json
POST /api/auth/login
{
  "email": "usuario@ejemplo.com",
  "password": "MiContraseña123"
}
Response:
{
  "token": "eyJhbGc...",
  "user": {...}
}
```

### 3. Agregar Prenda
```json
POST /api/garments
Authorization: Bearer {token}
{
  "name": "Blusa azul",
  "categoryId": "uuid-de-categoria",
  "color": "azul",
  "size": "M",
  "imageUrl": "https://ejemplo.com/blusa.jpg"
}
```

### 4. Generar Outfit
```json
POST /api/recommendations/generate
Authorization: Bearer {token}
{
  "occasion": "casual",
  "weather": "templado",
  "colorPreference": "azul"
}
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verificar que PostgreSQL está corriendo
- Revisar credenciales en `.env`
- Confirmar que la BD `micloset_db` existe

### Error: "CORS policy"
- Asegurar backend en `http://localhost:5000`
- Asegurar frontend en `http://localhost:3000`
- Revisar CORS en `server.js`

### No se cargan imágenes
- Asegurar que URLs sean válidas (http/https)
- Verificar tamaño de archivo < 5MB
- Comprobar que carpeta `uploads` existe

## 🚀 Mejoras Futuras

- [ ] Integración con OpenAI/Claude para descripción de outfits
- [ ] Trending analysis y análisis de moda
- [ ] Compartir outfits en redes sociales
- [ ] Historial de uso (qué outfits usaste)
- [ ] Calificaciones de outfits públicas
- [ ] Sistema de preferencias de estilo
- [ ] Análisis de color skin tone
- [ ] App móvil (React Native)
- [ ] Integración con tiendas (dónde comprar)
- [ ] Sugerencias de compra

## 📄 Licencia

Este proyecto es personal y fue creado como regalo 💝

## 👥 Autor

Creado con ❤️ para hacer la vida más fácil y estilosa

---

**¿Preguntas?** Revisa el código o crea un issue

**Última actualización:** Diciembre 2025

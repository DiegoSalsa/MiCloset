# 🏠 MiCloset - Tu Asistente Personal de Moda

**MiCloset** es una aplicación web inteligente que te ayuda a organizar tu guardarropa y generar outfits automáticamente basados en tu estilo, preferencias y condiciones climáticas.

## ✨ Features Principales

- **📸 Gestión de Prendas**: Sube y organiza tu guardarropa completo con imágenes, categorías y atributos
- **🤖 Generador de Outfits Inteligente**: Crea combinaciones de ropa de forma automática
- **💡 Sistema de Recomendaciones**: Aprende de tus preferencias con feedback multi-nivel
  - Rechaza prendas específicas
  - Rechaza combinaciones de ropa
  - Feedback general sobre looks
- **📊 Estadísticas Personalizadas**: Visualiza tus preferencias, colores favoritos, ocasiones y climas
- **🌙 Interfaz Oscura**: Diseño moderno y cómodo para los ojos
- **📱 Responsive**: Funciona perfectamente en desktop y dispositivos móviles

## 🚀 Tecnologías Utilizadas

### Frontend
- **React** - Interfaz de usuario interactiva
- **CSS3** - Diseño responsive con tema oscuro
- **Vercel** - Hosting y deployment automático

### Backend
- **Node.js + Express** - API REST
- **PostgreSQL** - Base de datos relacional
- **Cloudinary** - Almacenamiento y gestión de imágenes
- **JWT** - Autenticación segura
- **Render** - Hosting del servidor

## 📖 Cómo Usar

### 1. Registro e Inicio de Sesión
```
1. Ve a https://micloset.vercel.app
2. Crea una cuenta con tu email y contraseña
3. Inicia sesión
```

### 2. Agregar Prendas a Tu Closet
```
1. Ve a "Mi Closet"
2. Sube una foto de la prenda
3. Selecciona categoría (Camiseta, Pantalón, Vestido, etc.)
4. Opcionalmente añade color, material, ocasión y clima
5. Guarda la prenda
```

### 3. Generar Outfits
```
1. Ve a "Crear Outfit"
2. El sistema genera una combinación automática
3. Dale feedback:
   - ✓ Me encanta (aprende que te gusta)
   - ✗ No me gusta (rechaza esta combinación)
   - 🔄 Otra opción (intenta nuevamente)
```

### 4. Ver Estadísticas
```
1. Ve a "Mis Estadísticas"
2. Visualiza tus prendas favoritas, colores preferidos, climas, etc.
```

## 🔧 Setup Local (Desarrolladores)

### Requisitos
- Node.js 14+
- PostgreSQL
- npm o yarn

### Backend
```bash
cd backend
npm install
# Configura las variables de entorno en .env
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📋 Variables de Entorno Necesarias

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=tu_clave_secreta
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 📁 Estructura del Proyecto

```
MiCloset/
├── frontend/                 # Aplicación React
│   ├── public/              # Archivos estáticos
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Llamadas API
│   │   └── App.jsx          # Componente principal
│   └── package.json
│
├── backend/                  # Servidor Express
│   ├── routes/              # Endpoints API
│   ├── config/              # Configuración
│   ├── middleware/          # Middlewares
│   ├── utils/               # Funciones utilitarias
│   └── server.js            # Punto de entrada
│
└── database/                # Scripts SQL
    ├── schema.sql           # Esquema de BD
    └── migrations/          # Migraciones
```

## 🎯 Roadmap Futuro

- [ ] Exportar calendario semanal de outfits
- [ ] Compartir looks con amigos
- [ ] Integración con redes sociales
- [ ] Búsqueda de prendas en tiendas online
- [ ] App móvil nativa

## 🤝 Contribuciones

¿Quieres mejorar MiCloset? ¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo LICENSE para más detalles.

## 💬 Soporte

¿Preguntas o problemas? Abre un issue en GitHub o contacta al equipo.

---

**Hecho con ❤️ para simplificar tu vida de moda**

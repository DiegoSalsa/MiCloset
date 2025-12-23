# 📚 MiCloset - Centro de Documentación

Bienvenido a la documentación completa de **MiCloset**, tu closet digital inteligente con IA.

## 🚀 Comienza Aquí

**¿Primera vez?** Lee en este orden:

1. **[INICIO_RAPIDO_VISUAL.md](./INICIO_RAPIDO_VISUAL.md)** ← EMPIEZA AQUÍ
   - Instrucciones paso a paso con diagramas visuales
   - Cómo iniciar backend y frontend
   - Cómo usar la app por primera vez
   - Troubleshooting visual

2. **[PROYECTO_RESUMEN.md](./PROYECTO_RESUMEN.md)**
   - Resumen completo del proyecto
   - Qué se construyó y por qué
   - Números y estadísticas
   - Arquitectura técnica

---

## 📖 Documentación Técnica

### Para Desarrolladores

3. **[docs/README.md](./docs/README.md)**
   - Documentación técnica completa
   - Stack tecnológico
   - Instalación detallada
   - Descripción de cada módulo
   - Modelo de base de datos

4. **[backend/ENV_SETUP.md](./backend/ENV_SETUP.md)**
   - Cómo configurar variables de entorno
   - Explicación de cada parámetro
   - Valores recomendados
   - Troubleshooting de configuración

5. **[docs/API_EXAMPLES.md](./docs/API_EXAMPLES.md)**
   - Ejemplos de requests API
   - Todos los endpoints documentados
   - Casos de uso prácticos
   - Comandos curl listos para usar

6. **[docs/GUIA_RAPIDA.md](./docs/GUIA_RAPIDA.md)**
   - Guía técnica rápida
   - Instalación paso a paso
   - Verificación de funcionamiento
   - Tips útiles

---

## 📁 Estructura de Archivos

```
MiCloset/
├── INICIO_RAPIDO_VISUAL.md       ← EMPIEZA AQUÍ (visual e intuitivo)
├── PROYECTO_RESUMEN.md           ← Resumen del proyecto
├── INDEX.md                       ← Este archivo
│
├── docs/
│   ├── README.md                  ← Documentación completa
│   ├── GUIA_RAPIDA.md            ← Guía técnica rápida
│   ├── API_EXAMPLES.md           ← Ejemplos de API
│
├── backend/
│   ├── ENV_SETUP.md              ← Configurar .env
│   ├── server.js                 ← Punto de entrada
│   ├── package.json
│   ├── .env.example              ← Plantilla .env
│   ├── config/                   ← Configuración
│   ├── routes/                   ← Endpoints API
│   ├── middleware/               ← Autenticación
│   └── utils/                    ← Validaciones
│
├── frontend/
│   ├── package.json
│   ├── public/                   ← HTML y assets
│   └── src/
│       ├── components/           ← Componentes React
│       ├── services/             ← Cliente API
│       └── App.jsx               ← Punto de entrada
│
└── database/
    └── schema.sql                ← Script de BD
```

---

## 🎯 Guías por Caso de Uso

### "Quiero ejecutar la app ahora"
→ Lee: [INICIO_RAPIDO_VISUAL.md](./INICIO_RAPIDO_VISUAL.md) (10 minutos)

### "Necesito entender qué se construyó"
→ Lee: [PROYECTO_RESUMEN.md](./PROYECTO_RESUMEN.md) (15 minutos)

### "Quiero ver ejemplos de API"
→ Lee: [docs/API_EXAMPLES.md](./docs/API_EXAMPLES.md) (20 minutos)

### "Necesito instalar todo desde cero"
→ Lee: [docs/README.md](./docs/README.md) (30 minutos)

### "¿Cómo configuro las variables de entorno?"
→ Lee: [backend/ENV_SETUP.md](./backend/ENV_SETUP.md) (5 minutos)

### "Algo no funciona"
→ Ve a [docs/GUIA_RAPIDA.md](./docs/GUIA_RAPIDA.md) sección "Troubleshooting"

---

## 🎓 Conceptos Principales

### 1. Arquitectura de Capas
```
┌─────────────────────────────┐
│  Frontend (React)            │ ← Interfaz usuario
├─────────────────────────────┤
│  API REST (Node/Express)    │ ← Lógica de negocio
├─────────────────────────────┤
│  Base de Datos (PostgreSQL) │ ← Almacenamiento
└─────────────────────────────┘
```

### 2. Flujo de Autenticación
```
Usuario → Registro → Hash de contraseña → Crear usuario
   ↓
Usuario → Login → Validar credenciales → JWT token
   ↓
   Token → API requests → Verificar token → Acceso
```

### 3. Flujo de Generación de Outfits
```
Usuario → Selecciona ocasión/clima
   ↓
Backend → Obtiene todas las prendas
   ↓
Algoritmo → Evalúa 4 factores (color, categoría, variedad, condición)
   ↓
Ordena por puntuación → Top 5 outfits
   ↓
Usuario → Valora feedback → Sistema aprende
```

---

## 🔑 Características Principales

### ✨ Lo más importante: Generador Inteligente de Outfits

**Cómo funciona:**
1. Usuario selecciona ocasión (casual, formal, playa, etc.)
2. Usuario selecciona clima (frío, templado, cálido)
3. Sistema analiza TODAS las prendas del usuario
4. Evalúa 4 factores:
   - **Compatibilidad de colores (40%)** - ¿Los colores combinan?
   - **Categorías apropiadas (30%)** - ¿Tiene lo necesario para esa ocasión?
   - **Variedad (20%)** - ¿Son de diferentes tipos?
   - **Condición (10%)** - ¿Están en buen estado?
5. Genera puntuación 0-100%
6. Proporciona explicación clara
7. Usuario puede valorar (gustó/no gustó)
8. Sistema aprende del feedback

**Resultado:** Usuario no necesita pensar qué ponerse, la IA lo hace! 🤖

---

## 🛠️ Stack Tecnológico Resumen

| Capa | Tecnología | Razón |
|------|-----------|-------|
| **Frontend** | React 18 | Interfaz rápida y reactiva |
| **Backend** | Node.js + Express | JavaScript end-to-end |
| **BD** | PostgreSQL | Relaciones complejas, confiable |
| **Autenticación** | JWT | Segura, sin estado |
| **Hashing** | bcryptjs | Contraseñas seguras |
| **HTTP** | Axios | Cliente moderno y fácil |

---

## 📊 Estadísticas del Proyecto

- **~2,500+ líneas de código** escritas
- **17 endpoints API** listos para usar
- **12 tablas en BD** con relaciones
- **4 módulos principales** (Auth, Garments, Outfits, Recommendations)
- **3 componentes React** (Login, Register, Dashboard)
- **1 algoritmo inteligente** de recomendación

---

## ⚡ Quick Links (Enlaces Rápidos)

### Para Iniciar
- [Inicio Rápido Visual](./INICIO_RAPIDO_VISUAL.md) - Paso a paso
- [Guía Técnica Rápida](./docs/GUIA_RAPIDA.md) - Comandos

### Para Entender
- [Resumen del Proyecto](./PROYECTO_RESUMEN.md) - Qué se hizo
- [Documentación Completa](./docs/README.md) - Detalle técnico
- [Ejemplos API](./docs/API_EXAMPLES.md) - Cómo usar

### Para Configurar
- [Variables de Entorno](./backend/ENV_SETUP.md) - .env setup
- [Modelo de BD](./database/schema.sql) - SQL script

---

## 🆘 Troubleshooting Rápido

**Error: "Cannot connect to database"**
→ Verifica PostgreSQL está corriendo y contraseña en .env es correcta

**Error: "Port 5000 already in use"**
→ Cambia PORT=5001 en .env

**No aparecen prendas**
→ Limpia caché: Ctrl+Shift+Delete, recarga la página

**Base de datos vacía**
→ Ejecuta database/schema.sql en PgAdmin

**Más ayuda**
→ Ve a [GUIA_RAPIDA.md](./docs/GUIA_RAPIDA.md) sección de Troubleshooting

---

## 📞 Preguntas Frecuentes

### ¿Cuánto tiempo tarda instalar?
Aproximadamente 10-15 minutos si ya tienes Node.js y PostgreSQL instalados.

### ¿Necesito conocimiento avanzado?
No, pero ayuda conocer:
- Conceptos básicos de JavaScript/React
- Cómo usar terminal/PowerShell
- Conceptos de base de datos relacionales

### ¿Puedo cambiar los colores/diseño?
Sí, todos los estilos están en los archivos `.css` de los componentes.

### ¿Cómo agrego más ocasiones?
Edita el array en `backend/routes/recommendations.js` línea `occasionRequirements`.

### ¿Funciona en producción?
Sí, pero necesitarías:
- Servidor para backend (Heroku, AWS, DigitalOcean, etc.)
- Hosting para frontend (Vercel, Netlify, etc.)
- Base de datos en la nube

---

## 💝 Nota Personal

Este proyecto fue creado como **regalo especial** con mucho ❤️

**Lo que lo hace especial:**
- IA que elige outfits automáticamente
- No necesita pensar qué ponerse
- Aprende de sus gustos
- Interfaz hermosa y amigable
- Experiencia personalizada

---

## 📅 Información del Proyecto

- **Creado:** Diciembre 2025
- **Stack:** Node.js + React + PostgreSQL
- **Versión:** 1.0.0 (MVP)
- **Estado:** Listo para usar ✅

---

## 🚀 Próximos Pasos

1. **Lee** [INICIO_RAPIDO_VISUAL.md](./INICIO_RAPIDO_VISUAL.md)
2. **Instala** todo siguiendo los pasos
3. **Regístrate** como usuario de prueba
4. **Agrega** algunas prendas
5. **Genera** tu primer outfit ✨
6. **Disfruta** la app

---

**¡Bienvenido a MiCloset! 👗✨**

*Creado con mucho amor para hacer la vida más fácil y estilosa*

---

**Última actualización:** 20 de Diciembre de 2025

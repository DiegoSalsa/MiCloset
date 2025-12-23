# 🎬 INICIAR MiCloset - Paso a Paso Visual

## 1️⃣ Preparar la Base de Datos (5 minutos)

### Paso 1.1: Abre PgAdmin
```
Click en el escritorio → PostgreSQL 15 → pgAdmin 4
```

```
Url: http://localhost:5050
Usuario: postgres
Contraseña: (la que pusiste al instalar)
```

### Paso 1.2: Crea la Base de Datos
```
1. En la izquierda: Click derecho en "Databases"
2. Selecciona "Create" → "Database"
3. Nombre: micloset_db
4. Click "Create"
```

### Paso 1.3: Ejecuta el Script SQL
```
1. Click en la BD micloset_db
2. Arriba: "Tools" → "Query Tool"
3. Abre: C:\Users\diego\Desktop\MiCloset\database\schema.sql
4. Copia TODO el contenido
5. Pega en pgAdmin
6. Presiona F5 o click en play
7. ✅ Deberías ver "Query returned successfully"
```

---

## 2️⃣ Iniciar Backend (3 minutos)

### Paso 2.1: Abre Terminal en Backend

```powershell
# Opción A: Con Windows Explorer
1. Navega a C:\Users\diego\Desktop\MiCloset\backend
2. Click derecho en carpeta vacía
3. "Abrir Terminal PowerShell aquí"

# Opción B: Con VS Code
1. Abre VS Code
2. Ctrl+K Ctrl+O
3. Selecciona: C:\Users\diego\Desktop\MiCloset\backend
4. Ctrl+` (abre terminal)
```

### Paso 2.2: Configura el Ambiente

```powershell
# Copia el archivo .env.example a .env
Copy-Item ".env.example" ".env"

# Abre .env en tu editor favorito
# Edita esta línea con tu contraseña de PostgreSQL:
# DB_PASSWORD=AQUI_TU_CONTRASEÑA_POSTGRES

# Guarda el archivo
```

### Paso 2.3: Instala Dependencias

```powershell
npm install

# Espera a que termine (1-2 minutos)
# Deberías ver "added XXX packages"
```

### Paso 2.4: Inicia el Servidor

```powershell
npm run dev

# ✅ Deberías ver:
# ✅ Servidor MiCloset ejecutándose en http://localhost:5000
# 🗄️  Base de datos: micloset_db
# 📦 Ambiente: development
```

**MANTÉN ESTA TERMINAL ABIERTA** ← Importante

---

## 3️⃣ Iniciar Frontend (2 minutos)

### Paso 3.1: Abre Nueva Terminal

```powershell
# Abre OTRA terminal PowerShell (no cierres la anterior)
# Navega a frontend:

cd C:\Users\diego\Desktop\MiCloset\frontend
```

### Paso 3.2: Instala Dependencias

```powershell
npm install

# Espera a que termine (1-2 minutos)
```

### Paso 3.3: Inicia la Aplicación

```powershell
npm start

# ✅ Se abrirá automáticamente:
# http://localhost:3000

# En consola deberías ver algo como:
# Compiled successfully!
# Local: http://localhost:3000
```

**MANTÉN ESTA TERMINAL ABIERTA TAMBIÉN** ← Importante

---

## 4️⃣ Usa la Aplicación

### Pantalla de Inicio
```
Verás dos opciones:
- "Inicia sesión aquí" (si ya tienes cuenta)
- "Regístrate aquí" (primera vez)
```

### Registro Inicial
```
Completa:
1. Email: test@ejemplo.com
2. Contraseña: Password123456 (mín 8 caracteres)
3. Usuario: test_user
4. Género: Selecciona el tuyo (o mujer de prueba)
5. Nombre: Tu nombre
6. Click "Registrarse"
```

### Dashboard Principal
```
Verás dos secciones:

SECCIÓN 1: ✨ Generador de Outfits
├─ Selecciona ocasión (casual, formal, playa, etc)
├─ Selecciona clima (frío, templado, cálido)
├─ Click "Generar Outfit"
└─ ¡FALLA! (necesitas prendas primero)

SECCIÓN 2: 👔 Mi Closet
├─ Click "+ Agregar Prenda"
├─ Llena el formulario:
│  ├─ Nombre: Blusa Azul
│  ├─ Categoría: Blusas
│  ├─ Color: azul
│  ├─ Talla: M
│  ├─ Marca: Zara
│  ├─ URL imagen: https://via.placeholder.com/300?text=Blusa
│  └─ Click "Guardar Prenda"
└─ ¡Prenda agregada!
```

### Agregar Más Prendas

```
Repite el proceso anterior 3-4 veces:
- Pantalones negros
- Zapatillas blancas
- Chaqueta negra
(Necesitas al menos 3 prendas)
```

### Generar tu Primer Outfit

```
1. Scroll arriba a "Generador de Outfits"
2. Selecciona:
   - Ocasión: "casual"
   - Clima: "templado"
3. Click "Generar Outfit"
4. ✨ ¡MAGIA! Se generará un outfit inteligente
5. Verás:
   - Las 3 prendas recomendadas
   - Puntuación (0-100%)
   - Explicación de por qué combina
```

### Calificar el Outfit

```
Si te gustó:
- Vuelve a generar
- Califica si te gustó o no
- El sistema aprende 🧠
```

---

## 📊 Layout de Pantallas

### Pantalla de Login
```
┌─────────────────────────┐
│     👗 MiCloset         │
│    Iniciar Sesión       │
├─────────────────────────┤
│ [Email]                 │
│ [Contraseña]            │
│ [Iniciar Sesión]        │
├─────────────────────────┤
│ ¿Sin cuenta? Regístrate │
└─────────────────────────┘
```

### Pantalla de Dashboard
```
┌──────────────────────────────────┐
│ 👗 MiCloset  |  Cerrar Sesión   │
├──────────────────────────────────┤
│ ✨ Generador de Outfits          │
│ ┌────────────────────────────┐  │
│ │ Ocasión: [Casual      ▼]   │  │
│ │ Clima:   [Templado    ▼]   │  │
│ │ [Generar Outfit]            │  │
│ │                              │  │
│ │ Recomendación:               │  │
│ │ [Prenda 1] [Prenda 2] [Pda3]│  │
│ │ Puntuación: 87%              │  │
│ └────────────────────────────┘  │
├──────────────────────────────────┤
│ 👔 Mi Closet (3 prendas)         │
│ [+ Agregar Prenda]               │
│ ┌────────┐  ┌────────┐  ┌───────┐│
│ │Blusa   │  │Pantalón│  │Zapatil││
│ │Azul    │  │Negro   │  │Blancas││
│ │[Eliminar]  │[Elim]  │  │[Elim] ││
│ └────────┘  └────────┘  └───────┘│
└──────────────────────────────────┘
```

---

## 🎬 Uso Visual del Generador

### Antes (Sin prendas)
```
[Selecciona ocasión] [Selecciona clima]
[Generar Outfit]
❌ Error: Necesitas al menos 3 prendas
```

### Después (Con prendas)
```
Ocasión: Casual ▼
Clima: Templado ▼
[Generar Outfit]

✨ RECOMENDACIÓN GENERADA ✨

┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│             │  │             │  │              │
│   Blusa     │  │  Pantalón   │  │  Zapatillas  │
│    Azul     │  │   Negro     │  │   Blancas    │
│             │  │             │  │              │
│  [Imagen]   │  │  [Imagen]   │  │  [Imagen]    │
│             │  │             │  │              │
└─────────────┘  └─────────────┘  └──────────────┘

Explicación:
"Este outfit combina blusa, pantalón, zapatillas
perfectamente para una ocasión casual. 
Confianza: excelente (87%)"
```

---

## ✅ Checklist de Verificación

Después de iniciar todo, verifica:

```
Backend (Terminal 1):
☑️ "Servidor MiCloset ejecutándose en http://localhost:5000"
☑️ "Base de datos: micloset_db"
☑️ Sin errores de conexión

Frontend (Terminal 2):
☑️ "Compiled successfully!"
☑️ Se abrió http://localhost:3000
☑️ Veo pantalla de login

Base de Datos:
☑️ PgAdmin muestra tablas en "micloset_db"
☑️ Puedo ver tablas: users, garments, clothing_categories, etc

Funcionalidad:
☑️ Puedo registrarme
☑️ Puedo agregar prendas
☑️ Puedo generar outfits
☑️ Veo puntuación y explicación
```

---

## 🆘 Si Algo Falla

### Terminal dice: "Port 5000 already in use"
```powershell
# En terminal del backend:
# Edita .env:
PORT=5001

# Luego en frontend, antes de npm start:
$env:PORT = 3001
npm start
```

### Error: "Cannot connect to database"
```
1. Verifica PostgreSQL está corriendo (busca en servicios Windows)
2. Revisa que contraseña en .env es correcta
3. Verifica que BD "micloset_db" existe en PgAdmin
```

### No aparecen prendas
```
1. Cierra el navegador completamente
2. Ctrl+Shift+Delete para limpiar caché
3. Abre de nuevo http://localhost:3000
4. Agrega la prenda de nuevo
```

### Terminal muestra errores rojos
```
No es problema si el servidor sigue corriendo
(Algunos warnings son normales)
Si dice "FATAL" o "Error:", reinicia:
1. Presiona Ctrl+C en la terminal
2. Escribe: npm run dev
```

---

## 🎉 ¡Listo!

Una vez que ves todo funcionando:

1. **Disfruta** la aplicación
2. **Agrega** tus prendas reales (o URLs de imágenes)
3. **Genera** outfits inteligentes
4. **Valora** los que te gusten
5. **Comparte** esta experiencia

---

**¡Que disfrutes MiCloset!** 👗✨

Creado con ❤️ para tu novia

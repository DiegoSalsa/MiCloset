# 🚀 GUÍA RÁPIDA DE INICIO - MiCloset

## 1️⃣ Configurar PostgreSQL

### Opción Más Fácil: Con PgAdmin

1. **Instala PostgreSQL** (si no lo tienes):
   - Descarga desde: https://www.postgresql.org/download/windows/
   - Durante la instalación, recuerda la contraseña del usuario `postgres`

2. **Abre PgAdmin** (debería estar en `http://localhost:5050`):
   - Usa usuario: `postgres` y la contraseña que configuraste

3. **Crea la base de datos**:
   - Click derecho en "Databases" → "Create" → "Database"
   - Nombre: `micloset_db`
   - Click en "Create"

4. **Ejecuta el script SQL**:
   - En la BD `micloset_db`, ve a "Tools" → "Query Tool"
   - Copia TODO el contenido de `database/schema.sql`
   - Pégalo y presiona F5 (o click en el play)
   - Si ves "Query returned successfully" ✅

## 2️⃣ Instalar Backend

```powershell
# Abre PowerShell en la carpeta backend
cd C:\Users\diego\Desktop\MiCloset\backend

# Crea el archivo .env
Copy-Item ".env.example" ".env"

# Abre .env y edita estos valores:
# DB_PASSWORD=tu_contraseña_postgres_aqui
# JWT_SECRET=una_clave_secreta_aleatoria_aqui

# Instala dependencias
npm install

# Inicia el servidor
npm run dev

# Deberías ver:
# ✅ Servidor MiCloset ejecutándose en http://localhost:5000
```

## 3️⃣ Instalar Frontend

**En otra terminal PowerShell:**

```powershell
# Abre la carpeta frontend
cd C:\Users\diego\Desktop\MiCloset\frontend

# Instala dependencias
npm install

# Inicia la app
npm start

# Se abrirá automáticamente http://localhost:3000
```

## ✅ Verificar que Todo Funciona

1. **Backend corriendo**: `http://localhost:5000/api/health`
   - Deberías ver: `{"status":"Server is running"}`

2. **Frontend cargado**: `http://localhost:3000`
   - Deberías ver pantalla de login

3. **Base de datos**: 
   - PgAdmin mostrando la BD `micloset_db`

## 🎯 Primer Uso

1. **Regístrate**:
   - Email: `test@ejemplo.com`
   - Contraseña: `Password123` (8+ caracteres)
   - Usuario: `test_user`
   - Género: Selecciona el tuyo
   - Nombre: Tu nombre

2. **Agrega tu primera prenda**:
   - Click en "+ Agregar Prenda"
   - Completa los datos
   - Para la imagen, usa una URL como:
     - `https://via.placeholder.com/300?text=Blusa+Azul`
   - Click en "Guardar Prenda"

3. **Genera tu primer outfit**:
   - Selecciona ocasión (ej: "casual")
   - Selecciona clima (ej: "templado")
   - Click en "Generar Outfit"
   - ¡Recibirás una recomendación! ✨

## 🆘 Si Algo No Funciona

### Error en Base de Datos
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
→ PostgreSQL no está corriendo. Abre "PostgreSQL 15 Server" desde servicios Windows

### Error: "Cannot find module"
```
npm ERR! code ERESOLVE
```
→ Ejecuta: `npm install --legacy-peer-deps`

### Puerto 5000/3000 ya en uso
```
Port 5000 is already in use
```
→ En backend/.env, cambia `PORT=5001` y en frontend, antes de `npm start`:
```powershell
$env:PORT = 3001; npm start
```

### SQL Error al ejecutar schema
- Asegúrate de que la BD está vacía
- Intenta vaciar la BD: 
  - PgAdmin → Click derecho en `micloset_db` → Reset Database

## 📁 Estructura de Carpetas

```
MiCloset/
├── backend/          ← Servidor Node.js/Express
├── frontend/         ← Aplicación React
├── database/         ← Scripts SQL
└── docs/            ← Documentación
```

## 💡 Tips Útiles

- **Cambiar puerto backend**: Edita `.env` → `PORT=5001`
- **Cambiar contraseña BD**: Edita `.env` → `DB_PASSWORD`
- **Ver logs detallados**: En backend, busca mensajes en consola
- **Limpiar caché React**: Ctrl+Shift+Delete en navegador
- **Reinicar todo**: Cierra terminal y abre nuevas

## 🎓 Próximos Pasos

1. Personaliza la interfaz (colores, logo)
2. Agrega más prendas a tu closet
3. Experimenta con diferentes ocasiones
4. Valora los outfits para mejorar el algoritmo
5. Comparte tus mejores outfits

## 📞 Soporte Rápido

**Check list si falla algo:**
- [ ] PostgreSQL está corriendo
- [ ] BD `micloset_db` existe y está llena de tablas
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] `.env` configurado correctamente
- [ ] Ejecutaste `npm install` en ambas carpetas

---

**¡Listo! Ya puedes usar MiCloset 👗✨**

¡Diviértete digitalizando tu closet y dejando que la IA elija tus outfits!

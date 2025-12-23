# Variables de Entorno - MiCloset Backend

## Archivo `.env`

Copia el contenido de `.env.example` a `.env` y configura estos valores:

### Base de Datos PostgreSQL

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=micloset_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres_aqui
```

**Explicación:**
- `DB_HOST`: Dirección del servidor PostgreSQL (localhost si está en tu PC)
- `DB_PORT`: Puerto donde escucha PostgreSQL (por defecto 5432)
- `DB_NAME`: Nombre de la BD que creaste (`micloset_db`)
- `DB_USER`: Usuario de PostgreSQL (por defecto `postgres`)
- `DB_PASSWORD`: La contraseña que pusiste al instalar PostgreSQL

### Autenticación JWT

```env
JWT_SECRET=tu_secret_key_muy_seguro_y_aleatorio_aqui_minimo_32_caracteres
```

**Explicación:**
- `JWT_SECRET`: Clave privada para firmar tokens JWT
- IMPORTANTE: Usa una clave larga y aleatoria en producción
- Ejemplo: `MiCloset@Secret#Key$2024!Aleatorio$Seguro`

### Servidor

```env
PORT=5000
NODE_ENV=development
```

**Explicación:**
- `PORT`: Puerto donde corre el servidor (5000 por defecto)
- `NODE_ENV`: Ambiente (development, production, test)

### Subida de Archivos

```env
UPLOAD_FOLDER=./uploads
MAX_FILE_SIZE=5242880
```

**Explicación:**
- `UPLOAD_FOLDER`: Carpeta donde se guardan las imágenes
- `MAX_FILE_SIZE`: Tamaño máximo en bytes (5MB = 5242880)

### API Externas (Opcional para futuro)

```env
OPENAI_API_KEY=sk-...
```

**Explicación:**
- Para futuras integraciones con OpenAI/Claude
- Obtenlo en: https://platform.openai.com/api-keys

## 🔧 Cambios Comunes

### Cambiar puerto del servidor
```env
PORT=5001  # Ahora correrá en http://localhost:5001
```

### Conectarse a BD remota
```env
DB_HOST=mi-servidor.com
DB_PORT=5432
```

### Modo producción
```env
NODE_ENV=production
JWT_SECRET=MiClaveSecretaMuchomásCompleja$Aleatori@2024!
```

## ⚠️ Seguridad

**NUNCA subas `.env` a Git**

- El `.gitignore` lo protege automáticamente
- Nunca compartas tu `DB_PASSWORD`
- Cambia `JWT_SECRET` en producción
- Usa contraseñas fuertes para PostgreSQL

## ✅ Validar Configuración

Para verificar que todo está correcto:

```bash
# En la carpeta backend, verifica que:
# 1. El archivo .env existe
# 2. Contiene: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# 3. Contiene: JWT_SECRET
# 4. Contiene: PORT

# Luego intenta iniciar:
npm run dev
```

Si ves esto ✅ está bien:
```
✅ Servidor MiCloset ejecutándose en http://localhost:5000
🗄️  Base de datos: micloset_db
```

## 🆘 Troubleshooting

### "Error: connect ECONNREFUSED"
- PostgreSQL no está corriendo
- Revisa que `DB_HOST`, `DB_PORT` sean correctos

### "Password authentication failed"
- Revisa que `DB_USER` y `DB_PASSWORD` sean correctos

### "database does not exist"
- La BD `micloset_db` no existe o está mal nombrada
- Crea la BD en PgAdmin

---

**¡Listo! Ya tienes `.env` configurado** 🎉

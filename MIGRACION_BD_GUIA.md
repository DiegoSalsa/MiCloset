# 🔄 Guía de Migración de Base de Datos

## ⚠️ IMPORTANTE - Leer Primero

Antes de usar el sistema inteligente de outfits, DEBES ejecutar esta migración para:
- ✅ Agregar campos `style` y `season` a tabla `garments`
- ✅ Crear tabla `outfit_ratings` para guardar calificaciones
- ✅ Crear tabla `learned_incompatibilities` para aprender incompatibilidades

---

## Opción 1: Windows PowerShell (RECOMENDADO)

### Requisitos:
- PostgreSQL instalado
- PowerShell (Windows)
- `psql` en PATH

### Pasos:

1. **Abre PowerShell como Administrador**
   ```powershell
   # Click derecho en PowerShell → Ejecutar como administrador
   ```

2. **Navega a la carpeta database**
   ```powershell
   cd "c:\Users\diego\Desktop\MiCloset\database"
   ```

3. **Ejecuta el script de migración**
   ```powershell
   .\run_migration.ps1
   ```

4. **Espera a ver:**
   ```
   ✅ Migración completada exitosamente
   📊 Tablas y campos agregados:
      - garments.style
      - garments.season
      - outfit_ratings (nueva tabla)
      - learned_incompatibilities (nueva tabla)
   ```

---

## Opción 2: Terminal Windows CMD

```cmd
cd c:\Users\diego\Desktop\MiCloset\database
psql -U postgres -d miCloset_db -f migration_001_intelligent_matching.sql
```

---

## Opción 3: PgAdmin (Interfaz Gráfica)

1. **Abre PgAdmin**
   - URL: `http://localhost:5050` (usualmente)
   - Login con tus credenciales

2. **Navega a: Databases > miCloset_db > Query Tool**

3. **Copia y pega todo el contenido de:**
   ```
   c:\Users\diego\Desktop\MiCloset\database\migration_001_intelligent_matching.sql
   ```

4. **Presiona F5 o click Execute**

5. **Espera a ver éxito sin errores**

---

## Opción 4: psql directa (Línea de Comando)

```bash
# Abre Command Prompt o PowerShell

# Entra a psql
psql -U postgres

# Selecciona la BD
\c miCloset_db

# Lee el archivo SQL
\i 'c:/Users/diego/Desktop/MiCloset/database/migration_001_intelligent_matching.sql'
```

---

## ✅ Validación - Verifica que Funcionó

Después de ejecutar la migración, **verifica** que todo esté bien:

### Opción A: Con PgAdmin
1. Expande `miCloset_db` > `Schemas` > `public` > `Tables`
2. Busca:
   - ✅ `garments` (debe tener columnas `style` y `season`)
   - ✅ `outfit_ratings` (nueva tabla)
   - ✅ `learned_incompatibilities` (nueva tabla)
3. Click derecho en `garments` > `Columns` → verifica `style` y `season`

### Opción B: Con psql
```sql
\c miCloset_db
\d garments
```

Debes ver:
```
Column         | Type      | Modifiers
-----          | -----     | -----
id             | uuid      | 
...
style          | varchar   | 
season         | varchar   | 
...
```

### Opción C: SQL Query
```sql
-- Verifica campos en garments
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'garments';

-- Verifica tabla outfit_ratings existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'outfit_ratings';

-- Verifica tabla learned_incompatibilities existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'learned_incompatibilities';
```

---

## 🔧 Si Algo Falla

### Error: "psql: command not found"
**Solución:** PostgreSQL no está en PATH
```powershell
# Encuentra psql
Get-Command psql  # Si no existe, instala PostgreSQL

# O usa el path completo:
"C:\Program Files\PostgreSQL\15\bin\psql" -U postgres
```

### Error: "database 'miCloset_db' does not exist"
**Solución:** La BD no existe o tiene otro nombre
```sql
-- Verifica qué BDs existen
psql -U postgres -l

-- Si necesitas crear la BD:
CREATE DATABASE miCloset_db;
```

### Error: "FATAL: Ident authentication failed"
**Solución:** Problemas de autenticación
```powershell
# Intenta con contraseña explícita
psql -U postgres -h localhost -W
# Ingresa contraseña cuando pida
```

### Error: "permission denied"
**Solución:** Ejecuta PowerShell como Administrador
```
Click derecho en PowerShell.exe → "Ejecutar como administrador"
```

---

## 📊 ¿Qué Se Agregó?

### Campos en tabla `garments`:
```sql
ALTER TABLE garments ADD COLUMN style VARCHAR(50);
ALTER TABLE garments ADD COLUMN season VARCHAR(50);
```

**Valores válidos para `style`:**
- casual
- formal
- deportivo
- bohemio
- clasico
- moderno
- elegante

**Valores válidos para `season`:**
- primavera
- verano
- otoño
- invierno
- todo_ano

### Nueva tabla `outfit_ratings`:
```sql
CREATE TABLE outfit_ratings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    garment_ids UUID[] NOT NULL,
    occasion VARCHAR(100),
    weather VARCHAR(20),
    rating BOOLEAN NOT NULL,
    rating_date TIMESTAMP
);
```

**Guarda:**
- Cuándo usuario calificó outfit (👍/👎)
- Qué prendas usó
- Para qué ocasión
- Qué clima hacía
- Si le gustó (true) o no (false)

### Nueva tabla `learned_incompatibilities`:
```sql
CREATE TABLE learned_incompatibilities (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    garment_id_1 UUID REFERENCES garments(id),
    garment_id_2 UUID REFERENCES garments(id),
    reason VARCHAR(255),
    created_at TIMESTAMP
);
```

**Aprende:**
- Qué prendas NO combinan bien (según feedback)
- Razón por la que no combinan
- Cuándo se aprendió

---

## ⚡ Después de la Migración

### 1. Reinicia los servidores
```powershell
# Terminal 1 - Backend
cd c:\Users\diego\Desktop\MiCloset\backend
npm start

# Terminal 2 - Frontend
cd c:\Users\diego\Desktop\MiCloset\frontend
npm start
```

### 2. Abre http://localhost:3000
- Registra un usuario o login
- Intenta agregar una prenda
- Deberías ver los campos `Estilo` y `Temporada`

### 3. Genera un outfit
- Selecciona ocasión, clima, categorías
- Presiona "✨ Generar Outfit"
- ¡Debería funcionar con el algoritmo inteligente!

### 4. Califica outfits
- Después de cada recomendación
- Presiona 👍 o 👎
- El sistema aprenderá de tus preferencias

---

## 🎉 ¡Listo!

Una vez que veas ✅ en la migración, el sistema inteligente está activado.

Cualquier duda, revisa los logs:
```bash
# Backend logs (en terminal)
npm start  # Verás errores aquí si falla BD

# Frontend logs (en navegador)
F12 → Console → Busca errores
```

**¡A disfrutar de outfits inteligentes!** 👗✨

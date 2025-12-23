# 📡 Ejemplos de Requests API - MiCloset

Estos ejemplos puedes probarlos con:
- **Postman** (GUI)
- **Insomnia** (GUI)
- **curl** (línea de comandos)
- **Thunder Client** (extensión VS Code)

## 🔐 Autenticación

### 1. Registrarse

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123",
    "username": "usuario_cool",
    "gender": "femenino",
    "fullName": "Mi Nombre Completo"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "✅ Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "username": "usuario_cool",
    "email": "usuario@ejemplo.com",
    "gender": "femenino",
    "fullName": "Mi Nombre Completo"
  }
}
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "✅ Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "username": "usuario_cool",
    "email": "usuario@ejemplo.com",
    "gender": "femenino",
    "fullName": "Mi Nombre Completo"
  }
}
```

**Guarda el token para los siguientes requests**

### 3. Obtener Perfil

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 👔 Gestión de Prendas

### 4. Obtener Todas las Prendas

```bash
curl -X GET http://localhost:5000/api/garments \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "total": 2,
  "garments": [
    {
      "id": "uuid-prenda-1",
      "name": "Blusa Azul",
      "description": "Blusa de verano",
      "color": "azul",
      "size": "M",
      "brand": "Zara",
      "image_url": "https://...",
      "category": "Blusas",
      "icon_emoji": "👕"
    }
  ]
}
```

### 5. Obtener Categorías del Usuario

```bash
curl -X GET http://localhost:5000/api/garments/categories \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "gender": "femenino",
  "categories": [
    {
      "id": "uuid-cat-1",
      "name": "Blusas",
      "description": "Blusas, camisetas y tops",
      "icon_emoji": "👕",
      "gender": "femenino"
    },
    {
      "id": "uuid-cat-2",
      "name": "Pantalones",
      "description": "Pantalones y leggins",
      "icon_emoji": "👖",
      "gender": "femenino"
    }
  ]
}
```

### 6. Crear Prenda

```bash
curl -X POST http://localhost:5000/api/garments \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blusa Roja Elegante",
    "categoryId": "uuid-de-categoria-blusas",
    "description": "Blusa de satén roja para ocasiones especiales",
    "color": "rojo",
    "size": "M",
    "brand": "Zara",
    "imageUrl": "https://via.placeholder.com/300?text=Blusa+Roja",
    "purchaseDate": "2024-01-15",
    "condition": "como_nuevo",
    "tags": ["formal", "elegante", "rojo"]
  }'
```

### 7. Actualizar Prenda

```bash
curl -X PUT http://localhost:5000/api/garments/uuid-prenda-1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blusa Roja Elegante (Actualizada)",
    "color": "rojo oscuro",
    "tags": ["formal", "elegante", "rojo", "premium"]
  }'
```

### 8. Eliminar Prenda

```bash
curl -X DELETE http://localhost:5000/api/garments/uuid-prenda-1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "message": "✅ Prenda eliminada del closet"
}
```

### 9. Buscar Prendas

```bash
curl -X GET "http://localhost:5000/api/garments/search?query=blusa&color=azul" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## ✨ Generador Inteligente de Outfits

### 10. Generar Outfit Recomendado (FUNCIÓN PRINCIPAL)

```bash
curl -X POST http://localhost:5000/api/recommendations/generate \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "occasion": "casual",
    "weather": "templado",
    "colorPreference": "azul"
  }'
```

**Respuesta:**
```json
{
  "message": "✅ Recomendaciones generadas",
  "recommendations": [
    {
      "items": [
        {
          "id": "uuid-1",
          "name": "Blusa Azul",
          "color": "azul",
          "image_url": "https://...",
          "category": "Blusas",
          "icon_emoji": "👕"
        },
        {
          "id": "uuid-2",
          "name": "Pantalón Negro",
          "color": "negro",
          "image_url": "https://...",
          "category": "Pantalones",
          "icon_emoji": "👖"
        },
        {
          "id": "uuid-3",
          "name": "Zapatillas Blancas",
          "color": "blanco",
          "image_url": "https://...",
          "category": "Zapatillas",
          "icon_emoji": "👟"
        }
      ],
      "score": 87,
      "occasion": "casual",
      "reasoning": "Este outfit combina blusa, pantalones, zapatillas perfectamente para una ocasión casual. Confianza de combinación: excelente (87%)"
    },
    {
      "score": 79,
      ...
    }
  ]
}
```

### 11. Obtener Historial de Recomendaciones

```bash
curl -X GET http://localhost:5000/api/recommendations/history \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 12. Valorar Recomendación

```bash
curl -X PUT http://localhost:5000/api/recommendations/uuid-recomendacion/rate \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "liked": true
  }'
```

---

## 🎯 Outfits Personalizados

### 13. Crear Outfit Personalizado

```bash
curl -X POST http://localhost:5000/api/outfits \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Outfit Casual Favorito",
    "description": "El que uso los domingos",
    "occasion": "casual",
    "season": "verano",
    "colorTheme": "azul y blanco",
    "garmentIds": ["uuid-prenda-1", "uuid-prenda-2", "uuid-prenda-3"]
  }'
```

### 14. Obtener Todos los Outfits

```bash
curl -X GET http://localhost:5000/api/outfits \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 15. Obtener Detalles de Outfit

```bash
curl -X GET http://localhost:5000/api/outfits/uuid-outfit \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 16. Eliminar Outfit

```bash
curl -X DELETE http://localhost:5000/api/outfits/uuid-outfit \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🧪 Casos de Uso Prácticos

### Caso 1: Flow Completo de Usuario Nuevo

```bash
# 1. Registrarse
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"nueva@usuario.com","password":"Pass123456","username":"nuevo_user","gender":"femenino"}' \
  | jq -r '.token')

# 2. Agregar primera prenda
curl -X POST http://localhost:5000/api/garments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Blusa Rosa","categoryId":"uuid-blusas","color":"rosa","imageUrl":"https://via.placeholder.com/300"}'

# 3. Agregar segunda prenda
curl -X POST http://localhost:5000/api/garments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pantalón Blanco","categoryId":"uuid-pantalones","color":"blanco","imageUrl":"https://via.placeholder.com/300"}'

# 4. Generar outfit
curl -X POST http://localhost:5000/api/recommendations/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"occasion":"casual","weather":"templado"}'
```

### Caso 2: Experiencias Diferentes

```bash
# Outfit para día frío
curl -X POST http://localhost:5000/api/recommendations/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"occasion":"casual","weather":"frio"}'

# Outfit para playa
curl -X POST http://localhost:5000/api/recommendations/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"occasion":"playa","weather":"calido"}'

# Outfit formal
curl -X POST http://localhost:5000/api/recommendations/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"occasion":"formal","weather":"templado"}'
```

---

## 📝 Notas Importantes

1. **Token JWT**: Cambia `TU_TOKEN_AQUI` por el token que recibiste en login
2. **UUID**: Reemplaza `uuid-xxx` con IDs reales de tu base de datos
3. **Headers**: Siempre incluye `Authorization: Bearer {token}` excepto en login/register
4. **Content-Type**: Para POST/PUT, siempre incluye `"Content-Type: application/json"`

---

## 🛠️ Herramientas Recomendadas

- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download
- **Thunder Client** (VS Code): Extensión en el marketplace
- **curl** (línea de comandos): Ya incluido en Windows/Mac/Linux

---

**¡Listo para probar la API!** 🚀

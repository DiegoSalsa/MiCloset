-- Script para crear la BD en Supabase
-- Ejecutar en: Supabase > SQL Editor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('masculino', 'femenino', 'otro')),
    full_name VARCHAR(120),
    profile_picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías de Prendas
CREATE TABLE clothing_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('masculino', 'femenino', 'otro', 'unisex')),
    icon_emoji VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, gender)
);

-- Tabla de Prendas
CREATE TABLE garments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES clothing_categories(id),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    color VARCHAR(50),
    size VARCHAR(20),
    brand VARCHAR(100),
    image_url VARCHAR(500) NOT NULL,
    purchase_date DATE,
    condition VARCHAR(20) CHECK (condition IN ('como_nuevo', 'bueno', 'usado')),
    style VARCHAR(50),
    season VARCHAR(50),
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Outfits
CREATE TABLE outfit_combinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    occasion VARCHAR(100),
    season VARCHAR(20),
    color_theme VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Items en Outfits
CREATE TABLE outfit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outfit_id UUID NOT NULL REFERENCES outfit_combinations(id) ON DELETE CASCADE,
    garment_id UUID NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
    position VARCHAR(50),
    UNIQUE(outfit_id, garment_id)
);

-- Tabla de Recomendaciones
CREATE TABLE outfit_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    outfit_id UUID,
    occasion VARCHAR(100),
    weather VARCHAR(20),
    color_preference VARCHAR(50),
    confidence_score DECIMAL(3, 2),
    reasoning TEXT,
    liked BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Preferencias del Usuario
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    favorite_colors JSONB,
    style_preference VARCHAR(100),
    budget_range VARCHAR(50),
    sustainability_priority BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Compatibilidad de Colores
CREATE TABLE color_compatibility (
    color1 VARCHAR(50) NOT NULL,
    color2 VARCHAR(50) NOT NULL,
    compatibility_score DECIMAL(3, 2),
    PRIMARY KEY(color1, color2)
);

-- Tabla de Rechazo de Combinaciones
CREATE TABLE rejected_combinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    garment_id1 UUID NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
    garment_id2 UUID NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, garment_id1, garment_id2)
);

-- Insertar categorías iniciales
INSERT INTO clothing_categories (name, gender, icon_emoji) VALUES
('Blusas', 'femenino', '👕'),
('Camisetas', 'femenino', '👕'),
('Pantalones', 'femenino', '👖'),
('Shorts', 'femenino', '👖'),
('Faldas', 'femenino', '👗'),
('Vestidos', 'femenino', '💃'),
('Hoodies', 'femenino', '🧥'),
('Sudaderas', 'femenino', '🧥'),
('Chaquetas', 'femenino', '🧥'),
('Abrigos', 'femenino', '🧥'),
('Zapatillas', 'femenino', '👟'),
('Zapatos', 'femenino', '👟'),
('Accesorios', 'femenino', '👜'),
('Cinturones', 'femenino', '👜'),
('Gorras', 'femenino', '🎩'),
('Sombreros', 'femenino', '🎩'),
('Bolsos', 'femenino', '👜'),
('Mochilas', 'femenino', '👜');

-- Insertar compatibilidades de colores
INSERT INTO color_compatibility (color1, color2, compatibility_score) VALUES
('negro', 'blanco', 0.95),
('negro', 'rojo', 0.85),
('negro', 'azul', 0.90),
('blanco', 'rojo', 0.85),
('blanco', 'azul', 0.90),
('rojo', 'azul', 0.70),
('rojo', 'gris', 0.80),
('azul', 'gris', 0.85),
('verde', 'beige', 0.80),
('verde', 'gris', 0.75),
('rosa', 'blanco', 0.85),
('rosa', 'gris', 0.80);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_garments_user_id ON garments(user_id);
CREATE INDEX idx_garments_category_id ON garments(category_id);
CREATE INDEX idx_outfit_recommendations_user_id ON outfit_recommendations(user_id);
CREATE INDEX idx_outfit_items_outfit_id ON outfit_items(outfit_id);

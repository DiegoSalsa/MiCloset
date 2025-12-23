-- MiCloset Database Schema
-- PostgreSQL - UTF-8 Encoding

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

-- Tabla de Categorías de Prendas (diferenciadas por género)
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
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Combinaciones de Outfits
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

-- Tabla de relación Prendas en Outfits
CREATE TABLE outfit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outfit_id UUID NOT NULL REFERENCES outfit_combinations(id) ON DELETE CASCADE,
    garment_id UUID NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
    position VARCHAR(50),
    UNIQUE(outfit_id, garment_id)
);

-- Tabla de Recomendaciones de Outfits
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
    PRIMARY KEY (color1, color2)
);

-- Indices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_garments_user_id ON garments(user_id);
CREATE INDEX idx_garments_category_id ON garments(category_id);
CREATE INDEX idx_outfit_combinations_user_id ON outfit_combinations(user_id);
CREATE INDEX idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX idx_outfit_recommendations_user_id ON outfit_recommendations(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Insertar categorías por defecto para MUJERES
INSERT INTO clothing_categories (name, description, gender, icon_emoji) VALUES
('Blusas', 'Blusas, camisetas y tops', 'femenino', NULL),
('Pantalones', 'Pantalones y leggins', 'femenino', NULL),
('Faldas', 'Faldas y shorts', 'femenino', NULL),
('Vestidos', 'Vestidos completos', 'femenino', NULL),
('Hoodies', 'Sudaderas y hoodies', 'femenino', NULL),
('Chaquetas', 'Abrigos y chaquetas', 'femenino', NULL),
('Zapatillas', 'Zapatos y zapatillas', 'femenino', NULL),
('Accesorios', 'Bolsos, cinturones, sombreros', 'femenino', NULL);

-- Insertar categorías por defecto para HOMBRES
INSERT INTO clothing_categories (name, description, gender, icon_emoji) VALUES
('Camisetas', 'Camisetas y polos', 'masculino', NULL),
('Pantalones', 'Pantalones y shorts', 'masculino', NULL),
('Hoodies', 'Sudaderas y hoodies', 'masculino', NULL),
('Chaquetas', 'Abrigos y chaquetas', 'masculino', NULL),
('Zapatillas', 'Zapatos y zapatillas', 'masculino', NULL),
('Accesorios', 'Cinturones, gorras, mochilas', 'masculino', NULL);

-- Insertar compatibilidades de colores comunes
INSERT INTO color_compatibility (color1, color2, compatibility_score) VALUES
('blanco', 'negro', 0.95),
('blanco', 'azul', 0.90),
('negro', 'azul', 0.85),
('negro', 'gris', 0.90),
('azul', 'blanco', 0.90),
('rojo', 'blanco', 0.80),
('rojo', 'negro', 0.75),
('verde', 'blanco', 0.85),
('beige', 'marron', 0.90),
('gris', 'blanco', 0.85),
('gris', 'negro', 0.90),
('rosa', 'blanco', 0.85),
('rojo', 'gris', 0.70);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_garments_updated_at BEFORE UPDATE ON garments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outfit_combinations_updated_at BEFORE UPDATE ON outfit_combinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migracion: Agregar campos de estilo y temporada a garments
-- Fecha: 2025-12-22
-- Descripcion: Agrega campos para mejorar el sistema de matching inteligente

-- Agregar columnas a la tabla garments
ALTER TABLE garments
ADD COLUMN IF NOT EXISTS style VARCHAR(50) CHECK (style IN ('casual', 'formal', 'deportivo', 'bohemio', 'clasico', 'moderno', 'elegante')),
ADD COLUMN IF NOT EXISTS season VARCHAR(50) CHECK (season IN ('primavera', 'verano', 'otono', 'invierno', 'todo_ano'));

-- Crear tabla para guardar ratings de outfits (calificaciones del usuario)
CREATE TABLE IF NOT EXISTS outfit_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES outfit_recommendations(id) ON DELETE SET NULL,
    garment_ids UUID[] NOT NULL,
    occasion VARCHAR(100),
    weather VARCHAR(20),
    rating BOOLEAN NOT NULL,
    rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear indices
CREATE INDEX IF NOT EXISTS idx_outfit_ratings_user_id ON outfit_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_ratings_rating_date ON outfit_ratings(rating_date DESC);

-- Tabla para guardar feedback de compatibilidad aprendida
CREATE TABLE IF NOT EXISTS learned_incompatibilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    garment_id_1 UUID NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
    garment_id_2 UUID NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, garment_id_1, garment_id_2)
);

CREATE INDEX IF NOT EXISTS idx_learned_incompatibilities_user_id ON learned_incompatibilities(user_id);

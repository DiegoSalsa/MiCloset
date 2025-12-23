-- Actualizar emojis de categorías
UPDATE clothing_categories SET icon_emoji = CHAR(128077 || '') WHERE name = 'Blusas' AND gender = 'femenino';
UPDATE clothing_categories SET icon_emoji = CHAR(128088 || '') WHERE name = 'Pantalones';
UPDATE clothing_categories SET icon_emoji = CHAR(128087 || '') WHERE name = 'Faldas';
UPDATE clothing_categories SET icon_emoji = CHAR(128083 || '') WHERE name = 'Vestidos';
UPDATE clothing_categories SET icon_emoji = CHAR(129205 || '') WHERE (name = 'Hoodies' OR name = 'Chaquetas');
UPDATE clothing_categories SET icon_emoji = CHAR(128095 || '') WHERE name = 'Zapatillas';
UPDATE clothing_categories SET icon_emoji = CHAR(128084 || '') WHERE name = 'Accesorios';

-- Para hombres
UPDATE clothing_categories SET icon_emoji = CHAR(128077 || '') WHERE name = 'Camisetas' AND gender = 'masculino';

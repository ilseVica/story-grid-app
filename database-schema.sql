-- Script SQL para crear la base de datos Story Grid
-- Compatible con PostgreSQL

-- Crear extensión para generar UUIDs (si no existe)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de capítulos
CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    "order" TEXT NOT NULL
);

-- Tabla de personajes
CREATE TABLE IF NOT EXISTS characters (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    "order" TEXT NOT NULL
);

-- Tabla de tarjetas de contenido
CREATE TABLE IF NOT EXISTS cards (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id VARCHAR NOT NULL,
    chapter_id VARCHAR NOT NULL,
    content TEXT,
    tag TEXT
);

-- Opcional: Añadir índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_cards_character_id ON cards(character_id);
CREATE INDEX IF NOT EXISTS idx_cards_chapter_id ON cards(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters("order");
CREATE INDEX IF NOT EXISTS idx_characters_order ON characters("order");

-- Opcional: Comentarios para documentar las tablas
COMMENT ON TABLE chapters IS 'Tabla que almacena los capítulos de la historia';
COMMENT ON TABLE characters IS 'Tabla que almacena los personajes de la historia';
COMMENT ON TABLE cards IS 'Tabla que almacena las tarjetas de contenido que relacionan personajes con capítulos';

COMMENT ON COLUMN chapters.title IS 'Título del capítulo (ej: Capítulo 1, El Comienzo)';
COMMENT ON COLUMN chapters.description IS 'Descripción opcional del capítulo';
COMMENT ON COLUMN chapters."order" IS 'Orden del capítulo para mostrar en la interfaz';

COMMENT ON COLUMN characters.name IS 'Nombre del personaje';
COMMENT ON COLUMN characters.role IS 'Rol del personaje (ej: Protagonista, Antagonista)';
COMMENT ON COLUMN characters."order" IS 'Orden del personaje para mostrar en la interfaz';

COMMENT ON COLUMN cards.character_id IS 'ID del personaje asociado a esta tarjeta';
COMMENT ON COLUMN cards.chapter_id IS 'ID del capítulo asociado a esta tarjeta';
COMMENT ON COLUMN cards.content IS 'Contenido de la tarjeta - propósito del personaje en el capítulo';
COMMENT ON COLUMN cards.tag IS 'Etiqueta de la tarjeta (introducción, conflicto, desarrollo, etc.)';

-- Ejemplos de datos de prueba (opcional - descomenta si quieres datos de ejemplo)
/*
INSERT INTO chapters (title, description, "order") VALUES 
    ('Capítulo 1', 'El comienzo de la aventura', '1'),
    ('Capítulo 2', 'El primer conflicto', '2'),
    ('Capítulo 3', 'La resolución', '3');

INSERT INTO characters (name, role, "order") VALUES 
    ('Ana', 'Protagonista', '1'),
    ('Marcus', 'Antagonista', '2'),
    ('Elena', 'Mentora', '3');

INSERT INTO cards (character_id, chapter_id, content, tag) VALUES 
    ((SELECT id FROM characters WHERE name = 'Ana'), 
     (SELECT id FROM chapters WHERE title = 'Capítulo 1'), 
     'Ana descubre su poder especial y comienza su viaje', 
     'introducción');
*/
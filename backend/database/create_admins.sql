-- Script pour créer des administrateurs supplémentaires
-- À exécuter dans la console SQL de Supabase (https://supabase.com/dashboard)

-- Créer la table admins si elle n'existe pas
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- IDENTIFIANTS DE CONNEXION ADMIN
-- ============================================

-- Admin 1: Super Admin
-- Email: admin@bonimusik.com
-- Mot de passe: Admin@2024!
INSERT INTO admins (email, password_hash, full_name)
VALUES (
    'admin@bonimusik.com',
    '$2b$10$ga6Q71JfAIVLgpsr8ZhFZ.TmYm7f.gnOoEteZ4ul/o2MakUOvAhpS',
    'Super Admin'
) ON CONFLICT (email) DO NOTHING;

-- Admin 2: Gestionnaire de contenu
-- Email: content@bonimusik.com
-- Mot de passe: Content@2024!
INSERT INTO admins (email, password_hash, full_name)
VALUES (
    'content@bonimusik.com',
    '$2b$10$qSYQlxhzQmmuPmYJrlWla.xbM98hAg7r3zGFwmT2sFn6rmFJmu6Rq',
    'Gestionnaire Contenu'
) ON CONFLICT (email) DO NOTHING;

-- Admin 3: Support Technique
-- Email: support@bonimusik.com
-- Mot de passe: Support@2024!
INSERT INTO admins (email, password_hash, full_name)
VALUES (
    'support@bonimusik.com',
    '$2b$10$gevrGJgXZmS97EecqPU06OZo2ILYdBbo.Grq0nvdT.cXYqzYbo.Me',
    'Support Technique'
) ON CONFLICT (email) DO NOTHING;

-- Vérifier les admins créés
SELECT id, email, full_name, created_at FROM admins;

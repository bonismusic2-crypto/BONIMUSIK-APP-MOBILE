-- Vérifier si l'admin existe
SELECT * FROM admins WHERE email = 'admin@bonismusic.com';

-- Si l'admin existe, supprimer et recréer avec le bon hash
DELETE FROM admins WHERE email = 'admin@bonismusic.com';

-- Créer l'admin avec le hash correct
INSERT INTO admins (email, password_hash, full_name)
VALUES (
    'admin@bonismusic.com',
    '$2b$10$2l3zBZPs2R9Y0YvaIeNz5OUFdQC/HY4u70KxJAchQVHM6lgHZtgma',
    'Administrator'
);

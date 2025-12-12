-- =========================================================
-- FIX: SYNCHRONISATION UTILISATEURS (Auth -> Public)
-- =========================================================

-- 1. Créer la fonction de synchronisation automatique
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (new.id, new.email, 'user', new.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Créer le trigger (déclencheur)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. IMPORTATION MANUELLE DES UTILISATEURS MANQUANTS
-- Cela corrige l'erreur "Foreign Key Violation" actuelle
INSERT INTO public.users (id, email, role, created_at)
SELECT id, email, 'user', created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Vérification
SELECT count(*) as "Total Users in Public Table" FROM public.users;

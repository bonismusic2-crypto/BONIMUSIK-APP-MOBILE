-- =========================================================
-- FIX: CORRECTION CLE ETRANGERE (Payment Intents -> Public Users)
-- =========================================================

-- 1. Supprimer l'ancienne contrainte erronée (si elle existe)
ALTER TABLE payment_intents
DROP CONSTRAINT IF EXISTS payment_intents_user_id_fkey;

-- 2. Créer la nouvelle contrainte correcte (vers public.users)
-- Cela force la base de données à vérifier l'utilisateur dans VOTRE table 'users'
ALTER TABLE payment_intents
ADD CONSTRAINT payment_intents_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE;

-- 3. Confirmation simple
SELECT 'SUCCESS: FK fixed to point to public.users' as result;

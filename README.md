# BONIS MUSIC - Documentation Complète

## 📱 Vue d'ensemble du projet

BONIS MUSIC est une application mobile de streaming chrétien avec un dashboard admin pour la gestion du contenu.

### Technologies utilisées
- **Frontend Mobile**: React Native (Expo)
- **Backend**: NestJS
- **Base de données**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentification**: JWT + Numéros de téléphone

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase
- Expo Go (pour tester sur mobile)

### Configuration Backend

1. **Installer les dépendances**
```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement**
Créer un fichier `.env` :
```env
SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE=votre_service_role_key
JWT_SECRET=votre_secret_jwt
```

3. **Exécuter les scripts SQL**
Dans Supabase SQL Editor, exécuter dans l'ordre :
- `database/complete_setup.sql`
- `database/create_playlists_tables.sql`

4. **Démarrer le serveur**
```bash
npm run start:dev
```
Le backend sera disponible sur `http://localhost:3000`

### Configuration Dashboard Admin

1. **Installer les dépendances**
```bash
cd admin
npm install
```

2. **Démarrer le dashboard**
```bash
npm run dev
```
Le dashboard sera disponible sur `http://localhost:3001`

3. **Identifiants par défaut**
- Email: `admin@bonismusic.com`
- Password: `Admin123456`

### Configuration Application Mobile

1. **Installer les dépendances**
```bash
cd mobile
npm install
```

2. **Configurer l'API**
Modifier `src/services/api.ts` :
```typescript
const API_URL = 'http://VOTRE_IP_LOCAL:3000';
```

3. **Démarrer Expo**
```bash
npx expo start
```

---

## 📊 Structure de la Base de Données

### Tables principales

#### users
- `id` (UUID)
- `phone_number` (TEXT)
- `full_name` (TEXT)
- `password_hash` (TEXT)
- `role` (TEXT) - 'user', 'artist', 'editor', 'admin'
- `is_blocked` (BOOLEAN)
- `created_at` (TIMESTAMP)

#### albums
- `id` (UUID)
- `title` (TEXT)
- `artist` (TEXT)
- `year` (INTEGER)
- `description` (TEXT)
- `cover_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

#### videos
- `id` (UUID)
- `title` (TEXT)
- `category` (TEXT)
- `url` (TEXT)
- `thumbnail_url` (TEXT)
- `description` (TEXT)
- `views` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

#### teachings
- `id` (UUID)
- `title` (TEXT)
- `type` (TEXT) - 'Enseignement', 'Prédication'
- `file_url` (TEXT)
- `thumbnail_url` (TEXT)
- `description` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

#### playlists
- `id` (UUID)
- `user_id` (UUID)
- `name` (TEXT)
- `description` (TEXT)
- `cover_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

#### playlist_items
- `id` (UUID)
- `playlist_id` (UUID)
- `content_type` (TEXT) - 'video', 'teaching', 'album'
- `content_id` (UUID)
- `position` (INTEGER)
- `created_at` (TIMESTAMP)

---

## 🎯 Fonctionnalités

### Dashboard Admin
✅ Gestion des albums (CRUD + Upload)
✅ Gestion des vidéos (CRUD + Upload)
✅ Gestion des enseignements (CRUD + Upload)
✅ Gestion des utilisateurs avec rôles
✅ Gestion des lives
✅ Analytics

### Application Mobile
✅ Authentification par numéro de téléphone
✅ Écran d'accueil avec contenu dynamique
✅ Recherche en temps réel
✅ Lecteur vidéo/audio
✅ Bibliothèque (Albums, Vidéos, Enseignements)
✅ Gestion des playlists
✅ Téléchargement pour écoute hors ligne
✅ Profil utilisateur
✅ Notifications push
✅ Cache et optimisations

---

## 🔧 API Endpoints

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion

### Contenu
- `GET /api/albums` - Liste des albums
- `POST /api/albums` - Créer un album
- `PUT /api/albums/:id` - Modifier un album
- `DELETE /api/albums/:id` - Supprimer un album

- `GET /api/videos` - Liste des vidéos
- `POST /api/videos` - Créer une vidéo
- `PUT /api/videos/:id` - Modifier une vidéo
- `DELETE /api/videos/:id` - Supprimer une vidéo

- `GET /api/teachings` - Liste des enseignements
- `POST /api/teachings` - Créer un enseignement
- `PUT /api/teachings/:id` - Modifier un enseignement
- `DELETE /api/teachings/:id` - Supprimer un enseignement

### Playlists
- `GET /api/playlists?userId=xxx` - Playlists d'un utilisateur
- `POST /api/playlists` - Créer une playlist
- `GET /api/playlists/:id/items` - Items d'une playlist
- `POST /api/playlists/:id/items` - Ajouter un item
- `DELETE /api/playlists/items/:itemId` - Retirer un item

### Lives
- `GET /api/lives` - Liste des lives
- `POST /api/lives` - Créer un live
- `PUT /api/lives/:id` - Modifier un live

---

## 📱 Services Mobile

### Cache Service
```typescript
import { CacheService } from '../services/performance';

// Sauvegarder dans le cache
await CacheService.set('key', data);

// Récupérer du cache
const data = await CacheService.get('key');

// Nettoyer le cache
await CacheService.clearAll();
```

### Notifications
```typescript
import { registerForPushNotificationsAsync, sendImmediateNotification } from '../services/notifications';

// Enregistrer pour les notifications
const token = await registerForPushNotificationsAsync();

// Envoyer une notification
await sendImmediateNotification('Titre', 'Message');
```

---

## 🎨 Thème et Design

### Couleurs principales
- Primaire: `#FFC107` (Jaune/Or)
- Fond: `#000000` (Noir)
- Fond secondaire: `#1A1A1A`
- Texte: `#FFFFFF`
- Texte secondaire: `#888888`

---

## 🔐 Sécurité

### Authentification
- JWT tokens pour l'API
- Hachage bcrypt pour les mots de passe
- Row Level Security (RLS) sur Supabase

### Permissions
- Utilisateur standard: Lecture seule
- Artiste: Peut uploader du contenu
- Éditeur: Peut modifier le contenu
- Administrateur: Accès complet

---

## 📈 Optimisations

### Performance
- ✅ Cache des requêtes API (30 min)
- ✅ Cache des images
- ✅ Lazy loading des listes
- ✅ Monitoring des performances
- ✅ Pull-to-refresh

### Réseau
- ✅ Requêtes parallèles
- ✅ Gestion des erreurs
- ✅ Retry automatique
- ✅ Timeout configuré (10s)

---

## 🚧 Prochaines Étapes

### À implémenter
- [ ] Système de paiement CinetPay
- [ ] Abonnements premium
- [ ] Partage social
- [ ] Commentaires et likes
- [ ] Mode hors ligne complet
- [ ] Statistiques utilisateur

---

## 📞 Support

Pour toute question ou problème :
- Email: support@bonismusic.com
- Documentation: [À créer]

---

## 📄 Licence

© 2025 BONIS MUSIC - Tous droits réservés

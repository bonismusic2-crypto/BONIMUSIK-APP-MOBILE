# 🔥 Guide de Configuration Firebase - BONI MUSIK

## Étape 1 : Créer un Projet Firebase (5 minutes)

1. **Aller sur Firebase Console**
   - Ouvrir : https://console.firebase.google.com/
   - Se connecter avec ton compte Google

2. **Créer un nouveau projet**
   - Cliquer sur "Ajouter un projet"
   - Nom du projet : `BONI MUSIK`
   - Accepter les conditions
   - **Désactiver Google Analytics** (pas nécessaire pour nous)
   - Cliquer sur "Créer le projet"

---

## Étape 2 : Configurer l'Application Android (5 minutes)

1. **Ajouter une application Android**
   - Dans la console Firebase, cliquer sur l'icône Android
   - **Nom du package Android** : `com.bonimusik.app`
   - **Surnom de l'application** : `BONI MUSIK Android`
   - Laisser le SHA-1 vide pour l'instant
   - Cliquer sur "Enregistrer l'application"

2. **Télécharger google-services.json**
   - Télécharger le fichier `google-services.json`
   - **IMPORTANT** : Placer ce fichier dans :
     ```
     C:\Users\User\Desktop\BONIS MUSIC V01\mobile\google-services.json
     ```

---

## Étape 3 : Configurer l'Application iOS (5 minutes)

1. **Ajouter une application iOS**
   - Dans la console Firebase, cliquer sur l'icône iOS
   - **ID du bundle iOS** : `com.bonimusik.app`
   - **Surnom de l'application** : `BONI MUSIK iOS`
   - Laisser les autres champs vides
   - Cliquer sur "Enregistrer l'application"

2. **Télécharger GoogleService-Info.plist**
   - Télécharger le fichier `GoogleService-Info.plist`
   - **IMPORTANT** : Placer ce fichier dans :
     ```
     C:\Users\User\Desktop\BONIS MUSIC V01\mobile\GoogleService-Info.plist
     ```

---

## Étape 4 : Activer Cloud Messaging (2 minutes)

1. **Aller dans Cloud Messaging**
   - Dans le menu de gauche : "Engagement" → "Cloud Messaging"
   - Cliquer sur "Activer"

2. **Vérifier l'activation**
   - Vous devriez voir "Cloud Messaging activé" ✅

---

## Étape 5 : Activer Authentication (3 minutes)

1. **Aller dans Authentication**
   - Dans le menu de gauche : "Build" → "Authentication"
   - Cliquer sur "Commencer"

2. **Activer Phone Authentication**
   - Onglet "Sign-in method"
   - Cliquer sur "Phone"
   - Activer le bouton
   - Cliquer sur "Enregistrer"

3. **Vérifier les quotas gratuits**
   - Vous avez **10,000 SMS gratuits par mois** ✅

---

## Étape 6 : Récupérer la Clé Privée pour le Backend (5 minutes)

1. **Aller dans Paramètres du Projet**
   - Cliquer sur l'icône ⚙️ (en haut à gauche)
   - Cliquer sur "Paramètres du projet"

2. **Aller dans Comptes de service**
   - Onglet "Comptes de service"
   - Cliquer sur "Générer une nouvelle clé privée"
   - Confirmer en cliquant sur "Générer la clé"

3. **Télécharger le fichier JSON**
   - Un fichier JSON sera téléchargé
   - **IMPORTANT** : Renommer ce fichier en `firebase-admin-key.json`
   - Placer ce fichier dans :
     ```
     C:\Users\User\Desktop\BONIS MUSIC V01\backend\firebase-admin-key.json
     ```

---

## Étape 7 : Récupérer la Configuration Web (3 minutes)

1. **Ajouter une application Web**
   - Dans "Paramètres du projet" → "Général"
   - Descendre jusqu'à "Vos applications"
   - Cliquer sur l'icône Web `</>`
   - **Surnom de l'application** : `BONI MUSIK Web`
   - **NE PAS** cocher "Configurer Firebase Hosting"
   - Cliquer sur "Enregistrer l'application"

2. **Copier la configuration**
   - Vous verrez un objet JavaScript `firebaseConfig`
   - **Copier tout le contenu** (on l'utilisera plus tard)

---

## ✅ Checklist Finale

Avant de continuer, vérifie que tu as bien :

- [ ] Créé le projet Firebase "BONI MUSIK"
- [ ] Téléchargé `google-services.json` (Android)
- [ ] Téléchargé `GoogleService-Info.plist` (iOS)
- [ ] Téléchargé `firebase-admin-key.json` (Backend)
- [ ] Activé Cloud Messaging
- [ ] Activé Phone Authentication
- [ ] Copié la configuration Web

---

## 🎯 Prochaine Étape

Une fois que tu as tous ces fichiers, **dis-moi "C'est bon"** et je vais :
1. Configurer automatiquement le mobile
2. Configurer automatiquement le backend
3. Créer les services de notifications
4. Créer l'écran "Mot de passe oublié"

---

## ⚠️ IMPORTANT - Sécurité

**NE JAMAIS** partager ou commit ces fichiers sur GitHub :
- `google-services.json`
- `GoogleService-Info.plist`
- `firebase-admin-key.json`

Ils contiennent des clés secrètes pour ton projet !

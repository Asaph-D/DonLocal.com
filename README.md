# 🌍 DonLocal.cm - Plateforme de Partage Local au Cameroun

**La première plateforme camerounaise de partage local et solidaire**

Connectez-vous à votre communauté pour donner, échanger et s'entraider localement.

---

## ✨ Fonctionnalités

### 🎯 Core Features
- ✅ **Partage de ressources** - Dons, Services, Échanges, Entraide
- ✅ **Recherche avancée** - Filtres par catégorie, localisation, statut
- ✅ **Authentification** - Connexion/Inscription sécurisée
- ✅ **Profil utilisateur** - Gestion de compte et statistiques
- ✅ **Contact direct** - Email, WhatsApp, Téléphone
- ✅ **Notifications** - Toast notifications élégantes
- ✅ **Responsive Design** - Mobile, Tablet, Desktop

### 🎨 Animations & UX
- ✅ **Particles Canvas** - Particules blanches flottantes en arrière-plan
- ✅ **Scroll Progress Bar** - Barre de progression en haut de page
- ✅ **Fade In Animations** - Apparition progressive des éléments
- ✅ **Float Animation** - Effet de flottement subtil
- ✅ **3D Card Hover** - Transformations 3D sur les cards
- ✅ **Drag & Drop** - Réorganisation des ressources
- ✅ **Shimmer Effect** - Effet de brillance au hover

---

## 🏗️ Architecture

```
DonLocal/
├── src/app/
│   ├── core/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   └── footer/
│   │   ├── services/
│   │   │   ├── animation.service.ts
│   │   │   ├── resource.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── local-storage.service.ts
│   │   └── models/
│   │       └── *.model.ts
│   ├── features/
│   │   ├── home/
│   │   ├── resources/
│   │   │   ├── resource-list/
│   │   │   ├── resource-detail/
│   │   │   └── resource-form/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── profile/
│   │   └── about/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── card-resource/
│   │   │   └── modal/
│   │   └── pipes/
│   │       └── *.pipe.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
└── ...
```

---

## 🚀 Installation

### Prérequis
- Node.js (v18+)
- Angular CLI (v19)
- npm ou yarn

### 1. Installation des dépendances

```bash
# Cloner le projet
git clone https://github.com/votre-repo/donlocal-cm.git
cd donlocal-cm

# Installer les dépendances
npm install

# Ou avec yarn
yarn install
```

### 2. Configuration Tailwind CSS

```bash
# Installer Tailwind
npm install -D tailwindcss postcss autoprefixer

# Générer les fichiers de config
npx tailwindcss init
```

**tailwind.config.js**
```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#10b981',
          400: '#34d399',
        },
      },
    },
  },
  plugins: [],
}
```

**styles.scss**
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Lancer le projet

```bash
# Mode développement
ng serve

# Ou
npm start

# Accéder à l'application
# http://localhost:4200
```

### 4. Build pour production

```bash
# Build optimisé
ng build --configuration production

# Les fichiers seront dans dist/
```

---

## 📦 Composants créés

### Core Services (6)
1. ✅ **AnimationService** - Gestion des animations (particles, scroll)
2. ✅ **ResourceService** - CRUD des ressources avec Signals
3. ✅ **CategoryService** - Gestion des catégories
4. ✅ **UserService** - Authentification et profil
5. ✅ **NotificationService** - Toast notifications
6. ✅ **LocalStorageService** - Persistance des données

### Core Components (2)
7. ✅ **HeaderComponent** - Navigation responsive avec menu mobile
8. ✅ **FooterComponent** - Footer professionnel

### Shared Components (2)
9. ✅ **CardResourceComponent** - Card avec animations 3D
10. ✅ **ModalComponent** - Modal réutilisable

### Shared Pipes (6)
11. ✅ **TruncatePipe** - Tronquer du texte
12. ✅ **FilterPipe** - Filtrage de listes
13. ✅ **TimeAgoPipe** - Affichage relatif du temps
14. ✅ **SafeHtmlPipe** - Sanitization HTML
15. ✅ **PhoneFormatPipe** - Formatage de numéros
16. ✅ **HighlightPipe** - Surlignage de texte

### Features Components (7)
17. ✅ **HomeComponent** - Page d'accueil avec Hero
18. ✅ **ResourceListComponent** - Liste avec filtres + drag&drop
19. ✅ **ResourceDetailComponent** - Détails d'une ressource
20. ✅ **ResourceFormComponent** - Formulaire création/édition
21. ✅ **LoginComponent** - Connexion
22. ✅ **RegisterComponent** - Inscription avec force du mot de passe
23. ✅ **ProfileComponent** - Profil utilisateur avec tabs
24. ✅ **AboutComponent** - Page à propos

### Configuration (3)
25. ✅ **App Routes** - Routing complet avec lazy loading
26. ✅ **App Component** - Root component avec notifications
27. ✅ **App Config** - Configuration principale

---

## 🎨 Design System

### Couleurs
- **Primary**: Emerald (#10b981)
- **Background**: Black (#000000)
- **Surface**: Zinc-900 (#18181b)
- **Text**: White (#ffffff)
- **Gray**: Gray-400 (#9ca3af)

### Typographie
- **Font Family**: Inter, system-ui, sans-serif
- **Font Weight**: Light (300), Regular (400), Medium (500), Bold (700)
- **Tracking**: Letterspacing pour un look moderne

### Spacing
- Utilisation du système Tailwind (4px base)
- Padding/Margin cohérents

---

## 🔧 Technologies utilisées

- **Angular 19** - Framework standalone components
- **TypeScript** - Langage typé
- **Tailwind CSS** - Utility-first CSS framework
- **Signals** - Gestion d'état réactive
- **Reactive Forms** - Formulaires réactifs
- **Router** - Navigation avec lazy loading
- **SCSS** - Préprocesseur CSS

---

## 📱 Responsive Design

- **Mobile First** - Design optimisé mobile d'abord
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

---

## 🌟 Fonctionnalités à venir

- [ ] Chat en temps réel
- [ ] Système de notation/avis
- [ ] Notifications push
- [ ] Upload d'images
- [ ] Géolocalisation avancée
- [ ] API Backend
- [ ] PWA (Progressive Web App)
- [ ] Mode sombre/clair
- [ ] Multilingue (FR/EN)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License - Libre d'utilisation

---

## 👥 Équipe

- **Marie K.** - Fondatrice
- **Jean P.** - Développeur
- **Sophie M.** - Designer
- **Paul N.** - Community Manager

---

## 📞 Contact

- **Email**: contact@donlocal.cm
- **WhatsApp**: +237 650 000 000
- **Site Web**: https://donlocal.cm

---

## 🙏 Remerciements

Merci à tous les contributeurs et à la communauté camerounaise pour leur soutien !

---

**Fait avec ❤️ au Cameroun 🇨🇲**



# DonLocalCom

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

======================================================================================================================================================================================================================================================================================================================================================================================================

// ==========================================
// 7. DÉPLOIEMENT - Guide complet
// ==========================================

/*
==========================================
DÉPLOIEMENT BACKEND (API)
==========================================

OPTION 1: RENDER.COM (Gratuit)
--------------------------------
1. Créer un compte sur render.com
2. Connecter votre repo GitHub
3. Créer un "Web Service"
4. Configuration:
   - Build Command: npm install
   - Start Command: npm start
   - Environment: Node
5. Variables d'environnement:
   - NODE_ENV=production
   - MONGODB_URI=your_mongodb_atlas_uri
   - JWT_SECRET=your_secret
   - CLOUDINARY_...
   - CLIENT_URL=https://your-frontend.com

OPTION 2: RAILWAY.APP (Gratuit)
---------------------------------
1. Créer un compte sur railway.app
2. New Project > Deploy from GitHub
3. Add variables d'environnement
4. Deploy automatique

OPTION 3: HEROKU
-----------------
1. Installer Heroku CLI
2. Commandes:
   heroku login
   heroku create donlocal-api
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=...
   git push heroku main

==========================================
DÉPLOIEMENT FRONTEND (Angular)
==========================================

OPTION 1: VERCEL (Recommandé)
-------------------------------
1. Installer Vercel CLI:
   npm i -g vercel

2. Build:
   ng build --configuration production

3. Deploy:
   vercel --prod

OPTION 2: NETLIFY
------------------
1. Build:
   ng build --configuration production

2. Déployer le dossier dist/

3. Configuration _redirects:
   /* /index.html 200

OPTION 3: FIREBASE HOSTING
----------------------------
1. Installer Firebase CLI:
   npm i -g firebase-tools

2. Init:
   firebase init hosting

3. Build:
   ng build --configuration production

4. Deploy:
   firebase deploy

==========================================
BASE DE DONNÉES
==========================================

MONGODB ATLAS (Gratuit)
------------------------
1. Créer un compte: https://mongodb.com/cloud/atlas
2. Créer un cluster gratuit (M0)
3. Database Access: Créer un user
4. Network Access: Ajouter 0.0.0.0/0 (tous)
5. Connect: Copier l'URI de connexion
6. Remplacer <password> par votre mot de passe

URI Format:
mongodb+srv://username:password@cluster.mongodb.net/donlocal

==========================================
CLOUDINARY (Upload images)
==========================================

1. Créer un compte gratuit: https://cloudinary.com
2. Dashboard > Account Details
3. Copier:
   - Cloud Name
   - API Key
   - API Secret
4. Ajouter dans .env

==========================================
TESTS DE L'API
==========================================

# Test local
curl http://localhost:5000/api/resources

# Test production
curl https://your-api.com/api/resources

# Test avec Postman/Insomnia
Importer la collection depuis:
https://www.postman.com/downloads/

==========================================
MONITORING & LOGS
==========================================

# Voir les logs Render
render logs --tail

# Voir les logs Heroku
heroku logs --tail

# MongoDB Atlas
Monitoring > Metrics

==========================================
SÉCURITÉ - Checklist
==========================================

✅ Variables d'environnement sécurisées
✅ CORS configuré correctement
✅ Rate limiting activé
✅ Helmet.js pour les headers
✅ Validation des données (express-validator)
✅ JWT avec expiration
✅ Pas de données sensibles dans les logs
✅ HTTPS obligatoire en production
✅ Backup de la base de données

==========================================
COMMANDES UTILES
==========================================

# Build Angular
ng build --configuration production

# Test build Angular local
cd dist/donlocal
npx http-server -p 4200

# Variables d'env backend
heroku config:set KEY=VALUE
render env set KEY=VALUE

# MongoDB backup
mongodump --uri="mongodb+srv://..."

# Logs
heroku logs --tail
vercel logs
*/
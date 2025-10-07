# Hono Todo API

Une API REST complète construite avec **Hono**, **TypeScriptLe serveur sera accessible sur `http://localhost:3000`

##  Données de Test (Seeders)

L'API dispose d'un seeder unifié pour peupler la base de données avec des données de test.

### Commandes disponibles :

```bash
# Seed complet (utilisateurs + todos)
npm run seed
 # Nettoyer toute la base de données

npm run seed:clean 
```

### Comptes de test créés :

| Email | Mot de passe | Description |
|-------|--------------|-------------|
| `admin@example.com` | `admin123` | Compte administrateur |
| `john.doe@example.com` | `password123` | Utilisateur test 1 |
| `jane.smith@example.com` | `password123` | Utilisateur test 2 |
| `alice.johnson@example.com` | `password123` | Utilisateur test 3 |
| `bob.wilson@example.com` | `password123` | Utilisateur test 4 |

### � Workflow recommandé pour débuter :

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données
npm run db:push

# 3. Peupler avec des données de test
npm run seed

# 4. Démarrer le serveur
npm run dev

# 5. Tester l'API avec Postman
# Utilisez les comptes : john.doe@example.com / password123
```

##  API Documentation et **MySQL** pour une application Todo List avec authentification JWT.

##  Fonctionnalités

### Authentification
- ✅ Inscription utilisateur avec validation email/mot de passe
- ✅ Connexion avec token JWT stocké en **http-only cookie**
- ✅ Middleware de sécurisation des routes
- ✅ Déconnexion sécurisée

### Gestion des tâches
- ✅ CRUD complet des tâches (Create, Read, Update, Delete)  
- ✅ Tâches liées à l'utilisateur connecté uniquement
- ✅ Pagination des résultats (max 50 par page)
- ✅ Validation des données d'entrée

### Sécurité
- ✅ Mots de passe hachés avec **bcrypt**
- ✅ JWT en **http-only cookies**
- ✅ Validation des champs avec **Zod**
- ✅ Gestion des erreurs détaillée

##  Prérequis

- Node.js >= 18
- MySQL >= 8.0
- npm ou yarn

## 🛠️ Installation

### 1. Cloner et installer les dépendances

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npm run db:generate
```

### 2. Configuration de la base de données

1. **Créer la base MySQL :**
```
2. **Configurer les variables d'environnement :**
Modifier le fichier `.env` avec vos paramètres MySQL :
```env
DATABASE_URL="mysql://username:password@localhost:3306/hono_todo_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

3. **Synchroniser le schéma Prisma :**
```bash
npm run db:push
```

4. **Peupler la base avec des données de test (optionnel) :**
```bash
npm run seed
```

### 3. Démarrer le serveur

```bash
# Mode développement (avec rechargement automatique) pour executer le project
npx tsc --noEmit
npm run dev



Le serveur sera accessible sur `http://localhost:3000`

##  API Documentation

### Routes d'authentification

#### `POST /auth/register`
Inscription d'un nouvel utilisateur.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `POST /auth/login`
Connexion utilisateur.

**Body :**
```json
{
  "email": "user@example.com", 
  "password": "password123"
}
```

#### `POST /auth/logout`
Déconnexion (supprime le cookie JWT).

### Routes des tâches (Authentification requise)

#### `GET /todos?page=1&limit=10`
Récupérer les tâches de l'utilisateur connecté.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "todos": [...],
    "total": 25,
    "page": 1,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### `POST /todos`
Créer une nouvelle tâche.

**Body :**
```json
{
  "title": "Acheter du pain",
  "description": "Aller à la boulangerie du quartier"
}
```

#### `PUT /todos/:id`
Modifier une tâche existante.

**Body :**
```json
{
  "title": "Acheter du pain complet",
  "description": "Aller à la boulangerie bio", 
  "completed": true
}
```

#### `DELETE /todos/:id`
Supprimer une tâche.

##  Tests avec Postman

1. **Importer la collection :**
   - Ouvrir Postman
   - Importer le fichier `postman-collection.json`

2. **Tester l'API :**
   - Commencer par l'inscription (`Register`)
   - Se connecter (`Login`) - le cookie JWT sera automatiquement stocké
   - Tester les opérations CRUD sur les todos
   - Se déconnecter (`Logout`)

## Structure du projet

```
hono-todo/
├─ src/
│  ├─ controllers/          # Contrôleurs pour les routes
│  │  ├─ auth.controller.ts
│  │  └─ todo.controller.ts
│  ├─ services/            # Logique métier
│  │  ├─ auth.service.ts
│  │  └─ todo.service.ts
│  ├─ repositories/        # Accès aux données
│  │  ├─ user.repository.ts
│  │  └─ todo.repository.ts
│  ├─ validations/         # Schémas de validation Zod
│  │  ├─ auth.validation.ts
│  │  └─ todo.validation.ts
│  ├─ middlewares/         # Middlewares (auth, etc.)
│  │  └─ auth.middleware.ts
│  ├─ interfaces/          # Interfaces TypeScript
│  │  ├─ auth.service.interface.ts
│  │  ├─ todo.service.interface.ts
│  │  ├─ user.repository.interface.ts
│  │  ├─ todo.repository.interface.ts
│  │  └─ index.ts
│  ├─ seeders/             # Seeders pour données de test
│  │  ├─ main.seeder.ts    # Seeder principal unifié
│  │  ├─ index.ts         # Script d'exécution
│  │  └─ seeders.ts       # Exports centralisés
│  ├─ routers/             # Organisation des routes
│  │  ├─ auth.router.ts
│  │  ├─ todo.router.ts
│  │  └─ api.router.ts
│  ├─ prisma/             # Configuration Prisma
│  │  └─ client.ts
│  ├─ routes.ts           # Définition des routes principales
│  └─ server.ts           # Point d'entrée de l'application
├─ prisma/
│  └─ schema.prisma       # Schéma de base de données
├─ database-setup.sql     # Script de création MySQL
├─ postman-collection.json # Collection Postman pour les tests
├─ package.json
├─ tsconfig.json
└─ .env                   # Variables d'environnement
```

##  Sécurité implémentée

- **Hachage des mots de passe** avec bcrypt (salt rounds: 12)
- **JWT en http-only cookies** pour éviter les attaques XSS  
- **Validation stricte** des données d'entrée avec Zod
- **Autorisation par utilisateur** : chaque utilisateur ne peut accéder qu'à ses propres tâches
- **Gestion des erreurs** détaillée sans exposition d'informations sensibles

##  Commandes utiles

```bash

```

##  Notes importantes

1. **Variables d'environnement :** Changez `JWT_SECRET` en production !
2. **Base de données :** Assurez-vous que MySQL est démarré avant de lancer l'API
3. **Cookies :** Les cookies JWT sont automatiquement gérés par le navigateur
4. **Pagination :** La limite maximale est de 50 tâches par page
5. **CORS :** Ajoutez la configuration CORS si nécessaire pour le frontend

L'API est maintenant prête à être utilisée ! # TOdOLISTE-banckend-HONO

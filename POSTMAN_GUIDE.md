# Guide de Test API Hono Todo avec Postman

Ce guide vous explique comment tester toutes les fonctionnalités de l'API Hono Todo avec Postman.

## 📋 Prérequis

1. **Serveur démarré** : `npm run dev`
2. **Base de données seedée** : `npm run seed`  
3. **Postman installé** : [Télécharger Postman](https://www.postman.com/downloads/)

## 🔧 Configuration Postman

### Variables d'environnement (optionnel)
Créer un environnement Postman avec :
- `baseUrl` = `http://localhost:3000`
- `token` = (sera automatiquement défini après login)

## 🧪 Tests des Endpoints

### 1. 🏥 **Endpoints de Santé (Public)**

#### Health Check
```http
GET http://localhost:3000/api/health
```
**Réponse attendue :**
```json
{
  "success": true,
  "message": "Hono Todo API is healthy!",
  "version": "1.0.0",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

#### API Info
```http
GET http://localhost:3000/api/info
```

#### Status avec DB
```http
GET http://localhost:3000/api/status
```

---

### 2. 🔐 **Authentification**

#### A. Inscription d'un nouvel utilisateur
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### B. Connexion (Login)
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 42,
      "email": "john.doe@example.com",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

> **🍪 Important :** Le cookie JWT sera automatiquement défini dans votre navigateur/Postman

#### C. Déconnexion (Logout)
```http
POST http://localhost:3000/api/auth/logout
```

---

### 3. 📝 **Gestion des Todos (Authentification requise)**

> **⚠️ Important :** Vous devez être connecté (avoir fait un LOGIN) avant de tester ces endpoints

#### A. Lister tous les todos de l'utilisateur connecté
```http
GET http://localhost:3000/api/todos
```

**Avec pagination :**
```http
GET http://localhost:3000/api/todos?page=1&limit=5
```

**Réponse attendue :**
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": 1,
        "title": "Acheter du pain",
        "description": "Aller à la boulangerie du quartier avant 18h",
        "completed": false,
        "userId": 42,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### B. Récupérer un todo spécifique par ID
```http
GET http://localhost:3000/api/todos/1
```

**Réponse attendue :**
```json
{
  "success": true,
  "data": {
    "todo": {
      "id": 1,
      "title": "Acheter du pain",
      "description": "Aller à la boulangerie du quartier avant 18h",
      "completed": false,
      "userId": 42,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### C. Créer un nouveau todo
```http
POST http://localhost:3000/api/todos
Content-Type: application/json

{
  "title": "Nouvelle tâche",
  "description": "Description de la nouvelle tâche"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "todo": {
      "id": 30,
      "title": "Nouvelle tâche",
      "description": "Description de la nouvelle tâche",
      "completed": false,
      "userId": 42,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### D. Mettre à jour un todo
```http
PUT http://localhost:3000/api/todos/1
Content-Type: application/json

{
  "title": "Acheter du pain complet",
  "description": "Aller à la boulangerie bio",
  "completed": true
}
```

#### E. Supprimer un todo
```http
DELETE http://localhost:3000/api/todos/1
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

---

## 🧪 **Scénarios de Test Complets**

### Scénario 1 : Workflow complet nouvel utilisateur
1. **S'inscrire** : `POST /api/auth/register`
2. **Se connecter** : `POST /api/auth/login`
3. **Créer un todo** : `POST /api/todos`
4. **Lister les todos** : `GET /api/todos`
5. **Modifier le todo** : `PUT /api/todos/:id`
6. **Supprimer le todo** : `DELETE /api/todos/:id`
7. **Se déconnecter** : `POST /api/auth/logout`

### Scénario 2 : Utilisateur existant (avec données seedées)
1. **Se connecter** avec un compte existant :
   ```json
   {
     "email": "john.doe@example.com",
     "password": "password123"
   }
   ```
2. **Lister les todos existants** : `GET /api/todos`
3. **Récupérer un todo spécifique** : `GET /api/todos/1`
4. **Créer un nouveau todo** : `POST /api/todos`

---

## 🔍 **Comptes de Test Disponibles**

Après avoir exécuté `npm run seed`, utilisez ces comptes :

| Email | Mot de passe | Nombre de todos |
|-------|--------------|-----------------|
| `admin@example.com` | `admin123` | 3-8 (aléatoire) |
| `john.doe@example.com` | `password123` | 3-8 (aléatoire) |
| `jane.smith@example.com` | `password123` | 3-8 (aléatoire) |
| `alice.johnson@example.com` | `password123` | 3-8 (aléatoire) |
| `bob.wilson@example.com` | `password123` | 3-8 (aléatoire) |

---

## ❌ **Tests d'Erreurs**

### Erreurs d'authentification
```http
GET http://localhost:3000/api/todos
# Sans être connecté -> 401 Unauthorized
```

### Erreurs de validation
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "email-invalide",
  "password": "123"
}
# -> 400 Bad Request avec détails des erreurs
```

### Todo inexistant
```http
GET http://localhost:3000/api/todos/99999
# -> 404 Not Found
```

### Todo d'un autre utilisateur
```http
# Se connecter avec john.doe@example.com
# Essayer d'accéder au todo d'un autre utilisateur
GET http://localhost:3000/api/todos/1
# -> 404 Not Found (pour des raisons de sécurité)
```

---

## 🚀 **Collection Postman**

### Import rapide
1. Copiez le contenu du fichier `postman-collection.json`
2. Dans Postman : File > Import > Raw Text
3. Collez le JSON et importez

### Variables automatiques
Pour automatiser les tests, ajoutez ces scripts dans Postman :

**Script de Login (Tests) :**
```javascript
if (pm.response.code === 200) {
    // Le cookie JWT sera automatiquement géré par Postman
    console.log("Login successful");
} else {
    console.log("Login failed:", pm.response.text());
}
```

---

## 🐛 **Dépannage**

### Problème : "Authentication token required"
- **Solution** : Assurez-vous d'avoir fait un LOGIN avant d'accéder aux routes protégées

### Problème : "Todo not found"
- **Solution** : Vérifiez que l'ID existe et appartient à l'utilisateur connecté

### Problème : Serveur ne répond pas
- **Solution** : Vérifiez que le serveur est démarré (`npm run dev`)

### Problème : Base de données vide
- **Solution** : Exécutez les seeders (`npm run seed`)

---

## ✅ **Checklist de Test**

- [ ] ✅ Health check (`/api/health`)
- [ ] ✅ Registration (`/api/auth/register`)
- [ ] ✅ Login (`/api/auth/login`) 
- [ ] ✅ List todos (`/api/todos`)
- [ ] ✅ Get todo by ID (`/api/todos/:id`)
- [ ] ✅ Create todo (`POST /api/todos`)
- [ ] ✅ Update todo (`PUT /api/todos/:id`)
- [ ] ✅ Delete todo (`DELETE /api/todos/:id`)
- [ ] ✅ Logout (`/api/auth/logout`)
- [ ] ❌ Test d'erreur 401 (sans auth)
- [ ] ❌ Test d'erreur 404 (todo inexistant)
- [ ] ❌ Test d'erreur 400 (validation)

**🎉 L'API est prête à être testée !**
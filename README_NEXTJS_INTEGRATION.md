# 🚀 Guide Complet : Consommer l'API Hono Todo avec Next.js

## ⚡ Prérequis et Installation

### 📦 Dépendances requises pour Next.js

Voici les commandes d'installation que l'IA devra inclure dans le projet Next.js :

#### Installation initiale Next.js :
```bash
npx create-next-app@latest nextjs-todo-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd nextjs-todo-app
```

#### Dépendances principales :
```bash
# Gestion d'état et utilitaires
npm install zustand zod lucide-react class-variance-authority clsx tailwind-merge

# Gestion des formulaires
npm install react-hook-form @hookform/resolvers

# Notifications et UI
npm install sonner @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot

# Gestion des dates
npm install date-fns

# Types
npm install -D @types/node
```

#### Dépendances optionnelles (recommandées) :
```bash
# Cache et synchronisation des données
npm install @tanstack/react-query

# Animation
npm install framer-motion

# Icons supplémentaires
npm install @heroicons/react
```

### 🛠️ Configuration TypeScript

Le projet doit inclure ces interfaces dans `src/lib/types.ts` :

```typescript
// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  todos: T[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Data Types
export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  userId: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  email: string
  createdAt: string
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
}

export interface TodoForm {
  title: string
  description?: string
}
```

---

## 📋 Prompt à donner à l'IA

```
Crée une application Next.js complète qui consomme l'API Hono Todo suivante :

API_BASE_URL: http://localhost:3000

## ENDPOINTS DISPONIBLES :

### 🔐 AUTHENTIFICATION :
- POST /api/auth/register - Inscription
- POST /api/auth/login - Connexion (JWT en http-only cookie)
- POST /api/auth/logout - Déconnexion

### 📝 TODOS (Authentification requise) :
- GET /api/todos - Liste paginée des todos
- GET /api/todos/:id - Todo spécifique
- POST /api/todos - Créer un todo
- PUT /api/todos/:id - Modifier un todo
- DELETE /api/todos/:id - Supprimer un todo

### 🏥 UTILITAIRES :
- GET /api/health - Santé de l'API
- GET /api/info - Informations API

## SPÉCIFICATIONS TECHNIQUES :

### Format des données :
- Authentification utilise des **cookies HTTP-only**
- Toutes les réponses sont en JSON avec format : `{ success: boolean, data?: any, error?: string }`
- Pagination : `{ todos: [], total: number, page: number, totalPages: number, hasNext: boolean, hasPrev: boolean }`

### Structure Todo :
```typescript
interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  userId: number
  createdAt: string
  updatedAt: string
}
```

### Structure User :
```typescript
interface User {
  id: number
  email: string
  createdAt: string
}
```

## EXIGENCES DE L'APPLICATION NEXT.JS :

### 🎨 INTERFACE UTILISATEUR :
1. **Page de connexion/inscription** avec formulaires
2. **Dashboard des todos** avec :
   - Liste des todos avec pagination
   - Bouton créer nouveau todo
   - Actions : modifier, supprimer, marquer comme terminé
   - Filtres : tous, terminés, en cours
   - Barre de recherche
3. **Interface responsive** (mobile-friendly)
4. **Loading states** et gestion d'erreurs
5. **Notifications/toasts** pour les actions

### 🔧 FONCTIONNALITÉS TECHNIQUES :
1. **Gestion d'état** avec Context API ou Zustand
2. **Authentification** : redirection automatique si non connecté
3. **Middleware Next.js** pour protéger les routes
4. **API Routes Next.js** comme proxy si nécessaire
5. **Validation côté client** avec Zod
6. **TypeScript** complet avec interfaces typées
7. **Gestion des cookies** automatique pour JWT
8. **Intercepteurs HTTP** pour gérer les erreurs 401/403

### 📦 DÉPENDANCES À INSTALLER :
```bash
# Initialisation du projet
npx create-next-app@latest nextjs-todo-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Dépendances principales
npm install zustand zod lucide-react class-variance-authority clsx tailwind-merge
npm install react-hook-form @hookform/resolvers
npm install sonner @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot
npm install date-fns

# Optionnel (recommandé)
npm install @tanstack/react-query framer-motion @heroicons/react
```

### 🎯 STRUCTURE DU PROJET :
```
nextjs-todo-app/
├── src/
│   ├── app/                  # App Router Next.js 13+
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── todos/
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── TodoFilters.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   └── Layout.tsx
│   ├── lib/
│   │   ├── api.ts            # Client API avec fetch
│   │   ├── auth.ts           # Gestion authentification
│   │   ├── types.ts          # Interfaces TypeScript
│   │   └── utils.ts          # Utilitaires
│   ├── hooks/
│   │   ├── useAuth.ts        # Hook authentification
│   │   ├── useTodos.ts       # Hook gestion todos
│   │   └── useApi.ts         # Hook API générique
│   ├── context/
│   │   ├── AuthContext.tsx   # Context authentification
│   │   └── TodoContext.tsx   # Context todos
│   └── middleware.ts         # Protection des routes
```

### 🔐 GESTION DE L'AUTHENTIFICATION :
- Utiliser `fetch` avec `credentials: 'include'` pour les cookies
- Middleware Next.js pour rediriger si non authentifié
- Context pour l'état utilisateur global
- Déconnexion automatique sur erreur 401

### 📱 FONCTIONNALITÉS UX :
1. **Notifications** : succès/erreur pour chaque action
2. **Confirmations** : avant suppression
3. **Loading spinners** pendant les requêtes
4. **Optimistic updates** pour une UX fluide
5. **Pagination** avec numéros de page
6. **Recherche en temps réel** (debounced)

### 🎨 STYLING :
- Utilise **Tailwind CSS** pour le styling
- **Components réutilisables** (Button, Input, Modal, etc.)
- **Design moderne** et professionnel
- **Dark mode** (optionnel)

### 🧪 COMPTES DE TEST DISPONIBLES :
- admin@example.com / admin123
- john.doe@example.com / password123
- jane.smith@example.com / password123

### ⚡ OPTIMISATIONS :
1. **React Query/SWR** pour le cache des données
2. **Debounce** pour la recherche
3. **Lazy loading** des composants
4. **Error boundaries** pour la gestion d'erreurs
5. **SEO optimisé** avec metadata Next.js

### 🔄 GESTION DES ERREURS :
- Affichage des erreurs API dans l'interface
- Retry automatique pour les erreurs réseau
- Fallback UI pour les erreurs critiques
- Validation des formulaires avec messages d'erreur

### 📝 EXEMPLES DE REQUÊTES ATTENDUES :

#### Login :
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
})
```

#### Get Todos :
```javascript
const response = await fetch('http://localhost:3000/api/todos?page=1&limit=10', {
  credentials: 'include'
})
```

### 🎯 LIVRABLE ATTENDU :
Un projet Next.js complet, fonctionnel, avec tous les fichiers nécessaires, prêt à être lancé avec `npm run dev`, incluant :
- Code TypeScript complet
- Composants React modernes
- Gestion d'état professionnelle
- Interface utilisateur intuitive
- Gestion d'erreurs robuste
- Documentation du code

IMPORTANT : L'application doit être prête à tourner immédiatement après `npm install` et `npm run dev`.
```

---

## 📚 Informations Complémentaires pour l'IA

### 🔌 Configuration de l'API Hono

Votre API Hono tourne sur `http://localhost:3000` avec les endpoints suivants :

```typescript
// Structure des réponses API
interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Pagination
interface PaginatedResponse<T> {
  todos: T[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
```

### 🍪 Gestion des Cookies JWT

Votre API utilise des cookies HTTP-only pour l'authentification :
- Automatiquement définis lors du login
- Automatiquement supprimés lors du logout
- Inclus automatiquement avec `credentials: 'include'`

### 🧪 Comptes de Test

Après avoir exécuté `npm run seed` sur votre API :

| Email | Mot de passe | Todos |
|-------|--------------|-------|
| `admin@example.com` | `admin123` | 3-8 todos |
| `john.doe@example.com` | `password123` | 3-8 todos |
| `jane.smith@example.com` | `password123` | 3-8 todos |

### 🚀 Commandes pour démarrer l'API

```bash
# Dans le dossier de l'API Hono
npm run seed    # Peupler la base de données
npm run dev     # Démarrer l'API sur http://localhost:3000
```

---

## 🎯 Prompt Final Optimisé

**Copiez-collez ce prompt complet à l'IA pour obtenir une application Next.js complète :**

```
Crée une application Next.js 13+ complète avec App Router qui consomme une API Hono Todo sur http://localhost:3000. 

COMMANDES D'INSTALLATION :
```bash
# Initialisation
npx create-next-app@latest nextjs-todo-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd nextjs-todo-app

# Dépendances principales
npm install zustand zod lucide-react class-variance-authority clsx tailwind-merge
npm install react-hook-form @hookform/resolvers
npm install sonner @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot
npm install date-fns

# Optionnel mais recommandé
npm install @tanstack/react-query framer-motion @heroicons/react
```

ENDPOINTS API :
- POST /api/auth/register, /api/auth/login, /api/auth/logout
- GET /api/todos (paginé), GET /api/todos/:id
- POST /api/todos, PUT /api/todos/:id, DELETE /api/todos/:id

AUTHENTIFICATION : JWT en cookies HTTP-only (credentials: 'include')

INTERFACES TYPESCRIPT :
```typescript
interface Todo {
  id: number; title: string; description?: string; completed: boolean;
  userId: number; createdAt: string; updatedAt: string;
}
interface User { id: number; email: string; createdAt: string; }
interface ApiResponse<T> { success: boolean; data?: T; error?: string; }
```

FONCTIONNALITÉS REQUISES :
✅ Pages : Login/Register, Dashboard todos
✅ Composants : TodoList, TodoItem, TodoForm, Filters
✅ Auth Context + useAuth hook
✅ Protection routes avec middleware
✅ CRUD todos complet + pagination
✅ UI responsive Tailwind CSS
✅ Loading states + error handling
✅ TypeScript complet
✅ Notifications toast (avec sonner)

STRUCTURE :
src/app, src/components, src/lib, src/hooks, src/context

COMPTES TEST : john.doe@example.com / password123

Livrable : Projet complet prêt avec npm install && npm run dev
```

---

## 🎉 Résultat Attendu

Avec ce prompt, l'IA vous créera une application Next.js complète qui :

1. **Se connecte parfaitement** à votre API Hono
2. **Gère l'authentification** avec cookies HTTP-only
3. **Affiche et gère les todos** avec toutes les fonctionnalités CRUD
4. **Interface moderne** et responsive
5. **Code TypeScript** professionnel
6. **Prête à utiliser** immédiatement

Il vous suffira de démarrer votre API Hono (`npm run dev`) et l'application Next.js pour avoir un système complet fonctionnel ! 🚀

---

## 🔧 Instructions d'utilisation

### Étape 1 : Préparer votre API Hono
```bash
# Dans le dossier de l'API Hono
npm run seed    # Peupler la base de données
npm run dev     # Démarrer l'API sur http://localhost:3000
```

### Étape 2 : Créer l'application Next.js
1. Copiez le **Prompt Final Optimisé** ci-dessus
2. Collez-le dans votre IA préférée (ChatGPT, Claude, etc.)
3. Téléchargez le projet généré

### Étape 3 : Lancer l'application Next.js
```bash
# Dans le dossier du projet Next.js généré
npm install
npm run dev     # L'app sera sur http://localhost:3001
```

### Étape 4 : Tester l'intégration
- Ouvrez `http://localhost:3001`
- Connectez-vous avec : `john.doe@example.com / password123`
- Testez toutes les fonctionnalités CRUD des todos

Votre système complet API Hono + Frontend Next.js sera opérationnel ! ✨
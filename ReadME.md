# Projet filRouge

Ce dépôt contient l'application du projet filRouge.

## Prérequis
- Node.js installé (version compatible avec le projet)
- npm (ou yarn)

## Installation / mise à jour des dépendances
1. Installer les dépendances :
```bash
npm install
```
2. (Optionnel) Mettre à jour les dépendances vers leurs dernières versions compatibles :
```bash
npm update
```
3. Vérifier que le fichier devAPi.db a bien une table users (ca devrais normalement etre le cas)
```
-- Au cas ou voila la requete pour créer cette table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_premium TEXT DEFAULT 'false',
  role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  refresh_token TEXT
);
CREATE TABLE IF NOT EXISTS event (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  sport TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  date DATETIME,
  organizerId INTEGER,
);
``` 
## Lancement
- En développement (rechargement automatique) :
```bash
npm run dev
```

## Test via Swagger
Rendez vous sur le lien suivant pour effectuer des requêtes sur l'API :
```
http://localhost:3000/doc
```

Il faudra d'abord créer un compte, ou bien se connecter a un existant 
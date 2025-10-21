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
);
``` 
## Build
- (Optionnel) Pour produire une version de production :
```bash
npm run build 
```
- Ou bien 
```bash
npx tsc
```
## Lancement
- En développement (rechargement automatique) :
```bash
npm run dev
```
- En production (après avoir fait `npm run build`) :
```bash
npm run start
```

## Test via Postman
Utiliser Postman pour effectuer des requêtes contre l'API :
```
http://localhost:3000
```

Quatre requêtes principales à tester (détails à préciser) :
1. Requête 1
    - Méthode : [POST]
    - Endpoint : /auth/register
    - Headers : Authorization / Content-Type JSON
    - Body : { "username": "Usertest", "email": "test@test.com", "password": "TEST" }
    - Description : Permet d'enregistrer un utilisateur grace a un nom, un mail et un mot de passe

2. Requête 2
    - Méthode : [POST]
    - Endpoint : /auth/login
    - Headers : Authorization / Content-Type JSON
    - Body : { "email": "test@test.com", "password": "TEST" }
    - Description : Récupère le token jwt permettant de faire les autres requètes
3. Requête 3
    - Méthode : [GET]
    - Endpoint : /user/profil
    - Headers : Authorization : Bearer < token > / Content-Type JSON
    - Body : 
    - Description : Récupère le profil de la personne qui fais la requete (nécessite un token grace a la requete login)
3. Requête 3
    - Méthode : [PUT]
    - Endpoint : /user
    - Headers : Authorization : Bearer < token > / Content-Type JSON
    - Body : {
    "username": "Kyro","email": "kyrian.delaplace09@mail.com", "first_name": "Kyrian","last_name": "","bio": "test"
}
    - Description : Met a jours un profil (hors mot de passe, is_premium et role "admin/user")
4. Requête 4
    - Méthode : [DELETE]
    - Endpoint : /user
    - Headers : Authorization : Bearer < token > / Content-Type JSON
    - Body : { "passwordTest": "TEST" }
    - Description : Supprime le compte de l'utilisateur qui fais la requète

5. Requête 5 
    - Méthode : [PUT]
    - Endpoint : /admin/setMod
    - Headers : Authorization : Bearer < token > / Content-Type JSON
    - Body : { "refresh": < token refresh transmis au login >, "id": < id de la personne dont le statut va etre changé > }
    - Prérequis : Nécessite d'être de role admin
    - Description : Met moderateur l'utilisateur dont l'id est spécifié (dans le body)


- Requete sql pour set un utilisateur admin
    ```sql 
        UPDATE users SET role = 'admin' WHERE id = x
    ```
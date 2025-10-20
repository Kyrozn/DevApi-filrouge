export interface User {
  id: number; // ID unique de l'utilisateur
  username: string; // Nom d'utilisateur
  email: string; // Email
  password: string; // Mot de passe hashé
  first_name: string;
  last_name: string;
  bio: string;
  avatar_url: string;
  is_premium: string;
  role?: "user" | "admin";
  createdAt: Date; // Date de création
}

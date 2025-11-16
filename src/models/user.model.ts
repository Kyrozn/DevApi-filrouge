export interface User {
  id: number;
  username: string;
  email: string; 
  password: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar_url: string;
  is_premium: string;
  role?: "user" | "moderator" | "admin";
  createdAt: Date;
}

export interface PublicPlayer {
  id: number;
  name: string;
  score: number;
}

export interface AdminPlayer extends PublicPlayer {
  age: number | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

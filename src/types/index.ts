export interface Restaurant {
  id: string;
  slug?: string;
  name: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  score: number;
  reviews: number;
  taste_avg?: number;
  texture_avg?: number;
  ice_cream_avg?: number;
}

export interface Review {
  id: string | number;
  restaurant_id?: string;
  author: string;
  avatar: string;
  score: number;
  date: string;
  body: string;
  tags: string[];
  likes: number;
  liked?: boolean;
  hasPhoto?: boolean;
  photo_url?: string | null;
}

export type ActiveView = 'map' | 'leaderboard' | 'profile';

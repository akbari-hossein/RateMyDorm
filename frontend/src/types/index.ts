export interface University {
  id: number;
  name: string;
  city: string;
  country: string;
  description: string;
}

export interface Building {
  id: number;
  university: number;
  name: string;
  address: string;
  description: string | null;
  gender: "M" | "F";
  facilities: string | null;
}

export interface Student {
  id: number;
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  university: number | null;
  current_building: number | null;
}

export interface Comment {
  id: number;
  student: string;
  building: string;
  building_id: number;
  content: string;
  rating: number;
  image: string | null;
  created_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  is_new_user: boolean;
  user: Student;
}

export interface ApiError {
  error?: string;
  detail?: string;
  [key: string]: unknown;
}

// ========================
// STATS MODEL - core/models/stats.model.ts
// ========================

export interface Stats {
  resources: number;
  users: number;
  cities: number;
  exchanges: number;
}

// ========================
// FORM MODELS
// ========================

export interface ResourceFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl?: string;
  expiresAt?: Date;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  location: string;
}
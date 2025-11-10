// ========================
// MODELS - models/resource.model.ts
// ========================

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'don' | 'service' | 'echange' | 'aide';
  imageUrl?: string;
  location: string;
  author: {
    name: string;
    contact: string;
    whatsapp?: string;
  };
  createdAt: Date;
  expiresAt?: Date;
  status: 'disponible' | 'reserve' | 'termine';
  views: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  description?: string;
}

export interface Stats {
  resources: number;
  users: number;
  cities: number;
  exchanges: number;
}

export interface FilterOptions {
  category?: string;
  search?: string;
  location?: string;
  status?: string;
}
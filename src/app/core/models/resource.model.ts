// ========================
// RESOURCE MODEL - core/models/resource.model.ts
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

export interface FilterOptions {
  category?: string;
  search?: string;
  location?: string;
  status?: string;
}

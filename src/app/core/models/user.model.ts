// ========================
// USER MODEL - core/models/user.model.ts
// ========================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location: string;
  avatar?: string;
  bio?: string;
  joinedAt: Date;
  rating?: number;
  resourcesCount?: number;
}
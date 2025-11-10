// ========================
// CATEGORY MODEL - core/models/category.model.ts
// ========================

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  count: number;
}
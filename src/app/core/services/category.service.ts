// ========================
// CATEGORY SERVICE - core/services/category.service.ts
// ========================

import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories = signal<Category[]>([
    {
      id: 'don',
      name: 'Dons',
      icon: '🎁',
      color: '#10b981',
      description: 'Donnez ce dont vous n\'avez plus besoin',
      count: 0
    },
    {
      id: 'service',
      name: 'Services',
      icon: '🔧',
      color: '#3b82f6',
      description: 'Proposez ou trouvez des services locaux',
      count: 0
    },
    {
      id: 'echange',
      name: 'Échanges',
      icon: '🔄',
      color: '#f59e0b',
      description: 'Échangez vos biens contre d\'autres',
      count: 0
    },
    {
      id: 'aide',
      name: 'Entraide',
      icon: '🤝',
      color: '#ef4444',
      description: 'Demandez ou offrez de l\'aide',
      count: 0
    }
  ]);

  // Public readonly signal
  getCategories = this.categories.asReadonly();

  // Récupérer une catégorie par ID
  getCategoryById(id: string): Category | undefined {
    return this.categories().find(cat => cat.id === id);
  }

  // Récupérer l'icône d'une catégorie
  getCategoryIcon(id: string): string {
    return this.getCategoryById(id)?.icon || '📦';
  }

  // Récupérer la couleur d'une catégorie
  getCategoryColor(id: string): string {
    return this.getCategoryById(id)?.color || '#6b7280';
  }

  // Récupérer le nom d'une catégorie
  getCategoryName(id: string): string {
    return this.getCategoryById(id)?.name || 'Inconnu';
  }

  // Mettre à jour le compteur d'une catégorie
  updateCategoryCount(categoryId: string, count: number): void {
    this.categories.update(cats =>
      cats.map(cat => 
        cat.id === categoryId ? { ...cat, count } : cat
      )
    );
  }

  // Mettre à jour tous les compteurs
  updateAllCounts(counts: Record<string, number>): void {
    this.categories.update(cats =>
      cats.map(cat => ({
        ...cat,
        count: counts[cat.id] || 0
      }))
    );
  }
}
// ========================
// RESOURCE SERVICE - services/resource.service.ts
// ========================

import { Injectable, signal, computed, inject } from '@angular/core';
import { Resource } from '../models/resource.model';
import { Category, Stats } from '../models/category.model';
import { ApiService } from './api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  // State Management avec Signals
  // private resources = signal<Resource[]>([]);
  private apiService = inject(ApiService);

  private resources = signal<Resource[]>([
    {
      id: '1',
      title: 'Livres scolaires niveau primaire',
      description: 'Collection complète de livres scolaires pour CP à CM2. Très bon état.',
      category: 'don',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      location: 'Douala, Akwa',
      author: {
        name: 'Marie Kouam',
        contact: 'marie@email.cm',
        whatsapp: '+237650000001'
      },
      createdAt: new Date('2024-01-15'),
      status: 'disponible',
      views: 45
    },
    {
      id: '2',
      title: 'Cours de couture à domicile',
      description: 'Formatrice expérimentée propose cours de couture pour débutants et intermédiaires.',
      category: 'service',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
      location: 'Yaoundé, Bastos',
      author: {
        name: 'Solange Mbida',
        contact: 'solange@email.cm',
        whatsapp: '+237650000002'
      },
      createdAt: new Date('2024-01-20'),
      status: 'disponible',
      views: 78
    },
    {
      id: '3',
      title: 'Échange: Vélo contre trottinette',
      description: 'Vélo adulte en bon état à échanger contre trottinette électrique.',
      category: 'echange',
      imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400',
      location: 'Douala, Bonanjo',
      author: {
        name: 'Jean Fotso',
        contact: 'jean@email.cm',
        whatsapp: '+237650000003'
      },
      createdAt: new Date('2024-01-18'),
      status: 'disponible',
      views: 32
    },
    {
      id: '4',
      title: 'Aide au déménagement',
      description: 'Recherche personnes pour aider au déménagement samedi prochain. Repas offert.',
      category: 'aide',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
      location: 'Douala, Bonabéri',
      author: {
        name: 'Paul Nkolo',
        contact: 'paul@email.cm',
        whatsapp: '+237650000004'
      },
      createdAt: new Date('2024-01-22'),
      expiresAt: new Date('2024-01-27'),
      status: 'disponible',
      views: 56
    },
    {
      id: '5',
      title: 'Vêtements enfants (2-5 ans)',
      description: 'Grand lot de vêtements pour enfants en excellent état. Toutes saisons.',
      category: 'don',
      imageUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400',
      location: 'Yaoundé, Mvan',
      author: {
        name: 'Grace Tchoumi',
        contact: 'grace@email.cm',
        whatsapp: '+237650000005'
      },
      createdAt: new Date('2024-01-16'),
      status: 'disponible',
      views: 92
    },
    {
      id: '6',
      title: 'Réparation électronique',
      description: 'Technicien propose réparation smartphones, ordinateurs à prix solidaires.',
      category: 'service',
      imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
      location: 'Douala, Deido',
      author: {
        name: 'David Kamga',
        contact: 'david@email.cm',
        whatsapp: '+237650000006'
      },
      createdAt: new Date('2024-01-21'),
      status: 'disponible',
      views: 67
    }
  ]);

  private categories = signal<Category[]>([
    { id: 'don', name: 'Dons', icon: '🎁', color: '#10b981', count: 0 },
    { id: 'service', name: 'Services', icon: '🔧', color: '#3b82f6', count: 0 },
    { id: 'echange', name: 'Échanges', icon: '🔄', color: '#f59e0b', count: 0 },
    { id: 'aide', name: 'Entraide', icon: '🤝', color: '#ef4444', count: 0 }
  ]);

  // Computed signals pour les catégories avec compteurs mis à jour
  categoriesWithCount = computed(() => {
    const resources = this.resources();
    return this.categories().map(cat => ({
      ...cat,
      count: resources.filter(r => r.category === cat.id).length
    }));
  });

  // Public getters
  getResources = this.resources.asReadonly();
  getCategories = this.categoriesWithCount;

  // Méthodes CRUD
  getResourceById(id: string): Resource | undefined {
    return this.resources().find(r => r.id === id);
  }

  filterByCategory(category: string): Resource[] {
    if (category === 'all') return this.resources();
    return this.resources().filter(r => r.category === category);
  }

  searchResources(query: string): Resource[] {
    if (!query.trim()) return this.resources();
    
    const q = query.toLowerCase();
    return this.resources().filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.description.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.author.name.toLowerCase().includes(q)
    );
  }

  addResource(resource: Omit<Resource, 'id' | 'createdAt' | 'views'>): void {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      createdAt: new Date(),
      views: 0
    };
    this.resources.update(resources => [...resources, newResource]);
  }

  updateResource(id: string, updates: Partial<Resource>): void {
    this.resources.update(resources =>
      resources.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  }

  deleteResource(id: string): void {
    this.resources.update(resources => resources.filter(r => r.id !== id));
  }

  incrementViews(id: string): void {
    this.resources.update(resources =>
      resources.map(r => r.id === id ? { ...r, views: r.views + 1 } : r)
    );
  }

  // Stats
  getStats(): Stats {
    const resources = this.resources();
    const uniqueCities = new Set(resources.map(r => r.location.split(',')[1]?.trim()));
    
    return {
      resources: resources.length,
      users: Math.floor(resources.length * 1.5), // Estimation
      cities: uniqueCities.size,
      exchanges: Math.floor(resources.length * 0.8) // Estimation
    };
  }

  // Utilitaires
  getCategoryIcon(categoryId: string): string {
    return this.categories().find(c => c.id === categoryId)?.icon || '📦';
  }

  getCategoryColor(categoryId: string): string {
    return this.categories().find(c => c.id === categoryId)?.color || '#6b7280';
  }


  // Fetch all resources
  fetchResources(params?: any) {
    return this.apiService.get<any>('/resources', params).pipe(
      map(response => {
        if (response.success) {
          this.resources.set(response.data);
        }
        return response;
      })
    );
  }

  // Get single resource
  // getResourceById(id: string) {
  //   return this.apiService.get<any>(`/resources/${id}`);
  // }

  // Create resource
  createResource(data: any) {
    return this.apiService.post<any>('/resources', data).pipe(
      map(response => {
        if (response.success) {
          this.resources.update(list => [...list, response.data]);
        }
        return response;
      })
    );
  }

  // Update resource
  // updateResource(id: string, data: any) {
  //   return this.apiService.put<any>(`/resources/${id}`, data).pipe(
  //     map(response => {
  //       if (response.success) {
  //         this.resources.update(list =>
  //           list.map(r => r.id === id ? response.data : r)
  //         );
  //       }
  //       return response;
  //     })
  //   );
  // }

  // Delete resource
  // deleteResource(id: string) {
  //   return this.apiService.delete<any>(`/resources/${id}`).pipe(
  //     map(response => {
  //       if (response.success) {
  //         this.resources.update(list => list.filter(r => r.id !== id));
  //       }
  //       return response;
  //     })
  //   );
  // }
}
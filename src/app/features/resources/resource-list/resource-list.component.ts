import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResourceService } from '../../../core/services/resource.service';
import { CategoryService } from '../../../core/services/category.service';
import { CardResourceComponent } from '../../../shared/components/card-resource/card-resource.component';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { Resource } from '../../../core/models/resource.model';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CardResourceComponent, FilterPipe],
  template: `
    <div class="min-h-screen bg-black text-white pt-32 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Page Header -->
        <div class="mb-12">
          <h1 class="text-4xl md:text-5xl font-light mb-4">
            Explorer les ressources
          </h1>
          <p class="text-gray-400 font-light">
            Découvrez {{ filteredResources().length }} annonces disponibles dans votre région
          </p>
        </div>

        <!-- Filters Section -->
        <div class="mb-12 space-y-6">

          <!-- Search Bar -->
          <div class="relative max-w-2xl">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              placeholder="Rechercher par titre, description ou lieu..."
              class="w-full bg-zinc-900 border border-white/10 px-6 py-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all">
            <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>

          <!-- Category Filters -->
          <div class="flex flex-wrap gap-3">
            <button
              (click)="selectCategory('all')"
              [class.bg-white]="selectedCategory() === 'all'"
              [class.text-black]="selectedCategory() === 'all'"
              [class.border-white]="selectedCategory() === 'all'"
              class="px-6 py-2.5 border border-white/20 hover:border-emerald-500 transition-all text-sm tracking-wide">
              TOUT
            </button>

            @for (cat of categories(); track cat.id) {
              <button
                (click)="selectCategory(cat.id)"
                [class.bg-emerald-500]="selectedCategory() === cat.id"
                [class.text-black]="selectedCategory() === cat.id"
                [class.border-emerald-500]="selectedCategory() === cat.id"
                class="px-6 py-2.5 border border-white/20 hover:border-emerald-500 transition-all text-sm tracking-wide">
                {{ cat.icon }} {{ cat.name }}
                <span class="ml-2 opacity-70">({{ cat.count }})</span>
              </button>
            }
          </div>

          <!-- Status & Sort Filters -->
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Status Filter -->
            <select
              [(ngModel)]="selectedStatus"
              (ngModelChange)="applyFilters()"
              class="bg-zinc-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
              <option value="all">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="reserve">Réservé</option>
            </select>

            <!-- Sort -->
            <select
              [(ngModel)]="sortBy"
              (ngModelChange)="applyFilters()"
              class="bg-zinc-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
              <option value="recent">Plus récent</option>
              <option value="popular">Plus populaire</option>
              <option value="title">Titre A-Z</option>
            </select>

            <!-- View Toggle -->
            <div class="flex border border-white/10 ml-auto">
              <button
                (click)="viewMode.set('grid')"
                [class.bg-emerald-500]="viewMode() === 'grid'"
                [class.text-black]="viewMode() === 'grid'"
                class="px-4 py-3 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                (click)="viewMode.set('list')"
                [class.bg-emerald-500]="viewMode() === 'list'"
                [class.text-black]="viewMode() === 'list'"
                class="px-4 py-3 border-l border-white/10 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        @if (filteredResources().length > 0 && !isLoading()) {
          <div class="mb-8 text-gray-400 text-sm">
            {{ filteredResources().length }} résultat{{ filteredResources().length > 1 ? 's' : '' }} trouvé{{ filteredResources().length > 1 ? 's' : '' }}
          </div>
        }

        <!-- Skeleton Loader -->
        @if (isLoading()) {
          <div
            [class.grid]="viewMode() === 'grid'"
            [class.md:grid-cols-2]="viewMode() === 'grid'"
            [class.lg:grid-cols-3]="viewMode() === 'grid'"
            [class.gap-8]="viewMode() === 'grid'"
            [class.space-y-6]="viewMode() === 'list'">
            @for (_ of [1, 2, 3, 4, 5, 6]; track _) {
              <div class="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
                <div class="h-40 bg-zinc-800"></div>
                <div class="p-4 space-y-3">
                  <div class="h-4 bg-zinc-800 rounded w-3/4"></div>
                  <div class="h-3 bg-zinc-800 rounded w-1/2"></div>
                  <div class="h-3 bg-zinc-800 rounded w-5/6"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Resources Grid/List -->
        @if (filteredResources().length > 0 && !isLoading()) {
          <div
            [class.grid]="viewMode() === 'grid'"
            [class.md:grid-cols-2]="viewMode() === 'grid'"
            [class.lg:grid-cols-3]="viewMode() === 'grid'"
            [class.gap-8]="viewMode() === 'grid'"
            [class.space-y-6]="viewMode() === 'list'">

            @for (resource of filteredResources(); track resource.id; let i = $index) {
              <div
                class="animate-fade-in"
                [style.animation-delay]="(i * 50) + 'ms'"
                [draggable]="dragEnabled()"
                (dragstart)="onDragStart($event, i)"
                (dragend)="onDragEnd()"
                (dragover)="onDragOver($event)"
                (drop)="onDrop($event, i)">
                <app-card-resource
                  [resource]="resource"
                  [draggable]="dragEnabled()"
                  (cardClick)="viewResource($event)"
                  (contactClick)="contactResource($event)">
                </app-card-resource>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (filteredResources().length === 0 && !isLoading()) {
          <div class="text-center py-20">
            <div class="text-6xl mb-6">🔍</div>
            <h3 class="text-2xl font-light mb-4">Aucune ressource trouvée</h3>
            <p class="text-gray-400 mb-8">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              (click)="resetFilters()"
              class="border border-white/30 px-6 py-3 text-sm tracking-wide hover:bg-white/10 transition-all">
              RÉINITIALISER LES FILTRES
            </button>
          </div>
        }

        <!-- Load More Button -->
        @if (hasMore() && !isLoading()) {
          <div class="text-center mt-12">
            <button
              (click)="loadMore()"
              class="border border-white/30 px-8 py-3 text-sm tracking-wide hover:bg-white/10 transition-all">
              CHARGER PLUS D'ANNONCES
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in {
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    select, input {
      transition: all 0.2s ease;
    }
    button {
      transition: all 0.2s ease;
    }
  `]
})
export class ResourceListComponent implements OnInit {
  private resourceService = inject(ResourceService);
  private categoryService = inject(CategoryService);
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  categories = this.categoryService.getCategories;
  allResources = this.resourceService.getResources;

  searchQuery = '';
  selectedCategory = signal<string>('all');
  selectedStatus = 'all';
  sortBy = 'recent';
  viewMode = signal<'grid' | 'list'>('grid');
  isLoading = signal<boolean>(false);

  draggedIndex = signal<number | null>(null);
  displayLimit = signal(12);

  // Variable pour gérer le délai de recherche
  private searchTimeout: any;

  filteredResources = computed(() => {
    let resources = this.allResources();
    // Filtre par catégorie
    if (this.selectedCategory() !== 'all') {
      resources = resources.filter(r => r.category === this.selectedCategory());
    }
    // Filtre par statut
    if (this.selectedStatus !== 'all') {
      resources = resources.filter(r => r.status === this.selectedStatus);
    }
    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      resources = resources.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        (r.location && r.location.toLowerCase().includes(query))
      );
    }
    // Tri
    resources = this.sortResources(resources);
    // Limite d'affichage
    return resources.slice(0, this.displayLimit());
  });

  hasMore = computed(() => {
    const total = this.allResources().length;
    return this.displayLimit() < total;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.applyFilters();
  }

  onSearchChange(): void {
    // Annule le timeout précédent si la saisie est rapide
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    // Lance la recherche après 500ms d'inactivité
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  applyFilters(): void {
    this.isLoading.set(true);
    this.displayLimit.set(12);
    // Simule un délai pour montrer le loader (à remplacer par ton appel API réel)
    setTimeout(() => {
      this.isLoading.set(false);
    }, 800);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory.set('all');
    this.selectedStatus = 'all';
    this.sortBy = 'recent';
    this.applyFilters();
  }

  sortResources(resources: Resource[]): Resource[] {
    switch (this.sortBy) {
      case 'recent':
        return [...resources].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'popular':
        return [...resources].sort((a, b) => b.views - a.views);
      case 'title':
        return [...resources].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return resources;
    }
  }

  loadMore(): void {
    this.isLoading.set(true);
    this.displayLimit.update(limit => limit + 12);
    // Simule un délai pour montrer le loader
    setTimeout(() => {
      this.isLoading.set(false);
    }, 800);
  }

  viewResource(resource: Resource): void {
    this.router.navigate(['/resources', resource.id]);
  }

  contactResource(resource: Resource): void {
    if (resource.author.whatsapp) {
      window.open(`https://wa.me/${resource.author.whatsapp}`, '_blank');
    } else {
      window.location.href = `mailto:${resource.author.contact}`;
    }
  }

  dragEnabled(): boolean {
    return this.viewMode() === 'grid';
  }

  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex.set(index);
  }

  onDragEnd(): void {
    this.draggedIndex.set(null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const draggedIdx = this.draggedIndex();
    if (draggedIdx !== null && draggedIdx !== targetIndex) {
      console.log(`Moved from ${draggedIdx} to ${targetIndex}`);
    }
    this.draggedIndex.set(null);
  }
}

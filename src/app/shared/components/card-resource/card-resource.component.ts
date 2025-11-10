// ========================
// CARD RESOURCE COMPONENT - shared/components/card-resource/card-resource.component.ts
// ========================

import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Resource } from '../../../core/models/resource.model';
import { CategoryService } from '../../../core/services/category.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-card-resource',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div 
      class="card-3d bg-zinc-900 border border-white/10 overflow-hidden group cursor-pointer"
      [class.dragging]="isDragging"
      [draggable]="draggable"
      (dragstart)="onDragStart($event)"
      (dragend)="onDragEnd()"
      (click)="onCardClick()">
      
      <!-- Image Container -->
      <div class="h-64 bg-zinc-800 relative overflow-hidden">
        @if (resource.imageUrl) {
          <img 
            [src]="resource.imageUrl" 
            [alt]="resource.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        } @else {
          <div class="w-full h-full flex items-center justify-center text-6xl">
            {{ getCategoryIcon() }}
          </div>
        }
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <!-- Category Badge -->
        <div class="absolute top-4 right-4 z-10">
          <span class="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 text-xs tracking-wider uppercase">
            {{ getCategoryIcon() }} {{ resource.category }}
          </span>
        </div>

        <!-- Status Badge -->
        <div class="absolute top-4 left-4 z-10">
          <span 
            class="px-3 py-1.5 text-xs font-medium uppercase"
            [class.bg-emerald-500]="resource.status === 'disponible'"
            [class.text-black]="resource.status === 'disponible'"
            [class.bg-amber-500]="resource.status === 'reserve'"
            [class.text-black]="resource.status === 'reserve'"
            [class.bg-gray-500]="resource.status === 'termine'"
            [class.text-white]="resource.status === 'termine'">
            {{ getStatusIcon() }} {{ resource.status }}
          </span>
        </div>

        <!-- Shimmer Effect -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shimmer-layer"></div>
      </div>
      
      <!-- Content -->
      <div class="p-6">
        <!-- Title -->
        <h4 class="text-xl font-light mb-2 text-white line-clamp-1">
          {{ resource.title }}
        </h4>
        
        <!-- Description -->
        <p class="text-gray-400 text-sm mb-4 font-light line-clamp-2 leading-relaxed">
          {{ resource.description }}
        </p>

        <!-- Meta Info -->
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span class="flex items-center space-x-1">
            <span>📍</span>
            <span class="truncate">{{ resource.location }}</span>
          </span>
          <span class="flex items-center space-x-1">
            <span>👁️</span>
            <span>{{ resource.views }}</span>
          </span>
        </div>

        <!-- Date -->
        @if (resource.expiresAt) {
          <div class="text-xs text-amber-500 mb-4">
            ⏰ Expire le {{ formatDate(resource.expiresAt) }}
          </div>
        }

        <!-- Footer: Author & Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-white/10">
          <!-- Author -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-emerald-500 text-black rounded-full flex items-center justify-center text-xs font-bold">
              {{ getAuthorInitials() }}
            </div>
            <span class="text-sm text-gray-300 truncate max-w-[120px]">
              {{ resource.author.name }}
            </span>
          </div>

          <!-- Contact Button -->
          <button 
            (click)="onContact($event)"
            class="text-emerald-500 hover:text-emerald-400 transition-colors text-sm font-medium tracking-wide group-hover:translate-x-1 transition-transform">
            CONTACTER →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-3d {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }

    .card-3d:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    .card-3d.dragging {
      opacity: 0.5;
      transform: scale(1.05);
      cursor: grabbing;
    }

    .card-3d[draggable="true"] {
      cursor: grab;
    }

    .shimmer-layer {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class CardResourceComponent {
  @Input({ required: true }) resource!: Resource;
  @Input() draggable: boolean = false;
  @Output() cardClick = new EventEmitter<Resource>();
  @Output() contactClick = new EventEmitter<Resource>();
  @Output() dragStart = new EventEmitter<Resource>();
  @Output() dragEnd = new EventEmitter<void>();

  private categoryService = inject(CategoryService);
  private userService = inject(UserService);

  isDragging = false;

  getCategoryIcon(): string {
    return this.categoryService.getCategoryIcon(this.resource.category);
  }

  getStatusIcon(): string {
    const icons = {
      disponible: '✓',
      reserve: '⏳',
      termine: '✕'
    };
    return icons[this.resource.status] || '•';
  }

  getAuthorInitials(): string {
    return this.userService.getInitials(this.resource.author.name);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  onCardClick(): void {
    if (!this.isDragging) {
      this.cardClick.emit(this.resource);
    }
  }

  onContact(event: Event): void {
    event.stopPropagation();
    this.contactClick.emit(this.resource);
  }

  onDragStart(event: DragEvent): void {
    if (!this.draggable) return;
    this.isDragging = true;
    this.dragStart.emit(this.resource);
  }

  onDragEnd(): void {
    this.isDragging = false;
    this.dragEnd.emit();
  }
}
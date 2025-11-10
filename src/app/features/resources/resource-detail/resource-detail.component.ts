// ========================
// RESOURCE DETAIL COMPONENT - features/resources/resource-detail/resource-detail.component.ts
// ========================

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { CategoryService } from '../../../core/services/category.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Resource } from '../../../core/models/resource.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { PhoneFormatPipe } from '../../../shared/pipes/phone-format.pipe';

@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TimeAgoPipe, PhoneFormatPipe],
  template: `
    @if (resource(); as res) {
      <div class="min-h-screen bg-black text-white pt-32 pb-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Breadcrumb -->
          <nav class="mb-8 text-sm">
            <ol class="flex items-center space-x-2 text-gray-400">
              <li><a routerLink="/" class="hover:text-white transition-colors">Accueil</a></li>
              <li>/</li>
              <li><a routerLink="/resources" class="hover:text-white transition-colors">Ressources</a></li>
              <li>/</li>
              <li class="text-white truncate">{{ res.title }}</li>
            </ol>
          </nav>

          <div class="grid lg:grid-cols-3 gap-12">
            
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
              
              <!-- Image -->
              <div class="relative h-96 bg-zinc-900 overflow-hidden group">
                @if (res.imageUrl) {
                  <img 
                    [src]="res.imageUrl" 
                    [alt]="res.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-9xl">
                    {{ getCategoryIcon(res.category) }}
                  </div>
                }
                
                <!-- Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                <!-- Badges -->
                <div class="absolute top-6 left-6 flex flex-wrap gap-3">
                  <span class="bg-black/70 backdrop-blur-sm text-white px-4 py-2 text-sm tracking-wider uppercase">
                    {{ getCategoryIcon(res.category) }} {{ res.category }}
                  </span>
                  <span 
                    class="px-4 py-2 text-sm font-medium uppercase"
                    [class.bg-emerald-500]="res.status === 'disponible'"
                    [class.text-black]="res.status === 'disponible'"
                    [class.bg-amber-500]="res.status === 'reserve'"
                    [class.text-black]="res.status === 'reserve'"
                    [class.bg-gray-500]="res.status === 'termine'"
                    [class.text-white]="res.status === 'termine'">
                    {{ res.status }}
                  </span>
                </div>

                <!-- Views -->
                <div class="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm px-4 py-2 flex items-center space-x-2">
                  <span>👁️</span>
                  <span class="text-sm">{{ res.views }} vues</span>
                </div>
              </div>

              <!-- Title & Meta -->
              <div>
                <h1 class="text-4xl md:text-5xl font-light mb-6">
                  {{ res.title }}
                </h1>
                
                <div class="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
                  <div class="flex items-center space-x-2">
                    <span>📍</span>
                    <span>{{ res.location }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span>🕐</span>
                    <span>{{ res.createdAt | timeAgo }}</span>
                  </div>
                  @if (res.expiresAt) {
                    <div class="flex items-center space-x-2 text-amber-500">
                      <span>⏰</span>
                      <span>Expire le {{ formatDate(res.expiresAt) }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Description -->
              <div class="prose prose-invert max-w-none">
                <h2 class="text-2xl font-light mb-4">Description</h2>
                <p class="text-gray-300 leading-relaxed whitespace-pre-line">
                  {{ res.description }}
                </p>
              </div>

              <!-- Share Section -->
              <div class="border-t border-white/10 pt-8">
                <h3 class="text-xl font-light mb-4">Partager cette annonce</h3>
                <div class="flex space-x-4">
                  <button 
                    (click)="shareWhatsApp()"
                    class="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-500 transition-all">
                    <span>💬</span>
                    <span class="text-sm">WhatsApp</span>
                  </button>
                  <button 
                    (click)="shareEmail()"
                    class="flex items-center space-x-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 transition-all">
                    <span>📧</span>
                    <span class="text-sm">Email</span>
                  </button>
                  <button 
                    (click)="copyLink()"
                    class="flex items-center space-x-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 transition-all">
                    <span>🔗</span>
                    <span class="text-sm">Copier le lien</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
              
              <!-- Author Card -->
              <div class="bg-zinc-900 border border-white/10 p-8">
                <h3 class="text-xl font-light mb-6">Proposé par</h3>
                
                <div class="flex items-center space-x-4 mb-6">
                  <div class="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {{ getAuthorInitials(res.author.name) }}
                  </div>
                  <div>
                    <h4 class="text-lg font-medium">{{ res.author.name }}</h4>
                    <p class="text-sm text-gray-400">Membre vérifié</p>
                  </div>
                </div>

                <!-- Contact Buttons -->
                <div class="space-y-3">
                  @if (res.author.whatsapp) {
                    <button 
                      (click)="contactWhatsApp()"
                      class="w-full bg-green-600 hover:bg-green-500 text-white px-6 py-4 flex items-center justify-center space-x-2 transition-all">
                      <span>💬</span>
                      <span class="font-medium">WHATSAPP</span>
                    </button>
                  }
                  
                  <button 
                    (click)="contactEmail()"
                    class="w-full bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-4 flex items-center justify-center space-x-2 transition-all font-medium">
                    <span>📧</span>
                    <span>ENVOYER UN EMAIL</span>
                  </button>

                  @if (res.author.contact && res.author.contact.startsWith('+')) {
                    <button 
                      (click)="contactPhone()"
                      class="w-full bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-4 flex items-center justify-center space-x-2 transition-all">
                      <span>📞</span>
                      <span>{{ res.author.contact | phoneFormat }}</span>
                    </button>
                  }
                </div>

                <!-- Report -->
                <button 
                  (click)="reportResource()"
                  class="w-full mt-6 text-sm text-red-400 hover:text-red-300 transition-colors text-center">
                  🚩 Signaler cette annonce
                </button>
              </div>

              <!-- Similar Resources -->
              <div class="bg-zinc-900 border border-white/10 p-8">
                <h3 class="text-xl font-light mb-6">Annonces similaires</h3>
                
                @if (similarResources().length > 0) {
                  <div class="space-y-4">
                    @for (similar of similarResources(); track similar.id) {
                      <a 
                        [routerLink]="['/resources', similar.id]"
                        class="block group">
                        <div class="flex space-x-4">
                          <div class="w-20 h-20 bg-zinc-800 flex-shrink-0 overflow-hidden">
                            @if (similar.imageUrl) {
                              <img 
                                [src]="similar.imageUrl" 
                                [alt]="similar.title"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                            } @else {
                              <div class="w-full h-full flex items-center justify-center text-2xl">
                                {{ getCategoryIcon(similar.category) }}
                              </div>
                            }
                          </div>
                          <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-medium group-hover:text-emerald-500 transition-colors truncate">
                              {{ similar.title }}
                            </h4>
                            <p class="text-xs text-gray-400 mt-1">
                              {{ similar.location }}
                            </p>
                            <p class="text-xs text-gray-500 mt-1">
                              {{ similar.createdAt | timeAgo }}
                            </p>
                          </div>
                        </div>
                      </a>
                    }
                  </div>
                } @else {
                  <p class="text-sm text-gray-400">
                    Aucune annonce similaire pour le moment
                  </p>
                }
              </div>

              <!-- Safety Tips -->
              <div class="bg-amber-500/10 border border-amber-500/30 p-6">
                <h3 class="text-lg font-medium mb-4 text-amber-500">
                  ⚠️ Conseils de sécurité
                </h3>
                <ul class="space-y-2 text-sm text-gray-300">
                  <li>• Rencontrez-vous dans un lieu public</li>
                  <li>• Vérifiez l'identité de la personne</li>
                  <li>• Ne partagez pas d'informations personnelles</li>
                  <li>• Faites confiance à votre instinct</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <!-- Loading State -->
      <div class="min-h-screen bg-black text-white flex items-center justify-center">
        <div class="text-center">
          <div class="text-6xl mb-6 animate-pulse">⏳</div>
          <p class="text-gray-400">Chargement...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class ResourceDetailComponent implements OnInit {
  private resourceService = inject(ResourceService);
  private categoryService = inject(CategoryService);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  resource = signal<Resource | null>(null);
  similarResources = signal<Resource[]>([]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadResource(id);
      }
    });
  }

  loadResource(id: string): void {
    const res = this.resourceService.getResourceById(id);
    if (res) {
      this.resource.set(res);
      this.resourceService.incrementViews(id);
      this.loadSimilarResources(res);
    } else {
      this.notificationService.error('Ressource introuvable');
      this.router.navigate(['/resources']);
    }
  }

  loadSimilarResources(current: Resource): void {
    const all = this.resourceService.getResources();
    const similar = all
      .filter(r => r.id !== current.id && r.category === current.category)
      .slice(0, 3);
    this.similarResources.set(similar);
  }

  getCategoryIcon(category: string): string {
    return this.categoryService.getCategoryIcon(category);
  }

  getAuthorInitials(name: string): string {
    return this.userService.getInitials(name);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  contactWhatsApp(): void {
    const res = this.resource();
    if (res?.author.whatsapp) {
      const message = encodeURIComponent(`Bonjour, je suis intéressé(e) par: ${res.title}`);
      window.open(`https://wa.me/${res.author.whatsapp}?text=${message}`, '_blank');
    }
  }

  contactEmail(): void {
    const res = this.resource();
    if (res) {
      const subject = encodeURIComponent(`Intéressé par: ${res.title}`);
      const body = encodeURIComponent(`Bonjour,\n\nJe suis intéressé(e) par votre annonce: ${res.title}\n\nCordialement`);
      window.location.href = `mailto:${res.author.contact}?subject=${subject}&body=${body}`;
    }
  }

  contactPhone(): void {
    const res = this.resource();
    if (res?.author.contact) {
      window.location.href = `tel:${res.author.contact}`;
    }
  }

  shareWhatsApp(): void {
    const res = this.resource();
    if (res) {
      const url = window.location.href;
      const message = encodeURIComponent(`Découvrez cette annonce: ${res.title}\n${url}`);
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  }

  shareEmail(): void {
    const res = this.resource();
    if (res) {
      const url = window.location.href;
      const subject = encodeURIComponent(`Découvrez: ${res.title}`);
      const body = encodeURIComponent(`Je pense que cette annonce pourrait vous intéresser:\n\n${res.title}\n${url}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  }

  copyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.notificationService.success('Lien copié dans le presse-papier');
    }).catch(() => {
      this.notificationService.error('Erreur lors de la copie du lien');
    });
  }

  reportResource(): void {
    this.notificationService.info('Fonction de signalement à venir');
  }
}
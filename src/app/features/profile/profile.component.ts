// ========================
// PROFILE COMPONENT - features/profile/profile.component.ts
// ========================

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ResourceService } from '../../core/services/resource.service';
import { NotificationService } from '../../core/services/notification.service';
import { CardResourceComponent } from '../../shared/components/card-resource/card-resource.component';
import { Resource } from '../../core/models/resource.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, CardResourceComponent],
  template: `
    <div class="min-h-screen bg-black text-white pt-32 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        @if (currentUser(); as user) {
          <!-- Profile Header -->
          <div class="mb-12">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              
              <!-- User Info -->
              <div class="flex items-center space-x-6">
                <div class="w-24 h-24 bg-emerald-500 text-black rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
                  {{ getUserInitials() }}
                </div>
                <div>
                  <h1 class="text-4xl font-light mb-2">{{ user.name }}</h1>
                  <p class="text-gray-400 mb-2">{{ user.email }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 {{ user.location }}</span>
                    <span>•</span>
                    <span>📅 Membre depuis {{ formatDate(user.joinedAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Edit Button -->
              <button 
                (click)="toggleEditMode()"
                class="px-6 py-3 border border-white/30 hover:bg-white/10 transition-all text-sm tracking-wide">
                {{ isEditMode() ? 'ANNULER' : 'MODIFIER LE PROFIL' }}
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="border-b border-white/10 mb-12">
            <nav class="flex space-x-8">
              <button
                (click)="activeTab.set('resources')"
                [class.border-emerald-500]="activeTab() === 'resources'"
                [class.text-white]="activeTab() === 'resources'"
                [class.text-gray-400]="activeTab() !== 'resources'"
                class="py-4 border-b-2 border-transparent hover:text-white transition-colors text-sm tracking-wide">
                MES ANNONCES ({{ userResources().length }})
              </button>
              <button
                (click)="activeTab.set('settings')"
                [class.border-emerald-500]="activeTab() === 'settings'"
                [class.text-white]="activeTab() === 'settings'"
                [class.text-gray-400]="activeTab() !== 'settings'"
                class="py-4 border-b-2 border-transparent hover:text-white transition-colors text-sm tracking-wide">
                PARAMÈTRES
              </button>
              <button
                (click)="activeTab.set('stats')"
                [class.border-emerald-500]="activeTab() === 'stats'"
                [class.text-white]="activeTab() === 'stats'"
                [class.text-gray-400]="activeTab() !== 'stats'"
                class="py-4 border-b-2 border-transparent hover:text-white transition-colors text-sm tracking-wide">
                STATISTIQUES
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          @switch (activeTab()) {
            
            <!-- My Resources Tab -->
            @case ('resources') {
              <div>
                <div class="flex justify-between items-center mb-8">
                  <h2 class="text-2xl font-light">Mes annonces</h2>
                  <a 
                    routerLink="/resources/new"
                    class="bg-emerald-500 text-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all">
                    + NOUVELLE ANNONCE
                  </a>
                </div>

                @if (userResources().length > 0) {
                  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @for (resource of userResources(); track resource.id) {
                      <app-card-resource
                        [resource]="resource"
                        (cardClick)="viewResource($event)">
                      </app-card-resource>
                    }
                  </div>
                } @else {
                  <div class="text-center py-20 bg-zinc-900 border border-white/10">
                    <div class="text-6xl mb-6">📦</div>
                    <h3 class="text-2xl font-light mb-4">Aucune annonce</h3>
                    <p class="text-gray-400 mb-8">
                      Vous n'avez pas encore publié d'annonce
                    </p>
                    <a 
                      routerLink="/resources/new"
                      class="inline-block bg-emerald-500 text-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all">
                      PUBLIER MA PREMIÈRE ANNONCE
                    </a>
                  </div>
                }
              </div>
            }

            <!-- Settings Tab -->
            @case ('settings') {
              <div class="max-w-2xl">
                <h2 class="text-2xl font-light mb-8">Paramètres du compte</h2>

                @if (isEditMode()) {
                  <!-- Edit Form -->
                  <div class="bg-zinc-900 border border-white/10 p-8">
                    <div [formGroup]="profileForm" class="space-y-6">
                      
                      <!-- Name -->
                      <div>
                        <label class="block text-sm font-medium mb-2 tracking-wide">
                          NOM COMPLET
                        </label>
                        <input 
                          type="text"
                          formControlName="name"
                          class="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                      </div>

                      <!-- Email -->
                      <div>
                        <label class="block text-sm font-medium mb-2 tracking-wide">
                          EMAIL
                        </label>
                        <input 
                          type="email"
                          formControlName="email"
                          class="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                      </div>

                      <!-- Phone -->
                      <div>
                        <label class="block text-sm font-medium mb-2 tracking-wide">
                          TÉLÉPHONE / WHATSAPP
                        </label>
                        <input 
                          type="tel"
                          formControlName="phone"
                          class="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                      </div>

                      <!-- Location -->
                      <div>
                        <label class="block text-sm font-medium mb-2 tracking-wide">
                          LOCALISATION
                        </label>
                        <input 
                          type="text"
                          formControlName="location"
                          class="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all">
                      </div>

                      <!-- Bio -->
                      <div>
                        <label class="block text-sm font-medium mb-2 tracking-wide">
                          BIO
                        </label>
                        <textarea 
                          formControlName="bio"
                          rows="4"
                          placeholder="Parlez-nous de vous..."
                          class="w-full bg-black border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all resize-none">
                        </textarea>
                      </div>

                      <!-- Actions -->
                      <div class="flex gap-4 pt-6">
                        <button
                          (click)="cancelEdit()"
                          class="flex-1 border border-white/30 px-6 py-3 text-sm tracking-wide hover:bg-white/10 transition-all">
                          ANNULER
                        </button>
                        <button
                          (click)="saveProfile()"
                          class="flex-1 bg-emerald-500 text-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all">
                          SAUVEGARDER
                        </button>
                      </div>
                    </div>
                  </div>
                } @else {
                  <!-- Display Info -->
                  <div class="space-y-6">
                    <div class="bg-zinc-900 border border-white/10 p-6">
                      <h3 class="text-lg font-medium mb-4">Informations personnelles</h3>
                      <div class="space-y-4 text-sm">
                        <div class="flex justify-between">
                          <span class="text-gray-400">Nom</span>
                          <span>{{ user.name }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Email</span>
                          <span>{{ user.email }}</span>
                        </div>
                        @if (user.phone) {
                          <div class="flex justify-between">
                            <span class="text-gray-400">Téléphone</span>
                            <span>{{ user.phone }}</span>
                          </div>
                        }
                        <div class="flex justify-between">
                          <span class="text-gray-400">Localisation</span>
                          <span>{{ user.location }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="bg-zinc-900 border border-white/10 p-6">
                      <h3 class="text-lg font-medium mb-4">Sécurité</h3>
                      <button class="text-emerald-500 hover:underline text-sm">
                        Modifier le mot de passe →
                      </button>
                    </div>

                    <div class="bg-red-500/10 border border-red-500/30 p-6">
                      <h3 class="text-lg font-medium mb-4 text-red-500">Zone de danger</h3>
                      <button class="text-red-500 hover:underline text-sm">
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Stats Tab -->
            @case ('stats') {
              <div>
                <h2 class="text-2xl font-light mb-8">Statistiques</h2>

                <!-- Stats Grid -->
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div class="bg-zinc-900 border border-white/10 p-6 text-center">
                    <div class="text-4xl font-light text-emerald-500 mb-2">
                      {{ userResources().length }}
                    </div>
                    <div class="text-sm text-gray-400 uppercase tracking-wider">
                      Annonces publiées
                    </div>
                  </div>

                  <div class="bg-zinc-900 border border-white/10 p-6 text-center">
                    <div class="text-4xl font-light text-emerald-500 mb-2">
                      {{ getTotalViews() }}
                    </div>
                    <div class="text-sm text-gray-400 uppercase tracking-wider">
                      Vues totales
                    </div>
                  </div>

                  <div class="bg-zinc-900 border border-white/10 p-6 text-center">
                    <div class="text-4xl font-light text-emerald-500 mb-2">
                      {{ getActiveResources() }}
                    </div>
                    <div class="text-sm text-gray-400 uppercase tracking-wider">
                      Annonces actives
                    </div>
                  </div>

                  <div class="bg-zinc-900 border border-white/10 p-6 text-center">
                    <div class="text-4xl font-light text-emerald-500 mb-2">
                      {{ getDaysActive() }}
                    </div>
                    <div class="text-sm text-gray-400 uppercase tracking-wider">
                      Jours d'activité
                    </div>
                  </div>
                </div>

                <!-- Category Breakdown -->
                <div class="bg-zinc-900 border border-white/10 p-8">
                  <h3 class="text-xl font-light mb-6">Répartition par catégorie</h3>
                  <div class="space-y-4">
                    @for (category of getCategoryBreakdown(); track category.name) {
                      <div>
                        <div class="flex justify-between mb-2 text-sm">
                          <span>{{ category.icon }} {{ category.name }}</span>
                          <span class="text-gray-400">{{ category.count }} annonces</span>
                        </div>
                        <div class="h-2 bg-black rounded-full overflow-hidden">
                          <div 
                            class="h-full bg-emerald-500 rounded-full transition-all"
                            [style.width.%]="category.percentage">
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          }
        } @else {
          <!-- Not Logged In -->
          <div class="text-center py-20">
            <div class="text-6xl mb-6">🔒</div>
            <h2 class="text-3xl font-light mb-4">Accès restreint</h2>
            <p class="text-gray-400 mb-8">
              Vous devez être connecté pour accéder à votre profil
            </p>
            <a 
              routerLink="/login"
              class="inline-block bg-emerald-500 text-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all">
              SE CONNECTER
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* Smooth transitions */
    * {
      transition-property: color, background-color, border-color;
      transition-duration: 0.2s;
      transition-timing-function: ease;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private resourceService = inject(ResourceService);
  private notificationService = inject(NotificationService);

  currentUser = this.userService.getCurrentUser;
  activeTab = signal<'resources' | 'settings' | 'stats'>('resources');
  isEditMode = signal(false);
  userResources = signal<Resource[]>([]);

  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: ['', Validators.required],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserResources();
    this.initProfileForm();
  }

  loadUserResources(): void {
    const user = this.currentUser();
    if (user) {
      const allResources = this.resourceService.getResources();
      const filtered = allResources.filter(r => r.author.name === user.name);
      this.userResources.set(filtered);
    }
  }

  initProfileForm(): void {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        location: user.location,
        bio: user.bio || ''
      });
    }
  }

  getUserInitials(): string {
    const user = this.currentUser();
    return user ? this.userService.getInitials(user.name) : 'U';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  }

  toggleEditMode(): void {
    this.isEditMode.update(v => !v);
    if (!this.isEditMode()) {
      this.initProfileForm();
    }
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    this.initProfileForm();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.notificationService.error('Veuillez remplir tous les champs requis');
      return;
    }

    const updates = this.profileForm.value;
    this.userService.updateProfile(updates);
    this.notificationService.success('Profil mis à jour avec succès');
    this.isEditMode.set(false);
  }

  viewResource(resource: Resource): void {
    // Navigate to resource detail
    console.log('View resource:', resource.id);
  }

  getTotalViews(): number {
    return this.userResources().reduce((sum, r) => sum + r.views, 0);
  }

  getActiveResources(): number {
    return this.userResources().filter(r => r.status === 'disponible').length;
  }

  getDaysActive(): number {
    const user = this.currentUser();
    if (!user) return 0;
    
    const joinDate = new Date(user.joinedAt);
    const today = new Date();
    const diff = today.getTime() - joinDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getCategoryBreakdown(): Array<{name: string, icon: string, count: number, percentage: number}> {
    const resources = this.userResources();
    const total = resources.length;
    
    if (total === 0) return [];

    const breakdown = [
      { id: 'don', name: 'Dons', icon: '🎁' },
      { id: 'service', name: 'Services', icon: '🔧' },
      { id: 'echange', name: 'Échanges', icon: '🔄' },
      { id: 'aide', name: 'Entraide', icon: '🤝' }
    ];

    return breakdown.map(cat => {
      const count = resources.filter(r => r.category === cat.id).length;
      return {
        name: cat.name,
        icon: cat.icon,
        count,
        percentage: (count / total) * 100
      };
    }).filter(cat => cat.count > 0);
  }
}
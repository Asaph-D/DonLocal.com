// ========================
// HEADER COMPONENT - core/components/header/header.component.ts
// ========================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AnimationService } from '../../services/animation.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header 
      class="fixed w-full top-0 z-50 transition-all duration-300"
      [ngClass]="{'bg-black/90': isScrolled()}"      
      [class.backdrop-blur-lg]="isScrolled()"
      [class.border-b]="isScrolled()"
      [ngClass]="{'border-white/10': isScrolled()}">
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo -->
          <a routerLink="/" class="flex items-center space-x-3 group">
            <div class="w-12 h-12 bg-emerald-500 text-black flex items-center justify-center text-2xl font-bold transition-transform group-hover:scale-110">
              🌍
            </div>
            <div>
              <h1 class="text-xl font-light tracking-wider text-white">DONLOCAL.CM</h1>
              <p class="text-xs text-gray-400 tracking-widest">PARTAGE LOCAL</p>
            </div>
          </a>

          <!-- Navigation Desktop -->
          <nav class="hidden md:flex items-center space-x-8">
            <a 
              routerLink="/" 
              routerLinkActive="text-emerald-500"
              [routerLinkActiveOptions]="{exact: true}"
              class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
              ACCUEIL
            </a>
            <a 
              routerLink="/resources" 
              routerLinkActive="text-emerald-500"
              class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
              EXPLORER
            </a>
            <a 
              routerLink="/about" 
              routerLinkActive="text-emerald-500"
              class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
              À PROPOS
            </a>
          </nav>

          <!-- Actions -->
          <div class="hidden md:flex items-center space-x-4">
            @if (isAuthenticated()) {
              <!-- User Menu -->
              <div class="relative">
                <button 
                  (click)="toggleUserMenu()"
                  class="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                  <div class="w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                    {{ getUserInitials() }}
                  </div>
                  <span class="text-sm">{{ currentUser()?.name!.split(' ')[0] }}</span>
                </button>

                <!-- Dropdown Menu -->
                @if (showUserMenu()) {
                  <div class="absolute right-0 mt-2 w-56 bg-zinc-900 border border-white/10 shadow-xl animate-fade-in">
                    <a 
                      routerLink="/profile" 
                      class="block px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">
                      👤 Mon Profil
                    </a>
                    <a 
                      routerLink="/my-resources" 
                      class="block px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">
                      📦 Mes Annonces
                    </a>
                    <a 
                      routerLink="/messages" 
                      class="block px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5">
                      💬 Messages
                    </a>
                    <button 
                      (click)="logout()"
                      class="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      🚪 Déconnexion
                    </button>
                  </div>
                }
              </div>
              
              <a 
                routerLink="/resources/new" 
                class="bg-emerald-500 text-black px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all hover:scale-105">
                PUBLIER
              </a>
            } @else {
              <a 
                routerLink="/login" 
                class="text-sm tracking-wide text-white/80 hover:text-white transition-colors">
                CONNEXION
              </a>
              <a 
                routerLink="/resources/new" 
                class="bg-emerald-500 text-black px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all hover:scale-105">
                PUBLIER
              </a>
            }
          </div>

          <!-- Mobile Menu Button -->
          <button 
            (click)="toggleMobileMenu()"
            class="md:hidden text-white p-2"
            [attr.aria-label]="showMobileMenu() ? 'Fermer le menu' : 'Ouvrir le menu'">
            @if (showMobileMenu()) {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            } @else {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            }
          </button>
        </div>

        <!-- Mobile Menu -->
        @if (showMobileMenu()) {
          <div class="md:hidden border-t border-white/10 py-4 animate-fade-in">
            <nav class="flex flex-col space-y-4">
              <a 
                routerLink="/" 
                (click)="closeMobileMenu()"
                routerLinkActive="text-emerald-500"
                [routerLinkActiveOptions]="{exact: true}"
                class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
                ACCUEIL
              </a>
              <a 
                routerLink="/resources" 
                (click)="closeMobileMenu()"
                routerLinkActive="text-emerald-500"
                class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
                EXPLORER
              </a>
              <a 
                routerLink="/about" 
                (click)="closeMobileMenu()"
                routerLinkActive="text-emerald-500"
                class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
                À PROPOS
              </a>
              
              @if (isAuthenticated()) {
                <hr class="border-white/10">
                <a 
                  routerLink="/profile" 
                  (click)="closeMobileMenu()"
                  class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
                  👤 MON PROFIL
                </a>
                <a 
                  routerLink="/my-resources" 
                  (click)="closeMobileMenu()"
                  class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
                  📦 MES ANNONCES
                </a>
                <button 
                  (click)="logout()"
                  class="text-left text-sm tracking-wide text-red-400 hover:text-red-300 transition-colors">
                  🚪 DÉCONNEXION
                </button>
              } @else {
                <a 
                  routerLink="/login" 
                  (click)="closeMobileMenu()"
                  class="text-sm tracking-wide text-white/80 hover:text-emerald-500 transition-colors">
                  CONNEXION
                </a>
              }
              
              <a 
                routerLink="/resources/new" 
                (click)="closeMobileMenu()"
                class="bg-emerald-500 text-black px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all text-center">
                PUBLIER UNE ANNONCE
              </a>
            </nav>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }

    /* Smooth transitions */
    a, button {
      transition: all 0.2s ease;
    }
  `]
})
export class HeaderComponent {
  private animationService = inject(AnimationService);
  private userService = inject(UserService);

  isScrolled = this.animationService.isScrolled;
  isAuthenticated = this.userService.getAuthStatus;
  currentUser = this.userService.getCurrentUser;

  showMobileMenu = signal(false);
  showUserMenu = signal(false);

  toggleMobileMenu(): void {
    this.showMobileMenu.update(v => !v);
    this.showUserMenu.set(false);
  }

  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.userService.logout();
    this.showUserMenu.set(false);
    this.closeMobileMenu();
  }

  getUserInitials(): string {
    const user = this.currentUser();
    return user ? this.userService.getInitials(user.name) : 'U';
  }
}
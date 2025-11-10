// ========================
// APP COMPONENT - app.component.ts
// ========================

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { NotificationService } from './core/services/notification.service';
import { ParticlesBackgroundComponent } from './shared/components/particles-background/particles-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ParticlesBackgroundComponent],
  template: `
      <!-- <app-particles-background
      [particleCount]="40"
      [particleSpeed]="0.2"
      [connectionDistance]="0"
      [interactive]="false"
      [fps]="30"
      [mouseRadius]="180">
    </app-particles-background> -->
    <!-- Header -->
    <app-header></app-header>

    <!-- Main Content -->
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <app-footer></app-footer>

    <!-- Notifications Container -->
    <div class="fixed top-24 right-4 z-50 space-y-3 max-w-md">
      @for (notification of notifications(); track notification.id) {
        <div 
          class="bg-zinc-900 border px-6 py-4 shadow-2xl animate-slide-in flex items-start space-x-4"
          [class.border-emerald-500]="notification.type === 'success'"
          [class.border-red-500]="notification.type === 'error'"
          [class.border-amber-500]="notification.type === 'warning'"
          [class.border-blue-500]="notification.type === 'info'">
          
          <!-- Icon -->
          <div 
            class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
            [class.bg-emerald-500]="notification.type === 'success'"
            [class.bg-red-500]="notification.type === 'error'"
            [class.bg-amber-500]="notification.type === 'warning'"
            [class.bg-blue-500]="notification.type === 'info'"
            [class.text-black]="notification.type === 'success' || notification.type === 'warning'"
            [class.text-white]="notification.type === 'error' || notification.type === 'info'">
            {{ getNotificationIcon(notification.type) }}
          </div>

          <!-- Message -->
          <p class="flex-1 text-sm text-white">
            {{ notification.message }}
          </p>

          <!-- Close Button -->
          <button
            (click)="removeNotification(notification.id)"
            class="flex-shrink-0 text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }

    /* Smooth scroll */
    :host {
      display: block;
    }

    * {
      scroll-behavior: smooth;
    }
  `]
})
export class AppComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.getNotifications;

  ngOnInit(): void {
    // Any app initialization logic here
    console.log('🌍 DonLocal.cm initialized');
  }

  getNotificationIcon(type: string): string {
    return this.notificationService.getIcon(type as any);
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }
}
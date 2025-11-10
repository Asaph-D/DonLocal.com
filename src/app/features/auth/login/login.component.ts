// ========================
// LOGIN COMPONENT - features/auth/login/login.component.ts
// ========================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
      <div class="max-w-md w-full">
        
        <!-- Logo & Title -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 text-black text-4xl font-bold mb-6 float-animation">
            🌍
          </div>
          <h1 class="text-4xl font-light mb-3">
            Connexion
          </h1>
          <p class="text-gray-400 font-light">
            Accédez à votre compte DonLocal.cm
          </p>
        </div>

        <!-- Form Card -->
        <div class="bg-zinc-900 border border-white/10 p-8">
          <div [formGroup]="loginForm" class="space-y-6">
            
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                EMAIL
              </label>
              <input 
                type="email"
                formControlName="email"
                placeholder="votre@email.cm"
                class="w-full bg-black border px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                [ngClass]="{'border-white/10': !isFieldInvalid('email')}"
                [class.border-red-500]="isFieldInvalid('email')">
              @if (isFieldInvalid('email')) {
                <p class="mt-2 text-sm text-red-500">
                  Email valide requis
                </p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                MOT DE PASSE
              </label>
              <div class="relative">
                <input 
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full bg-black border px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none transition-all"
                  [ngClass]="{'border-white/10': !isFieldInvalid('password'), 'border-red-500': isFieldInvalid('password')}"
                  [class.border-red-500]="isFieldInvalid('password')">
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  @if (showPassword()) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
              @if (isFieldInvalid('password')) {
                <p class="mt-2 text-sm text-red-500">
                  Mot de passe requis (minimum 6 caractères)
                </p>
              }
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  formControlName="rememberMe"
                  class="w-4 h-4 bg-black border border-white/20 checked:bg-emerald-500 checked:border-emerald-500 focus:outline-none">
                <span class="text-sm text-gray-400 group-hover:text-white transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <a href="#" class="text-sm text-emerald-500 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <!-- Submit Button -->
            <button
              type="button"
              (click)="onSubmit()"
              [disabled]="isSubmitting()"
              class="w-full bg-emerald-500 text-black px-6 py-4 text-sm font-medium tracking-wide hover:bg-emerald-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all">
              @if (isSubmitting()) {
                <span class="flex items-center justify-center space-x-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>CONNEXION...</span>
                </span>
              } @else {
                SE CONNECTER
              }
            </button>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/10"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-zinc-900 text-gray-400">OU</span>
              </div>
            </div>

            <!-- Social Login (Optional) -->
            <div class="space-y-3">
              <button
                type="button"
                class="w-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continuer avec Google</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center mt-8">
          <p class="text-gray-400">
            Vous n'avez pas de compte ?
            <a routerLink="/register" class="text-emerald-500 hover:underline font-medium ml-1">
              Créer un compte
            </a>
          </p>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <a routerLink="/" class="text-sm text-gray-500 hover:text-gray-400 transition-colors">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .float-animation {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    input[type="checkbox"]:checked {
      background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  showPassword = signal(false);
  isSubmitting = signal(false);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);

    const { email, password } = this.loginForm.value;

    // Simulate API call
    setTimeout(() => {
      // Mock login - in real app, call authentication API
      const mockUser = {
        id: '1',
        name: 'Utilisateur Demo',
        email: email,
        location: 'Douala, Cameroun',
        joinedAt: new Date()
      };

      this.userService.login(mockUser);
      this.notificationService.success('Connexion réussie !');
      this.isSubmitting.set(false);
      
      // Redirect to home or previous page
      this.router.navigate(['/']);
    }, 1500);
  }
}
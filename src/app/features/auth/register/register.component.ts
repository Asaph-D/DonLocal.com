// ========================
// REGISTER COMPONENT - features/auth/register/register.component.ts
// ========================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
      <div class="max-w-2xl w-full">
        
        <!-- Logo & Title -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 text-black text-4xl font-bold mb-6 float-animation">
            🌍
          </div>
          <h1 class="text-4xl font-light mb-3">
            Créer un compte
          </h1>
          <p class="text-gray-400 font-light">
            Rejoignez la communauté DonLocal.cm
          </p>
        </div>

        <!-- Form Card -->
        <div class="bg-zinc-900 border border-white/10 p-8 md:p-12">
          <div [formGroup]="registerForm" class="space-y-6">
            
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                NOM COMPLET <span class="text-red-500">*</span>
              </label>
              <input 
                type="text"
                formControlName="name"
                placeholder="Jean Dupont"
                class="w-full bg-black border px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                [ngClass]="{'border-white/10':!isFieldInvalid('name')}"
                [class.border-red-500]="isFieldInvalid('name')">
              @if (isFieldInvalid('name')) {
                <p class="mt-2 text-sm text-red-500">
                  Nom complet requis (minimum 3 caractères)
                </p>
              }
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                EMAIL <span class="text-red-500">*</span>
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

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                TÉLÉPHONE / WHATSAPP
              </label>
              <input 
                type="tel"
                formControlName="phone"
                placeholder="+237 6XX XX XX XX"
                class="w-full bg-black border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all">
              <p class="mt-2 text-sm text-gray-500">
                Optionnel - Format: +237XXXXXXXXX
              </p>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                LOCALISATION <span class="text-red-500">*</span>
              </label>
              <input 
                type="text"
                formControlName="location"
                placeholder="Douala, Akwa"
                class="w-full bg-black border px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                [ngClass]="{'border-white/10': !isFieldInvalid('location')}"
                [class.border-red-500]="isFieldInvalid('location')">
              @if (isFieldInvalid('location')) {
                <p class="mt-2 text-sm text-red-500">
                  Localisation requise
                </p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                MOT DE PASSE <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full bg-black border px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none transition-all"
                  [ngClass]="{'border-white/10': !isFieldInvalid('password')}"
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
              
              <!-- Password Strength -->
              @if (registerForm.get('password')?.value) {
                <div class="mt-3">
                  <div class="flex items-center space-x-2 mb-1">
                    <div class="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all"
                        [class.bg-red-500]="passwordStrength() === 'weak'"
                        [class.bg-amber-500]="passwordStrength() === 'medium'"
                        [class.bg-emerald-500]="passwordStrength() === 'strong'"
                        [style.width]="getPasswordStrengthWidth()">
                      </div>
                    </div>
                  </div>
                  <p class="text-xs" [class.text-red-500]="passwordStrength() === 'weak'"
                     [class.text-amber-500]="passwordStrength() === 'medium'"
                     [class.text-emerald-500]="passwordStrength() === 'strong'">
                    Force: {{ getPasswordStrengthLabel() }}
                  </p>
                </div>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium mb-2 tracking-wide">
                CONFIRMER LE MOT DE PASSE <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input 
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  placeholder="••••••••"
                  class="w-full bg-black border px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none transition-all"
                  [ngClass]="{'border-white/10': !isFieldInvalid('confirmPassword')}"
                  [class.border-red-500]="isFieldInvalid('confirmPassword')">
                <button
                  type="button"
                  (click)="toggleConfirmPasswordVisibility()"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  @if (showConfirmPassword()) {
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
              @if (isFieldInvalid('confirmPassword')) {
                <p class="mt-2 text-sm text-red-500">
                  Les mots de passe ne correspondent pas
                </p>
              }
            </div>

            <!-- Terms -->
            <div>
              <label class="flex items-start space-x-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  formControlName="acceptTerms"
                  class="mt-1 w-5 h-5 bg-black border border-white/20 checked:bg-emerald-500 checked:border-emerald-500 focus:outline-none">
                <span class="text-sm text-gray-400 group-hover:text-white transition-colors">
                  J'accepte les <a href="#" class="text-emerald-500 hover:underline">conditions d'utilisation</a> et la <a href="#" class="text-emerald-500 hover:underline">politique de confidentialité</a>
                </span>
              </label>
              @if (isFieldInvalid('acceptTerms')) {
                <p class="mt-2 text-sm text-red-500">
                  Vous devez accepter les conditions
                </p>
              }
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
                  <span>CRÉATION...</span>
                </span>
              } @else {
                CRÉER MON COMPTE
              }
            </button>
          </div>
        </div>

        <!-- Login Link -->
        <div class="text-center mt-8">
          <p class="text-gray-400">
            Vous avez déjà un compte ?
            <a routerLink="/login" class="text-emerald-500 hover:underline font-medium ml-1">
              Se connecter
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isSubmitting = signal(false);
  passwordStrength = signal<'weak' | 'medium' | 'strong'>('weak');

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });

    // Watch password changes for strength indicator
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordStrength(password);
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (fieldName === 'confirmPassword') {
      return !!(field && (field.invalid || this.registerForm.errors?.['passwordMismatch']) && (field.dirty || field.touched));
    }
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }

  updatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength.set('weak');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 1) this.passwordStrength.set('weak');
    else if (strength <= 2) this.passwordStrength.set('medium');
    else this.passwordStrength.set('strong');
  }

  getPasswordStrengthWidth(): string {
    const strength = this.passwordStrength();
    if (strength === 'weak') return '33%';
    if (strength === 'medium') return '66%';
    return '100%';
  }

  getPasswordStrengthLabel(): string {
    const strength = this.passwordStrength();
    if (strength === 'weak') return 'Faible';
    if (strength === 'medium') return 'Moyenne';
    return 'Forte';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.registerForm.value;

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        whatsapp: formValue.phone,
        location: formValue.location,
        joinedAt: new Date()
      };

      this.userService.login(newUser);
      this.notificationService.success('Compte créé avec succès !');
      this.isSubmitting.set(false);
      
      this.router.navigate(['/']);
    }, 1500);
  }
}
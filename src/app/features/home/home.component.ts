// ========================
// HOME COMPONENT - features/home/home.component.ts
// ========================

import { Component, OnInit, OnDestroy, inject, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AnimationService } from '../../core/services/animation.service';
import { ResourceService } from '../../core/services/resource.service';
import { CategoryService } from '../../core/services/category.service';
import { CardResourceComponent } from '../../shared/components/card-resource/card-resource.component';
import { Resource } from '../../core/models/resource.model';
import { ParticlesBackgroundComponent } from '../../shared/components/particles-background/particles-background.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CardResourceComponent, ParticlesBackgroundComponent],
  template: `
    <!-- Particles Canvas -->
    <!-- <canvas #particlesCanvas class="particles-canvas"></canvas> -->
<!-- Particles background -->
    <!-- <app-particles-background
      [particleCount]="100"
      [particleColor]="'rgba(255,255,255,0.6)'"
      [lineColor]="'rgba(16,185,129,0.3)'"
      [particleSpeed]="0.7"
      [connectionDistance]="160"
      [interactive]="true"
    ></app-particles-background> -->
    <app-particles-background
      [particleCount]="40"
      [particleSpeed]="0.2"
      [connectionDistance]="0"
      [interactive]="false"
      [fps]="30"
      [mouseRadius]="180">
    </app-particles-background>
    <!-- Scroll Progress Bar -->
    <div 
      class="scroll-progress" 
      [style.width.%]="scrollProgress()">
    </div>

    <div class="min-h-screen bg-black text-white">
      <!-- Hero Section -->
      <section class="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div class="max-w-7xl mx-auto text-center w-full">
          
          <!-- Animated Icon -->
          <div class="animate-fade-in delay-100">
            <div class="float-animation inline-block text-7xl md:text-8xl mb-8">
              🌍
            </div>
          </div>
          
          <!-- Main Title -->
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight animate-fade-in delay-200">
            Partagez localement,<br>
            <span class="text-emerald-500">Impactez durablement</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light animate-fade-in delay-300 leading-relaxed">
            La plateforme camerounaise pour donner, échanger et s'entraider. 
            Connectez-vous à votre communauté locale en quelques clics.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-400 mb-20">
            <button 
              (click)="scrollToResources()"
              class="bg-emerald-500 text-black px-8 py-4 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all transform hover:scale-105">
              EXPLORER LES RESSOURCES
            </button>
            <a 
              routerLink="/resources/new"
              class="border border-white/30 px-8 py-4 text-sm font-medium tracking-wide hover:bg-white/10 transition-all text-center">
              PUBLIER UNE ANNONCE
            </a>
          </div>

          <!-- Categories Quick Access -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            @for (cat of categories(); track cat.id; let i = $index) {
              <button
                (click)="navigateToCategory(cat.id)"
                class="card-3d bg-white/5 backdrop-blur-sm p-6 border border-white/10 cursor-pointer shimmer-effect text-center group animate-fade-in"
                [style.animation-delay]="(i * 100 + 500) + 'ms'">
                <div class="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {{ cat.icon }}
                </div>
                <h3 class="text-lg font-light mb-2 text-white">{{ cat.name }}</h3>
                <p class="text-sm text-gray-400">{{ cat.count }} annonces</p>
              </button>
            }
          </div>
        </div>
      </section>

      <!-- Featured Resources Section -->
      <section id="resources" class="py-32 relative z-10 px-4">
        <div class="max-w-7xl mx-auto">
          
          <!-- Section Header -->
          <div class="text-center mb-20">
            <p class="text-sm tracking-[0.3em] text-gray-400 mb-4 uppercase">
              Ressources Disponibles
            </p>
            <h2 class="text-4xl md:text-5xl font-light mb-6">
              Ce que votre communauté partage
            </h2>
            <p class="text-gray-400 max-w-2xl mx-auto font-light">
              Découvrez les dernières annonces publiées par les membres de votre communauté locale
            </p>
          </div>

          <!-- Resources Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            @for (resource of featuredResources(); track resource.id; let i = $index) {
              <div 
                class="animate-fade-in"
                [style.animation-delay]="(i * 100) + 'ms'">
                <app-card-resource
                  [resource]="resource"
                  (cardClick)="viewResource($event)"
                  (contactClick)="contactResource($event)">
                </app-card-resource>
              </div>
            }
          </div>

          <!-- View All Button -->
          <div class="text-center">
            <a 
              routerLink="/resources"
              class="inline-block border border-white/30 px-8 py-3 text-sm tracking-wide hover:bg-white/10 transition-all">
              VOIR TOUTES LES ANNONCES →
            </a>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="py-32 bg-white/5 relative z-10 px-4">
        <div class="max-w-7xl mx-auto">
          
          <!-- Section Header -->
          <div class="text-center mb-20">
            <p class="text-sm tracking-[0.3em] text-gray-400 mb-4 uppercase">
              Comment ça marche
            </p>
            <h2 class="text-4xl md:text-5xl font-light mb-6">
              Simple et efficace
            </h2>
          </div>

          <!-- Steps Grid -->
          <div class="grid md:grid-cols-3 gap-12">
            @for (step of steps; track step.number) {
              <div class="text-center group">
                <div class="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl group-hover:scale-110 transition-transform">
                  {{ step.icon }}
                </div>
                <div class="text-emerald-500 text-sm tracking-widest mb-4 uppercase">
                  Étape {{ step.number }}
                </div>
                <h3 class="text-2xl font-light mb-4">{{ step.title }}</h3>
                <p class="text-gray-400 font-light leading-relaxed">
                  {{ step.description }}
                </p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-32 border-t border-white/10 relative z-10 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            @for (stat of stats; track stat.label) {
              <div class="group">
                <div class="text-4xl md:text-5xl font-light mb-3 text-emerald-500 group-hover:scale-110 transition-transform">
                  {{ stat.value }}+
                </div>
                <div class="text-xs md:text-sm tracking-wider text-gray-400 uppercase">
                  {{ stat.label }}
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-32 relative z-10 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-light mb-8 leading-tight">
            Prêt à faire partie<br>de la communauté ?
          </h2>
          <p class="text-xl text-gray-400 mb-12 font-light">
            Publiez votre première annonce gratuitement dès aujourd'hui.
          </p>
          <a 
            routerLink="/resources/new"
            class="inline-block bg-emerald-500 text-black px-12 py-4 text-lg font-medium hover:bg-emerald-400 transition-all transform hover:scale-105">
            COMMENCER MAINTENANT
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .particles-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      opacity: 0.15;
    }

    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #059669);
      z-index: 1000;
      transition: width 0.1s ease;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .animate-fade-in {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
    }

    .float-animation {
      animation: float 4s ease-in-out infinite;
    }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }

    .card-3d {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }

    .card-3d:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    .shimmer-effect {
      position: relative;
      overflow: hidden;
    }

    .shimmer-effect::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }

    .shimmer-effect:hover::before {
      left: 100%;
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particlesCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private animationService = inject(AnimationService);
  private resourceService = inject(ResourceService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  scrollProgress = this.animationService.scrollProgress;
  categories = this.categoryService.getCategories;
  
  featuredResources = signal<Resource[]>([]);

  steps = [
    {
      number: 1,
      icon: '📝',
      title: 'Publiez',
      description: 'Créez une annonce en quelques minutes. Ajoutez photos et description.'
    },
    {
      number: 2,
      icon: '🔍',
      title: 'Explorez',
      description: 'Parcourez les ressources disponibles dans votre quartier.'
    },
    {
      number: 3,
      icon: '🤝',
      title: 'Connectez',
      description: 'Contactez directement par email, téléphone ou WhatsApp.'
    }
  ];

  stats = [
    { value: 250, label: 'Ressources' },
    { value: 1200, label: 'Utilisateurs' },
    { value: 5, label: 'Villes' },
    { value: 800, label: 'Échanges' }
  ];

  ngOnInit(): void {
    this.loadFeaturedResources();
  }

  ngAfterViewInit(): void {
    if (this.canvasRef) {
      this.animationService.initParticles(this.canvasRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.animationService.cleanup();
  }

  loadFeaturedResources(): void {
    const all = this.resourceService.getResources();
    this.featuredResources.set(all.slice(0, 6));
  }

  scrollToResources(): void {
    this.animationService.scrollToElement('resources');
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/resources'], { 
      queryParams: { category: categoryId } 
    });
  }

  viewResource(resource: Resource): void {
    this.router.navigate(['/resources', resource.id]);
  }

  contactResource(resource: Resource): void {
    // Ouvrir WhatsApp ou email
    if (resource.author.whatsapp) {
      window.open(`https://wa.me/${resource.author.whatsapp}`, '_blank');
    } else {
      window.location.href = `mailto:${resource.author.contact}`;
    }
  }
}
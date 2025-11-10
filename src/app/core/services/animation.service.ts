// ========================
// ANIMATION SERVICE - services/animation.service.ts
// ========================

import { Injectable, signal, effect } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  scrollProgress = signal(0);
  isScrolled = signal(false);
  
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    // Écouter le scroll
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => this.updateScrollProgress());
      window.addEventListener('resize', () => this.resizeCanvas());
    }
  }

  // ===== PARTICLES CANVAS =====
  initParticles(canvasElement: HTMLCanvasElement, particleCount: number = 80): void {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.canvas || !this.ctx) return;

    // Configurer les dimensions
    this.resizeCanvas();

    // Créer les particules
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    // Démarrer l'animation
    this.animate();
  }

  private animate(): void {
    if (!this.canvas || !this.ctx) return;

    // Effacer le canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dessiner les particules
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    
    this.particles.forEach(particle => {
      // Mettre à jour la position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Rebondir sur les bords
      if (particle.x < 0 || particle.x > this.canvas!.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas!.height) {
        particle.vy *= -1;
      }

      // Dessiner la particule
      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx!.fill();
    });

    // Continuer l'animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  stopParticles(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // ===== SCROLL PROGRESS =====
  private updateScrollProgress(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = (window.scrollY / documentHeight) * 100;
    
    this.scrollProgress.set(Math.min(scrolled, 100));
    this.isScrolled.set(window.scrollY > 50);
  }

  // ===== SMOOTH SCROLL =====
  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }

  // ===== INTERSECTION OBSERVER (pour animations au scroll) =====
  observeElements(selector: string, callback: (entry: IntersectionObserverEntry) => void): IntersectionObserver {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(callback);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });

    return observer;
  }

  // ===== CLEANUP =====
  cleanup(): void {
    this.stopParticles();
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', () => this.updateScrollProgress());
      window.removeEventListener('resize', () => this.resizeCanvas());
    }
  }
}
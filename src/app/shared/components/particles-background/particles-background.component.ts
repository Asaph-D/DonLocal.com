// ========================
// PARTICLES BACKGROUND COMPONENT - shared/components/particles-background/particles-background.component.ts
// ========================

import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  targetOpacity: number;
}

interface Connection {
  from: Particle;
  to: Particle;
  distance: number;
}

@Component({
  selector: 'app-particles-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas 
      #particlesCanvas
      class="particles-canvas"
      [class.interactive]="interactive"
      (mousemove)="onMouseMove($event)"
      (mouseleave)="onMouseLeave()">
    </canvas>
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
    }

    .particles-canvas.interactive {
      pointer-events: auto;
    }

    :host {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
      z-index: 0;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .particles-canvas {
        animation: none !important;
      }
    }
  `]
})
export class ParticlesBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particlesCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // Configuration inputs
  @Input() particleCount: number = 80;
  @Input() particleColor: string = 'rgba(255, 255, 255, 0.5)';
  @Input() lineColor: string = 'rgba(16, 185, 129, 0.3)'; // emerald-500
  @Input() particleSpeed: number = 0.5;
  @Input() particleSize: { min: number; max: number } = { min: 1, max: 3 };
  @Input() connectionDistance: number = 150;
  @Input() interactive: boolean = true;
  @Input() mouseRadius: number = 200;
  @Input() fps: number = 60;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private mouse = { x: 0, y: 0, active: false };
  private lastFrameTime = 0;
  private frameInterval: number;
  private resizeTimeout: number | null = null;

  constructor() {
    this.frameInterval = 1000 / this.fps;
  }

  ngOnInit(): void {
    // Detect if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.particleSpeed = 0.1;
      this.particleCount = Math.floor(this.particleCount / 2);
    }
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d', { alpha: true })!;

    if (!this.ctx) {
      console.error('Could not get canvas context');
      return;
    }

    this.setupCanvas();
    this.createParticles();
    this.animate(0);

    // Handle window resize
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    window.removeEventListener('resize', this.handleResize);
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    
    this.ctx.scale(dpr, dpr);
  }

  private createParticles(): void {
    this.particles = [];
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    for (let i = 0; i < this.particleCount; i++) {
      const radius = this.randomRange(this.particleSize.min, this.particleSize.max);
      const opacity = this.randomRange(0.3, 0.8);

      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * this.particleSpeed,
        vy: (Math.random() - 0.5) * this.particleSpeed,
        radius,
        opacity,
        targetOpacity: opacity
      });
    }
  }

  private animate = (currentTime: number): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = currentTime - this.lastFrameTime;

    if (elapsed < this.frameInterval) {
      return;
    }

    this.lastFrameTime = currentTime - (elapsed % this.frameInterval);

    this.update();
    this.draw();
  };

  private update(): void {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      // Mouse interaction
      if (this.interactive && this.mouse.active) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouseRadius) {
          const force = (this.mouseRadius - distance) / this.mouseRadius;
          const angle = Math.atan2(dy, dx);
          
          particle.vx -= Math.cos(angle) * force * 0.05;
          particle.vy -= Math.sin(angle) * force * 0.05;
          particle.targetOpacity = 1;
        } else {
          particle.targetOpacity = this.randomRange(0.3, 0.8);
        }
      }

      // Smooth opacity transition
      if (particle.opacity < particle.targetOpacity) {
        particle.opacity += 0.02;
      } else if (particle.opacity > particle.targetOpacity) {
        particle.opacity -= 0.02;
      }

      // Limit speed
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      const maxSpeed = this.particleSpeed * 2;
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }
    });
  }

  private draw(): void {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    // Clear canvas with fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, width, height);

    // Draw connections
    const connections: Connection[] = [];
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          connections.push({
            from: this.particles[i],
            to: this.particles[j],
            distance
          });
        }
      }
    }

    // Draw lines
    connections.forEach(({ from, to, distance }) => {
      const opacity = 1 - (distance / this.connectionDistance);
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.lineColor.replace(/[\d.]+\)$/g, `${opacity * 0.3})`);
      this.ctx.lineWidth = 0.5;
      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.stroke();
    });

    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.particleColor.replace(/[\d.]+\)$/g, `${particle.opacity})`);
      this.ctx.fill();

      // Add glow effect
      if (particle.opacity > 0.6) {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.particleColor;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    // Draw mouse cursor effect
    if (this.interactive && this.mouse.active) {
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, this.mouseRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  private stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private handleResize = (): void => {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(() => {
      this.setupCanvas();
      this.createParticles();
    }, 250);
  };

  onMouseMove(event: MouseEvent): void {
    if (!this.interactive) return;

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
    this.mouse.active = true;
  }

  onMouseLeave(): void {
    this.mouse.active = false;
    
    // Reset all particles opacity
    this.particles.forEach(particle => {
      particle.targetOpacity = this.randomRange(0.3, 0.8);
    });
  }

  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
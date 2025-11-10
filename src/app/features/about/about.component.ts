// ========================
// ABOUT COMPONENT - features/about/about.component.ts
// ========================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black text-white">
      
      <!-- Hero Section -->
      <section class="relative pt-32 pb-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <div class="text-7xl mb-8 float-animation">🌍</div>
          <h1 class="text-5xl md:text-6xl font-light mb-6">
            À propos de DonLocal.cm
          </h1>
          <p class="text-xl text-gray-400 font-light leading-relaxed">
            La première plateforme camerounaise de partage local et solidaire,
            connectant les communautés pour un avenir plus durable.
          </p>
        </div>
      </section>

      <!-- Mission Section -->
      <section class="py-20 px-4 bg-white/5">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p class="text-sm tracking-[0.3em] text-emerald-500 mb-4 uppercase">
                Notre Mission
              </p>
              <h2 class="text-4xl font-light mb-6">
                Faciliter le partage local et renforcer les liens communautaires
              </h2>
              <p class="text-gray-400 leading-relaxed mb-6">
                DonLocal.cm est né d'une vision simple : créer une plateforme où les Camerounais 
                peuvent facilement donner, échanger et s'entraider au sein de leurs communautés locales.
              </p>
              <p class="text-gray-400 leading-relaxed">
                Nous croyons que le partage local est la clé d'une société plus solidaire et d'une 
                économie plus circulaire. Chaque don, chaque échange, chaque coup de main contribue 
                à construire des communautés plus fortes et plus résilientes.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-6">
              @for (value of values; track value.title) {
                <div class="bg-zinc-900 border border-white/10 p-6 hover:border-emerald-500/50 transition-all group">
                  <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {{ value.icon }}
                  </div>
                  <h3 class="text-lg font-medium mb-2">{{ value.title }}</h3>
                  <p class="text-sm text-gray-400">{{ value.description }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-20 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] text-gray-400 mb-4 uppercase">
              Comment ça marche
            </p>
            <h2 class="text-4xl font-light mb-6">
              Simple, rapide et efficace
            </h2>
          </div>

          <div class="grid md:grid-cols-3 gap-12">
            @for (step of steps; track step.number) {
              <div class="text-center group">
                <div class="relative mb-8">
                  <div class="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-5xl group-hover:scale-110 transition-transform">
                    {{ step.icon }}
                  </div>
                  <div class="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center font-bold">
                    {{ step.number }}
                  </div>
                </div>
                <h3 class="text-2xl font-light mb-4">{{ step.title }}</h3>
                <p class="text-gray-400 leading-relaxed">{{ step.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Impact Section -->
      <section class="py-20 px-4 bg-white/5">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] text-gray-400 mb-4 uppercase">
              Notre Impact
            </p>
            <h2 class="text-4xl font-light mb-6">
              Ensemble, nous faisons la différence
            </h2>
          </div>

          <div class="grid md:grid-cols-4 gap-8 mb-16">
            @for (stat of stats; track stat.label) {
              <div class="text-center group">
                <div class="text-5xl font-light text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                  {{ stat.value }}+
                </div>
                <div class="text-sm text-gray-400 uppercase tracking-wider">
                  {{ stat.label }}
                </div>
              </div>
            }
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            @for (impact of impacts; track impact.title) {
              <div class="bg-zinc-900 border border-white/10 p-8 hover:border-emerald-500/50 transition-all">
                <div class="text-4xl mb-4">{{ impact.icon }}</div>
                <h3 class="text-xl font-medium mb-3">{{ impact.title }}</h3>
                <p class="text-gray-400 text-sm leading-relaxed">{{ impact.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="py-20 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] text-gray-400 mb-4 uppercase">
              L'Équipe
            </p>
            <h2 class="text-4xl font-light mb-6">
              Qui sommes-nous ?
            </h2>
            <p class="text-gray-400 max-w-2xl mx-auto">
              Une équipe passionnée de développeurs, designers et community managers 
              dédiée à créer un impact positif au Cameroun.
            </p>
          </div>

          <div class="grid md:grid-cols-4 gap-8">
            @for (member of team; track member.name) {
              <div class="text-center group">
                <div class="w-24 h-24 bg-emerald-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {{ member.initials }}
                </div>
                <h3 class="text-lg font-medium mb-1">{{ member.name }}</h3>
                <p class="text-sm text-gray-400">{{ member.role }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 px-4 bg-emerald-500/10 border-y border-emerald-500/30">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-light mb-6">
            Rejoignez le mouvement
          </h2>
          <p class="text-xl text-gray-400 mb-12 font-light">
            Faites partie de la communauté qui change le Cameroun, 
            un partage à la fois.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              routerLink="/register"
              class="bg-emerald-500 text-black px-8 py-4 text-sm font-medium tracking-wide hover:bg-emerald-400 transition-all inline-block">
              CRÉER UN COMPTE
            </a>
            <a 
              routerLink="/resources"
              class="border border-white/30 px-8 py-4 text-sm font-medium tracking-wide hover:bg-white/10 transition-all inline-block">
              EXPLORER LES RESSOURCES
            </a>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-light mb-6">
            Une question ? Contactez-nous
          </h2>
          <p class="text-gray-400 mb-8">
            Notre équipe est là pour vous aider
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="mailto:contact@donlocal.cm"
              class="flex items-center justify-center space-x-2 bg-zinc-900 border border-white/10 px-6 py-4 hover:border-emerald-500 transition-all">
              <span>📧</span>
              <span class="text-sm">contact&#64;donlocal.cm</span>
            </a>
            <a 
              href="https://wa.me/237650000000"
              target="_blank"
              class="flex items-center justify-center space-x-2 bg-green-600 px-6 py-4 hover:bg-green-500 transition-all">
              <span>💬</span>
              <span class="text-sm">WhatsApp Support</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    .float-animation {
      animation: float 4s ease-in-out infinite;
    }
  `]
})
export class AboutComponent {
  values = [
    {
      icon: '🤝',
      title: 'Solidarité',
      description: 'Renforcer les liens entre voisins et communautés'
    },
    {
      icon: '♻️',
      title: 'Durabilité',
      description: 'Promouvoir l\'économie circulaire et le réemploi'
    },
    {
      icon: '🌱',
      title: 'Local',
      description: 'Favoriser les échanges au sein des quartiers'
    },
    {
      icon: '✨',
      title: 'Simplicité',
      description: 'Une plateforme accessible à tous'
    }
  ];

  steps = [
    {
      number: 1,
      icon: '📝',
      title: 'Créez votre compte',
      description: 'Inscription gratuite et rapide en quelques clics'
    },
    {
      number: 2,
      icon: '📢',
      title: 'Publiez vos annonces',
      description: 'Partagez ce que vous donnez, échangez ou proposez'
    },
    {
      number: 3,
      icon: '🤝',
      title: 'Connectez-vous',
      description: 'Échangez directement avec votre communauté locale'
    }
  ];

  stats = [
    { value: '250', label: 'Ressources' },
    { value: '1200', label: 'Utilisateurs' },
    { value: '5', label: 'Villes' },
    { value: '800', label: 'Échanges' }
  ];

  impacts = [
    {
      icon: '🌍',
      title: 'Impact environnemental',
      description: 'Réduction des déchets et promotion du réemploi pour un Cameroun plus vert'
    },
    {
      icon: '💚',
      title: 'Impact social',
      description: 'Renforcement des liens communautaires et entraide de proximité'
    },
    {
      icon: '💰',
      title: 'Impact économique',
      description: 'Économie circulaire locale et accès facilité aux ressources'
    }
  ];

  team = [
    { name: 'Marie K.', role: 'Fondatrice', initials: 'MK' },
    { name: 'Jean P.', role: 'Développeur', initials: 'JP' },
    { name: 'Sophie M.', role: 'Designer', initials: 'SM' },
    { name: 'Paul N.', role: 'Community Manager', initials: 'PN' }
  ];
}
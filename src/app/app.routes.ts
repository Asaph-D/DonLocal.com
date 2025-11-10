// ========================
// APP ROUTES - app.routes.ts
// ========================

import { Routes } from '@angular/router';

// Importation de tous les composants
import { HomeComponent } from './features/home/home.component';
import { ResourceListComponent } from './features/resources/resource-list/resource-list.component';
import { ResourceFormComponent } from './features/resources/resource-form/resource-form.component';
import { ResourceDetailComponent } from './features/resources/resource-detail/resource-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
  // Home
  {
    path: '',
    component: HomeComponent,
    title: 'DonLocal.cm - Partage Local au Cameroun'
  },

  // Resources
  {
    path: 'resources',
    children: [
      {
        path: '',
        component: ResourceListComponent,
        title: 'Explorer les ressources - DonLocal.cm'
      },
      {
        path: 'new',
        component: ResourceFormComponent,
        title: 'Publier une annonce - DonLocal.cm'
      },
      {
        path: ':id',
        component: ResourceDetailComponent,
        title: 'Détails de l\'annonce - DonLocal.cm'
      },
      {
        path: ':id/edit',
        component: ResourceFormComponent,
        title: 'Modifier l\'annonce - DonLocal.cm'
      }
    ]
  },

  // Authentication
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion - DonLocal.cm'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Créer un compte - DonLocal.cm'
  },

  // Profile
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Mon Profil - DonLocal.cm'
  },

  // About
  {
    path: 'about',
    component: AboutComponent,
    title: 'À propos - DonLocal.cm'
  },

  // Redirect old routes
  {
    path: 'my-resources',
    redirectTo: 'profile',
    pathMatch: 'full'
  },

  // 404 - Not Found
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

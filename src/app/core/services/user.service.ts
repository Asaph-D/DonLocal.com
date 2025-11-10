// ========================
// USER SERVICE - core/services/user.service.ts
// ========================

import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  // Public readonly signals
  getCurrentUser = this.currentUser.asReadonly();
  getAuthStatus = this.isAuthenticated.asReadonly();

  constructor() {
    // Charger l'utilisateur depuis le localStorage au démarrage
    this.loadUserFromStorage();
  }

  // Connexion utilisateur
  login(user: User): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    this.saveUserToStorage(user);
  }

  // Déconnexion
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.clearUserFromStorage();
  }

  // Mettre à jour le profil
  updateProfile(updates: Partial<User>): void {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, ...updates };
      this.currentUser.set(updated);
      this.saveUserToStorage(updated);
    }
  }

  // Récupérer les initiales d'un nom
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Sauvegarder dans localStorage
  private saveUserToStorage(user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('donlocal_user', JSON.stringify(user));
    }
  }

  // Charger depuis localStorage
  private loadUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('donlocal_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        } catch (error) {
          console.error('Erreur lors du chargement de l\'utilisateur:', error);
        }
      }
    }
  }

  // Effacer du localStorage
  private clearUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('donlocal_user');
    }
  }

  // Vérifier si l'utilisateur possède une ressource
  isResourceOwner(authorName: string): boolean {
    const user = this.currentUser();
    return user ? user.name === authorName : false;
  }
}
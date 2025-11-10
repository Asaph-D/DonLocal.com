// ========================
// LOCAL STORAGE SERVICE - core/services/local-storage.service.ts
// ========================

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private prefix = 'donlocal_';

  // Vérifier si localStorage est disponible
  private isAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  // Sauvegarder une valeur
  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage n\'est pas disponible');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  // Récupérer une valeur
  get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      return null;
    }
  }

  // Supprimer une valeur
  remove(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  // Effacer toutes les valeurs avec le préfixe
  clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      return false;
    }
  }

  // Vérifier si une clé existe
  has(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    return localStorage.getItem(this.prefix + key) !== null;
  }

  // Récupérer toutes les clés
  keys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }

    const allKeys = Object.keys(localStorage);
    return allKeys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }

  // Obtenir la taille utilisée (en octets)
  getSize(): number {
    if (!this.isAvailable()) {
      return 0;
    }

    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  }

  // Obtenir la taille formatée
  getFormattedSize(): string {
    const bytes = this.getSize();
    
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
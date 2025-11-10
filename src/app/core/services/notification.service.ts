// ========================
// NOTIFICATION SERVICE - core/services/notification.service.ts
// ========================

import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  // Public readonly signal
  getNotifications = this.notifications.asReadonly();

  // Durée par défaut (en ms)
  private defaultDuration = 5000;

  // Afficher une notification de succès
  success(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'success',
      message,
      duration: duration || this.defaultDuration
    });
  }

  // Afficher une notification d'erreur
  error(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'error',
      message,
      duration: duration || this.defaultDuration
    });
  }

  // Afficher une notification d'avertissement
  warning(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'warning',
      message,
      duration: duration || this.defaultDuration
    });
  }

  // Afficher une notification d'information
  info(message: string, duration?: number): void {
    this.show({
      id: this.generateId(),
      type: 'info',
      message,
      duration: duration || this.defaultDuration
    });
  }

  // Afficher une notification
  private show(notification: Notification): void {
    // Ajouter la notification
    this.notifications.update(notifs => [...notifs, notification]);

    // Supprimer automatiquement après la durée définie
    if (notification.duration) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }
  }

  // Supprimer une notification
  remove(id: string): void {
    this.notifications.update(notifs => 
      notifs.filter(notif => notif.id !== id)
    );
  }

  // Supprimer toutes les notifications
  clear(): void {
    this.notifications.set([]);
  }

  // Générer un ID unique
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obtenir la couleur selon le type
  getColor(type: Notification['type']): string {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[type];
  }

  // Obtenir l'icône selon le type
  getIcon(type: Notification['type']): string {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type];
  }
}
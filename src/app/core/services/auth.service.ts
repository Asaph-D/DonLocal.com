import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  getCurrentUser = this.currentUser.asReadonly();
  getAuthStatus = this.isAuthenticated.asReadonly();

  constructor() {
    this.loadUserFromToken();
  }

  // Register
  register(data: any) {
    return this.apiService.post<any>('/auth/register', data).pipe(
      map(response => {
        if (response.success) {
          this.setSession(response.data);
        }
        return response;
      })
    );
  }

  // Login
  login(credentials: { email: string; password: string }) {
    return this.apiService.post<any>('/auth/login', credentials).pipe(
      map(response => {
        if (response.success) {
          this.setSession(response.data);
        }
        return response;
      })
    );
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  // Get Current User
  getMe() {
    return this.apiService.get<any>('/auth/me').pipe(
      map(response => {
        if (response.success) {
          this.currentUser.set(response.data);
        }
        return response;
      })
    );
  }

  private setSession(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
    this.isAuthenticated.set(true);
  }

  private loadUserFromToken() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        this.currentUser.set(JSON.parse(user));
        this.isAuthenticated.set(true);
        
        // Refresh user data
        this.getMe().subscribe();
      } catch (error) {
        this.logout();
      }
    }
  }
}
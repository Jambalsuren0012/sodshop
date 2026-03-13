import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = `${environment.apiBase}/users/login`;

  // 🔹 Login function (1 удаа)
  async login(email: string, password: string) {
    const response = await fetch(`${environment.apiBase}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const user = data.data; // API structure

    localStorage.setItem('user', JSON.stringify(user));

    return user;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getUser() {
    const u = localStorage.getItem('user');

    if (!u || u === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(u);
    } catch {
      return null;
    }
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }
  async signup(name: string, email: string, password: string) {
    return fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
  }
}

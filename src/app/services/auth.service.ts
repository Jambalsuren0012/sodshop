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

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }
}

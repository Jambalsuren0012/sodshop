import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50"
    >
      <div class="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <div
            class="bg-black text-white font-bold text-xl px-4 py-2 rounded-lg"
          >
            TechStore
          </div>
        </div>

        <h2 class="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Welcome Back
        </h2>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="you@example.com"
              class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <label class="block text-gray-700 font-medium mb-2">Password</label>
            <input
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="********"
              class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <button
              type="button"
              (click)="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex justify-between items-center text-sm text-gray-600">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="accent-indigo-500" />
              Remember me
            </label>
            <a href="#" class="hover:underline">Forgot password?</a>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold text-lg"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <!-- Error -->
          <p *ngIf="error" class="text-red-500 text-center text-sm mt-2">
            {{ error }}
          </p>
        </form>

        <!-- Sign up -->
        <p class="text-center text-gray-500 mt-6">
          Don’t have an account?
          <a href="#" class="text-indigo-600 font-medium hover:underline"
            >Sign up</a
          >
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  async onSubmit() {
    this.loading = true;
    this.error = '';

    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (err) {
      this.error = 'Email эсвэл password буруу';
    }

    this.loading = false;
  }
}

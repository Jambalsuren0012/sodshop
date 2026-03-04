import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ← нэмсэн
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // ← CommonModule нэмсэн
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold text-center mb-6">Account Login</h2>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            placeholder="Email"
            class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            required
            placeholder="Password"
            class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
          />

          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <p *ngIf="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </p>
        </form>
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

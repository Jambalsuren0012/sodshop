import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-sky-50 to-white"
    >
      <div
        class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8"
      >
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img src="assets/imgs/logo.png" class="h-12" />
        </div>

        <!-- Title -->
        <h2 class="text-3xl font-bold text-center mb-6 text-slate-800">
          {{ isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх' }}
        </h2>

        <!-- Toggle -->
        <div class="flex justify-center mb-6">
          <div class="flex rounded-full bg-sky-50 p-1 border border-sky-100">
            <button
              type="button"
              (click)="isLogin ? null : toggle()"
              class="px-5 py-2 text-sm rounded-full"
              [class]="
                isLogin ? 'bg-white shadow text-slate-800' : 'text-gray-500'
              "
            >
              Нэвтрэх
            </button>

            <button
              type="button"
              (click)="!isLogin ? null : toggle()"
              class="px-5 py-2 text-sm rounded-full"
              [class]="
                !isLogin ? 'bg-sky-500 text-white shadow' : 'text-gray-500'
              "
            >
              Бүртгүүлэх
            </button>
          </div>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Name -->
          <div *ngIf="!isLogin">
            <label class="text-sm text-gray-600">Нэр</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              class="w-full mt-1 border border-sky-100 rounded-xl p-3 outline-none focus:border-sky-400"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="text-sm text-gray-600">Имэйл</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              class="w-full mt-1 border border-sky-100 rounded-xl p-3 outline-none focus:border-sky-400"
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <label class="text-sm text-gray-600">Нууц үг</label>

            <input
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              required
              class="w-full mt-1 border border-sky-100 rounded-xl p-3 outline-none focus:border-sky-400"
            />

            <button
              type="button"
              (click)="showPassword = !showPassword"
              class="absolute right-3 top-9 text-xs text-gray-500"
            >
              {{ showPassword ? 'Нуух' : 'Харах' }}
            </button>
          </div>

          <!-- Error -->
          <p *ngIf="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            type="submit"
            [disabled]="loading"
            class="w-full bg-sky-500 text-white py-3 rounded-xl hover:bg-sky-600 transition font-semibold"
          >
            {{
              loading ? 'Түр хүлээнэ үү...' : isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'
            }}
          </button>
        </form>

        <!-- Switch -->
        <p class="text-center text-gray-500 mt-6 text-sm">
          <span *ngIf="isLogin">
            Бүртгэлгүй юу?
            <button (click)="toggle()" class="text-sky-600 font-semibold">
              Бүртгүүлэх
            </button>
          </span>

          <span *ngIf="!isLogin">
            Аль хэдийн бүртгэлтэй юу?
            <button (click)="toggle()" class="text-sky-600 font-semibold">
              Нэвтрэх
            </button>
          </span>
        </p>
      </div>
    </div>
  `,
})
export class AuthComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLogin = true;

  name = '';
  email = '';
  password = '';

  loading = false;
  error = '';
  showPassword = false;

  toggle() {
    this.isLogin = !this.isLogin;
    this.error = '';
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';

    try {
      if (this.isLogin) {
        await this.auth.login(this.email, this.password);
      } else {
        await this.auth.signup(this.name, this.email, this.password);
      }

      this.router.navigate(['/']);
    } catch (err) {
      this.error = 'Имэйл эсвэл нууц үг буруу байна';
    }

    this.loading = false;
  }
}

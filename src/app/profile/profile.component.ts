import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../../type';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-5xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold mb-8">Миний мэдээлэл</h1>

      <div *ngIf="user()" class="grid md:grid-cols-3 gap-8">
        <!-- Left menu -->
        <div class="bg-white rounded-xl shadow p-6 h-fit">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl"
            >
              {{ user()?.fname?.[0] }}
            </div>
            <div>
              <p class="font-semibold">
                {{ user()?.fname }} {{ user()?.lname }}
              </p>
              <p class="text-sm text-gray-500">{{ user()?.email }}</p>
            </div>
          </div>

          <button
            (click)="logout()"
            class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            Гарах
          </button>
        </div>

        <!-- Profile info -->
        <div class="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-semibold mb-6">Хувийн мэдээлэл</h2>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm text-gray-500">Нэр</label>
              <p class="font-medium">{{ user()?.fname }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-500">Овог</label>
              <p class="font-medium">{{ user()?.lname }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-500">Имэйл</label>
              <p class="font-medium">{{ user()?.email }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-500">Утас</label>
              <p class="font-medium">{{ user()?.phone }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-500">Role</label>
              <p class="font-medium">{{ user()?.role }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-500">Бүртгүүлсэн огноо</label>
              <p class="font-medium">{{ user()?.created_at }}</p>
            </div>
          </div>

          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Хаяг</h3>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <p>
                <span class="text-gray-500">Хот:</span>
                {{ user()?.address?.city }}
              </p>
              <p>
                <span class="text-gray-500">Дүүрэг:</span>
                {{ user()?.address?.district }}
              </p>
              <p>
                <span class="text-gray-500">Хороо:</span>
                {{ user()?.address?.khoroo }}
              </p>
              <p>
                <span class="text-gray-500">Тайлбар:</span>
                {{ user()?.address?.detail }}
              </p>
              <p>
                <span class="text-gray-500">Label:</span>
                {{ user()?.address?.label }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  user = signal<User | null>(null);

  ngOnInit() {
    const u = this.auth.getUser();
    console.log('Profile user:', u); // 🔹 localStorage-с авсан user-ийг шалгах
    if (!u) {
      window.location.href = '/login';
    } else {
      this.user.set(u);
    }
  }

  logout() {
    this.auth.logout();
    window.location.href = '/';
  }
}

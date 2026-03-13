import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faHeart,
  faCartShopping,
  faCircleQuestion,
  faGift,
  faLocationDot,
  faRightFromBracket,
  faChevronRight,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { User } from '../../type';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <section class="bg-[#f7f7f7] min-h-screen py-8 md:py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <a href="/" class="hover:text-[#1d2240] transition">Нүүр хуудас</a>
          <fa-icon [icon]="faChevronRight" class="text-[10px]"></fa-icon>
          <span class="text-[#1d2240]">Хувийн мэдээлэл</span>
        </div>

        <div
          *ngIf="user()"
          class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10"
        >
          <!-- LEFT SIDEBAR -->
          <aside>
            <div class="pb-6 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center font-semibold text-sm"
                >
                  {{ getInitials() }}
                </div>

                <div>
                  <p class="text-[#1d2240] font-semibold leading-none">
                    {{ user()?.fname }}.{{ user()?.lname }}
                  </p>
                  <p class="text-sm text-gray-400 mt-1">0 оноо</p>
                </div>
              </div>
            </div>

            <nav class="mt-6 space-y-1">
              <a
                href="javascript:void(0)"
                class="flex items-center gap-3 px-4 py-3 rounded-full bg-[#eceef5] text-[#1d2240] font-medium"
              >
                <fa-icon
                  [icon]="faUser"
                  class="text-[15px] text-[#1d2240]"
                ></fa-icon>
                <span>Хувийн мэдээлэл</span>
              </a>

              <a
                href="javascript:void(0)"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-[#1d2240] hover:bg-white transition"
              >
                <fa-icon
                  [icon]="faHeart"
                  class="text-[15px] text-gray-500"
                ></fa-icon>
                <span>Хадгалсан бараа</span>
              </a>

              <a
                href="javascript:void(0)"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-[#1d2240] hover:bg-white transition"
              >
                <fa-icon
                  [icon]="faCartShopping"
                  class="text-[15px] text-gray-500"
                ></fa-icon>
                <span>Миний захиалга</span>
              </a>

              <a
                href="javascript:void(0)"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-[#1d2240] hover:bg-white transition"
              >
                <fa-icon
                  [icon]="faCircleQuestion"
                  class="text-[15px] text-gray-500"
                ></fa-icon>
                <span>Тусламж</span>
              </a>

              <a
                href="javascript:void(0)"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-[#1d2240] hover:bg-white transition"
              >
                <fa-icon
                  [icon]="faGift"
                  class="text-[15px] text-gray-500"
                ></fa-icon>
                <span>Бэлгийн карт</span>
              </a>

              <a
                href="javascript:void(0)"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-[#1d2240] hover:bg-white transition"
              >
                <fa-icon
                  [icon]="faLocationDot"
                  class="text-[15px] text-gray-500"
                ></fa-icon>
                <span>Хүргэлтийн хаяг</span>
              </a>

              <button
                type="button"
                (click)="logout()"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-full text-left text-[#1d2240] hover:bg-white transition"
              >
                <fa-icon
                  [icon]="faRightFromBracket"
                  class="text-[15px] text-gray-500"
                ></fa-icon>
                <span>Гарах</span>
              </button>
            </nav>
          </aside>

          <!-- RIGHT CONTENT -->
          <div>
            <h1
              class="text-3xl md:text-5xl font-extrabold italic text-[#1d2240] mb-8"
            >
              Хувийн мэдээлэл
            </h1>

            <form class="space-y-10">
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-6">
                <!-- Овог -->
                <div>
                  <label class="block text-sm text-[#1d2240] mb-3">
                    Овог<span class="text-sky-500">*</span>
                  </label>
                  <input
                    type="text"
                    [value]="user()?.lname || ''"
                    class="w-full h-14 rounded-full border border-gray-300 bg-white px-5 outline-none focus:border-sky-400"
                  />
                </div>

                <!-- Утас -->
                <div class="flex items-end gap-3">
                  <div class="flex-1">
                    <label class="block text-sm text-[#1d2240] mb-3">
                      Утасны дугаар<span class="text-sky-500">*</span>
                    </label>
                    <input
                      type="text"
                      [value]="user()?.phone || ''"
                      class="w-full h-14 rounded-full border border-gray-300 bg-white px-5 outline-none focus:border-sky-400"
                    />
                  </div>

                  <button
                    type="button"
                    class="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 mb-1"
                  >
                    <fa-icon [icon]="faCheck"></fa-icon>
                  </button>
                </div>

                <!-- Нэр -->
                <div>
                  <label class="block text-sm text-[#1d2240] mb-3">
                    Нэр<span class="text-sky-500">*</span>
                  </label>
                  <input
                    type="text"
                    [value]="user()?.fname || ''"
                    class="w-full h-14 rounded-full border border-gray-300 bg-white px-5 outline-none focus:border-sky-400"
                  />
                </div>

                <!-- Имэйл -->
                <div>
                  <label class="block text-sm text-[#1d2240] mb-3">
                    Имэйл<span class="text-sky-500">*</span>
                  </label>
                  <input
                    type="email"
                    [value]="user()?.email || ''"
                    class="w-full h-14 rounded-full border border-gray-300 bg-white px-5 outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <button
                  type="button"
                  class="h-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold transition"
                >
                  Хадгалах
                </button>

                <div class="text-center">
                  <a
                    href="javascript:void(0)"
                    class="text-[#1d2240] font-medium hover:text-sky-500 transition"
                  >
                    Нууц үг солих
                  </a>
                </div>
              </div>
            </form>

            <!-- EXTRA INFO -->
            <div class="mt-12 bg-white rounded-2xl p-6 border border-gray-200">
              <h2 class="text-xl font-semibold text-[#1d2240] mb-5">
                Нэмэлт мэдээлэл
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="rounded-xl bg-gray-50 p-4">
                  <p class="text-gray-500 mb-1">Role</p>
                  <p class="font-medium text-[#1d2240]">
                    {{ user()?.role || '-' }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 p-4">
                  <p class="text-gray-500 mb-1">Бүртгүүлсэн огноо</p>
                  <p class="font-medium text-[#1d2240]">
                    {{ user()?.created_at || '-' }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 p-4">
                  <p class="text-gray-500 mb-1">Хот</p>
                  <p class="font-medium text-[#1d2240]">
                    {{ user()?.address?.city || '-' }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 p-4">
                  <p class="text-gray-500 mb-1">Дүүрэг</p>
                  <p class="font-medium text-[#1d2240]">
                    {{ user()?.address?.district || '-' }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 p-4">
                  <p class="text-gray-500 mb-1">Хороо</p>
                  <p class="font-medium text-[#1d2240]">
                    {{ user()?.address?.khoroo || '-' }}
                  </p>
                </div>

                <div class="rounded-xl bg-gray-50 p-4">
                  <p class="text-gray-500 mb-1">Дэлгэрэнгүй хаяг</p>
                  <p class="font-medium text-[#1d2240]">
                    {{ user()?.address?.detail || '-' }}
                  </p>
                </div>
              </div>
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

  faUser = faUser;
  faHeart = faHeart;
  faCartShopping = faCartShopping;
  faCircleQuestion = faCircleQuestion;
  faGift = faGift;
  faLocationDot = faLocationDot;
  faRightFromBracket = faRightFromBracket;
  faChevronRight = faChevronRight;
  faCheck = faCheck;

  async ngOnInit() {
    const loginUser = this.auth.getUser();

    if (!loginUser) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await fetch('https://sodtech.mn/admin/api/users');
      const data = await res.json();

      const currentUser = data.data.find(
        (u: User) => u.email === loginUser.email,
      );

      this.user.set(currentUser || loginUser);
    } catch (error) {
      this.user.set(loginUser);
    }
  }

  getInitials(): string {
    const u = this.user();
    if (!u) return 'U';

    const first = u.fname?.charAt(0) || '';
    const last = u.lname?.charAt(0) || '';

    return (first + last).toUpperCase();
  }

  logout() {
    this.auth.logout();
    window.location.href = '/';
  }
}

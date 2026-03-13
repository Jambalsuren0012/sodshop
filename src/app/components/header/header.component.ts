import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faHeart,
  faUser,
  faSearch,
  faBox,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../../type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header
      class="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200"
    >
      <!-- MOBILE HEADER -->
      <div class="block lg:hidden">
        <div class="h-20 px-4 flex items-center justify-between">
          <!-- LOGO -->
          <a routerLink="/" class="flex items-center shrink-0">
            <img
              src="assets/imgs/logo.png"
              alt="SODTECH"
              class="h-10 object-contain"
            />
          </a>

          <!-- RIGHT ICON -->
          <a
            routerLink="/shopping-cart"
            class="relative inline-flex items-center justify-center w-10 h-10 text-slate-700"
          >
            <fa-icon [icon]="faCartShopping" class="text-lg"></fa-icon>

            <span
              *ngIf="cartItemStock() > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold"
            >
              {{ cartItemStock() }}
            </span>
          </a>
        </div>
      </div>

      <!-- DESKTOP / TABLET HEADER -->
      <div class="hidden lg:block">
        <!-- TOP BAR -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between gap-4 h-20">
            <!-- LOGO -->
            <a routerLink="/" class="flex items-center gap-3 shrink-0 group">
              <div
                class="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition"
              >
                <img
                  src="assets/imgs/logo.png"
                  alt="SODTECH"
                  class="h-8 w-8 object-contain"
                />
              </div>

              <div class="leading-tight">
                <h1
                  class="text-lg sm:text-xl font-black tracking-[0.16em] text-slate-900"
                >
                  SODTECH
                </h1>
                <p class="text-[11px] sm:text-xs text-sky-600 font-medium">
                  Tech Store
                </p>
              </div>
            </a>

            <!-- SEARCH -->
            <div class="flex-1 hidden lg:flex justify-center min-w-0">
              <div class="relative w-full max-w-2xl">
                <input
                  type="text"
                  placeholder="Бүтээгдэхүүн хайх..."
                  class="w-full h-12 rounded-full border border-sky-100 bg-sky-50/70 pl-12 pr-5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />

                <fa-icon
                  [icon]="faSearch"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
                ></fa-icon>
              </div>
            </div>

            <!-- RIGHT ICONS -->
            <div class="flex items-center gap-2 sm:gap-3 relative shrink-0">
              <a
                routerLink="/favorite-items"
                class="relative inline-flex items-center justify-center w-11 h-11 rounded-full border border-sky-100 bg-white/80 text-slate-700 hover:text-sky-700 hover:border-sky-200 hover:bg-sky-50 transition shadow-sm"
              >
                <fa-icon [icon]="faHeart"></fa-icon>
              </a>

              <a
                routerLink="/shopping-cart"
                class="relative inline-flex items-center justify-center w-11 h-11 rounded-full border border-sky-100 bg-white/80 text-slate-700 hover:text-sky-700 hover:border-sky-200 hover:bg-sky-50 transition shadow-sm"
              >
                <fa-icon [icon]="faCartShopping"></fa-icon>

                <span
                  *ngIf="cartItemStock() > 0"
                  class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-sky-500 text-white text-[10px] font-bold shadow"
                >
                  {{ cartItemStock() }}
                </span>
              </a>

              <!-- USER DROPDOWN -->
              <div class="relative">
                <button
                  (click)="toggleUserMenu()"
                  class="inline-flex items-center justify-center w-11 h-11 rounded-full border border-sky-100 bg-white/80 text-slate-700 hover:text-sky-700 hover:border-sky-200 hover:bg-sky-50 transition shadow-sm"
                >
                  <fa-icon [icon]="faUser"></fa-icon>
                </button>

                <div
                  *ngIf="userMenuOpen()"
                  class="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-sky-100 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,132,199,0.12)] z-50"
                >
                  <ng-container *ngIf="isLoggedIn(); else loginBtn">
                    <div class="px-5 py-4 bg-sky-50/70 border-b border-sky-100">
                      <p class="text-sm font-bold text-slate-800">
                        {{ user()?.fname }}
                      </p>
                      <p class="text-xs text-slate-500 mt-1">
                        {{ user()?.email }}
                      </p>
                    </div>

                    <div class="p-2 text-sm">
                      <a
                        routerLink="/profile"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        <fa-icon
                          [icon]="faUserIcon"
                          class="text-sky-500 w-4"
                        ></fa-icon>
                        <span>Хувийн мэдээлэл</span>
                      </a>

                      <a
                        routerLink="/wishlist"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        <fa-icon
                          [icon]="faHeartIcon"
                          class="text-sky-500 w-4"
                        ></fa-icon>
                        <span>Хадгалсан бараа</span>
                      </a>

                      <a
                        routerLink="/orders"
                        class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        <fa-icon
                          [icon]="faBoxIcon"
                          class="text-sky-500 w-4"
                        ></fa-icon>
                        <span>Миний захиалга</span>
                      </a>

                      <div class="my-2 border-t border-sky-100"></div>

                      <button
                        (click)="logout()"
                        class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
                      >
                        <fa-icon [icon]="faLogoutIcon" class="w-4"></fa-icon>
                        <span>Гарах</span>
                      </button>
                    </div>
                  </ng-container>

                  <ng-template #loginBtn>
                    <div class="p-2">
                      <a
                        routerLink="/login"
                        class="flex items-center justify-center px-4 py-3 rounded-2xl bg-sky-500 text-white font-medium hover:bg-sky-600 transition"
                      >
                        Нэвтрэх
                      </a>
                    </div>
                  </ng-template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CATEGORY BAR -->
        <div class="border-t border-sky-100/80 bg-white/55 backdrop-blur-xl">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              class="flex items-center gap-3 sm:gap-4 h-14 overflow-x-auto scrollbar-hide whitespace-nowrap"
            >
              <a
                routerLink="/"
                routerLinkActive="bg-sky-500 text-white border-sky-500 shadow-sm"
                [routerLinkActiveOptions]="{ exact: true }"
                class="inline-flex items-center justify-center h-9 px-4 rounded-full border border-sky-100 bg-white text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
              >
                Бүгд
              </a>

              <div class="relative" *ngFor="let cat of parentCategories">
                <a
                  [routerLink]="['/category', cat.id]"
                  routerLinkActive="bg-sky-500 text-white border-sky-500 shadow-sm"
                  class="inline-flex items-center justify-center h-9 px-4 rounded-full border border-sky-100 bg-white text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                >
                  {{ cat.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .category {
        position: relative;
        padding: 8px 2px;
        color: #555;
        font-weight: 500;
        transition: 0.25s;
      }

      .category:hover {
        color: #38bdf8;
      }

      .category::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0%;
        height: 2px;
        background: #38bdf8;
        transition: 0.25s;
      }

      .category:hover::after {
        width: 100%;
      }

      .active {
        color: #38bdf8 !important;
      }

      .active::after {
        width: 100%;
      }

      .icon-btn {
        font-size: 18px;
        color: #444;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        transition: 0.2s;
      }

      .icon-btn:hover {
        background: #f3f4f6;
        color: #38bdf8;
        transform: translateY(-1px);
      }

      .dropdown-item {
        display: block;
        padding: 8px 16px;
        transition: 0.2s;
      }

      .dropdown-item:hover {
        background: #f3f4f6;
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  private shoppingCartService = inject(ShoppingCartLocalStorageService);
  private auth = inject(AuthService);
  private categoriesService = inject(CategoriesService);

  faCartShopping = faCartShopping;
  faHeart = faHeart;
  faUser = faUser;
  faSearch = faSearch;
  faUserIcon = faUser;
  faHeartIcon = faHeart;
  faBoxIcon = faBox;
  faLogoutIcon = faRightFromBracket;

  cartItemStock = computed(() => this.shoppingCartService.cartItemQuantity());

  parentCategories: Category[] = [];

  userMenuOpen = signal(false);

  ngOnInit() {
    this.categoriesService.getParentCategories().subscribe({
      next: (res) => (this.parentCategories = res),
      error: (err) => console.error(err),
    });
  }

  toggleUserMenu() {
    this.userMenuOpen.update((v) => !v);
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  user() {
    return this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    location.reload();
  }
}

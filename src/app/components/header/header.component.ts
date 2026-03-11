import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faHeart,
  faUser,
  faSearch,
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
      class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <!-- TOP BAR -->
      <div>
        <div
          class="max-w-7xl mx-auto flex items-center justify-between h-16 px-6"
        >
          <!-- LOGO -->
          <a routerLink="/" class="flex items-center gap-2 font-bold text-xl">
            <img src="assets/imgs/logo.png" class="h-10" /> SODTECH
          </a>

          <!-- SEARCH -->
          <div class="flex-1 hidden lg:block">
            <div class="relative w-full max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Бүтээгдэхүүн хайх..."
                class="w-full bg-gray-100 border border-transparent rounded-full py-2.5 pl-11 pr-4
                focus:bg-white focus:border-sky-400 focus:outline-none transition"
              />

              <fa-icon
                [icon]="faSearch"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              ></fa-icon>
            </div>
          </div>

          <!-- RIGHT ICONS -->
          <div class="flex items-center gap-3 relative">
            <a routerLink="/favorite-items" class="icon-btn">
              <fa-icon [icon]="faHeart"></fa-icon>
            </a>

            <a routerLink="/shopping-cart" class="relative icon-btn">
              <fa-icon [icon]="faCartShopping"></fa-icon>
              <span
                *ngIf="cartItemStock() > 0"
                class="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] rounded-full px-1.5 py-[1px] shadow"
              >
                {{ cartItemStock() }}
              </span>
            </a>

            <!-- USER DROPDOWN -->
            <div class="relative">
              <button (click)="toggleUserMenu()" class="icon-btn">
                <fa-icon [icon]="faUser"></fa-icon>
              </button>

              <div
                *ngIf="userMenuOpen()"
                class="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                <ng-container *ngIf="isLoggedIn(); else loginBtn">
                  <div class="px-4 py-3 border-b bg-gray-50">
                    <p class="text-sm font-semibold">{{ user()?.fname }}</p>
                    <p class="text-xs text-gray-500">{{ user()?.email }}</p>
                  </div>

                  <div class="py-2 text-sm">
                    <a routerLink="/profile" class="dropdown-item"
                      >👤 Хувийн мэдээлэл</a
                    >

                    <a routerLink="/wishlist" class="dropdown-item"
                      >❤️ Хадгалсан бараа</a
                    >

                    <a routerLink="/orders" class="dropdown-item"
                      >📦 Миний захиалга</a
                    >

                    <div class="border-t my-2"></div>

                    <button
                      (click)="logout()"
                      class="dropdown-item text-red-500 hover:bg-red-50"
                    >
                      🚪 Гарах
                    </button>
                  </div>
                </ng-container>

                <ng-template #loginBtn>
                  <a routerLink="/login" class="dropdown-item"> Нэвтрэх </a>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CATEGORY BAR -->
      <div class="bg-white/70 backdrop-blur border-t border-gray-100">
        <div
          class="max-w-7xl mx-auto flex items-center justify-center h-12 px-6 gap-8 text-sm"
        >
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="category"
          >
            Бүгд
          </a>

          <div class="relative group" *ngFor="let cat of parentCategories">
            <a
              [routerLink]="['/category', cat.id]"
              routerLinkActive="active"
              class="category"
            >
              {{ cat.name }}
            </a>
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

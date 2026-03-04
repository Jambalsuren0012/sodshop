import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faHamburger,
  faHeart,
  faShoppingBag,
  faHeartCircleBolt,
  faHeartCircleExclamation,
  faUser,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="fixed top-0 w-full z-50 shadow-sm">
      <!-- 🔵 TOP ROW -->
      <div class="bg-base-100 border-b border-base-300">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 text-xl font-bold">
            <img
              src="assets/imgs/logo.png"
              alt="Sodtech Logo"
              class="h-12 w-auto"
            />
            <span>Sodtech</span>
          </a>

          <!-- Search -->
          <div class="flex-1 hidden lg:flex">
            <div class="relative w-full max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Бүтээгдэхүүн хайх..."
                class="w-full pl-5 pr-4 py-2 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <!-- Right Icons / Auth -->
          <div class="flex items-center gap-4 ml-auto">
            <a routerLink="/favorite-items" class="icon-btn">
              <fa-icon [icon]="faHeartCircleBolt"></fa-icon>
            </a>

            <a routerLink="/shopping-cart" class="icon-btn relative">
              <fa-icon [icon]="faCartShopping"></fa-icon>

              <span
                *ngIf="cartItemQuantity() > 0"
                class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5"
              >
                {{ cartItemQuantity() }}
              </span>
            </a>

            <!-- Auth Buttons -->
            <ng-container *ngIf="isLoggedIn(); else loginLink">
              <span class="ml-2 font-medium">{{ user()?.fname }}</span>
              <button
                (click)="logout()"
                class="ml-2 text-sm text-red-500 hover:underline flex items-center gap-1"
              >
                <fa-icon [icon]="faHeartCircleExclamation"></fa-icon> Logout
              </button>
            </ng-container>

            <ng-template #loginLink>
              <a
                routerLink="/login"
                class="text-sm font-medium flex items-center gap-1"
              >
                <fa-icon [icon]="faUser"></fa-icon> Login
              </a>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- 🟠 CATEGORY ROW -->
      <div class="bg-white border-t border-b border-gray-200">
        <div
          class="max-w-7xl mx-auto px-6 h-12 flex items-center gap-8 text-sm font-medium"
        >
          <a
            routerLink="/"
            routerLinkActive="active-category"
            [routerLinkActiveOptions]="{ exact: true }"
            class="category-link"
            >Бүгд</a
          >
          <a
            routerLink="/electronics"
            routerLinkActive="active-category"
            class="category-link"
            >Electronics</a
          >
          <a
            routerLink="/men-clothing"
            routerLinkActive="active-category"
            class="category-link"
            >Men</a
          >
          <a
            routerLink="/women-clothing"
            routerLinkActive="active-category"
            class="category-link"
            >Women</a
          >
          <a
            routerLink="/jewelry"
            routerLinkActive="active-category"
            class="category-link"
            >Jewelry</a
          >
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .category-link {
        position: relative;
        padding: 0.5rem 0;
        color: #4b5563;
        transition: all 0.2s ease;
      }
      .category-link:hover {
        color: #111827;
      }
      .category-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -6px;
        width: 0%;
        height: 2px;
        background: #f97316;
        transition: width 0.25s ease;
      }
      .category-link:hover::after {
        width: 100%;
      }
      .active-category {
        color: #f97316 !important;
      }
      .active-category::after {
        width: 100% !important;
      }
    `,
  ],
})
export class HeaderComponent {
  private shoppingCartService = inject(ShoppingCartLocalStorageService);
  private auth = inject(AuthService);

  faCartShopping = faCartShopping;
  faHeart = faHeart;
  faUser = faUser;
  faHeartCircleBolt = faHeartCircleBolt;
  faHeartCircleExclamation = faHeartCircleExclamation;

  cartItemQuantity = computed(() =>
    this.shoppingCartService.cartItemQuantity(),
  );

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  user() {
    return this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    location.reload(); // page refresh to update header
  }
}

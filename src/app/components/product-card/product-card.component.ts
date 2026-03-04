import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../type';
import {
  faEye,
  faHeart,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { Router } from '@angular/router';
import { FavoriteItemsLocalStorageService } from '../../services/favorite-items-local-storage.service';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  imports: [FontAwesomeModule, CommonModule],
  template: `
    <div
      class="relative bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 p-4"
    >
      <!-- Favorite icon -->
      <button
        (click)="toggleFavoriteItem()"
        class="absolute top-3 right-3 transition text-xl"
      >
        <fa-icon
          [icon]="
            checkFavoriteItemAlreadyExist() ? faHeartSolid : faHeartRegular
          "
          [class.text-red-500]="checkFavoriteItemAlreadyExist()"
          [class.text-gray-400]="!checkFavoriteItemAlreadyExist()"
          class="transition duration-200"
        >
        </fa-icon>
      </button>

      <!-- Product Image -->
      <div class="flex justify-center items-center h-[220px] mb-4">
        <img
          [src]="imageUrl() || 'assets/imgs/no-image.png'"
          class="max-h-full object-contain"
        />
      </div>

      <!-- Rating + Badge -->
      <div class="flex items-center justify-between mb-2 text-sm">
        <div class="flex items-center gap-1 text-yellow-500">
          ⭐ <span class="text-gray-700 font-medium">5.0</span>
        </div>

        <span class="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs">
          Шинэ | Үлдэгдэл: 5ш
        </span>
      </div>

      <!-- Title -->
      <h3 class="font-semibold text-gray-800 line-clamp-2 h-[48px]">
        {{ product()?.title }}
      </h3>

      <!-- Price -->
      <div class="mt-2 text-2xl font-bold text-black">
        {{ product()?.price | number }}₮
      </div>

      <!-- Shipping -->
      <div class="text-sm text-gray-500 mt-1">Хүргэлт үнэгүй</div>

      <!-- Bottom Actions -->
      <div class="mt-4 flex items-center justify-between">
        <button
          class="text-sm text-gray-500 hover:text-black"
          (click)="onClickNavigate()"
        >
          Харах
        </button>

        <button
          [disabled]="checkItemAlreadyExist()"
          (click)="addItem()"
          class="bg-sky-400 hover:bg-sky- text-white px-4 py-2 rounded-full text-sm font-medium transition disabled:bg-gray-300"
        >
          <svg
            class="h-6 w-6 inline-block mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
          Сагслах
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService,
  );
  private readonly favoriteItemsLocalStorageService = inject(
    FavoriteItemsLocalStorageService,
  );
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  faHeart = faHeart;
  faEye = faEye;
  faCartShopping = faCartShopping;
  faHeartSolid = faHeartSolid;
  faHeartRegular = faHeartRegular;
  product = input<Product>();

  cartItems = computed(() => this.shoppingCartLocalStorageService.cartItems());

  addItem() {
    this.shoppingCartLocalStorageService.addItem({
      ...this?.product()!,
      quantity: 1, // Add default quantity
    });
  }

  checkItemAlreadyExist() {
    return this.shoppingCartLocalStorageService.checkItemAlreadyExist(
      this.product()?.id!,
    );
  }

  checkFavoriteItemAlreadyExist() {
    return this.favoriteItemsLocalStorageService.checkItemAlreadyExist(
      this.product()?.id!,
    );
  }

  toggleFavoriteItem() {
    if (this.checkFavoriteItemAlreadyExist()) {
      this.favoriteItemsLocalStorageService.removeItem(this.product()!);
    } else {
      this.favoriteItemsLocalStorageService.addItem(this.product()!);
    }
  }

  onClickNavigate() {
    this.router.navigate(['/products', this.product()?.id]);
  }
  imageUrl = computed(() =>
    this.product()?.image
      ? this.productService.getImageUrl(this.product()!.image)
      : '',
  );
}

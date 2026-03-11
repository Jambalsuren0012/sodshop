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
      <div
        class="flex justify-center items-center h-[220px] mb-4"
        (click)="onClickNavigate()"
      >
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
          Үлдэгдэл: {{ product()?.stock }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="font-semibold text-gray-800 line-clamp-2 h-[48px]">
        {{ product()?.name }}
      </h3>

      <!-- PRICE -->

      <div class="mt-2">
        <!-- Discount price -->
        <div
          *ngIf="product()?.discount_price; else normalPrice"
          class="flex items-center gap-3"
        >
          <span class="text-2xl font-bold text-sky-900">
            {{ product()?.discount_price | number }}₮
          </span>

          <span class="text-gray-400 line-through">
            {{ product()?.price | number }}₮
          </span>
        </div>

        <!-- Normal price -->
        <ng-template #normalPrice>
          <span class="text-2xl font-bold text-black">
            {{ product()?.price | number }}₮
          </span>
        </ng-template>
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
          class="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium transition disabled:bg-gray-300"
        >
          Сагслах
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  product = input<Product>();

  faHeartSolid = faHeartSolid;
  faHeartRegular = faHeartRegular;

  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService,
  );
  private readonly favoriteItemsLocalStorageService = inject(
    FavoriteItemsLocalStorageService,
  );
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  cartItems = computed(() => this.shoppingCartLocalStorageService.cartItems());

  addItem() {
    if (!this.product()) return;
    this.shoppingCartLocalStorageService.addItem({
      ...this.product()!,
      stock: 1,
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
    if (!this.product()) return;
    if (this.checkFavoriteItemAlreadyExist()) {
      this.favoriteItemsLocalStorageService.removeItem(this.product()!);
    } else {
      this.favoriteItemsLocalStorageService.addItem(this.product()!);
    }
  }

  onClickNavigate() {
    if (!this.product()) return;
    this.router.navigate(['/products', this.product()?.id]);
  }

  imageUrl = computed(() => {
    const img = this.product()?.images?.main;
    return img ? this.productService.getImageUrl(img) : '';
  });
}

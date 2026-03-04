import { Component, inject, input, computed } from '@angular/core';
import { Product } from '../../../type';
import { faMinus, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-shopping-cart-item',
  imports: [FontAwesomeModule],
  template: `
    <div class="flex items-start justify-start gap-x-4">
      <figure>
        <img
          class="h-[130px] w-[140px] object-fill"
          [src]="imageUrl() || 'assets/imgs/no-image.png'"
          alt="Shoes"
        />
      </figure>
      <div class="w-full">
        <div class="space-y-1">
          <p class="font-bold">{{ item()?.name }}</p>
          <p class="font-bold text-lg mt-auto">$ {{ item()?.price }}</p>
        </div>
        <div class="mt-3 flex items-center justify-between gap-x-4">
          <div class="flex items-center gap-x-2">
            <button
              (click)="decrementItemQuantity()"
              class="btn btn-soft btn-sm"
            >
              <fa-icon [icon]="faMinus"></fa-icon>
            </button>
            <span>{{ item()?.stock }}</span>
            <button
              (click)="incrementItemQuantity()"
              class="btn btn-soft btn-sm"
            >
              <fa-icon [icon]="faPlus"></fa-icon>
            </button>
          </div>
          <button
            (click)="removeItemQuantity()"
            class="btn btn-soft btn-error btn-sm"
          >
            <fa-icon [icon]="faTrashCan"></fa-icon>
          </button>
        </div>
      </div>
    </div>
    <!-- <div class="flex justify-end mb-4">
      <button (click)="clearCart()" class="btn btn-warning">Clear Cart</button>
    </div> -->
  `,
  styles: ``,
})
export class ShoppingCartItemComponent {
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService,
  );
  private readonly productService = inject(ProductService);

  faPlus = faPlus;
  faMinus = faMinus;
  faTrashCan = faTrashCan;

  item = input<Product>();

  incrementItemQuantity() {
    this.shoppingCartLocalStorageService.updateItem({
      ...this?.item()!,
      status: this.item()?.stock! + 1,
    });
  }

  decrementItemQuantity() {
    // Remove item when quantity equal to 0
    if (this.item()?.stock! <= 1) {
      this.shoppingCartLocalStorageService.removeItem(this.item()!);
    } else {
      this.shoppingCartLocalStorageService.updateItem({
        ...this?.item()!,
        stock: this.item()?.stock! - 1,
      });
    }
  }
  // ShoppingCartComponent.ts
  clearCart() {
    const confirmed = confirm('Are you sure you want to clear the cart?');
    if (confirmed) {
      this.shoppingCartLocalStorageService.clearCart();
    }
  }
  removeItemQuantity() {
    this.shoppingCartLocalStorageService.removeItem(this.item()!);
  }
  imageUrl = computed(() => {
    const img = this.item()?.images?.main;
    return img ? this.productService.getImageUrl(img) : '';
  });
}

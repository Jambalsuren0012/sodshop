import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../type';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faChevronLeft,
  faChevronRight,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { Meta, Title } from '@angular/platform-browser';
import { FavoriteItemsLocalStorageService } from '../../services/favorite-items-local-storage.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ProductCardComponent,
    ProductCardSkeletonComponent,
    FooterComponent,
  ],
  template: `
    <div class="min-h-full">
      <div class="mx-auto pt-24 pb-10 px-6 max-w-7xl">
        <!-- FAVORITE + NAV -->
        <div
          class="border-y border-y-base-300 flex gap-x-2 justify-end py-2 mb-8"
        >
          <button
            (click)="toggleFavoriteItem()"
            [ngClass]="
              checkFavoriteItemAlreadyExist()
                ? 'btn btn-soft btn-primary btn-md'
                : 'btn btn-soft btn-md'
            "
          >
            <fa-icon [icon]="faHeart"></fa-icon>
          </button>

          <div class="flex items-center gap-x-2">
            <button
              [disabled]="isFirstItem()"
              (click)="handlePrevNavigation()"
              class="btn btn-ghost btn-md"
            >
              <fa-icon [icon]="faChevronLeft"></fa-icon>
            </button>
            <button
              [disabled]="isLastItem()"
              (click)="handleNextNavigation()"
              class="btn btn-ghost btn-md"
            >
              <fa-icon [icon]="faChevronRight"></fa-icon>
            </button>
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <div
          class="flex flex-col-reverse lg:flex-row gap-y-10 justify-between gap-x-10"
        >
          <!-- IMAGE GALLERY -->
          <div class="w-full md:w-[70%]">
            <ng-container
              *ngIf="productResource.isLoading(); else galleryLoaded"
            >
              <figure>
                <div class="w-full h-[350px] md:h-[550px] skeleton"></div>
              </figure>
            </ng-container>

            <ng-template #galleryLoaded>
              <figure>
                <img
                  class="w-full h-[350px] md:h-[550px] object-contain mb-4"
                  [src]="selectedImage || imageUrl()"
                  [alt]="productResource.value()?.name"
                />
              </figure>

              <!-- Thumbnails -->
              <div class="flex gap-2 overflow-x-auto">
                <ng-container
                  *ngFor="let img of productResource.value()?.images?.gallery"
                >
                  <img
                    class="w-24 h-24 object-cover cursor-pointer border-2 border-transparent hover:border-primary rounded"
                    [src]="productService.getImageUrl(img)"
                    (click)="selectedImage = productService.getImageUrl(img)"
                  />
                </ng-container>
              </div>
            </ng-template>
          </div>

          <!-- PRODUCT INFO -->
          <div class="w-full">
            <ng-container *ngIf="productResource.isLoading(); else infoLoaded">
              <div class="skeleton w-full h-[40px]"></div>
              <div class="skeleton w-[100px] mt-3 h-[20px]"></div>
              <div class="skeleton w-full mt-4 h-[150px]"></div>
              <div class="skeleton w-full mt-8 h-[50px]"></div>
            </ng-container>

            <ng-template #infoLoaded>
              <h2 class="text-2xl font-bold mb-3">
                {{ productResource.value()?.name }}
              </h2>
              <h3 class="text-3xl font-bold">
                {{ productResource.value()?.price }} ₮
              </h3>
              <p class="leading-6 mt-4" [innerHTML]="getSafeDescription()"></p>
              <div class="badge badge-outline capitalize mt-2">
                {{ productResource.value()?.category?.name || 'No Category' }}
              </div>

              <div class="mt-6 space-y-6">
                <!-- Quantity + Stock -->
                <div class="flex items-center justify-between">
                  <!-- Quantity Selector -->
                  <div
                    class="flex items-center bg-base-200 rounded-full px-4 py-2 gap-4"
                  >
                    <button
                      (click)="decreaseQuantity()"
                      [disabled]="quantity() <= 1"
                      class="text-lg font-bold text-gray-500"
                    >
                      -
                    </button>

                    <span class="text-lg font-semibold w-6 text-center">
                      {{ quantity() }}
                    </span>

                    <button
                      (click)="increaseQuantity()"
                      [disabled]="
                        quantity() >= (productResource.value()?.stock ?? 0)
                      "
                      class="text-lg font-bold text-orange-500"
                    >
                      +
                    </button>
                  </div>

                  <!-- Stock -->
                  <span class="text-sm text-gray-400">
                    {{ productResource.value()?.stock }} үлдэгдэл
                  </span>
                </div>

                <!-- Buttons -->
                <div class="flex gap-4">
                  <!-- Add to Cart -->
                  <button
                    (click)="addItem()"
                    [disabled]="checkItemAlreadyExist()"
                    class="flex-1 btn bg-gray-300 text-black rounded-full border-0 hover:bg-gray-400"
                  >
                    Сагслах
                  </button>

                  <!-- Buy Now -->
                  <button
                    (click)="buyNow()"
                    class="flex-1 btn bg-orange-500 text-white rounded-full border-0 hover:bg-orange-600"
                  >
                    Худалдан авах
                  </button>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- SIMILAR PRODUCTS -->
      <div class="mx-auto pt-28 pb-10 px-6 max-w-7xl">
        <h3 class="text-2xl font-bold mb-8">Адил төстэй бүтээгдэхүүнүүд</h3>

        <ng-container
          *ngIf="isLoadingSimilarProductResource(); else similarLoaded"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            <app-product-card-skeleton
              *ngFor="let i of [1, 2, 3, 4]"
            ></app-product-card-skeleton>
          </div>
        </ng-container>

        <ng-template #similarLoaded>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            <app-product-card
              *ngFor="let similarProduct of similarProductResource.value()"
              [product]="similarProduct"
            ></app-product-card>
          </div>
        </ng-template>
      </div>
    </div>

    <app-footer></app-footer>
  `,
})
export class ProductDetailComponent implements OnInit {
  faCartShopping = faCartShopping;
  faChevronRight = faChevronRight;
  faHeart = faHeart;
  faChevronLeft = faChevronLeft;

  productId = signal<string>('');
  selectedImage: string | null = null;

  public readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService,
  );
  private readonly favoriteItemsLocalStorageService = inject(
    FavoriteItemsLocalStorageService,
  );
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);

  productResource = resource<Product, { id: string }>({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => this.productService.getProductById(request.id),
  });

  similarProductResource = resource<Product[], { category: string } | null>({
    request: () => {
      const categoryObj = this.productResource.value()?.category;
      return categoryObj ? { category: categoryObj.name } : null;
    },
    loader: async ({ request }) => {
      if (!request) return [];

      const products = await this.productService.getProductsWithLimit(
        10,
        request.category,
      ); // ихээхэн авчирч фильтр хийх
      const currentId = this.productResource.value()?.id;

      // Одоогийн барааг хасах ба 4 бүтээгдэхүүн авах
      return products.filter((p) => p.id !== currentId).slice(0, 4);
    },
  });

  isFirstItem = computed(() => Number(this.productId()) === 1);
  isLastItem = computed(() => Number(this.productId()) === 20);
  isLoadingSimilarProductResource = computed(() =>
    this.similarProductResource.isLoading(),
  );

  ngOnInit() {
    this.title.setTitle('Product Details');
    this.meta.updateTag({
      name: 'description',
      content: 'Product Details Page',
    });

    this.route.paramMap.subscribe((param) => {
      this.productId.set(param.get('id')!);
      // Set first gallery image once loaded
      effect(() => {
        const gallery = this.productResource.value()?.images?.gallery;
        if (gallery?.length)
          this.selectedImage = this.productService.getImageUrl(gallery[0]);
      });
    });
  }

  handlePrevNavigation() {
    const newId = (Number(this.productId()) - 1).toString();
    if (+this.productId() <= 1) return;
    this.productId.set(newId);
    this.router.navigate(['/products', newId]);
  }

  handleNextNavigation() {
    const newId = (Number(this.productId()) + 1).toString();
    if (+this.productId() >= 20) return;
    this.productId.set(newId);
    this.router.navigate(['/products', newId]);
  }

  checkItemAlreadyExist() {
    return this.shoppingCartLocalStorageService.checkItemAlreadyExist(
      this.productResource.value()?.id!,
    );
  }

  addItem() {
    this.shoppingCartLocalStorageService.addItem({
      ...this.productResource.value()!,
      stock: 1,
    });
  }

  checkFavoriteItemAlreadyExist() {
    return this.favoriteItemsLocalStorageService.checkItemAlreadyExist(
      this.productResource.value()?.id!,
    );
  }

  toggleFavoriteItem() {
    if (this.checkFavoriteItemAlreadyExist()) {
      this.favoriteItemsLocalStorageService.removeItem(
        this.productResource.value()!,
      );
    } else {
      this.favoriteItemsLocalStorageService.addItem(
        this.productResource.value()!,
      );
    }
  }

  getSafeDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.productResource.value()?.description || '',
    );
  }
  quantity = signal(1);

  increaseQuantity() {
    const stock = this.productResource.value()?.stock ?? 0;

    if (this.quantity() < stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  buyNow() {
    this.addItem();
    this.router.navigate(['/shopping-cart']);
  }

  imageUrl = computed(() => {
    const gallery = this.productResource.value()?.images?.gallery;
    if (gallery && gallery.length > 0)
      return this.productService.getImageUrl(gallery[0]);
    const main = this.productResource.value()?.images?.main;
    if (main) return this.productService.getImageUrl(main);
    return 'assets/imgs/no-image.png';
  });
}

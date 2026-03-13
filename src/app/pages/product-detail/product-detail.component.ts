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
    <div
      class="min-h-full mt-10 bg-gradient-to-b from-sky-50/40 via-white to-white"
    >
      <!-- PRODUCT DETAIL -->
      <div class="mx-auto pt-20 pb-12 px-6 max-w-7xl">
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start"
        >
          <!-- IMAGE GALLERY -->
          <div class="w-full">
            <ng-container
              *ngIf="productResource.isLoading(); else galleryLoaded"
            >
              <div
                class="bg-white rounded-3xl border border-sky-100 shadow-sm p-4 md:p-6"
              >
                <div
                  class="w-full h-[350px] md:h-[550px] skeleton rounded-2xl"
                ></div>
              </div>
            </ng-container>

            <ng-template #galleryLoaded>
              <div
                class="bg-white rounded-3xl border border-sky-100 shadow-[0_10px_40px_rgba(14,165,233,0.08)] p-4 md:p-6"
              >
                <figure
                  class="rounded-2xl bg-sky-50/50 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-[350px] md:h-[550px] object-contain mb-4"
                    [src]="selectedImage || imageUrl()"
                    [alt]="productResource.value()?.name"
                  />
                </figure>

                <!-- Thumbnails -->
                <div class="flex gap-3 overflow-x-auto pt-2 pb-1 mt-2">
                  <img
                    *ngFor="let img of thumbnails()"
                    class="w-20 h-20 md:w-24 md:h-24 shrink-0 object-cover cursor-pointer rounded-2xl border-2 border-sky-100 bg-white p-1 hover:border-sky-400 hover:shadow-md transition"
                    [src]="productService.getImageUrl(img)"
                    (click)="selectedImage = productService.getImageUrl(img)"
                  />
                </div>
              </div>
            </ng-template>
          </div>

          <!-- PRODUCT INFO -->
          <div class="w-full">
            <ng-container *ngIf="productResource.isLoading(); else infoLoaded">
              <div
                class="bg-white rounded-3xl border border-sky-100 shadow-sm p-6"
              >
                <div class="skeleton w-3/4 h-[36px] rounded-xl"></div>
                <div class="skeleton w-[120px] mt-4 h-[22px] rounded-xl"></div>
                <div class="skeleton w-full mt-6 h-[140px] rounded-2xl"></div>
                <div class="skeleton w-full mt-8 h-[56px] rounded-full"></div>
              </div>
            </ng-container>

            <ng-template #infoLoaded>
              <div
                class="bg-white rounded-3xl border border-sky-100 shadow-[0_10px_40px_rgba(14,165,233,0.08)] p-6 md:p-8"
              >
                <!-- Top -->
                <div class="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div
                      class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold border border-sky-200"
                    >
                      <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                      {{
                        productResource.value()?.category?.name || 'No Category'
                      }}
                    </div>

                    <h2
                      class="text-2xl md:text-3xl font-bold text-slate-800 mt-4 leading-snug"
                    >
                      {{ productResource.value()?.name }}
                    </h2>
                  </div>

                  <div
                    class="px-5 py-3 rounded-2xl bg-sky-50 border border-sky-100"
                  >
                    <h3
                      class="text-2xl md:text-3xl font-extrabold text-sky-600"
                    >
                      {{ productResource.value()?.price }} ₮
                    </h3>
                  </div>
                </div>

                <!-- Stock Info -->
                <div
                  class="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3"
                >
                  <span class="text-sm md:text-base text-slate-600 font-medium">
                    Агуулах дахь үлдэгдэл
                  </span>
                  <span
                    class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-100"
                  >
                    {{ productResource.value()?.stock }} ширхэг
                  </span>
                </div>

                <!-- Description -->
                <div class="mt-6">
                  <h4 class="text-lg font-bold text-slate-800 mb-3">
                    Бүтээгдэхүүний тайлбар
                  </h4>
                  <div
                    class="text-slate-600 leading-7 text-sm md:text-base bg-sky-50/40 border border-sky-100 rounded-2xl p-4 md:p-5"
                    [innerHTML]="getSafeDescription()"
                  ></div>
                </div>

                <!-- Quantity -->
                <div class="mt-8">
                  <h4 class="text-lg font-bold text-slate-800 mb-3">
                    Тоо ширхэг
                  </h4>

                  <div
                    class="flex flex-wrap items-center gap-4 justify-between"
                  >
                    <div
                      class="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-2 shadow-sm"
                    >
                      <button
                        (click)="decreaseQuantity()"
                        [disabled]="quantity() <= 1"
                        class="w-10 h-10 rounded-full bg-white border border-sky-100 text-slate-600 text-xl font-bold hover:bg-sky-100 transition disabled:opacity-40"
                      >
                        -
                      </button>

                      <span
                        class="w-14 text-center text-lg font-bold text-slate-800"
                      >
                        {{ quantity() }}
                      </span>

                      <button
                        (click)="increaseQuantity()"
                        [disabled]="
                          quantity() >= (productResource.value()?.stock ?? 0)
                        "
                        class="w-10 h-10 rounded-full bg-sky-500 text-white text-xl font-bold hover:bg-sky-600 transition disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div class="text-sm text-slate-500">
                      Сонгосон тоо хэмжээг өөрчилж болно
                    </div>
                  </div>
                </div>

                <!-- Buttons -->
                <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    (click)="addItem()"
                    [disabled]="checkItemAlreadyExist()"
                    class="h-14 rounded-full font-semibold border border-sky-200 bg-white text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    Сагслах
                  </button>

                  <button
                    (click)="buyNow()"
                    class="h-14 rounded-full font-semibold bg-sky-500 text-white hover:bg-sky-600 transition shadow-[0_10px_25px_rgba(14,165,233,0.25)]"
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
      <div class="mx-auto pt-10 pb-14 px-6 max-w-7xl">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl md:text-3xl font-bold text-slate-800">
              Адил төстэй бүтээгдэхүүнүүд
            </h3>
            <p class="text-slate-500 mt-1 text-sm md:text-base">
              Танд санал болгох ижил төрлийн бүтээгдэхүүнүүд
            </p>
          </div>
          <div class="hidden md:block w-20 h-1 rounded-full bg-sky-400"></div>
        </div>

        <ng-container
          *ngIf="isLoadingSimilarProductResource(); else similarLoaded"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            <app-product-card-skeleton
              *ngFor="let i of [1, 2, 3, 4]"
            ></app-product-card-skeleton>
          </div>
        </ng-container>

        <ng-template #similarLoaded>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            <app-product-card
              *ngFor="let similarProduct of similarProductResource.value()"
              [product]="similarProduct"
            ></app-product-card>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  faCartShopping = faCartShopping;
  faChevronRight = faChevronRight;
  faHeart = faHeart;
  faChevronLeft = faChevronLeft;

  Boolean = Boolean;
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
      const id = param.get('id');
      if (!id) return; // null бол function-оос гарах
      this.productId.set(id);
      // Set first gallery image once loaded
      effect(() => {
        const images = this.productResource.value()?.images;

        if (images?.main) {
          this.selectedImage = this.productService.getImageUrl(images.main);
        }
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
  get allImages() {
    const images = this.productResource.value()?.images;
    return [images?.main, ...(images?.gallery || [])].filter(Boolean);
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

  thumbnails = computed(() => {
    const images = this.productResource.value()?.images;

    if (!images) return [];

    return [images.main, ...(images.gallery || [])].filter(
      (img): img is string => img !== null && img !== undefined,
    );
  });
}

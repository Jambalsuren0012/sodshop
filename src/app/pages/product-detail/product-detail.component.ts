import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  resource,
  signal,
} from '@angular/core';
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
    FontAwesomeModule,
    ProductCardComponent,
    ProductCardSkeletonComponent,
    FooterComponent,
  ],
  template: `
    <div class="min-h-full">
      <div class="mx-auto pt-24 pb-10 px-6 max-w-7xl">
        <div
          class="border-y border-y-base-300 flex gap-x-2 justify-end py-2 mb-8"
        >
          <button
            (click)="toggleFavoriteItem()"
            [class]="
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

        <div
          class="flex flex-col-reverse lg:flex-row gap-y-10 justify-between gap-x-10"
        >
          <!-- IMAGE -->
          <div class="w-full md:w-[70%]">
            @if (productResource.isLoading()) {
              <figure>
                <div class="w-full h-[350px] md:h-[550px] skeleton"></div>
              </figure>
            } @else {
              <figure>
                <img
                  class="w-full h-[350px] md:h-[550px] object-contain"
                  [src]="productResource.value()?.image"
                  [alt]="productResource.value()?.title"
                />
              </figure>
            }
          </div>

          <!-- INFO -->
          <div class="w-full">
            @if (productResource.isLoading()) {
              <div class="skeleton w-full h-[40px]"></div>
              <div class="skeleton w-[100px] mt-3 h-[20px]"></div>
              <div class="skeleton w-full mt-4 h-[150px]"></div>
              <div class="skeleton w-full mt-8 h-[50px]"></div>
            } @else {
              <h2 class="text-2xl font-bold mb-3">
                {{ productResource.value()?.title }}
              </h2>

              <h3 class="text-3xl font-bold">
                {{ productResource.value()?.price }} ₮
              </h3>

              <p
                class="leading-6 mt-4"
                [innerHTML]="productResource.value()?.description"
              ></p>

              <div class="badge badge-outline capitalize mt-2">
                {{ productResource.value()?.category }}
              </div>

              <button
                [disabled]="checkItemAlreadyExist()"
                (click)="addItem()"
                class="w-full btn btn-primary mt-8"
              >
                <fa-icon [icon]="faCartShopping"></fa-icon>
                Add to Cart
              </button>
            }
          </div>
        </div>
      </div>

      <!-- SIMILAR PRODUCTS -->
      <div class="mx-auto pt-28 pb-10 px-6 max-w-7xl">
        <h3 class="text-2xl font-bold mb-8">Other similar products</h3>

        @if (isLoadingSimilarProductResource()) {
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            @for (item of [1, 2, 3, 4]; track item) {
              <app-product-card-skeleton />
            }
          </div>
        } @else {
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            @for (
              similarProduct of similarProductResource.value();
              track similarProduct.id
            ) {
              <app-product-card [product]="similarProduct" />
            }
          </div>
        }
      </div>
    </div>

    <app-footer />
  `,
})
export class ProductDetailComponent implements OnInit {
  constructor(
    private meta: Meta,
    private title: Title,
    private sanitizer: DomSanitizer,
  ) {
    this.title.setTitle('Product Details');
    this.meta.updateTag({
      name: 'description',
      content: 'Product Details Page',
    });
  }

  faCartShopping = faCartShopping;
  faChevronRight = faChevronRight;
  faHeart = faHeart;
  faChevronLeft = faChevronLeft;

  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService,
  );
  private readonly favoriteItemsLocalStorageService = inject(
    FavoriteItemsLocalStorageService,
  );

  productId = signal<string>('');

  productResource = resource<Product, { id: string }>({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => this.productService.getProductById(request.id),
  });

  similarProductResource = resource<Product[], { category: string } | null>({
    request: () => {
      const category = this.productResource.value()?.category;
      return category ? { category } : null;
    },
    loader: ({ request }) =>
      request
        ? this.productService.getProductsWithLimit(4, request.category)
        : Promise.resolve([]), // ✅ wrap empty array in a Promise
  });

  isFirstItem = computed(() => Number(this.productId()) === 1);
  isLastItem = computed(() => Number(this.productId()) === 20);
  isLoadingSimilarProductResource = computed(() =>
    this.similarProductResource.isLoading(),
  );

  errorEffect = effect(() => {
    const error = this.productResource.error() as Error;
    if (error) console.log(error);
  });

  ngOnInit() {
    this.route.paramMap.subscribe((param) =>
      this.productId.set(param.get('id')!),
    );
  }

  handlePrevNavigation() {
    if (+this.productId() <= 1) return;
    const newId = (Number(this.productId()) - 1).toString();
    this.productId.set(newId);
    this.router.navigate(['/products', newId]);
  }

  handleNextNavigation() {
    if (+this.productId() >= 20) return;
    const newId = (Number(this.productId()) + 1).toString();
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
      quantity: 1,
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
}

import { Component, inject, computed, effect, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';
import { CarouselComponent } from '../../carousel/carousel.component';
import { BrandComponent } from '../../brand/brand.component';
import { FeaturedProductComponent } from '../../featured-product/featured-product.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    ProductCardComponent,
    ProductCardSkeletonComponent,
    FooterComponent,
    BrandComponent,
    FeaturedProductComponent,
  ],
  template: `
    <!-- HERO CAROUSEL -->
    <section class="w-full ">
      <app-carousel></app-carousel>
    </section>
    <section class="w-full ">
      <app-brand></app-brand>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="max-w-7xl mx-auto px-6 mt-10">
      <h2 class="text-2xl font-bold mb-6">Санал болгох бараа</h2>

      <ng-container *ngIf="isLoading(); else products">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <app-product-card-skeleton
            *ngFor="let item of [1, 2, 3, 4, 5, 6, 7, 8]"
          />
        </div>
      </ng-container>

      <ng-template #products>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <app-product-card
            *ngFor="let product of productsResource.value()"
            [product]="product"
          />
        </div>
      </ng-template>
    </section>
    <section class="w-full ">
      <app-featured-product></app-featured-product>
    </section>

    <!-- PROMO BANNER -->
    <section class="max-w-7xl mx-auto px-6 mt-12">
      <div
        class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white p-10 flex items-center justify-between"
      >
        <div>
          <h2 class="text-3xl font-bold">Special Offer</h2>
          <p class="mt-2 opacity-90">
            Get up to 40% discount on selected products
          </p>
        </div>

        <button
          class="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Shop Now
        </button>
      </div>
    </section>

    <!-- MORE PRODUCTS -->
    <section class="max-w-7xl mx-auto px-6 mt-12 pb-16">
      <h2 class="text-2xl font-bold mb-6">Шинээр Нэмэгдсэн Бүтээгдэхүүн</h2>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <app-product-card
          *ngFor="let product of productsResource.value()?.slice(0, 8)"
          [product]="product"
        />
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  productsResource = resource({
    loader: () => this.productService.getProducts(),
  });

  isLoading = computed(() => this.productsResource.isLoading());

  errorEffect = effect(() => {
    const error = this.productsResource.error() as Error;
    if (error) console.log(error);
  });

  constructor(
    private meta: Meta,
    private title: Title,
  ) {
    this.title.setTitle('Home');
    this.meta.updateTag({
      name: 'description',
      content: 'Home page description',
    });
  }
}

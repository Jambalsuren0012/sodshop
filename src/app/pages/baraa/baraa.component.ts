import { Component, computed, inject, resource } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-baraa',
  standalone: true,
  imports: [
    ProductCardComponent,
    ProductCardSkeletonComponent,
    FooterComponent,
  ],
  template: `
    <div class="mt-28 pb-10 px-6">
      @if (isLoading()) {
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto max-w-7xl gap-6"
        >
          @for (item of [1, 2, 3, 4]; track item) {
            <app-product-card-skeleton />
          }
        </div>
      } @else {
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto max-w-7xl gap-6"
        >
          @for (product of productsResource.value(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </div>
    <app-footer />
  `,
})
export class BaraaComponent {
  private readonly productService = inject(ProductService);

  productsResource = resource({
    loader: async () => {
      const res = await this.productService.getProducts();
      return res; // res already Product[]
    },
  });

  isLoading = computed(() => this.productsResource.isLoading());

  constructor(
    private meta: Meta,
    private title: Title,
  ) {
    this.title.setTitle('Бүх бараа');
    this.meta.updateTag({
      name: 'description',
      content: 'Бүх барааны жагсаалт',
    });
  }
}

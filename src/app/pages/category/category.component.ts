import { Component, inject, computed, resource, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductCardSkeletonComponent],
  template: `
    <div class="mt-6 pb-10 px-6 relative z-0">
      <ng-container *ngIf="isLoading(); else loaded">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-7xl mx-auto gap-6"
        >
          <app-product-card-skeleton *ngFor="let item of [1, 2, 3, 4]" />
        </div>
      </ng-container>

      <ng-template #loaded>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-7xl mx-auto gap-6"
        >
          <app-product-card
            *ngFor="let product of productsResource.value()"
            [product]="product"
          />
        </div>
      </ng-template>
    </div>
  `,
})
export class CategoryComponent {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  // 👉 category param signal
  categoryId = toSignal(this.route.paramMap);

  // 👉 category солигдох бүр API дахин дуудагдана
  productsResource = resource({
    request: () => this.categoryId()?.get('id'),

    loader: ({ request }) => {
      return this.productService.getProducts(request || undefined);
    },
  });

  isLoading = computed(() => this.productsResource.isLoading());

  errorEffect = effect(() => {
    const error = this.productsResource.error();
    if (error) console.log(error);
  });
}

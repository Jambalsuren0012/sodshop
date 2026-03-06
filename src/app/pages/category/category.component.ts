import { Component, inject, computed, resource, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductCardSkeletonComponent],
  template: `
    <div class="mt-6 pb-10 px-6">
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

  productsResource = resource({
    loader: () => {
      const categoryId = this.route.snapshot.paramMap.get('id');
      return this.productService.getProducts(categoryId || undefined);
    },
  });

  isLoading = computed(() => this.productsResource.isLoading());

  errorEffect = effect(() => {
    const error = this.productsResource.error();
    if (error) console.log(error);
  });
}

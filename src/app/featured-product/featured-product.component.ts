import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-featured-product',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <section class="max-w-7xl mx-auto px-6 mt-10">
      <!-- Section Title -->
      <h1 class="text-2xl font-bold mb-6 w-full">Онцлох бараа</h1>

      <div class="flex gap-6">
        <!-- Left: Carousel -->
        <div
          class="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          <div class="flex gap-4 w-max">
            <ng-container *ngFor="let product of products">
              <div class="flex-none w-64 sm:w-72 md:w-80 snap-start">
                <app-product-card [product]="product"></app-product-card>
              </div>
            </ng-container>
          </div>
        </div>

        <!-- Right: Banner -->
        <div class="w-5/7 hidden md:block flex-shrink-0">
          <img
            src="https://www.hitech.mn/_next/image?url=https%3A%2F%2Fhitech-bc-banners.s3.ap-southeast-1.amazonaws.com%2Fd660d64aab730ff2649ec9a67d991020.png&w=1920&q=75"
            alt="Онцлох баннер"
            class="rounded-xl object-cover h-full w-full"
          />
        </div>
      </div>
    </section>
  `,
})
export class FeaturedProductComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().then((res) => {
      this.products = res;
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-7xl mx-auto px-6 mt-10">
      <h2 class="text-2xl font-bold mb-6">Брэндүүд</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div
          class="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-center transition-transform transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          *ngFor="let brand of brands"
        >
          <img
            [src]="brand.logo"
            [alt]="brand.name"
            class="max-w-[100px] max-h-[40px] object-contain"
          />
        </div>
      </div>
    </section>
  `,
})
export class BrandComponent {
  brands = [
    {
      name: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    },
    {
      name: 'Asus',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg',
    },
    {
      name: 'Dell',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg',
    },
    {
      name: 'HP',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg',
    },
  ];
}

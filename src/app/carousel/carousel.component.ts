import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SlidersService, Slider } from '../services/sliders.service'; // <-- only this

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="carousel flex overflow-x-auto gap-4">
      <div *ngFor="let slide of sliders" class="flex-shrink-0 w-80">
        <img
          [src]="getImageUrl(slide.image_url)"
          [alt]="slide.title"
          class="w-full h-48 object-cover rounded-lg"
        />
        <h2 class="text-lg font-bold mt-2">{{ slide.title }}</h2>
        <p class="text-sm text-gray-600">{{ slide.subtitle }}</p>
      </div>
    </div>
  `,
})
export class CarouselComponent implements OnInit {
  private slidersService = inject(SlidersService);

  sliders: Slider[] = [];

  ngOnInit(): void {
    this.slidersService.getSliders().subscribe({
      next: (res) => (this.sliders = res),
      error: (err) => console.error(err),
    });
  }

  getImageUrl(path: string) {
    return `https://sodtech.mn/${path}`;
  }
}

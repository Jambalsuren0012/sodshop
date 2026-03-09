import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SlidersService } from '../services/sliders.service';
import { Slider } from '../../type';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="relative w-full overflow-hidden ">
      <!-- Slides -->
      <div
        class="flex transition-transform duration-700"
        [style.transform]="'translateX(-' + currentIndex() * 100 + '%)'"
      >
        <div
          *ngFor="let slide of sliders"
          class="min-w-full h-[420px] relative"
        >
          <img
            [src]="getImageUrl(slide.image_url)"
            [alt]="slide.title"
            class="w-full h-full object-cover"
          />

          <!-- <div class="absolute bottom-10 left-10 text-white">
            <h2 class="text-3xl font-bold">{{ slide.title }}</h2>
            <p class="text-lg">{{ slide.subtitle }}</p>
          </div> -->
        </div>
      </div>

      <!-- arrows -->
      <button
        (click)="prev()"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ‹
      </button>

      <button
        (click)="next()"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ›
      </button>

      <!-- dots -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <span
          *ngFor="let slide of sliders; let i = index"
          (click)="goTo(i)"
          class="w-3 h-3 rounded-full cursor-pointer"
          [class.bg-white]="currentIndex() === i"
          [class.bg-gray-400]="currentIndex() !== i"
        ></span>
      </div>
    </div>
  `,
})
export class CarouselComponent implements OnInit {
  private slidersService = inject(SlidersService);

  sliders: Slider[] = [];

  currentIndex = signal(0);

  ngOnInit() {
    this.slidersService.getSliders().subscribe({
      next: (res) => {
        this.sliders = res;
        this.autoSlide();
      },
    });
  }

  autoSlide() {
    setInterval(() => {
      this.next();
    }, 4000);
  }

  next() {
    this.currentIndex.update((v) =>
      v === this.sliders.length - 1 ? 0 : v + 1,
    );
  }

  prev() {
    this.currentIndex.update((v) =>
      v === 0 ? this.sliders.length - 1 : v - 1,
    );
  }

  goTo(i: number) {
    this.currentIndex.set(i);
  }

  getImageUrl(path: string) {
    return `https://sodtech.mn/admin/${path}`;
  }
}

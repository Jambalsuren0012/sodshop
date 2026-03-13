import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer
      class="relative border-t border-white/20 bg-[linear-gradient(180deg,rgba(240,249,255,0.65),rgba(255,255,255,0.96))] backdrop-blur-xl"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-8">
        <!-- Top -->
        <div
          class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 pb-10 border-b border-sky-100/80"
        >
          <!-- Brand -->
          <div class="max-w-sm">
            <div class="flex items-center gap-3">
              <img
                src="assets/imgs/logo.png"
                alt="Sodtech Logo"
                class="w-11 h-11 object-contain rounded-2xl ring-1 ring-sky-100"
              />

              <div>
                <h2
                  class="text-2xl font-black tracking-[0.18em] text-slate-900"
                >
                  SODTECH
                </h2>
                <p class="text-sm text-sky-600 font-medium">
                  Future of Tech Store
                </p>
              </div>
            </div>

            <p class="mt-5 text-sm leading-7 text-slate-600">
              Компьютер, техник технологийн бүтээгдэхүүнийг хурдан, найдвартай,
              орчин үеийн шийдлээр хүргэх онлайн дэлгүүр.
            </p>

            <div class="flex items-center gap-3 mt-6">
              <a
                href="#"
                class="inline-flex items-center justify-center h-10 px-4 rounded-full border border-sky-100 bg-white/70 text-sm text-slate-700 hover:bg-sky-100 hover:text-sky-700 transition"
              >
                Facebook
              </a>
              <a
                href="#"
                class="inline-flex items-center justify-center h-10 px-4 rounded-full border border-sky-100 bg-white/70 text-sm text-slate-700 hover:bg-sky-100 hover:text-sky-700 transition"
              >
                Instagram
              </a>
            </div>
          </div>

          <!-- Links -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">
            <div>
              <h3
                class="text-sm font-bold uppercase tracking-[0.14em] text-slate-900 mb-4"
              >
                Тусламж
              </h3>
              <ul class="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Захиалга шалгах
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Хүргэлтийн нөхцөл
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Буцаалт
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Төлбөрийн нөхцөл
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                class="text-sm font-bold uppercase tracking-[0.14em] text-slate-900 mb-4"
              >
                Ангилал
              </h3>
              <ul class="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Laptop
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Gaming PC
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Monitor
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-slate-600 hover:text-sky-700 transition"
                  >
                    Accessories
                  </a>
                </li>
              </ul>
            </div>

            <div class="col-span-2 md:col-span-1">
              <h3
                class="text-sm font-bold uppercase tracking-[0.14em] text-slate-900 mb-4"
              >
                Холбоо барих
              </h3>

              <ul class="space-y-3 text-sm text-slate-600">
                <li class="flex items-center gap-3">
                  <span class="text-sky-500">●</span>
                  <span>Улаанбаатар хот</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-sky-500">●</span>
                  <span>7700-1234</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-sky-500">●</span>
                  <span>infosodtech.mn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bottom -->
        <div
          class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p class="text-sm text-slate-500">
            © {{ year }} Sodtech. All rights reserved.
          </p>

          <div class="flex flex-wrap items-center gap-5 text-sm text-slate-500">
            <a href="#" class="hover:text-sky-700 transition">Нууцлал</a>
            <a href="#" class="hover:text-sky-700 transition"
              >Үйлчилгээний нөхцөл</a
            >
            <a href="#" class="hover:text-sky-700 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}

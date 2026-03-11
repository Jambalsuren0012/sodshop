import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-100 mt-20">
      <div class="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <!-- Logo / About -->
        <div>
          <h2 class="text-2xl font-bold text-red-600 mb-3">SODTECH</h2>
          <p class="text-sm text-gray-600">
            Компьютер, техник технологийн бүтээгдэхүүнийг хамгийн найдвартай,
            хурдан хүргэх онлайн дэлгүүр.
          </p>
        </div>

        <!-- Help -->
        <div>
          <h3 class="font-semibold mb-4">Тусламж</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-red-500">Захиалга шалгах</a></li>
            <li>
              <a href="#" class="hover:text-red-500">Хүргэлтийн нөхцөл</a>
            </li>
            <li><a href="#" class="hover:text-red-500">Буцаалт</a></li>
            <li><a href="#" class="hover:text-red-500">Төлбөрийн нөхцөл</a></li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="font-semibold mb-4">Ангилал</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-red-500">Laptop</a></li>
            <li><a href="#" class="hover:text-red-500">Gaming PC</a></li>
            <li><a href="#" class="hover:text-red-500">Monitor</a></li>
            <li><a href="#" class="hover:text-red-500">Accessories</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="font-semibold mb-4">Холбоо барих</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>📍 Улаанбаатар хот</li>
            <li>📞 7700-1234</li>
            <li>✉️ infosodtech.mn</li>
          </ul>

          <div class="flex gap-3 mt-4 text-lg">
            <a href="#" class="hover:text-red-500">Facebook</a>
            <a href="#" class="hover:text-red-500">Instagram</a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div
        class="border-t border-gray-300 py-4 text-center text-sm text-gray-500"
      >
        © {{ year }} Sodtech. All rights reserved.
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}

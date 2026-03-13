import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { themeChange } from 'theme-change';
import { FooterComponent } from './components/footer/footer.component';
import { MobileBottomNavComponent } from './mobile-bottom-nav/mobile-bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    HeaderComponent,
    FooterComponent,
    MobileBottomNavComponent,
  ],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <app-header></app-header>

      <main class="flex-1 pt-20 lg:pt-[134px] pb-20 lg:pb-0 bg-gray-50">
        <router-outlet></router-outlet>
      </main>

      <app-footer class="bg-gray-100 text-gray-700 text-center"></app-footer>

      <app-mobile-bottom-nav></app-mobile-bottom-nav>
    </div>
  `,
})
export class AppComponent implements OnInit {
  title = 'Angular E-Commerce Template';

  ngOnInit(): void {
    themeChange(false);
  }
}

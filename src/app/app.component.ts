import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { themeChange } from 'theme-change';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule, HeaderComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header />

      <main class="flex-1 pt-[112px] bg-gray-50">
        <router-outlet />
      </main>

      <app-footer
        class="bg-gray-100 text-gray-700 p-4 text-center"
      ></app-footer>
    </div>
  `,
})
export class AppComponent implements OnInit {
  title = 'Angular E-Commerce Template';

  ngOnInit(): void {
    themeChange(false);
  }
}

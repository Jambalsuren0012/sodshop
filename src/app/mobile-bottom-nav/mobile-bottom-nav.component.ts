import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHouse,
  faBars,
  faMagnifyingGlass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule],
  template: `
    <nav
      class="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden"
    >
      <div class="grid grid-cols-4 h-16">
        <a
          routerLink="/"
          [routerLinkActiveOptions]="{ exact: true }"
          routerLinkActive="text-orange-500"
          class="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-400"
        >
          <fa-icon [icon]="faHouse" class="text-[18px]"></fa-icon>
          <span>Нүүр</span>
        </a>

        <a
          routerLink="/categories"
          routerLinkActive="text-orange-500"
          class="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-400"
        >
          <fa-icon [icon]="faBars" class="text-[18px]"></fa-icon>
          <span>Ангилал</span>
        </a>

        <a
          routerLink="/search"
          routerLinkActive="text-orange-500"
          class="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-400"
        >
          <fa-icon [icon]="faMagnifyingGlass" class="text-[18px]"></fa-icon>
          <span>Хайлт</span>
        </a>

        <a
          routerLink="/profile"
          routerLinkActive="text-orange-500"
          class="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-400"
        >
          <fa-icon [icon]="faUser" class="text-[18px]"></fa-icon>
          <span>Бүртгэл</span>
        </a>
      </div>
    </nav>
  `,
})
export class MobileBottomNavComponent {
  faHouse = faHouse;
  faBars = faBars;
  faMagnifyingGlass = faMagnifyingGlass;
  faUser = faUser;
}

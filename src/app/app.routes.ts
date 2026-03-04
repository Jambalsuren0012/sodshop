import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';

import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { FavoriteItemsComponent } from './pages/favorite-items/favorite-items.component';
import { BaraaComponent } from './pages/baraa/baraa.component';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  {
    path: 'favorite-items',
    title: 'Favorite Items',
    component: FavoriteItemsComponent,
  },
  {
    path: 'login',
    title: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'baraa',
    title: 'Baraa',
    component: BaraaComponent,
  },

  {
    path: 'products/:id',
    title: 'Product Details',
    component: ProductDetailComponent,
  },

  {
    path: 'shopping-cart',
    title: 'Shopping Cart',
    component: ShoppingCartComponent,
  },
];

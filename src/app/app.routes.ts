import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';

import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { FavoriteItemsComponent } from './pages/favorite-items/favorite-items.component';
import { BaraaComponent } from './pages/baraa/baraa.component';
import { adminGuard } from './guards/admin.guard';

import { CategoryComponent } from './pages/category/category.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'favorite-items',
    title: 'Favorite Items',
    component: FavoriteItemsComponent,
  },
  {
    path: 'login',
    component: AuthComponent,
  },
  { path: 'category/:id', component: CategoryComponent },

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

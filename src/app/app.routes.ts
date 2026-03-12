import { Routes } from '@angular/router';
import { TargetComponent } from './pages/target/target.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { PaymentsPageComponent } from './pages/payments-page/payments-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },

  {
    path: 'admin',
    component: AdminPageComponent
  },

  {
    path: 'admin/products',
    component: ProductsPageComponent
  },

  {
    path: 'admin/users',
    component: UsersPageComponent
  },

  {
    path: 'admin/users/:userId',
    component: UserProfilePageComponent
  },

  {
    path: 'admin/orders',
    component: OrdersPageComponent
  },

  {
    path: 'admin/payments',
    component: PaymentsPageComponent
  },

  {
    path: 'admin/shop',
    component: ShopPageComponent
  },
  {
    path: '**',
    component: TargetComponent
  },
];

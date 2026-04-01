import { Routes } from '@angular/router';
import { TargetComponent } from './pages/target/target.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { PaymentsPageComponent } from './pages/payments-page/payments-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { PlacingOrderPageComponent } from './pages/placing-order-page/placing-order-page.component';
import { OnlinePaymentPageComponent } from './pages/online-payment-page/online-payment-page.component';
import { OrderPlacedPageComponent } from './pages/order-placed-page/order-placed-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';

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
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'placing-order',
    component: PlacingOrderPageComponent
  },
  {
    path: 'online-payment/:paymentId',
    component: OnlinePaymentPageComponent
  },
  {
    path: 'order-placed',
    component: OrderPlacedPageComponent
  },
  {
    path: 'orders',
    component: OrdersPageComponent
  },
  {
    path: 'account/:userId',
    component: AccountPageComponent
  },
  {
    path: 'order/:orderId',
    component: OrderPageComponent
  },
  {
    path: '**',
    component: TargetComponent
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout.page').then((m) => m.CheckoutPage),
  },
  {
    path: 'order-tracking',
    loadComponent: () =>
      import('./order-tracking/order-tracking.component').then(
        (m) => m.OrderTrackingComponent
      ),
  },
];

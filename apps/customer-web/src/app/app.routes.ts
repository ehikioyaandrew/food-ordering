import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: '' },
];

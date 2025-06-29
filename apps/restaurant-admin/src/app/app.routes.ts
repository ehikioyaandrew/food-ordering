import { Routes } from '@angular/router';
import { MenuManagementComponent } from './pages/menu-management/menu-management.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu-management', component: MenuManagementComponent },
  { path: 'orders', component: OrdersComponent },
  { path: '**', redirectTo: '/dashboard' },
];

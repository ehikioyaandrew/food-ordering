import { Routes } from '@angular/router';
import { MenuManagementComponent } from './pages/menu-management/menu-management.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { StaffManagementComponent } from './pages/staff-management/staff-management.component';
import { CustomerManagementComponent } from './pages/customer-management/customer-management.component';
import { PromotionsComponent } from './pages/promotions/promotions.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu-management', component: MenuManagementComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'staff-management', component: StaffManagementComponent },
  { path: 'customer-management', component: CustomerManagementComponent },
  { path: 'promotions', component: PromotionsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/dashboard' },
];

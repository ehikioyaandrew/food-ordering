import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateToMenuManagement() {
    this.router.navigate(['/menu-management']);
  }

  navigateToOrders() {
    this.router.navigate(['/orders']);
  }

  navigateToAnalytics() {
    this.router.navigate(['/analytics']);
  }

  navigateToStaffManagement() {
    this.router.navigate(['/staff-management']);
  }

  navigateToCustomers() {
    this.router.navigate(['/customer-management']);
  }

  navigateToPromotions() {
    this.router.navigate(['/promotions']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }
}

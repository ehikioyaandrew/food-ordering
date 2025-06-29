import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonAvatar,
  IonImg,
  IonToggle,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  person,
  personOutline,
  settings,
  settingsOutline,
  heart,
  heartOutline,
  time,
  timeOutline,
  card,
  cardOutline,
  location,
  locationOutline,
  notifications,
  notificationsOutline,
  mailOutline,
  help,
  helpCircle,
  logOut,
  logOutOutline,
  chevronForward,
  star,
  starOutline,
  bag,
  bagOutline,
  shield,
  shieldOutline,
  moonOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { ThemeService } from '../services/theme.service';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  totalOrders: number;
  favoriteRestaurants: number;
  membershipLevel: string;
}

interface OrderHistory {
  id: number;
  restaurantName: string;
  date: string;
  total: number;
  status: string;
  items: string[];
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonAvatar,
    IonImg,
    IonToggle,
    IonRippleEffect,
  ],
})
export class Tab3Page {
  // Mock user data - in a real app, this would come from authentication service
  user: UserProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinDate: 'January 2023',
    totalOrders: 24,
    favoriteRestaurants: 8,
    membershipLevel: 'Gold',
  };

  // Mock order history
  recentOrders: OrderHistory[] = [
    {
      id: 1,
      restaurantName: "Mario's Pizzeria",
      date: '2024-01-15',
      total: 32.99,
      status: 'Delivered',
      items: ['Margherita Pizza', 'Bruschetta', 'Tiramisu'],
    },
    {
      id: 2,
      restaurantName: 'Burger Palace',
      date: '2024-01-10',
      total: 18.5,
      status: 'Delivered',
      items: ['Classic Cheeseburger', 'Buffalo Wings'],
    },
    {
      id: 3,
      restaurantName: 'Dragon Wok',
      date: '2024-01-08',
      total: 25.75,
      status: 'Delivered',
      items: ['Pad Thai', 'Spring Rolls', 'Green Tea'],
    },
  ];

  // Settings
  notificationsEnabled = true;
  emailNotifications = true;
  locationServices = true;

  constructor(private router: Router, public themeService: ThemeService) {
    addIcons({
      person,
      personOutline,
      settings,
      settingsOutline,
      heart,
      heartOutline,
      time,
      timeOutline,
      card,
      cardOutline,
      location,
      locationOutline,
      notifications,
      notificationsOutline,
      mailOutline,
      help,
      helpCircle,
      logOut,
      logOutOutline,
      star,
      starOutline,
      bag,
      bagOutline,
      shield,
      shieldOutline,
      moonOutline,
      sunnyOutline,
    });
  }

  // Navigation methods
  editProfile() {
    console.log('Navigate to edit profile');
    // In a real app: this.router.navigate(['/edit-profile']);
  }

  viewOrderHistory() {
    console.log('Navigate to order history');
    // In a real app: this.router.navigate(['/order-history']);
  }

  viewFavorites() {
    console.log('Navigate to favorites');
    // In a real app: this.router.navigate(['/favorites']);
  }

  managePaymentMethods() {
    console.log('Navigate to payment methods');
    // In a real app: this.router.navigate(['/payment-methods']);
  }

  manageAddresses() {
    console.log('Navigate to addresses');
    // In a real app: this.router.navigate(['/addresses']);
  }

  openSettings() {
    console.log('Navigate to settings');
    // In a real app: this.router.navigate(['/settings']);
  }

  openSupport() {
    console.log('Navigate to support');
    // In a real app: this.router.navigate(['/support']);
  }

  logout() {
    console.log('Logout user');
    // In a real app: this.authService.logout();
  }

  // Toggle methods
  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
    console.log('Notifications:', this.notificationsEnabled);
  }

  toggleEmailNotifications() {
    this.emailNotifications = !this.emailNotifications;
    console.log('Email notifications:', this.emailNotifications);
  }

  toggleLocationServices() {
    this.locationServices = !this.locationServices;
    console.log('Location services:', this.locationServices);
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getMembershipColor(): string {
    switch (this.user.membershipLevel.toLowerCase()) {
      case 'gold':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'silver':
        return 'bg-gray-400 dark:bg-gray-500';
      case 'bronze':
        return 'bg-orange-600 dark:bg-orange-700';
      default:
        return 'bg-gray-400 dark:bg-gray-500';
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonIcon,
  IonButton,
  IonImg,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  locationOutline,
  timeOutline,
  starOutline,
  star,
  heartOutline,
  heart,
  restaurantOutline,
  moonOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { ThemeService } from '../services/theme.service';

interface Restaurant {
  id: number;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  distance: string;
  isOpen: boolean;
  isFavorite: boolean;
  cuisine: string[];
  minOrder: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonIcon,
    IonButton,
    IonImg,
  ],
})
export class Tab1Page {
  selectedCategory = 'all';
  searchQuery = '';

  categories = [
    { value: 'all', label: 'All' },
    { value: 'pizza', label: 'Pizza' },
    { value: 'burger', label: 'Burgers' },
    { value: 'asian', label: 'Asian' },
    { value: 'healthy', label: 'Healthy' },
    { value: 'dessert', label: 'Desserts' },
  ];

  restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Mario's Pizzeria",
      category: 'pizza',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      image:
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
      distance: '1.2 km',
      isOpen: true,
      isFavorite: false,
      cuisine: ['Italian', 'Pizza'],
      minOrder: 15,
    },
    {
      id: 2,
      name: 'Burger Palace',
      category: 'burger',
      rating: 4.6,
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      distance: '0.8 km',
      isOpen: true,
      isFavorite: true,
      cuisine: ['American', 'Burgers'],
      minOrder: 12,
    },
    {
      id: 3,
      name: 'Dragon Wok',
      category: 'asian',
      rating: 4.7,
      deliveryTime: '30-40 min',
      deliveryFee: 3.49,
      image:
        'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop',
      distance: '2.1 km',
      isOpen: true,
      isFavorite: false,
      cuisine: ['Chinese', 'Thai'],
      minOrder: 20,
    },
    {
      id: 4,
      name: 'Green Bowl',
      category: 'healthy',
      rating: 4.5,
      deliveryTime: '15-25 min',
      deliveryFee: 2.49,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      distance: '0.5 km',
      isOpen: false,
      isFavorite: true,
      cuisine: ['Healthy', 'Salads'],
      minOrder: 10,
    },
    {
      id: 5,
      name: 'Sweet Dreams',
      category: 'dessert',
      rating: 4.9,
      deliveryTime: '20-30 min',
      deliveryFee: 1.49,
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      distance: '1.5 km',
      isOpen: true,
      isFavorite: false,
      cuisine: ['Desserts', 'Ice Cream'],
      minOrder: 8,
    },
  ];

  constructor(public themeService: ThemeService, private router: Router) {
    addIcons({
      searchOutline,
      locationOutline,
      timeOutline,
      starOutline,
      star,
      heartOutline,
      heart,
      restaurantOutline,
      moonOutline,
      sunnyOutline,
    });
  }

  get filteredRestaurants() {
    let filtered = this.restaurants;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(
        (restaurant) => restaurant.category === this.selectedCategory
      );
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.some((c) => c.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value;
  }

  toggleFavorite(restaurant: Restaurant) {
    restaurant.isFavorite = !restaurant.isFavorite;
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  getStars(rating: number) {
    return Array(5)
      .fill(0)
      .map((_, i) => i < Math.floor(rating));
  }

  navigateToRestaurant(restaurant: any) {
    this.router.navigate(['/restaurant', restaurant.id]);
  }
}

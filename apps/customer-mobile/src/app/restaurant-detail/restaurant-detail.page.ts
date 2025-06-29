import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonIcon,
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
  IonImg,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  star,
  time,
  location,
  heart,
  heartOutline,
  add,
  remove,
  bag,
  informationCircle,
  checkmarkCircle,
  starOutline,
} from 'ionicons/icons';
import { ThemeService } from '../services/theme.service';
import { CartService, CartItem } from '../services/cart.service';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  allergens?: string[];
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  distance: string;
  cuisine: string[];
  description: string;
  isOpen: boolean;
  openingHours: string;
  minOrder: number;
  isFavorite: boolean;
}

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.page.html',
  styleUrls: ['./restaurant-detail.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
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
    IonImg,
    IonFab,
    IonFabButton,
  ],
})
export class RestaurantDetailPage implements OnInit {
  restaurantId!: number;
  restaurant: any = {};
  menuItems: MenuItem[] = [];
  selectedCategory = 'all';

  // Using CartService instead of local cart state
  categories = [
    { value: 'all', label: 'All' },
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'mains', label: 'Mains' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public themeService: ThemeService,
    private cartService: CartService
  ) {
    addIcons({
      heart,
      heartOutline,
      star,
      starOutline,
      location,
      time,
      bag,
      checkmarkCircle,
      add,
      remove,
      arrowBack,
    });
  }

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRestaurantData();
  }

  loadRestaurantData() {
    // Mock restaurant data - in a real app, this would come from a service
    const restaurants = [
      {
        id: 1,
        name: "Mario's Pizzeria",
        image:
          'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop',
        rating: 4.8,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        distance: '1.2 km',
        cuisine: ['Italian', 'Pizza'],
        description:
          'Authentic Italian pizzeria serving traditional recipes with fresh ingredients and wood-fired ovens.',
        isOpen: true,
        openingHours: 'Open until 11:00 PM',
        minOrder: 15,
        isFavorite: false,
      },
      {
        id: 2,
        name: 'Burger Palace',
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
        rating: 4.6,
        deliveryTime: '20-30 min',
        deliveryFee: 1.99,
        distance: '0.8 km',
        cuisine: ['American', 'Burgers'],
        description:
          'Classic American burger joint with premium beef patties, fresh ingredients, and handcut fries.',
        isOpen: true,
        openingHours: 'Open until 10:30 PM',
        minOrder: 12,
        isFavorite: true,
      },
      // Add other restaurants...
    ];

    this.restaurant =
      restaurants.find((r: any) => r.id === this.restaurantId) ||
      restaurants[0];

    // Load menu items based on restaurant
    this.loadMenuItems();
  }

  loadMenuItems() {
    // Mock menu data - in a real app, this would come from a service
    const allMenuItems = [
      // Mario's Pizzeria Menu (id: 1)
      {
        id: 1,
        name: 'Bruschetta Classica',
        description:
          'Toasted bread topped with fresh tomatoes, basil, and garlic',
        price: 8.99,
        image:
          'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&h=200&fit=crop',
        category: 'appetizers',
        isVegetarian: true,
        restaurantId: 1,
      },
      {
        id: 2,
        name: 'Antipasto Platter',
        description:
          'Selection of cured meats, cheeses, olives, and marinated vegetables',
        price: 16.99,
        image:
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop',
        category: 'appetizers',
        isPopular: true,
        restaurantId: 1,
      },
      {
        id: 3,
        name: 'Margherita Pizza',
        description:
          'San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil',
        price: 18.99,
        image:
          'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
        category: 'mains',
        isVegetarian: true,
        isPopular: true,
        restaurantId: 1,
      },
      {
        id: 4,
        name: 'Pepperoni Pizza',
        description:
          'Classic pepperoni with mozzarella cheese and tomato sauce',
        price: 21.99,
        image:
          'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
        category: 'mains',
        isPopular: true,
        restaurantId: 1,
      },
      {
        id: 5,
        name: 'Tiramisu',
        description:
          'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
        price: 7.99,
        image:
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
        category: 'desserts',
        isPopular: true,
        restaurantId: 1,
      },
      {
        id: 6,
        name: 'Italian Soda',
        description: 'Sparkling water with your choice of fruit syrup',
        price: 3.99,
        image:
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
        category: 'beverages',
        isVegetarian: true,
        restaurantId: 1,
      },

      // Burger Palace Menu (id: 2)
      {
        id: 7,
        name: 'Buffalo Wings',
        description: 'Crispy chicken wings tossed in spicy buffalo sauce',
        price: 12.99,
        image:
          'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&h=200&fit=crop',
        category: 'appetizers',
        isPopular: true,
        restaurantId: 2,
      },
      {
        id: 8,
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheese, lettuce, tomato, and house sauce',
        price: 14.99,
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        category: 'mains',
        isPopular: true,
        restaurantId: 2,
      },
      {
        id: 9,
        name: 'Bacon BBQ Burger',
        description:
          'Double beef patty with bacon, BBQ sauce, and crispy onions',
        price: 18.99,
        image:
          'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300&h=200&fit=crop',
        category: 'mains',
        isPopular: true,
        restaurantId: 2,
      },
      {
        id: 10,
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate milkshake topped with whipped cream',
        price: 5.99,
        image:
          'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=300&h=200&fit=crop',
        category: 'beverages',
        restaurantId: 2,
      },
    ];

    this.menuItems = allMenuItems.filter(
      (item: any) => item.restaurantId === this.restaurantId
    );
  }

  get filteredMenuItems() {
    // Filter menu items by restaurant ID and category
    // In a real app, menu items would be associated with restaurant IDs
    // For now, we'll show different items based on restaurant ID
    let restaurantMenuItems: MenuItem[] = [];

    switch (this.restaurantId) {
      case 1: // Mario's Pizzeria
        restaurantMenuItems = this.menuItems.filter((item) =>
          [1, 2, 3, 4, 5, 6].includes(item.id)
        );
        break;
      case 2: // Burger Palace
        restaurantMenuItems = this.menuItems.filter((item) =>
          [7, 8, 9, 10].includes(item.id)
        );
        break;
      case 3: // Dragon Wok
        restaurantMenuItems = this.menuItems.filter((item) =>
          [11, 12, 13, 14].includes(item.id)
        );
        break;
      case 4: // Green Bowl
        restaurantMenuItems = this.menuItems.filter((item) =>
          [15, 16, 17].includes(item.id)
        );
        break;
      case 5: // Sweet Dreams
        restaurantMenuItems = this.menuItems.filter((item) =>
          [18, 19, 20].includes(item.id)
        );
        break;
      default:
        restaurantMenuItems = this.menuItems.filter((item) =>
          [1, 2, 3, 4, 5, 6].includes(item.id)
        );
    }

    // If 'all' is selected, return all items; otherwise filter by category
    if (this.selectedCategory === 'all') {
      return restaurantMenuItems;
    }

    return restaurantMenuItems.filter(
      (item) => item.category === this.selectedCategory
    );
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
  }

  // Cart management using CartService
  addToCart(item: MenuItem) {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      quantity: 1,
      restaurantName: this.restaurant.name,
      isVegetarian: item.isVegetarian,
      isPopular: item.isPopular,
    };

    this.cartService.addToCart(cartItem);
  }

  removeFromCart(item: MenuItem) {
    this.cartService.removeFromCart(item.id);
  }

  getItemQuantity(itemId: number): number {
    const cartItems = this.cartService.getCurrentCartItems();
    const item = cartItems.find((cartItem: CartItem) => cartItem.id === itemId);
    return item ? item.quantity : 0;
  }

  // Cart totals using CartService
  get cartCount(): number {
    return this.cartService.getTotalItems();
  }

  get cartTotal(): number {
    return this.cartService.getSubtotal();
  }

  toggleFavorite() {
    this.restaurant.isFavorite = !this.restaurant.isFavorite;
  }

  goToCart() {
    // Navigate to cart page
    this.router.navigate(['/tabs/tab2']);
  }

  getStars(rating: number) {
    return Array(5)
      .fill(0)
      .map((_, i) => i < Math.floor(rating));
  }
}

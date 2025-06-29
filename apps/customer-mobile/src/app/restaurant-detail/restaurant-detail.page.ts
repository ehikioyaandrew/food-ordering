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
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonBadge,
  IonItem,
  IonThumbnail,
  IonImg,
  IonText,
  IonNote,
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
} from 'ionicons/icons';
import { ThemeService } from '../services/theme.service';

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
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonBadge,
    IonItem,
    IonThumbnail,
    IonImg,
    IonText,
    IonNote,
    IonFab,
    IonFabButton,
  ],
})
export class RestaurantDetailPage implements OnInit {
  restaurantId!: number;
  selectedCategory = 'appetizers';
  cartItems: { [key: number]: number } = {};
  cartCount = 0;
  cartTotal = 0;
  restaurant!: Restaurant;

  categories = [
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'mains', label: 'Mains' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'drinks', label: 'Drinks' },
  ];

  // Mock restaurant data - in a real app, this would come from a service
  restaurants: Restaurant[] = [
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
    {
      id: 3,
      name: 'Dragon Wok',
      image:
        'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=400&fit=crop',
      rating: 4.7,
      deliveryTime: '30-40 min',
      deliveryFee: 3.49,
      distance: '2.1 km',
      cuisine: ['Chinese', 'Thai'],
      description:
        'Authentic Asian cuisine featuring traditional Chinese and Thai dishes with bold flavors and fresh ingredients.',
      isOpen: true,
      openingHours: 'Open until 11:30 PM',
      minOrder: 20,
      isFavorite: false,
    },
    {
      id: 4,
      name: 'Green Bowl',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
      rating: 4.5,
      deliveryTime: '15-25 min',
      deliveryFee: 2.49,
      distance: '0.5 km',
      cuisine: ['Healthy', 'Salads'],
      description:
        'Fresh, healthy meals featuring organic ingredients, nutritious salads, and wholesome bowls.',
      isOpen: false,
      openingHours: 'Closed - Opens at 7:00 AM',
      minOrder: 10,
      isFavorite: true,
    },
    {
      id: 5,
      name: 'Sweet Dreams',
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
      rating: 4.9,
      deliveryTime: '20-30 min',
      deliveryFee: 1.49,
      distance: '1.5 km',
      cuisine: ['Desserts', 'Ice Cream'],
      description:
        'Artisanal desserts, premium ice cream, and sweet treats made fresh daily with the finest ingredients.',
      isOpen: true,
      openingHours: 'Open until 12:00 AM',
      minOrder: 8,
      isFavorite: false,
    },
  ];

  menuItems: MenuItem[] = [
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
    },
    {
      id: 4,
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni with mozzarella cheese and tomato sauce',
      price: 21.99,
      image:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
      category: 'mains',
      isPopular: true,
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
    },
    {
      id: 6,
      name: 'Italian Soda',
      description: 'Sparkling water with your choice of fruit syrup',
      price: 3.99,
      image:
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
      category: 'drinks',
      isVegetarian: true,
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
    },
    {
      id: 9,
      name: 'Bacon BBQ Burger',
      description: 'Double beef patty with bacon, BBQ sauce, and crispy onions',
      price: 18.99,
      image:
        'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300&h=200&fit=crop',
      category: 'mains',
      isPopular: true,
    },
    {
      id: 10,
      name: 'Chocolate Milkshake',
      description: 'Rich chocolate milkshake topped with whipped cream',
      price: 5.99,
      image:
        'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=300&h=200&fit=crop',
      category: 'drinks',
    },

    // Dragon Wok Menu (id: 3)
    {
      id: 11,
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls with sweet chili sauce',
      price: 7.99,
      image:
        'https://images.unsplash.com/photo-1563379091339-03246963d117?w=300&h=200&fit=crop',
      category: 'appetizers',
      isVegetarian: true,
    },
    {
      id: 12,
      name: 'Sweet & Sour Pork',
      description:
        'Tender pork with pineapple and bell peppers in sweet and sour sauce',
      price: 16.99,
      image:
        'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300&h=200&fit=crop',
      category: 'mains',
      isPopular: true,
    },
    {
      id: 13,
      name: 'Pad Thai',
      description:
        'Traditional Thai stir-fried noodles with shrimp and peanuts',
      price: 15.99,
      image:
        'https://images.unsplash.com/photo-1559314809-0f31657da5cb?w=300&h=200&fit=crop',
      category: 'mains',
      isPopular: true,
    },
    {
      id: 14,
      name: 'Green Tea',
      description: 'Traditional Chinese green tea',
      price: 2.99,
      image:
        'https://images.unsplash.com/photo-1594631661960-475ceb69a0a4?w=300&h=200&fit=crop',
      category: 'drinks',
    },

    // Green Bowl Menu (id: 4)
    {
      id: 15,
      name: 'Quinoa Salad',
      description: 'Fresh quinoa with mixed vegetables and lemon vinaigrette',
      price: 11.99,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      category: 'mains',
      isVegetarian: true,
      isPopular: true,
    },
    {
      id: 16,
      name: 'Avocado Toast',
      description: 'Multigrain toast topped with fresh avocado and seeds',
      price: 9.99,
      image:
        'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop',
      category: 'appetizers',
      isVegetarian: true,
    },
    {
      id: 17,
      name: 'Fresh Juice',
      description: 'Cold-pressed green juice with kale, spinach, and apple',
      price: 6.99,
      image:
        'https://images.unsplash.com/photo-1610970881699-44a5587abdec?w=300&h=200&fit=crop',
      category: 'drinks',
      isVegetarian: true,
    },

    // Sweet Dreams Menu (id: 5)
    {
      id: 18,
      name: 'Chocolate Cake',
      description: 'Rich chocolate layer cake with chocolate ganache',
      price: 8.99,
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
      category: 'desserts',
      isPopular: true,
    },
    {
      id: 19,
      name: 'Vanilla Ice Cream',
      description: 'Premium vanilla ice cream made with Madagascar vanilla',
      price: 5.99,
      image:
        'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&h=200&fit=crop',
      category: 'desserts',
      isVegetarian: true,
    },
    {
      id: 20,
      name: 'Strawberry Smoothie',
      description: 'Fresh strawberry smoothie with yogurt and honey',
      price: 4.99,
      image:
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
      category: 'drinks',
      isVegetarian: true,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public themeService: ThemeService
  ) {
    addIcons({
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
    });
  }

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRestaurantData();
  }

  loadRestaurantData() {
    // Find the restaurant by ID
    const foundRestaurant = this.restaurants.find(
      (r) => r.id === this.restaurantId
    );
    if (foundRestaurant) {
      this.restaurant = foundRestaurant;
    } else {
      // Fallback to first restaurant if ID not found
      this.restaurant = this.restaurants[0];
    }
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

    return restaurantMenuItems.filter(
      (item) => item.category === this.selectedCategory
    );
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
  }

  addToCart(item: MenuItem) {
    if (!this.cartItems[item.id]) {
      this.cartItems[item.id] = 0;
    }
    this.cartItems[item.id]++;
    this.updateCartTotals();
  }

  removeFromCart(item: MenuItem) {
    if (this.cartItems[item.id] && this.cartItems[item.id] > 0) {
      this.cartItems[item.id]--;
      if (this.cartItems[item.id] === 0) {
        delete this.cartItems[item.id];
      }
      this.updateCartTotals();
    }
  }

  getItemQuantity(itemId: number): number {
    return this.cartItems[itemId] || 0;
  }

  updateCartTotals() {
    this.cartCount = Object.values(this.cartItems).reduce(
      (sum, qty) => sum + qty,
      0
    );
    this.cartTotal = Object.entries(this.cartItems).reduce(
      (total, [itemId, qty]) => {
        const item = this.menuItems.find((i) => i.id === Number(itemId));
        return total + (item ? item.price * qty : 0);
      },
      0
    );
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

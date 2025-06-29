import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isAvailable?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface UserRole {
  id: string;
  name: string;
  allowedCategories: string[];
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shift: string;
  isActive: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  selectedCategory = 'all';
  searchQuery = '';
  currentUser!: User; // Using definite assignment assertion

  constructor(private cartService: CartService) {}

  // Define user roles with category permissions
  userRoles: UserRole[] = [
    {
      id: 'food-specialist',
      name: 'Food Specialist',
      allowedCategories: ['appetizers', 'pizza', 'burgers', 'pasta', 'salads'],
      description: 'Handles all food items',
    },
    {
      id: 'beverage-specialist',
      name: 'Beverage Specialist',
      allowedCategories: ['beverages'],
      description: 'Handles all drinks and beverages',
    },
    {
      id: 'snacks-specialist',
      name: 'Snacks & Desserts',
      allowedCategories: ['appetizers', 'desserts'],
      description: 'Handles snacks and desserts',
    },
    {
      id: 'drinks-snacks',
      name: 'Drinks & Snacks',
      allowedCategories: ['beverages', 'appetizers', 'desserts'],
      description: 'Handles beverages, snacks and desserts',
    },
    {
      id: 'manager',
      name: 'Manager',
      allowedCategories: [
        'appetizers',
        'pizza',
        'burgers',
        'pasta',
        'salads',
        'desserts',
        'beverages',
      ],
      description: 'Full access to all categories',
    },
  ];

  categories: Category[] = [
    { id: 'all', name: 'All Items', icon: 'grid' },
    { id: 'appetizers', name: 'Appetizers', icon: 'restaurant' },
    { id: 'pizza', name: 'Pizza', icon: 'pizza' },
    { id: 'burgers', name: 'Burgers', icon: 'burger' },
    { id: 'pasta', name: 'Pasta', icon: 'noodles' },
    { id: 'salads', name: 'Salads', icon: 'leaf' },
    { id: 'desserts', name: 'Desserts', icon: 'ice-cream' },
    { id: 'beverages', name: 'Beverages', icon: 'wine' },
  ];

  menuItems: MenuItem[] = [
    // Appetizers
    {
      id: 1,
      name: 'Bruschetta al Pomodoro',
      description:
        'Grilled bread topped with fresh tomatoes, basil, and garlic',
      price: 3500, // ₦3,500
      category: 'appetizers',
      image:
        'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&h=200&fit=crop',
      isPopular: true,
      isVegetarian: true,
      isAvailable: true,
    },
    {
      id: 2,
      name: 'Buffalo Wings',
      description:
        'Crispy chicken wings with spicy buffalo sauce and blue cheese',
      price: 5200, // ₦5,200
      category: 'appetizers',
      image:
        'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=300&h=200&fit=crop',
      isPopular: true,
      isAvailable: true,
    },
    {
      id: 3,
      name: 'Mozzarella Sticks',
      description: 'Golden fried mozzarella with marinara sauce',
      price: 4000, // ₦4,000
      category: 'appetizers',
      image:
        'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=300&h=200&fit=crop',
      isVegetarian: true,
      isAvailable: true,
    },

    // Pizza
    {
      id: 4,
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, and basil',
      price: 7500, // ₦7,500
      category: 'pizza',
      image:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
      isPopular: true,
      isVegetarian: true,
      isAvailable: true,
    },
    {
      id: 5,
      name: 'Pepperoni Supreme',
      description: 'Pepperoni, mushrooms, bell peppers, and extra cheese',
      price: 9200, // ₦9,200
      category: 'pizza',
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      isPopular: true,
      isAvailable: true,
    },
    {
      id: 6,
      name: 'BBQ Chicken Pizza',
      description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
      price: 10000, // ₦10,000
      category: 'pizza',
      image:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
      isAvailable: true,
    },

    // Burgers
    {
      id: 7,
      name: 'Classic Cheeseburger',
      description: 'Beef patty, cheese, lettuce, tomato, onion, pickles',
      price: 6000, // ₦6,000
      category: 'burgers',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      isPopular: true,
      isAvailable: true,
    },
    {
      id: 8,
      name: 'Bacon BBQ Burger',
      description: 'Beef patty, bacon, BBQ sauce, onion rings, cheddar cheese',
      price: 7200, // ₦7,200
      category: 'burgers',
      image:
        'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=300&h=200&fit=crop',
      isAvailable: true,
    },
    {
      id: 9,
      name: 'Veggie Burger',
      description: 'Plant-based patty, avocado, sprouts, tomato, vegan mayo',
      price: 6400, // ₦6,400
      category: 'burgers',
      image:
        'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&h=200&fit=crop',
      isVegetarian: true,
      isAvailable: true,
    },

    // Pasta
    {
      id: 10,
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with pancetta, eggs, and parmesan',
      price: 8000, // ₦8,000
      category: 'pasta',
      image:
        'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
      isPopular: true,
      isAvailable: true,
    },
    {
      id: 11,
      name: 'Penne Arrabbiata',
      description: 'Spicy tomato sauce with garlic and red peppers',
      price: 6800, // ₦6,800
      category: 'pasta',
      image:
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop',
      isVegetarian: true,
      isAvailable: true,
    },

    // Salads
    {
      id: 12,
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan, caesar dressing',
      price: 5200, // ₦5,200
      category: 'salads',
      image:
        'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      isVegetarian: true,
      isAvailable: true,
    },
    {
      id: 13,
      name: 'Greek Salad',
      description: 'Mixed greens, feta, olives, tomatoes, cucumber, red onion',
      price: 5600, // ₦5,600
      category: 'salads',
      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      isVegetarian: true,
      isPopular: true,
      isAvailable: true,
    },

    // Desserts
    {
      id: 14,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 3200, // ₦3,200
      category: 'desserts',
      image:
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
      isPopular: true,
      isVegetarian: true,
      isAvailable: true,
    },
    {
      id: 15,
      name: 'Chocolate Lava Cake',
      description:
        'Warm chocolate cake with molten center and vanilla ice cream',
      price: 3600, // ₦3,600
      category: 'desserts',
      image:
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
      isVegetarian: true,
      isAvailable: true,
    },

    // Beverages
    {
      id: 16,
      name: 'Fresh Lemonade',
      description: 'House-made lemonade with fresh lemons',
      price: 1600, // ₦1,600
      category: 'beverages',
      image:
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=200&fit=crop',
      isVegetarian: true,
      isAvailable: true,
    },
    {
      id: 17,
      name: 'Craft Beer',
      description: 'Local craft beer selection',
      price: 2400, // ₦2,400
      category: 'beverages',
      image:
        'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&h=200&fit=crop',
      isAvailable: true,
    },
    {
      id: 18,
      name: 'Nigerian Chapman',
      description: 'Traditional Nigerian cocktail with fruit mix',
      price: 2000, // ₦2,000
      category: 'beverages',
      image:
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
      isPopular: true,
      isAvailable: true,
    },
    {
      id: 19,
      name: 'Zobo Drink',
      description: 'Nigerian hibiscus tea with natural spices',
      price: 1800, // ₦1,800
      category: 'beverages',
      image:
        'https://images.unsplash.com/photo-1556881286-fc89a9e15d5e?w=300&h=200&fit=crop',
      isVegetarian: true,
      isAvailable: true,
    },
  ];

  get allowedCategories(): Category[] {
    if (this.currentUser?.role.name === 'Manager') {
      return this.categories; // Managers see all categories
    }

    // Filter categories based on user role
    return this.categories.filter(
      (cat) =>
        cat.id === 'all' ||
        this.currentUser?.role.allowedCategories.includes(cat.id)
    );
  }

  get filteredItems(): MenuItem[] {
    let items = this.menuItems;

    // First filter by user role permissions
    if (this.currentUser?.role.name !== 'Manager') {
      items = items.filter((item) =>
        this.currentUser.role.allowedCategories.includes(item.category)
      );
    }

    // Then filter by selected category
    if (this.selectedCategory !== 'all') {
      items = items.filter((item) => item.category === this.selectedCategory);
    }

    // Finally filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return items;
  }

  ngOnInit() {
    // Simulate different users - you can change this to test different roles
    this.currentUser = {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@restaurant.com',
      role: this.userRoles[3], // Drinks & Snacks specialist
      shift: '9AM-5PM',
      isActive: true,
    };

    // Set initial category based on user permissions
    this.updateAvailableCategories();
  }

  private updateAvailableCategories() {
    // Auto-select first available category for non-managers
    if (
      this.currentUser?.role.name !== 'Manager' &&
      this.allowedCategories.length > 1
    ) {
      this.selectedCategory = this.allowedCategories[1].id; // Skip 'all', select first specific category
    }
  }

  onCategoryChange(categoryId: string) {
    this.selectedCategory = categoryId;
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
  }

  addToOrder(item: MenuItem) {
    if (!item.isAvailable) {
      return; // Don't add unavailable items
    }

    // Add item to cart using the cart service
    this.cartService.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
    });

    console.log(`Added ${item.name} to cart`);
  }

  // Format price in Nigerian Naira
  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  getIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      grid: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
      restaurant:
        'M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41-5.51-5.51z',
      pizza:
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      burger:
        'M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z',
      noodles:
        'M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41-5.51-5.51z',
      leaf: 'M17 8C8 10 5.9 16.17 3.82 21.34l1.06.83C6.16 17.74 9 14 17 14V8z',
      'ice-cream':
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      wine: 'M6 9V7h4V2h4v5h4v2c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12z',
    };
    return icons[iconName] || icons['grid'];
  }
}

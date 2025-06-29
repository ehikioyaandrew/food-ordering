import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonImg,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  remove,
  trash,
  location,
  card,
  gift,
  checkmarkCircle,
  arrowForward,
  bagHandle,
  restaurant,
  chevronForward,
} from 'ionicons/icons';
import { ThemeService } from '../services/theme.service';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  restaurantName: string;
  isVegetarian?: boolean;
  isPopular?: boolean;
}

interface DeliveryAddress {
  id: number;
  title: string;
  address: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonImg,
    IonChip,
  ],
})
export class Tab2Page implements OnInit {
  cartItems: CartItem[] = [];
  promoCode = '';
  selectedAddress: DeliveryAddress | null = null;
  showPromoInput = false;
  appliedPromo: { code: string; discount: number } | null = null;

  // Mock data - in a real app, this would come from a cart service
  mockCartItems: CartItem[] = [
    {
      id: 3,
      name: 'Margherita Pizza',
      description:
        'San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil',
      price: 18.99,
      image:
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop',
      quantity: 2,
      restaurantName: "Mario's Pizzeria",
      isVegetarian: true,
      isPopular: true,
    },
    {
      id: 1,
      name: 'Bruschetta Classica',
      description:
        'Toasted bread topped with fresh tomatoes, basil, and garlic',
      price: 8.99,
      image:
        'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&h=200&fit=crop',
      quantity: 1,
      restaurantName: "Mario's Pizzeria",
      isVegetarian: true,
    },
    {
      id: 5,
      name: 'Tiramisu',
      description:
        'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
      price: 7.99,
      image:
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
      quantity: 1,
      restaurantName: "Mario's Pizzeria",
      isPopular: true,
    },
  ];

  deliveryAddresses: DeliveryAddress[] = [
    {
      id: 1,
      title: 'Home',
      address: '123 Main St, Downtown, City 10001',
      isDefault: true,
    },
    {
      id: 2,
      title: 'Work',
      address: '456 Business Ave, Business District, City 10002',
      isDefault: false,
    },
    {
      id: 3,
      title: 'Other',
      address: '789 Park Lane, Residential Area, City 10003',
      isDefault: false,
    },
  ];

  availablePromoCodes = [
    { code: 'SAVE10', discount: 0.1, description: '10% off your order' },
    { code: 'NEWUSER', discount: 0.15, description: '15% off for new users' },
    { code: 'FREESHIP', discount: 0, description: 'Free delivery' },
  ];

  constructor(private router: Router, public themeService: ThemeService) {
    addIcons({
      add,
      remove,
      trash,
      location,
      card,
      gift,
      checkmarkCircle,
      arrowForward,
      bagHandle,
      restaurant,
      chevronForward,
    });
  }

  ngOnInit() {
    // Initialize cart with mock data
    this.cartItems = [...this.mockCartItems];
    this.selectedAddress =
      this.deliveryAddresses.find((addr) => addr.isDefault) ||
      this.deliveryAddresses[0];
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  get deliveryFee(): number {
    return this.appliedPromo?.code === 'FREESHIP' ? 0 : 2.99;
  }

  get tax(): number {
    return this.subtotal * 0.08; // 8% tax
  }

  get promoDiscount(): number {
    if (!this.appliedPromo) return 0;
    return this.subtotal * this.appliedPromo.discount;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee + this.tax - this.promoDiscount;
  }

  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(item: CartItem) {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItem) {
      existingItem.quantity++;
    }
  }

  removeFromCart(item: CartItem) {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity--;
    } else if (existingItem && existingItem.quantity === 1) {
      // Remove item completely when quantity reaches 0
      this.cartItems = this.cartItems.filter(
        (cartItem) => cartItem.id !== item.id
      );
    }
  }

  deleteFromCart(item: CartItem) {
    this.cartItems = this.cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );
  }

  selectAddress(address: DeliveryAddress) {
    this.selectedAddress = address;
  }

  onAddressChange(event: any) {
    const addressId = event.detail.value;
    const address = this.deliveryAddresses.find(
      (addr) => addr.id === addressId
    );
    if (address) {
      this.selectedAddress = address;
    }
  }

  togglePromoInput() {
    this.showPromoInput = !this.showPromoInput;
    if (!this.showPromoInput) {
      this.promoCode = '';
    }
  }

  applyPromoCode() {
    if (!this.promoCode.trim()) return;

    const promo = this.availablePromoCodes.find(
      (p) => p.code.toLowerCase() === this.promoCode.trim().toLowerCase()
    );

    if (promo) {
      this.appliedPromo = { code: promo.code, discount: promo.discount };
      this.promoCode = '';
      this.showPromoInput = false;
    } else {
      // In a real app, you'd show a toast or alert for invalid promo code
      console.log('Invalid promo code');
    }
  }

  removePromoCode() {
    this.appliedPromo = null;
  }

  continueShopping() {
    this.router.navigate(['/tabs/tab1']);
  }

  proceedToCheckout() {
    // Navigate to checkout page with cart data
    this.router.navigate(['/checkout'], {
      state: {
        cartItems: this.cartItems,
        selectedAddress: this.selectedAddress,
        subtotal: this.subtotal,
        deliveryFee: this.deliveryFee,
        tax: this.tax,
        promoDiscount: this.promoDiscount,
        total: this.total,
        appliedPromo: this.appliedPromo,
      },
    });
  }

  onPromoCodeClick(promoCode: string) {
    this.promoCode = promoCode;
    this.applyPromoCode();
  }
}

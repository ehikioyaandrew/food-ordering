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
import {
  CartService,
  CartItem,
  DeliveryAddress,
  PromoCode,
} from '../services/cart.service';

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
  selectedAddress: DeliveryAddress = {
    id: 1,
    title: 'Home',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    isDefault: true,
  };

  // Promo code functionality
  promoCode = '';
  appliedPromo: PromoCode | null = null;
  showPromoInput = false;

  // Available addresses
  addresses: DeliveryAddress[] = [
    {
      id: 1,
      title: 'Home',
      address: '123 Main Street, Apt 4B, New York, NY 10001',
      isDefault: true,
    },
    {
      id: 2,
      title: 'Work',
      address: '456 Business Ave, Suite 200, New York, NY 10002',
      isDefault: false,
    },
    {
      id: 3,
      title: 'Other',
      address: '789 Friend Street, New York, NY 10003',
      isDefault: false,
    },
  ];

  // Available promo codes
  availablePromoCodes: PromoCode[] = [
    {
      code: 'SAVE10',
      discount: 5.0,
      description: 'Save $5 on orders over $25',
    },
    { code: 'NEWUSER', discount: 3.0, description: 'New user discount' },
    { code: 'FREESHIP', discount: 2.99, description: 'Free delivery' },
  ];

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private cartService: CartService
  ) {
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
    // Subscribe to cart items from service
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  // Cart management methods using CartService
  addToCart(item: CartItem) {
    this.cartService.addToCart({ ...item, quantity: 1 });
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item.id);
  }

  deleteFromCart(item: CartItem) {
    this.cartService.deleteItemFromCart(item.id);
  }

  // Address management
  onAddressChange(event: any) {
    const addressId = event.detail.value;
    this.selectedAddress =
      this.addresses.find((addr) => addr.id === addressId) || this.addresses[0];
  }

  // Promo code management
  togglePromoInput() {
    this.showPromoInput = !this.showPromoInput;
    if (!this.showPromoInput) {
      this.promoCode = '';
    }
  }

  onPromoCodeClick(promoCode: string) {
    this.promoCode = promoCode;
    this.applyPromoCode();
  }

  applyPromoCode() {
    if (!this.promoCode.trim()) return;

    const promo = this.availablePromoCodes.find(
      (p) => p.code.toLowerCase() === this.promoCode.toLowerCase()
    );

    if (promo) {
      this.appliedPromo = promo;
      this.promoCode = '';
      this.showPromoInput = false;
    } else {
      // Handle invalid promo code
      alert('Invalid promo code');
    }
  }

  removePromoCode() {
    this.appliedPromo = null;
  }

  // Calculated properties using CartService
  get totalItems(): number {
    return this.cartService.getTotalItems();
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get deliveryFee(): number {
    return this.cartService.calculateDeliveryFee();
  }

  get tax(): number {
    return this.cartService.calculateTax();
  }

  get promoDiscount(): number {
    return this.appliedPromo?.discount || 0;
  }

  get total(): number {
    return this.cartService.calculateTotal(this.promoDiscount);
  }

  // Navigation
  proceedToCheckout() {
    if (this.cartItems.length === 0) return;

    this.router.navigate(['/checkout'], {
      state: {
        appliedPromo: this.appliedPromo,
        promoDiscount: this.promoDiscount,
      },
    });
  }

  goToRestaurants() {
    this.router.navigate(['/tabs/tab1']);
  }
}

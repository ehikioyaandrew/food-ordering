import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonTextarea,
  IonRadio,
  IonRadioGroup,
  IonImg,
  IonChip,
  IonBadge,
  AlertController,
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  location,
  card,
  cash,
  shield,
  checkmarkCircle,
  time,
  restaurant,
  bag,
  receipt,
  lockClosed,
} from 'ionicons/icons';
import {
  CartService,
  CartItem,
  DeliveryAddress,
  PromoCode,
} from '../services/cart.service';

interface PaymentMethod {
  id: number;
  type: 'card' | 'cash';
  name: string;
  details: string;
  icon: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonTextarea,
    IonRadio,
    IonRadioGroup,
    IonImg,
    IonChip,
    IonBadge,
    IonItem,
    IonLabel,
  ],
})
export class CheckoutPage implements OnInit {
  // Order data from cart service
  cartItems: CartItem[] = [];
  selectedAddress: DeliveryAddress = {
    id: 1,
    title: 'Home',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    isDefault: true,
  };

  subtotal = 0;
  deliveryFee = 0;
  tax = 0;
  promoDiscount = 0;
  total = 0;
  appliedPromo: PromoCode | null = null;

  // Checkout specific data
  selectedPaymentMethod: number = 1;
  orderNotes = '';
  estimatedDeliveryTime = '25-35 min';

  // Payment methods (simplified to card and cash only)
  paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      type: 'card',
      name: 'Credit Card',
      details: '•••• •••• •••• 1234',
      icon: 'card',
      isDefault: true,
    },
    {
      id: 2,
      type: 'cash',
      name: 'Cash on Delivery',
      details: 'Pay when you receive',
      icon: 'cash',
      isDefault: false,
    },
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private cartService: CartService
  ) {
    addIcons({
      arrowBack,
      location,
      card,
      cash,
      shield,
      checkmarkCircle,
      time,
      restaurant,
      bag,
      receipt,
      lockClosed,
    });
  }

  ngOnInit() {
    // Subscribe to cart items and calculate totals
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotals();
    });

    // If no cart data, redirect back to cart
    if (this.cartItems.length === 0) {
      this.router.navigate(['/tabs/tab2']);
    }

    // Get data from navigation state if available (for promo codes)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.appliedPromo = navigation.extras.state['appliedPromo'];
      this.promoDiscount = navigation.extras.state['promoDiscount'] || 0;
      this.calculateTotals();
    }
  }

  // Calculate all totals using cart service
  private calculateTotals() {
    this.subtotal = this.cartService.getSubtotal();
    this.deliveryFee = this.cartService.calculateDeliveryFee();
    this.tax = this.cartService.calculateTax();
    this.total = this.cartService.calculateTotal(this.promoDiscount);
  }

  // Payment method selection
  onPaymentMethodChange(paymentMethodId: number) {
    this.selectedPaymentMethod = paymentMethodId;
  }

  // Edit delivery address
  editAddress() {
    this.router.navigate(['/addresses']);
  }

  // Place order using cart service
  async placeOrder() {
    const selectedMethod = this.getSelectedPaymentMethod();

    if (!selectedMethod) {
      const alert = await this.alertController.create({
        header: 'Payment Method Required',
        message: 'Please select a payment method to continue.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Handle different payment methods
    switch (selectedMethod.type) {
      case 'card':
        await this.processCardPayment();
        break;

      case 'cash':
        await this.processCashPayment();
        break;

      default:
        await this.processCardPayment();
    }
  }

  // Process traditional card payment
  private async processCardPayment() {
    const loading = await this.loadingController.create({
      message: 'Processing your payment...',
      duration: 2000,
    });
    await loading.present();

    // Simulate card payment processing
    setTimeout(async () => {
      await loading.dismiss();

      // Create order using cart service (this will clear the cart automatically)
      const order = this.cartService.createOrder(
        this.selectedAddress,
        'Credit Card',
        this.orderNotes,
        this.appliedPromo || undefined
      );

      // Show success alert
      const alert = await this.alertController.create({
        header: 'Order Placed!',
        message: `Order #${order.id} has been confirmed. Estimated delivery: ${order.estimatedDeliveryTime}`,
        buttons: [
          {
            text: 'Track Order',
            handler: () => {
              this.router.navigate(['/order-tracking'], {
                state: { orderId: order.id },
              });
            },
          },
          {
            text: 'Continue Shopping',
            handler: () => {
              this.router.navigate(['/tabs/tab1']);
            },
          },
        ],
      });
      await alert.present();
    }, 2000);
  }

  // Process cash on delivery
  private async processCashPayment() {
    // Create order using cart service (this will clear the cart automatically)
    const order = this.cartService.createOrder(
      this.selectedAddress,
      'Cash on Delivery',
      this.orderNotes,
      this.appliedPromo || undefined
    );

    const alert = await this.alertController.create({
      header: 'Cash on Delivery Confirmed',
      message: `Order #${
        order.id
      } has been placed! Please have $${order.total.toFixed(
        2
      )} ready when the delivery arrives. Estimated time: ${
        order.estimatedDeliveryTime
      }`,
      buttons: [
        {
          text: 'Track Order',
          handler: () => {
            this.router.navigate(['/order-tracking'], {
              state: { orderId: order.id },
            });
          },
        },
        {
          text: 'Continue Shopping',
          handler: () => {
            this.router.navigate(['/tabs/tab1']);
          },
        },
      ],
    });
    await alert.present();
  }

  // Get payment method details
  getSelectedPaymentMethod(): PaymentMethod | undefined {
    return this.paymentMethods.find(
      (pm) => pm.id === this.selectedPaymentMethod
    );
  }

  // Calculate total items using cart service
  get totalItems(): number {
    return this.cartService.getTotalItems();
  }

  // Format delivery time
  getDeliveryTime(): string {
    const now = new Date();
    const deliveryStart = new Date(now.getTime() + 25 * 60000); // 25 minutes from now
    const deliveryEnd = new Date(now.getTime() + 35 * 60000); // 35 minutes from now

    return `${deliveryStart.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })} - ${deliveryEnd.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }

  // Back to cart
  goBack() {
    this.router.navigate(['/tabs/tab2']);
  }
}

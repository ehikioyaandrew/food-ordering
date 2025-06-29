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
  IonCardHeader,
  IonCardTitle,
  IonList,
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
  IonNote,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonCheckbox,
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
  add,
} from 'ionicons/icons';

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
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
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
    IonNote,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonCheckbox,
    CommonModule,
    FormsModule,
  ],
})
export class CheckoutPage implements OnInit {
  // Order data from cart
  cartItems: CartItem[] = [];
  selectedAddress: DeliveryAddress | null = null;
  subtotal = 0;
  deliveryFee = 0;
  tax = 0;
  promoDiscount = 0;
  total = 0;
  appliedPromo: { code: string; discount: number } | null = null;

  // Checkout specific data
  selectedPaymentMethod: number = 1;
  orderNotes = '';
  savePaymentMethod = false;
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
    private loadingController: LoadingController
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
      add,
    });

    // Get navigation state data from cart
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cartItems = navigation.extras.state['cartItems'] || [];
      this.selectedAddress = navigation.extras.state['selectedAddress'];
      this.subtotal = navigation.extras.state['subtotal'] || 0;
      this.deliveryFee = navigation.extras.state['deliveryFee'] || 0;
      this.tax = navigation.extras.state['tax'] || 0;
      this.promoDiscount = navigation.extras.state['promoDiscount'] || 0;
      this.total = navigation.extras.state['total'] || 0;
      this.appliedPromo = navigation.extras.state['appliedPromo'];
    }
  }

  ngOnInit() {
    // If no cart data, redirect back to cart
    if (this.cartItems.length === 0) {
      this.router.navigate(['/tabs/tab2']);
    }
  }

  // Payment method selection
  onPaymentMethodChange(paymentMethodId: number) {
    this.selectedPaymentMethod = paymentMethodId;
  }

  // Add new payment method
  async addPaymentMethod() {
    const alert = await this.alertController.create({
      header: 'Add Payment Method',
      message: 'Choose a payment method to add',
      buttons: [
        {
          text: 'Credit/Debit Card',
          handler: () => {
            this.router.navigate(['/add-card']);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  // Edit delivery address
  editAddress() {
    this.router.navigate(['/addresses']);
  }

  // Place order
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

      // Show success alert
      const alert = await this.alertController.create({
        header: 'Order Placed!',
        message: `Your order has been confirmed. Estimated delivery: ${this.estimatedDeliveryTime}`,
        buttons: [
          {
            text: 'Track Order',
            handler: () => {
              this.router.navigate(['/order-tracking']);
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
    const alert = await this.alertController.create({
      header: 'Cash on Delivery Confirmed',
      message: `Your order has been placed! Please have $${this.total.toFixed(
        2
      )} ready when the delivery arrives. Estimated time: ${
        this.estimatedDeliveryTime
      }`,
      buttons: [
        {
          text: 'Track Order',
          handler: () => {
            this.router.navigate(['/order-tracking']);
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

  // Calculate total items
  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
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

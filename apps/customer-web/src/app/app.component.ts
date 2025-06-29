import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from './services/cart.service';
import {
  PaymentModalComponent,
  PaymentResult,
} from './components/payment-modal/payment-modal.component';
import { OrderHistoryService } from './services/order-history.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, PaymentModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'restaurant-pos';
  isDarkMode = false;
  currentTime = new Date();
  private timeInterval: any;
  private cartSubscription?: Subscription;

  // Cart data from service
  currentOrderItems: CartItem[] = [];

  // Payment modal state
  isPaymentModalOpen = false;

  constructor(
    private cartService: CartService,
    private orderHistoryService: OrderHistoryService,
    public router: Router
  ) {}

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get tax(): number {
    return this.cartService.getTax();
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  get totalItemsCount(): number {
    return this.cartService.getTotalItemsCount();
  }

  ngOnInit() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode =
      savedTheme === 'dark' ||
      (!savedTheme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.updateTheme();

    // Update time every minute
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);

    // Subscribe to cart updates
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.currentOrderItems = items;
    });
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private updateTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Format price in Nigerian Naira
  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  // Order management methods - delegate to cart service
  increaseQuantity(itemId: number) {
    this.cartService.increaseQuantity(itemId);
  }

  decreaseQuantity(itemId: number) {
    this.cartService.decreaseQuantity(itemId);
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId);
  }

  // Open payment modal
  openPaymentModal() {
    if (this.currentOrderItems.length === 0) {
      return;
    }
    this.isPaymentModalOpen = true;
  }

  // Close payment modal
  closePaymentModal() {
    this.isPaymentModalOpen = false;
  }

  // Handle payment completion
  onPaymentComplete(paymentResult: PaymentResult) {
    if (paymentResult.success) {
      // Save order to history
      const completedOrder = this.orderHistoryService.addOrder(
        this.currentOrderItems,
        this.subtotal,
        this.tax,
        this.total,
        paymentResult,
        'Sarah Johnson', // Current cashier name - could be dynamic
        'Table #5' // Table number - could be dynamic
      );

      // Show success message with order details
      const changeText =
        paymentResult.change > 0
          ? `\nChange: ${this.formatPrice(paymentResult.change)}`
          : '';

      alert(
        `✅ Payment Successful!\n\n` +
          `Order #: ${completedOrder.orderNumber}\n` +
          `Method: ${this.getPaymentMethodName(paymentResult.method)}\n` +
          `Amount: ${this.formatPrice(
            paymentResult.amountPaid
          )}${changeText}\n` +
          `Transaction ID: ${paymentResult.transactionId}\n\n` +
          `Thank you for your business!`
      );

      // Clear cart and close modal
      this.cartService.clearCart();
      this.closePaymentModal();

      console.log('Order saved to history:', completedOrder);
      console.log(
        "Today's summary:",
        this.orderHistoryService.getDailySummary()
      );
    }
  }

  // Helper method to get payment method display name
  private getPaymentMethodName(methodId: string): string {
    const methods: { [key: string]: string } = {
      cash: 'Cash Payment',
      card: 'Debit/Credit Card',
      mobile: 'Mobile Money',
      'bank-transfer': 'Bank Transfer',
    };
    return methods[methodId] || methodId;
  }

  // Legacy method - now opens payment modal instead
  processPayment() {
    this.openPaymentModal();
  }
}

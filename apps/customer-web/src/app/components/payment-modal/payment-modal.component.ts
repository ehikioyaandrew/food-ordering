import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../services/cart.service';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export interface PaymentResult {
  success: boolean;
  method: string;
  amountPaid: number;
  change: number;
  transactionId?: string;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss',
})
export class PaymentModalComponent {
  @Input() isOpen = false;
  @Input() cartItems: CartItem[] = [];
  @Input() subtotal = 0;
  @Input() tax = 0;
  @Input() total = 0;
  @Input() totalItemsCount = 0;

  @Output() close = new EventEmitter<void>();
  @Output() paymentComplete = new EventEmitter<PaymentResult>();

  selectedPaymentMethod = 'cash';
  cashReceived = 0;
  isProcessing = false;

  paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: 'cash',
      description: 'Pay with cash - most common method',
      enabled: true,
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      icon: 'card',
      description: 'Pay with Visa, MasterCard, Verve',
      enabled: true,
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: 'mobile',
      description: 'Opay, PalmPay, Kuda, etc.',
      enabled: true,
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: 'bank',
      description: 'Direct bank transfer',
      enabled: true,
    },
  ];

  // Quick cash amount buttons for common denominations
  quickCashAmounts = [
    { label: '₦1,000', value: 1000 },
    { label: '₦2,000', value: 2000 },
    { label: '₦5,000', value: 5000 },
    { label: '₦10,000', value: 10000 },
    { label: '₦20,000', value: 20000 },
    { label: 'Exact', value: 0 }, // Will be set to total amount
  ];

  get changeAmount(): number {
    return Math.max(0, this.cashReceived - this.total);
  }

  get isValidCashAmount(): boolean {
    return this.cashReceived >= this.total;
  }

  get canProcessPayment(): boolean {
    if (this.selectedPaymentMethod === 'cash') {
      return this.isValidCashAmount && !this.isProcessing;
    }
    return !this.isProcessing;
  }

  get selectedPaymentMethodName(): string {
    const method = this.paymentMethods.find(
      (m) => m.id === this.selectedPaymentMethod
    );
    return method?.name || '';
  }

  selectPaymentMethod(methodId: string) {
    this.selectedPaymentMethod = methodId;
    if (methodId !== 'cash') {
      this.cashReceived = 0;
    }
  }

  setCashAmount(amount: number) {
    if (amount === 0) {
      // "Exact" button
      this.cashReceived = this.total;
    } else {
      this.cashReceived = amount;
    }
  }

  onCashInputChange(event: any) {
    const value = parseFloat(event.target.value) || 0;
    this.cashReceived = value;
  }

  async processPayment() {
    if (!this.canProcessPayment) return;

    this.isProcessing = true;

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const paymentResult: PaymentResult = {
      success: true,
      method: this.selectedPaymentMethod,
      amountPaid:
        this.selectedPaymentMethod === 'cash' ? this.cashReceived : this.total,
      change: this.selectedPaymentMethod === 'cash' ? this.changeAmount : 0,
      transactionId: this.generateTransactionId(),
    };

    this.paymentComplete.emit(paymentResult);
    this.isProcessing = false;
    this.resetForm();
  }

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  private resetForm() {
    this.selectedPaymentMethod = 'cash';
    this.cashReceived = 0;
    this.isProcessing = false;
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getPaymentMethodIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      cash: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      card: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
      mobile:
        'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM17 19H7V5h10v14z',
      bank: 'M11.5 1L2 6v2h20V6m-5 4v7h3v-7M2 17v2h20v-2M6 10v7h3v-7m7 0v7h3v-7',
    };
    return icons[iconName] || icons['cash'];
  }
}

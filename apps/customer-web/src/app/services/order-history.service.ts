import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.service';
import { PaymentResult } from '../components/payment-modal/payment-modal.component';

export interface CompletedOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment: PaymentResult;
  timestamp: Date;
  cashier: string;
  tableNumber?: string;
  customerName?: string;
  status: 'completed' | 'refunded' | 'cancelled';
}

export interface DailySummary {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  paymentMethods: {
    cash: number;
    card: number;
    mobile: number;
    bankTransfer: number;
  };
  topItems: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private ordersSubject = new BehaviorSubject<CompletedOrder[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor() {
    // Load orders from localStorage on initialization
    this.loadOrdersFromStorage();
  }

  // Add a completed order
  addOrder(
    items: CartItem[],
    subtotal: number,
    tax: number,
    total: number,
    payment: PaymentResult,
    cashier: string = 'Current User',
    tableNumber?: string
  ): CompletedOrder {
    const order: CompletedOrder = {
      id: this.generateOrderId(),
      orderNumber: this.generateOrderNumber(),
      items: [...items],
      subtotal,
      tax,
      total,
      payment,
      timestamp: new Date(),
      cashier,
      tableNumber,
      status: 'completed',
    };

    const currentOrders = this.getOrders();
    currentOrders.unshift(order); // Add to beginning for newest first
    this.ordersSubject.next(currentOrders);
    this.saveOrdersToStorage();

    return order;
  }

  // Get all orders
  getOrders(): CompletedOrder[] {
    return this.ordersSubject.value;
  }

  // Get orders for a specific date
  getOrdersForDate(date: Date): CompletedOrder[] {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return this.getOrders().filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= targetDate && orderDate < nextDay;
    });
  }

  // Get today's orders
  getTodaysOrders(): CompletedOrder[] {
    return this.getOrdersForDate(new Date());
  }

  // Calculate daily summary
  getDailySummary(date: Date = new Date()): DailySummary {
    const ordersForDate = this.getOrdersForDate(date);

    const summary: DailySummary = {
      date: date.toISOString().split('T')[0],
      totalOrders: ordersForDate.length,
      totalRevenue: ordersForDate.reduce((sum, order) => sum + order.total, 0),
      paymentMethods: {
        cash: 0,
        card: 0,
        mobile: 0,
        bankTransfer: 0,
      },
      topItems: [],
    };

    // Calculate payment method breakdown
    ordersForDate.forEach((order) => {
      switch (order.payment.method) {
        case 'cash':
          summary.paymentMethods.cash += order.total;
          break;
        case 'card':
          summary.paymentMethods.card += order.total;
          break;
        case 'mobile':
          summary.paymentMethods.mobile += order.total;
          break;
        case 'bank-transfer':
          summary.paymentMethods.bankTransfer += order.total;
          break;
      }
    });

    // Calculate top items
    const itemMap = new Map<string, { quantity: number; revenue: number }>();
    ordersForDate.forEach((order) => {
      order.items.forEach((item) => {
        const existing = itemMap.get(item.name) || { quantity: 0, revenue: 0 };
        itemMap.set(item.name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.price * item.quantity,
        });
      });
    });

    summary.topItems = Array.from(itemMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return summary;
  }

  // Find order by order number
  findByOrderNumber(orderNumber: string): CompletedOrder | undefined {
    return this.getOrders().find((order) => order.orderNumber === orderNumber);
  }

  // Get recent orders (last 10)
  getRecentOrders(): CompletedOrder[] {
    return this.getOrders().slice(0, 10);
  }

  // Clear all orders (for testing)
  clearAllOrders() {
    this.ordersSubject.next([]);
    this.saveOrdersToStorage();
  }

  // Format price in Nigerian Naira
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Private helper methods
  private generateOrderId(): string {
    return (
      'order_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
    );
  }

  private generateOrderNumber(): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const orderCount = this.getTodaysOrders().length + 1;
    return `ORD${dateStr}${orderCount.toString().padStart(3, '0')}`;
  }

  private saveOrdersToStorage() {
    try {
      const orders = this.getOrders();
      localStorage.setItem('restaurant_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save orders to localStorage:', error);
    }
  }

  private loadOrdersFromStorage() {
    try {
      const stored = localStorage.getItem('restaurant_orders');
      if (stored) {
        const orders: CompletedOrder[] = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        orders.forEach((order) => {
          order.timestamp = new Date(order.timestamp);
        });
        this.ordersSubject.next(orders);
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
    }
  }
}

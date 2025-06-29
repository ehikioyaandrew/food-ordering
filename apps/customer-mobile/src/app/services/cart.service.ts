import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
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

export interface DeliveryAddress {
  id: number;
  title: string;
  address: string;
  isDefault: boolean;
}

export interface PromoCode {
  code: string;
  discount: number;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  restaurantName: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  orderNotes: string;
  status: 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDeliveryTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private orderHistorySubject = new BehaviorSubject<Order[]>([]);

  // Observable streams
  cartItems$ = this.cartItemsSubject.asObservable();
  orderHistory$ = this.orderHistorySubject.asObservable();

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCartFromStorage();
    this.loadOrderHistoryFromStorage();

    // Add mock data for demonstration
    this.initializeMockData();
  }

  // Cart Management Methods
  addToCart(item: CartItem) {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Add new item to cart
      this.cartItemsSubject.next([...currentItems, item]);
    }

    this.saveCartToStorage();
  }

  removeFromCart(itemId: number) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(
      (cartItem) => cartItem.id === itemId
    );

    if (existingItem && existingItem.quantity > 1) {
      // Decrease quantity
      const updatedItems = currentItems.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Remove item completely
      const updatedItems = currentItems.filter(
        (cartItem) => cartItem.id !== itemId
      );
      this.cartItemsSubject.next(updatedItems);
    }

    this.saveCartToStorage();
  }

  deleteItemFromCart(itemId: number) {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(
      (cartItem) => cartItem.id !== itemId
    );
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  // Cart Calculation Methods
  getSubtotal(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotalItems(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  calculateDeliveryFee(): number {
    const subtotal = this.getSubtotal();
    return subtotal > 25 ? 0 : 2.99; // Free delivery over $25
  }

  calculateTax(): number {
    const subtotal = this.getSubtotal();
    return subtotal * 0.08; // 8% tax
  }

  calculateTotal(discount: number = 0): number {
    const subtotal = this.getSubtotal();
    const deliveryFee = this.calculateDeliveryFee();
    const tax = this.calculateTax();
    return subtotal + deliveryFee + tax - discount;
  }

  // Order Management Methods
  createOrder(
    deliveryAddress: DeliveryAddress,
    paymentMethod: string,
    orderNotes: string,
    appliedPromo?: PromoCode
  ): Order {
    const items = this.cartItemsSubject.value;
    const subtotal = this.getSubtotal();
    const deliveryFee = this.calculateDeliveryFee();
    const tax = this.calculateTax();
    const discount = appliedPromo?.discount || 0;
    const total = this.calculateTotal(discount);

    const order: Order = {
      id: this.generateOrderId(),
      items: [...items],
      restaurantName: items[0]?.restaurantName || 'Unknown Restaurant',
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      deliveryAddress,
      paymentMethod,
      orderNotes,
      status: 'preparing',
      createdAt: new Date(),
      estimatedDeliveryTime: '25-35 min',
    };

    // Add to order history
    const currentOrders = this.orderHistorySubject.value;
    this.orderHistorySubject.next([order, ...currentOrders]);
    this.saveOrderHistoryToStorage();

    // Clear cart after order is created
    this.clearCart();

    return order;
  }

  getOrderHistory(): Order[] {
    return this.orderHistorySubject.value;
  }

  getRecentOrders(limit: number = 3): Order[] {
    return this.orderHistorySubject.value.slice(0, limit);
  }

  // Get current cart items synchronously
  getCurrentCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Utility Methods
  private generateOrderId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `ORD-${timestamp.slice(-6)}${random}`;
  }

  // Local Storage Methods
  private saveCartToStorage() {
    const items = this.cartItemsSubject.value;
    localStorage.setItem('cart_items', JSON.stringify(items));
  }

  private loadCartFromStorage() {
    const saved = localStorage.getItem('cart_items');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveOrderHistoryToStorage() {
    const orders = this.orderHistorySubject.value;
    localStorage.setItem('order_history', JSON.stringify(orders));
  }

  private loadOrderHistoryFromStorage() {
    const saved = localStorage.getItem('order_history');
    if (saved) {
      try {
        const orders = JSON.parse(saved);
        // Convert string dates back to Date objects
        const parsedOrders = orders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
        }));
        this.orderHistorySubject.next(parsedOrders);
      } catch (error) {
        console.error('Error loading order history from storage:', error);
      }
    }
  }

  // Mock data for demonstration
  private initializeMockData() {
    // Only add mock data if no existing data
    if (this.cartItemsSubject.value.length === 0) {
      const mockCartItems: CartItem[] = [
        {
          id: 1,
          name: 'Margherita Pizza',
          description:
            'Classic pizza with fresh mozzarella, tomatoes, and basil',
          price: 16.99,
          image:
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          quantity: 2,
          restaurantName: "Mario's Pizzeria",
          isVegetarian: true,
          isPopular: true,
        },
        {
          id: 5,
          name: 'Tiramisu',
          description: 'Classic Italian dessert with mascarpone and coffee',
          price: 7.99,
          image:
            'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
          quantity: 1,
          restaurantName: "Mario's Pizzeria",
          isVegetarian: true,
        },
      ];

      this.cartItemsSubject.next(mockCartItems);
      this.saveCartToStorage();
    }
  }
}

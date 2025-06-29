import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  // Tax rate (8%)
  private taxRate = 0.08;

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCartFromStorage();
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Add item to cart
  addToCart(item: {
    id: number;
    name: string;
    price: number;
    category: string;
    image?: string;
  }) {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex >= 0) {
      // Item already exists, increase quantity
      currentItems[existingItemIndex].quantity += 1;
    } else {
      // New item, add to cart
      const newCartItem: CartItem = {
        ...item,
        quantity: 1,
      };
      currentItems.push(newCartItem);
    }

    this.updateCart([...currentItems]);
  }

  // Remove item completely from cart
  removeFromCart(itemId: number) {
    const currentItems = this.getCartItems();
    const filteredItems = currentItems.filter((item) => item.id !== itemId);
    this.updateCart(filteredItems);
  }

  // Increase item quantity
  increaseQuantity(itemId: number) {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex((item) => item.id === itemId);

    if (itemIndex >= 0) {
      currentItems[itemIndex].quantity += 1;
      this.updateCart([...currentItems]);
    }
  }

  // Decrease item quantity
  decreaseQuantity(itemId: number) {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex((item) => item.id === itemId);

    if (itemIndex >= 0) {
      if (currentItems[itemIndex].quantity > 1) {
        currentItems[itemIndex].quantity -= 1;
      } else {
        // Remove item if quantity becomes 0
        currentItems.splice(itemIndex, 1);
      }
      this.updateCart([...currentItems]);
    }
  }

  // Calculate subtotal
  getSubtotal(): number {
    const items = this.getCartItems();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Calculate tax
  getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }

  // Calculate total
  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  // Get total items count
  getTotalItemsCount(): number {
    const items = this.getCartItems();
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart (after payment)
  clearCart() {
    this.updateCart([]);
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

  // Private helper methods for localStorage persistence
  private updateCart(items: CartItem[]) {
    this.cartItemsSubject.next(items);
    this.saveCartToStorage(items);
  }

  private saveCartToStorage(items: CartItem[]) {
    try {
      localStorage.setItem('pos_cart_items', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }

  private loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('pos_cart_items');
      if (saved) {
        const items: CartItem[] = JSON.parse(saved);
        this.cartItemsSubject.next(items);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }
}

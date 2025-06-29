import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'blocked';
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  preferredPayment?: string;
  dietaryRestrictions?: string[];
  notes?: string;
}

interface CustomerOrder {
  id: number;
  customerId: number;
  orderNumber: string;
  date: string;
  total: number;
  status: 'completed' | 'cancelled' | 'refunded';
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface CustomerFeedback {
  id: number;
  customerId: number;
  orderId: number;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  responded: boolean;
}

interface LoyaltyTier {
  id: number;
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss',
})
export class CustomerManagementComponent {
  customers: Customer[] = [];
  orders: CustomerOrder[] = [];
  feedback: CustomerFeedback[] = [];
  loyaltyTiers: LoyaltyTier[] = [];

  // Modal states
  showCustomerModal = false;
  showOrderHistoryModal = false;
  showFeedbackModal = false;
  showResponseModal = false;
  selectedCustomer: Customer | null = null;
  selectedFeedback: CustomerFeedback | null = null;

  // Form data
  newCustomer: Partial<Customer> = {};
  feedbackResponse = '';

  // Filters
  statusFilter = 'all';
  searchTerm = '';
  sortBy = 'totalSpent';
  sortOrder = 'desc';

  // View states
  currentView = 'list'; // 'list', 'analytics'

  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize loyalty tiers
    this.loyaltyTiers = [
      {
        id: 1,
        name: 'Bronze',
        minPoints: 0,
        benefits: ['5% discount on orders over ₦2000'],
        color: 'bg-amber-600',
      },
      {
        id: 2,
        name: 'Silver',
        minPoints: 500,
        benefits: ['10% discount on orders over ₦1500', 'Free delivery'],
        color: 'bg-gray-400',
      },
      {
        id: 3,
        name: 'Gold',
        minPoints: 1500,
        benefits: [
          '15% discount on all orders',
          'Free delivery',
          'Priority support',
        ],
        color: 'bg-yellow-500',
      },
      {
        id: 4,
        name: 'Platinum',
        minPoints: 3000,
        benefits: [
          '20% discount on all orders',
          'Free delivery',
          'Priority support',
          'Birthday specials',
        ],
        color: 'bg-purple-600',
      },
    ];

    // Initialize customers with realistic data
    this.customers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Oak Street, Apt 4B',
        city: 'Lagos',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face',
        joinDate: '2023-01-15',
        status: 'active',
        loyaltyPoints: 2450,
        totalOrders: 28,
        totalSpent: 84500,
        averageOrderValue: 3018,
        lastOrderDate: '2024-01-14',
        preferredPayment: 'Card',
        dietaryRestrictions: ['Vegetarian'],
        notes: 'Prefers extra cheese on pizzas',
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        address: '456 Pine Avenue, Unit 12',
        city: 'Abuja',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        joinDate: '2023-03-22',
        status: 'active',
        loyaltyPoints: 1850,
        totalOrders: 35,
        totalSpent: 125000,
        averageOrderValue: 3571,
        lastOrderDate: '2024-01-13',
        preferredPayment: 'Cash',
        dietaryRestrictions: [],
        notes: 'Regular customer, loves spicy food',
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1 (555) 345-6789',
        address: '789 Maple Drive',
        city: 'Lagos',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        joinDate: '2023-05-10',
        status: 'active',
        loyaltyPoints: 3200,
        totalOrders: 42,
        totalSpent: 156000,
        averageOrderValue: 3714,
        lastOrderDate: '2024-01-15',
        preferredPayment: 'Card',
        dietaryRestrictions: ['Gluten-free'],
        notes: 'VIP customer, hosts office parties',
      },
      {
        id: 4,
        name: 'David Thompson',
        email: 'david.thompson@email.com',
        phone: '+1 (555) 456-7890',
        address: '321 Cedar Lane',
        city: 'Port Harcourt',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        joinDate: '2023-07-05',
        status: 'active',
        loyaltyPoints: 820,
        totalOrders: 15,
        totalSpent: 45000,
        averageOrderValue: 3000,
        lastOrderDate: '2024-01-12',
        preferredPayment: 'Digital Wallet',
        dietaryRestrictions: [],
        notes: 'New customer, recently moved to area',
      },
      {
        id: 5,
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '+1 (555) 567-8901',
        address: '654 Birch Street',
        city: 'Lagos',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        joinDate: '2022-11-20',
        status: 'inactive',
        loyaltyPoints: 450,
        totalOrders: 8,
        totalSpent: 24000,
        averageOrderValue: 3000,
        lastOrderDate: '2023-12-15',
        preferredPayment: 'Card',
        dietaryRestrictions: ['Dairy-free'],
        notes: 'Has not ordered recently',
      },
      {
        id: 6,
        name: 'James Wilson',
        email: 'james.wilson@email.com',
        phone: '+1 (555) 678-9012',
        address: '987 Elm Court',
        city: 'Kano',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        joinDate: '2023-09-12',
        status: 'blocked',
        loyaltyPoints: 0,
        totalOrders: 3,
        totalSpent: 12000,
        averageOrderValue: 4000,
        lastOrderDate: '2023-11-20',
        preferredPayment: 'Cash',
        dietaryRestrictions: [],
        notes: 'Blocked due to payment issues',
      },
    ];

    // Initialize sample feedback
    this.feedback = [
      {
        id: 1,
        customerId: 1,
        orderId: 101,
        rating: 5,
        comment:
          'Amazing pizza! The crust was perfect and delivery was super fast. Will definitely order again!',
        date: '2024-01-14',
        responded: false,
      },
      {
        id: 2,
        customerId: 2,
        orderId: 102,
        rating: 4,
        comment:
          'Good food overall, but the pasta was a bit too salty for my taste. Everything else was great.',
        date: '2024-01-13',
        response:
          "Thank you for your feedback! We'll make sure to adjust the seasoning. Hope to serve you better next time!",
        responded: true,
      },
      {
        id: 3,
        customerId: 3,
        orderId: 103,
        rating: 5,
        comment:
          'Excellent service as always! The gluten-free options are fantastic and my team loved the office lunch.',
        date: '2024-01-15',
        responded: false,
      },
      {
        id: 4,
        customerId: 4,
        orderId: 104,
        rating: 3,
        comment:
          'Food was okay but delivery took longer than expected. Could improve on timing.',
        date: '2024-01-12',
        responded: false,
      },
    ];

    // Initialize sample orders
    this.orders = [
      {
        id: 101,
        customerId: 1,
        orderNumber: 'ORD-2024-0114-001',
        date: '2024-01-14',
        total: 3500,
        status: 'completed',
        items: [
          {
            id: 1,
            name: 'Margherita Pizza',
            quantity: 1,
            price: 2500,
            total: 2500,
          },
          { id: 2, name: 'Garlic Bread', quantity: 2, price: 500, total: 1000 },
        ],
        deliveryAddress: '123 Oak Street, Apt 4B, Lagos',
        paymentMethod: 'Card',
      },
      {
        id: 102,
        customerId: 2,
        orderNumber: 'ORD-2024-0113-002',
        date: '2024-01-13',
        total: 4200,
        status: 'completed',
        items: [
          {
            id: 3,
            name: 'Spicy Chicken Pasta',
            quantity: 1,
            price: 3200,
            total: 3200,
          },
          { id: 4, name: 'Soft Drink', quantity: 2, price: 500, total: 1000 },
        ],
        deliveryAddress: '456 Pine Avenue, Unit 12, Abuja',
        paymentMethod: 'Cash',
      },
    ];
  }

  // Computed properties
  get filteredCustomers() {
    let filtered = this.customers.filter((customer) => {
      const matchesStatus =
        this.statusFilter === 'all' || customer.status === this.statusFilter;
      const matchesSearch =
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phone.includes(this.searchTerm);
      return matchesStatus && matchesSearch;
    });

    // Sort customers
    filtered.sort((a, b) => {
      const aValue = a[this.sortBy as keyof Customer] as number;
      const bValue = b[this.sortBy as keyof Customer] as number;

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }

  get customerStats() {
    const active = this.customers.filter((c) => c.status === 'active').length;
    const totalRevenue = this.customers.reduce(
      (sum, c) => sum + c.totalSpent,
      0
    );
    const totalOrders = this.customers.reduce(
      (sum, c) => sum + c.totalOrders,
      0
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      total: this.customers.length,
      active,
      totalRevenue,
      avgOrderValue,
      pendingFeedback: this.feedback.filter((f) => !f.responded).length,
    };
  }

  get topCustomers() {
    return [...this.customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }

  // Customer CRUD operations
  openAddCustomerModal() {
    this.newCustomer = {
      status: 'active',
      loyaltyPoints: 0,
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };
    this.showCustomerModal = true;
  }

  openEditCustomerModal(customer: Customer) {
    this.selectedCustomer = { ...customer };
    this.showCustomerModal = true;
  }

  saveCustomer() {
    if (this.selectedCustomer) {
      // Update existing customer
      const index = this.customers.findIndex(
        (c) => c.id === this.selectedCustomer!.id
      );
      if (index !== -1) {
        this.customers[index] = { ...this.selectedCustomer };
      }
    } else if (this.newCustomer.name && this.newCustomer.email) {
      // Add new customer
      const newId = Math.max(...this.customers.map((c) => c.id)) + 1;
      const customer: Customer = {
        id: newId,
        name: this.newCustomer.name,
        email: this.newCustomer.email,
        phone: this.newCustomer.phone || '',
        address: this.newCustomer.address || '',
        city: this.newCustomer.city || '',
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&${newId}`,
        joinDate:
          this.newCustomer.joinDate || new Date().toISOString().split('T')[0],
        status: this.newCustomer.status as 'active' | 'inactive' | 'blocked',
        loyaltyPoints: this.newCustomer.loyaltyPoints || 0,
        totalOrders: this.newCustomer.totalOrders || 0,
        totalSpent: this.newCustomer.totalSpent || 0,
        averageOrderValue: this.newCustomer.averageOrderValue || 0,
        preferredPayment: this.newCustomer.preferredPayment,
        dietaryRestrictions: this.newCustomer.dietaryRestrictions || [],
        notes: this.newCustomer.notes,
      };

      this.customers.push(customer);
    }
    this.closeModals();
  }

  deleteCustomer(customerId: number) {
    if (
      confirm(
        'Are you sure you want to delete this customer? This action cannot be undone.'
      )
    ) {
      this.customers = this.customers.filter((c) => c.id !== customerId);
      // Also remove related feedback and orders
      this.feedback = this.feedback.filter((f) => f.customerId !== customerId);
      this.orders = this.orders.filter((o) => o.customerId !== customerId);
    }
  }

  toggleCustomerStatus(customer: Customer) {
    if (customer.status === 'active') {
      customer.status = 'inactive';
    } else if (customer.status === 'inactive') {
      customer.status = 'active';
    } else {
      customer.status = 'active'; // unblock
    }
  }

  // Order history methods
  openOrderHistory(customer: Customer) {
    this.selectedCustomer = customer;
    this.showOrderHistoryModal = true;
  }

  getCustomerOrders(customerId: number) {
    return this.orders.filter((order) => order.customerId === customerId);
  }

  // Feedback methods
  openFeedbackModal() {
    this.showFeedbackModal = true;
  }

  openResponseModal(feedback: CustomerFeedback) {
    this.selectedFeedback = feedback;
    this.feedbackResponse = feedback.response || '';
    this.showResponseModal = true;
  }

  submitFeedbackResponse() {
    if (this.selectedFeedback && this.feedbackResponse.trim()) {
      this.selectedFeedback.response = this.feedbackResponse.trim();
      this.selectedFeedback.responded = true;
      this.closeModals();
    }
  }

  getCustomerFeedback(customerId: number) {
    return this.feedback.filter((f) => f.customerId === customerId);
  }

  // Loyalty methods
  getCustomerTier(loyaltyPoints: number): LoyaltyTier {
    return (
      this.loyaltyTiers
        .sort((a, b) => b.minPoints - a.minPoints)
        .find((tier) => loyaltyPoints >= tier.minPoints) || this.loyaltyTiers[0]
    );
  }

  addLoyaltyPoints(customer: Customer, points: number) {
    customer.loyaltyPoints += points;
  }

  // Utility methods
  closeModals() {
    this.showCustomerModal = false;
    this.showOrderHistoryModal = false;
    this.showFeedbackModal = false;
    this.showResponseModal = false;
    this.selectedCustomer = null;
    this.selectedFeedback = null;
    this.newCustomer = {};
    this.feedbackResponse = '';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  // Helper method to get customer count for a specific tier
  getCustomersInTier(tierId: number): number {
    return this.customers.filter(
      (customer) => this.getCustomerTier(customer.loyaltyPoints).id === tierId
    ).length;
  }

  // Helper method to find customer by ID
  findCustomerById(customerId: number): Customer | undefined {
    return this.customers.find((customer) => customer.id === customerId);
  }

  // Form binding helpers
  get formName(): string {
    return this.selectedCustomer
      ? this.selectedCustomer.name
      : this.newCustomer.name || '';
  }
  set formName(value: string) {
    if (this.selectedCustomer) {
      this.selectedCustomer.name = value;
    } else {
      this.newCustomer.name = value;
    }
  }

  get formEmail(): string {
    return this.selectedCustomer
      ? this.selectedCustomer.email
      : this.newCustomer.email || '';
  }
  set formEmail(value: string) {
    if (this.selectedCustomer) {
      this.selectedCustomer.email = value;
    } else {
      this.newCustomer.email = value;
    }
  }

  get formPhone(): string {
    return this.selectedCustomer
      ? this.selectedCustomer.phone
      : this.newCustomer.phone || '';
  }
  set formPhone(value: string) {
    if (this.selectedCustomer) {
      this.selectedCustomer.phone = value;
    } else {
      this.newCustomer.phone = value;
    }
  }

  get formAddress(): string {
    return this.selectedCustomer
      ? this.selectedCustomer.address
      : this.newCustomer.address || '';
  }
  set formAddress(value: string) {
    if (this.selectedCustomer) {
      this.selectedCustomer.address = value;
    } else {
      this.newCustomer.address = value;
    }
  }

  get formCity(): string {
    return this.selectedCustomer
      ? this.selectedCustomer.city
      : this.newCustomer.city || '';
  }
  set formCity(value: string) {
    if (this.selectedCustomer) {
      this.selectedCustomer.city = value;
    } else {
      this.newCustomer.city = value;
    }
  }

  get formStatus(): string {
    return this.selectedCustomer
      ? this.selectedCustomer.status
      : (this.newCustomer.status as string) || 'active';
  }
  set formStatus(value: string) {
    if (this.selectedCustomer) {
      this.selectedCustomer.status = value as 'active' | 'inactive' | 'blocked';
    } else {
      this.newCustomer.status = value as 'active' | 'inactive' | 'blocked';
    }
  }

  get formNotes(): string {
    return this.selectedCustomer
      ? this.selectedCustomer.notes || ''
      : this.newCustomer.notes || '';
  }
  set formNotes(value: string) {
    if (this.selectedCustomer) {
      this.selectedCustomer.notes = value;
    } else {
      this.newCustomer.notes = value;
    }
  }
}

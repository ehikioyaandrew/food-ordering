import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  image: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  isVip: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status:
    | 'new'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'out-for-delivery'
    | 'delivered'
    | 'cancelled';
  orderType: 'delivery' | 'pickup' | 'dine-in';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  estimatedPrepTime: number;
  actualPrepTime?: number;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
  scheduledFor?: Date;
  deliveryAddress?: string;
  rating?: number;
  feedback?: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus = 'all';
  selectedOrderType = 'all';
  searchTerm = '';
  selectedOrder: Order | null = null;
  showOrderDetails = false;

  // Stats
  todayStats = {
    totalOrders: 0,
    newOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  };

  // Status colors and labels
  statusConfig = {
    new: {
      label: 'New',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    },
    confirmed: {
      label: 'Confirmed',
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    },
    preparing: {
      label: 'Preparing',
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
    ready: {
      label: 'Ready',
      color:
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    },
    'out-for-delivery': {
      label: 'Out for Delivery',
      color:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    },
  };

  orderTypeConfig = {
    delivery: { label: 'Delivery', icon: 'truck', color: 'text-blue-600' },
    pickup: { label: 'Pickup', icon: 'store', color: 'text-green-600' },
    'dine-in': {
      label: 'Dine-in',
      icon: 'restaurant',
      color: 'text-purple-600',
    },
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMockData();
    this.filterOrders();
    this.calculateStats();
    this.simulateRealTimeUpdates();
  }

  loadMockData() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    this.orders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customer: {
          id: 'c1',
          name: 'John Doe',
          phone: '+234 901 234 5678',
          email: 'john@example.com',
          address: '123 Main St, Lagos',
          isVip: true,
        },
        items: [
          {
            id: '1',
            name: 'Margherita Pizza',
            quantity: 2,
            price: 2500,
            image:
              'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
          },
          {
            id: '2',
            name: 'Bruschetta',
            quantity: 1,
            price: 850,
            specialInstructions: 'Extra basil please',
            image:
              'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
          },
        ],
        status: 'new',
        orderType: 'delivery',
        subtotal: 5850,
        deliveryFee: 500,
        tax: 585,
        discount: 0,
        total: 6935,
        paymentMethod: 'online',
        paymentStatus: 'paid',
        estimatedPrepTime: 25,
        specialInstructions: 'Ring the doorbell twice',
        createdAt: new Date(now.getTime() - 5 * 60000), // 5 minutes ago
        updatedAt: new Date(now.getTime() - 5 * 60000),
        deliveryAddress: '123 Main St, Lagos',
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customer: {
          id: 'c2',
          name: 'Sarah Johnson',
          phone: '+234 802 345 6789',
          email: 'sarah@example.com',
          address: '456 Oak Ave, Abuja',
          isVip: false,
        },
        items: [
          {
            id: '3',
            name: 'Chicken Parmesan',
            quantity: 1,
            price: 3200,
            image:
              'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
          },
          {
            id: '4',
            name: 'Italian Soda',
            quantity: 2,
            price: 650,
            image:
              'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
          },
        ],
        status: 'preparing',
        orderType: 'pickup',
        subtotal: 4500,
        deliveryFee: 0,
        tax: 450,
        discount: 225, // 5% discount
        total: 4725,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        estimatedPrepTime: 20,
        actualPrepTime: 18,
        createdAt: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
        updatedAt: new Date(now.getTime() - 2 * 60000),
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customer: {
          id: 'c3',
          name: 'Michael Brown',
          phone: '+234 703 456 7890',
          email: 'michael@example.com',
          address: '789 Pine St, Port Harcourt',
          isVip: false,
        },
        items: [
          {
            id: '5',
            name: 'Tiramisu',
            quantity: 2,
            price: 1200,
            image:
              'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
          },
        ],
        status: 'ready',
        orderType: 'delivery',
        subtotal: 2400,
        deliveryFee: 400,
        tax: 240,
        discount: 0,
        total: 3040,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        estimatedPrepTime: 10,
        actualPrepTime: 8,
        createdAt: new Date(now.getTime() - 25 * 60000), // 25 minutes ago
        updatedAt: new Date(now.getTime() - 1 * 60000),
        deliveryAddress: '789 Pine St, Port Harcourt',
      },
      {
        id: '4',
        orderNumber: 'ORD-004',
        customer: {
          id: 'c4',
          name: 'Emily Davis',
          phone: '+234 804 567 8901',
          email: 'emily@example.com',
          address: 'Table 5',
          isVip: true,
        },
        items: [
          {
            id: '6',
            name: 'Margherita Pizza',
            quantity: 1,
            price: 2500,
            image:
              'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
          },
          {
            id: '7',
            name: 'Bruschetta',
            quantity: 2,
            price: 850,
            image:
              'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
          },
        ],
        status: 'confirmed',
        orderType: 'dine-in',
        subtotal: 4200,
        deliveryFee: 0,
        tax: 420,
        discount: 420, // VIP 10% discount
        total: 4200,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        estimatedPrepTime: 18,
        createdAt: new Date(now.getTime() - 8 * 60000), // 8 minutes ago
        updatedAt: new Date(now.getTime() - 3 * 60000),
      },
      {
        id: '5',
        orderNumber: 'ORD-005',
        customer: {
          id: 'c5',
          name: 'David Wilson',
          phone: '+234 905 678 9012',
          email: 'david@example.com',
          address: '321 Elm St, Kano',
          isVip: false,
        },
        items: [
          {
            id: '8',
            name: 'Chicken Parmesan',
            quantity: 1,
            price: 3200,
            image:
              'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
          },
        ],
        status: 'out-for-delivery',
        orderType: 'delivery',
        subtotal: 3200,
        deliveryFee: 600,
        tax: 320,
        discount: 0,
        total: 4120,
        paymentMethod: 'online',
        paymentStatus: 'paid',
        estimatedPrepTime: 20,
        actualPrepTime: 22,
        createdAt: new Date(now.getTime() - 35 * 60000), // 35 minutes ago
        updatedAt: new Date(now.getTime() - 5 * 60000),
        deliveryAddress: '321 Elm St, Kano',
      },
    ];
  }

  filterOrders() {
    let filtered = this.orders;

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(
        (order) => order.status === this.selectedStatus
      );
    }

    // Filter by order type
    if (this.selectedOrderType !== 'all') {
      filtered = filtered.filter(
        (order) => order.orderType === this.selectedOrderType
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(search) ||
          order.customer.name.toLowerCase().includes(search) ||
          order.customer.phone.includes(search) ||
          order.items.some((item) => item.name.toLowerCase().includes(search))
      );
    }

    this.filteredOrders = filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  calculateStats() {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayOrders = this.orders.filter(
      (order) => order.createdAt >= todayStart
    );

    this.todayStats = {
      totalOrders: todayOrders.length,
      newOrders: todayOrders.filter((order) => order.status === 'new').length,
      preparingOrders: todayOrders.filter(
        (order) => order.status === 'preparing'
      ).length,
      readyOrders: todayOrders.filter((order) => order.status === 'ready')
        .length,
      totalRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
      avgOrderValue:
        todayOrders.length > 0
          ? todayOrders.reduce((sum, order) => sum + order.total, 0) /
            todayOrders.length
          : 0,
    };
  }

  updateOrderStatus(order: Order, newStatus: Order['status']) {
    order.status = newStatus;
    order.updatedAt = new Date();

    // Set actual prep time when order is ready
    if (newStatus === 'ready' && !order.actualPrepTime) {
      const prepTime = Math.floor(
        (order.updatedAt.getTime() - order.createdAt.getTime()) / 60000
      );
      order.actualPrepTime = prepTime;
    }

    this.calculateStats();
    this.filterOrders();
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails() {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  onStatusChange() {
    this.filterOrders();
  }

  onOrderTypeChange() {
    this.filterOrders();
  }

  onSearchChange() {
    this.filterOrders();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  formatPrice(price: number): string {
    return `₦${price.toLocaleString()}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  getTimeSince(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  getStatusColor(status: Order['status']): string {
    return this.statusConfig[status]?.color || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: Order['status']): string {
    return this.statusConfig[status]?.label || status;
  }

  getOrderTypeIcon(type: Order['orderType']): string {
    return this.orderTypeConfig[type]?.icon || 'help';
  }

  getOrderTypeColor(type: Order['orderType']): string {
    return this.orderTypeConfig[type]?.color || 'text-gray-600';
  }

  simulateRealTimeUpdates() {
    // Simulate real-time order updates every 30 seconds
    setInterval(() => {
      // Randomly update some orders
      const activeOrders = this.orders.filter((order) =>
        ['new', 'confirmed', 'preparing'].includes(order.status)
      );

      if (activeOrders.length > 0) {
        const randomOrder =
          activeOrders[Math.floor(Math.random() * activeOrders.length)];
        const statusFlow = ['new', 'confirmed', 'preparing', 'ready'];
        const currentIndex = statusFlow.indexOf(randomOrder.status);

        if (currentIndex < statusFlow.length - 1) {
          const nextStatus = statusFlow[currentIndex + 1] as Order['status'];
          this.updateOrderStatus(randomOrder, nextStatus);
        }
      }
    }, 30000);
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }
}

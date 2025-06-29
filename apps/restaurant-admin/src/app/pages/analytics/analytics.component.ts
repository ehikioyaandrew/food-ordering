import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface PopularItem {
  id: string;
  name: string;
  category: string;
  ordersCount: number;
  revenue: number;
  image: string;
  percentage: number;
}

interface CustomerInsight {
  newCustomers: number;
  returningCustomers: number;
  vipCustomers: number;
  totalCustomers: number;
  averageOrderValue: number;
  customerRetentionRate: number;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  unit: string;
  change: number; // percentage change
  changeDirection: 'up' | 'down' | 'neutral';
  icon: string;
}

interface TimeSlot {
  hour: string;
  orders: number;
  revenue: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit {
  selectedPeriod = '7days';
  selectedMetric = 'revenue';

  // Analytics data
  totalRevenue = 0;
  totalOrders = 0;
  averageOrderValue = 0;
  revenueGrowth = 0;

  // Tooltip properties
  tooltipPosition = { x: 0, y: 0 };
  tooltipContent = { date: '', value: '' };

  revenueData: RevenueData[] = [];
  popularItems: PopularItem[] = [];
  customerInsights: CustomerInsight = {
    newCustomers: 0,
    returningCustomers: 0,
    vipCustomers: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    customerRetentionRate: 0,
  };
  performanceMetrics: PerformanceMetric[] = [];
  hourlyData: TimeSlot[] = [];

  // Order status distribution
  orderStatusData = {
    delivered: 0,
    preparing: 0,
    cancelled: 0,
    pending: 0,
  };

  // Category performance
  categoryData = [
    { name: 'Pizzas', revenue: 0, orders: 0, percentage: 0 },
    { name: 'Appetizers', revenue: 0, orders: 0, percentage: 0 },
    { name: 'Main Courses', revenue: 0, orders: 0, percentage: 0 },
    { name: 'Desserts', revenue: 0, orders: 0, percentage: 0 },
    { name: 'Beverages', revenue: 0, orders: 0, percentage: 0 },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  loadAnalyticsData() {
    this.generateRevenueData();
    this.generatePopularItems();
    this.generateCustomerInsights();
    this.generatePerformanceMetrics();
    this.generateHourlyData();
    this.generateOrderStatusData();
    this.generateCategoryData();
    this.calculateTotals();
  }

  generateRevenueData() {
    const today = new Date();
    const days =
      this.selectedPeriod === '7days'
        ? 7
        : this.selectedPeriod === '30days'
        ? 30
        : 90;

    this.revenueData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic revenue data with some randomness
      const baseRevenue = 15000 + Math.sin(i * 0.5) * 5000;
      const randomVariation = (Math.random() - 0.5) * 4000;
      const revenue = Math.max(8000, baseRevenue + randomVariation);

      const orders = Math.floor(revenue / 650); // Average order value around 650

      this.revenueData.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(revenue),
        orders: orders,
      });
    }
  }

  generatePopularItems() {
    const items = [
      {
        id: '1',
        name: 'Margherita Pizza',
        category: 'Pizzas',
        image:
          'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
      },
      {
        id: '2',
        name: 'Chicken Parmesan',
        category: 'Main Courses',
        image:
          'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
      },
      {
        id: '3',
        name: 'Bruschetta',
        category: 'Appetizers',
        image:
          'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
      },
      {
        id: '4',
        name: 'Tiramisu',
        category: 'Desserts',
        image:
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      },
      {
        id: '5',
        name: 'Italian Soda',
        category: 'Beverages',
        image:
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
      },
    ];

    const maxOrders = 45;
    this.popularItems = items.map((item, index) => {
      const ordersCount = maxOrders - index * 8 + Math.floor(Math.random() * 5);
      const avgPrice =
        item.category === 'Pizzas'
          ? 2500
          : item.category === 'Main Courses'
          ? 3200
          : item.category === 'Appetizers'
          ? 850
          : item.category === 'Desserts'
          ? 1200
          : 650;

      return {
        ...item,
        ordersCount,
        revenue: ordersCount * avgPrice,
        percentage: Math.round((ordersCount / maxOrders) * 100),
      };
    });
  }

  generateCustomerInsights() {
    this.customerInsights = {
      newCustomers: 34,
      returningCustomers: 128,
      vipCustomers: 12,
      totalCustomers: 162,
      averageOrderValue: 2850,
      customerRetentionRate: 79,
    };
  }

  generatePerformanceMetrics() {
    this.performanceMetrics = [
      {
        metric: 'Average Prep Time',
        value: 18,
        unit: 'min',
        change: -12,
        changeDirection: 'down',
        icon: 'clock',
      },
      {
        metric: 'Order Accuracy',
        value: 96.8,
        unit: '%',
        change: 2.3,
        changeDirection: 'up',
        icon: 'check',
      },
      {
        metric: 'Customer Rating',
        value: 4.7,
        unit: '/5',
        change: 0.2,
        changeDirection: 'up',
        icon: 'star',
      },
      {
        metric: 'Table Turnover',
        value: 3.2,
        unit: '/day',
        change: 8.5,
        changeDirection: 'up',
        icon: 'refresh',
      },
    ];
  }

  generateHourlyData() {
    const hours = [
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
    ];
    const peakHours = ['12', '13', '18', '19', '20']; // Lunch and dinner rush

    this.hourlyData = hours.map((hour) => {
      const isPeak = peakHours.includes(hour);
      const baseOrders = isPeak
        ? 15 + Math.random() * 10
        : 5 + Math.random() * 8;
      const orders = Math.round(baseOrders);

      return {
        hour: `${hour}:00`,
        orders,
        revenue: orders * (600 + Math.random() * 200), // Average order value with variation
      };
    });
  }

  generateOrderStatusData() {
    this.orderStatusData = {
      delivered: 89,
      preparing: 8,
      cancelled: 2,
      pending: 3,
    };
  }

  generateCategoryData() {
    const totalRevenue = this.revenueData.reduce(
      (sum, day) => sum + day.revenue,
      0
    );

    this.categoryData = [
      {
        name: 'Pizzas',
        revenue: Math.round(totalRevenue * 0.35),
        orders: 56,
        percentage: 35,
      },
      {
        name: 'Main Courses',
        revenue: Math.round(totalRevenue * 0.28),
        orders: 34,
        percentage: 28,
      },
      {
        name: 'Appetizers',
        revenue: Math.round(totalRevenue * 0.15),
        orders: 45,
        percentage: 15,
      },
      {
        name: 'Desserts',
        revenue: Math.round(totalRevenue * 0.12),
        orders: 28,
        percentage: 12,
      },
      {
        name: 'Beverages',
        revenue: Math.round(totalRevenue * 0.1),
        orders: 67,
        percentage: 10,
      },
    ];
  }

  calculateTotals() {
    this.totalRevenue = this.revenueData.reduce(
      (sum, day) => sum + day.revenue,
      0
    );
    this.totalOrders = this.revenueData.reduce(
      (sum, day) => sum + day.orders,
      0
    );
    this.averageOrderValue = this.totalRevenue / this.totalOrders;

    // Calculate growth compared to previous period
    const currentPeriodRevenue = this.totalRevenue;
    const previousPeriodRevenue =
      currentPeriodRevenue * (0.85 + Math.random() * 0.3); // Simulate previous period
    this.revenueGrowth =
      ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) *
      100;
  }

  onPeriodChange(period: string) {
    this.selectedPeriod = period;
    this.loadAnalyticsData();
  }

  onMetricChange(metric: string) {
    this.selectedMetric = metric;
  }

  formatPrice(price: number): string {
    return `₦${price.toLocaleString()}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMaxValue(data: any[], key: string): number {
    return Math.max(...data.map((item) => item[key]));
  }

  getGradientStops(percentage: number): string {
    return `linear-gradient(90deg, #ff6b35 0%, #ff6b35 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  }

  generateLinePath(): string {
    if (this.revenueData.length === 0) return '';

    const width = 380;
    const height = 180;
    const padding = 10;

    const maxValue = this.getMaxValue(this.revenueData, this.selectedMetric);
    const minValue = Math.min(
      ...this.revenueData.map(
        (item) => item[this.selectedMetric as keyof RevenueData] as number
      )
    );

    const points = this.revenueData.map((point, index) => {
      const x = (index / (this.revenueData.length - 1)) * width + padding;
      const value = point[this.selectedMetric as keyof RevenueData] as number;
      const y =
        height -
        padding -
        ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }

  getYPosition(point: RevenueData, metric: string): number {
    const height = 180;
    const padding = 10;

    const maxValue = this.getMaxValue(this.revenueData, metric);
    const minValue = Math.min(
      ...this.revenueData.map(
        (item) => item[metric as keyof RevenueData] as number
      )
    );

    const value = point[metric as keyof RevenueData] as number;
    return (
      height -
      padding -
      ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding)
    );
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  trackByFn(index: number, item: any) {
    return item.id || item.name || index;
  }

  getMetricTooltip(icon: string): string {
    const tooltips = {
      clock: 'Average time to prepare orders',
      check: 'Percentage of orders completed correctly',
      star: 'Customer satisfaction rating',
      refresh: 'Number of times tables are used per day',
    };
    return tooltips[icon as keyof typeof tooltips] || 'Performance metric';
  }

  getMetricDescription(metric: PerformanceMetric): string {
    const descriptions = {
      'Average Prep Time': `Current average preparation time is ${
        metric.value
      } ${metric.unit}. ${
        metric.change >= 0 ? 'Increased' : 'Decreased'
      } by ${Math.abs(metric.change)}% from previous period.`,
      'Order Accuracy': `${metric.value}% of orders are prepared correctly. ${
        metric.change >= 0 ? 'Improved' : 'Decreased'
      } by ${Math.abs(metric.change)}% from previous period.`,
      'Customer Rating': `Average customer satisfaction is ${metric.value}${
        metric.unit
      }. ${metric.change >= 0 ? 'Improved' : 'Decreased'} by ${Math.abs(
        metric.change
      )} points from previous period.`,
      'Table Turnover': `Tables are turned over ${metric.value} times${
        metric.unit
      }. ${metric.change >= 0 ? 'Increased' : 'Decreased'} by ${Math.abs(
        metric.change
      )}% from previous period.`,
    };
    return (
      descriptions[metric.metric as keyof typeof descriptions] ||
      `${metric.metric}: ${metric.value}${metric.unit}`
    );
  }

  showChartTooltip(event: MouseEvent, point: RevenueData, index: number) {
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const containerRect = (event.target as SVGElement)
      .closest('.h-64')
      ?.getBoundingClientRect();

    if (containerRect) {
      this.tooltipPosition = {
        x: rect.left - containerRect.left - 50, // Offset to center tooltip
        y: rect.top - containerRect.top - 60, // Position above the point
      };
    }

    this.tooltipContent = {
      date: this.formatDate(point.date),
      value:
        this.selectedMetric === 'revenue'
          ? this.formatPrice(point.revenue)
          : `${point.orders} orders`,
    };

    // Show tooltip with slight delay
    setTimeout(() => {
      const tooltip = document.querySelector('#chartTooltip') as HTMLElement;
      if (tooltip) {
        tooltip.style.opacity = '1';
      }
    }, 100);
  }

  hideChartTooltip() {
    const tooltip = document.querySelector('#chartTooltip') as HTMLElement;
    if (tooltip) {
      tooltip.style.opacity = '0';
    }
  }
}

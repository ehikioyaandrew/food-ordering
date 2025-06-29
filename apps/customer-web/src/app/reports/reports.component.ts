import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  OrderHistoryService,
  CompletedOrder,
  DailySummary,
} from '../services/order-history.service';

interface ReportPeriod {
  id: string;
  name: string;
  days: number;
}

interface SalesMetric {
  label: string;
  value: number;
  change: number;
  isPositive: boolean;
  format: 'currency' | 'number' | 'percentage';
}

interface HourlyData {
  hour: string;
  orders: number;
  revenue: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  // Date range selection
  selectedPeriod: string = '1'; // Default to today
  customStartDate: string = '';
  customEndDate: string = '';

  reportPeriods: ReportPeriod[] = [
    { id: '1', name: 'Today', days: 1 },
    { id: '7', name: 'Last 7 Days', days: 7 },
    { id: '30', name: 'Last 30 Days', days: 30 },
    { id: '90', name: 'Last 3 Months', days: 90 },
    { id: 'custom', name: 'Custom Range', days: 0 },
  ];

  // Report data
  salesMetrics: SalesMetric[] = [];
  totalOrders: CompletedOrder[] = [];
  dailyRevenue: DailyRevenue[] = [];
  hourlyData: HourlyData[] = [];
  topItems: {
    name: string;
    quantity: number;
    revenue: number;
    category: string;
  }[] = [];
  paymentMethodData: {
    method: string;
    amount: number;
    percentage: number;
    count: number;
  }[] = [];

  // Summary data
  currentPeriodRevenue = 0;
  previousPeriodRevenue = 0;
  currentPeriodOrders = 0;
  previousPeriodOrders = 0;
  averageOrderValue = 0;
  peakHour = '';
  totalCustomers = 0;

  constructor(private orderHistoryService: OrderHistoryService) {
    // Initialize custom date range to today
    const today = new Date();

    this.customEndDate = today.toISOString().split('T')[0];
    this.customStartDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.generateReport();
  }

  onPeriodChange() {
    if (this.selectedPeriod !== 'custom') {
      const days = parseInt(this.selectedPeriod);
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - days);

      this.customEndDate = endDate.toISOString().split('T')[0];
      this.customStartDate = startDate.toISOString().split('T')[0];
    }
    this.generateReport();
  }

  onCustomDateChange() {
    if (this.selectedPeriod === 'custom') {
      this.generateReport();
    }
  }

  generateReport() {
    const startDate = new Date(this.customStartDate);
    const endDate = new Date(this.customEndDate);

    // Get orders for current period
    this.totalOrders = this.getOrdersInRange(startDate, endDate);

    // Get orders for previous period (for comparison)
    const periodLength = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - periodLength);

    const previousOrders = this.getOrdersInRange(
      previousStartDate,
      previousEndDate
    );

    this.calculateMetrics(this.totalOrders, previousOrders);
    this.calculateHourlyData();
    this.calculateDailyRevenue();
    this.calculateTopItems();
    this.calculatePaymentMethodData();
  }

  private getOrdersInRange(startDate: Date, endDate: Date): CompletedOrder[] {
    const allOrders = this.orderHistoryService.getOrders();

    // Adjust endDate to include the entire day (set to 23:59:59.999)
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    return allOrders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= startDate && orderDate <= adjustedEndDate;
    });
  }

  private calculateMetrics(
    currentOrders: CompletedOrder[],
    previousOrders: CompletedOrder[]
  ) {
    // Current period metrics
    this.currentPeriodRevenue = currentOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    this.currentPeriodOrders = currentOrders.length;
    this.averageOrderValue =
      this.currentPeriodOrders > 0
        ? this.currentPeriodRevenue / this.currentPeriodOrders
        : 0;

    // Previous period metrics
    this.previousPeriodRevenue = previousOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    this.previousPeriodOrders = previousOrders.length;

    // Calculate percentage changes
    const revenueChange =
      this.previousPeriodRevenue > 0
        ? ((this.currentPeriodRevenue - this.previousPeriodRevenue) /
            this.previousPeriodRevenue) *
          100
        : 0;

    const ordersChange =
      this.previousPeriodOrders > 0
        ? ((this.currentPeriodOrders - this.previousPeriodOrders) /
            this.previousPeriodOrders) *
          100
        : 0;

    const avgOrderValueChange =
      this.previousPeriodOrders > 0
        ? ((this.averageOrderValue -
            this.previousPeriodRevenue / this.previousPeriodOrders) /
            (this.previousPeriodRevenue / this.previousPeriodOrders)) *
          100
        : 0;

    // Build metrics array
    this.salesMetrics = [
      {
        label: 'Total Revenue',
        value: this.currentPeriodRevenue,
        change: revenueChange,
        isPositive: revenueChange >= 0,
        format: 'currency',
      },
      {
        label: 'Total Orders',
        value: this.currentPeriodOrders,
        change: ordersChange,
        isPositive: ordersChange >= 0,
        format: 'number',
      },
      {
        label: 'Average Order Value',
        value: this.averageOrderValue,
        change: avgOrderValueChange,
        isPositive: avgOrderValueChange >= 0,
        format: 'currency',
      },
      {
        label: 'Customer Count',
        value: this.currentPeriodOrders, // Assuming 1 customer per order for now
        change: ordersChange,
        isPositive: ordersChange >= 0,
        format: 'number',
      },
    ];
  }

  private calculateHourlyData() {
    const hourlyMap = new Map<number, { orders: number; revenue: number }>();

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, { orders: 0, revenue: 0 });
    }

    // Aggregate orders by hour
    this.totalOrders.forEach((order) => {
      const hour = new Date(order.timestamp).getHours();
      const existing = hourlyMap.get(hour)!;
      hourlyMap.set(hour, {
        orders: existing.orders + 1,
        revenue: existing.revenue + order.total,
      });
    });

    // Convert to array and find peak hour
    this.hourlyData = Array.from(hourlyMap.entries()).map(([hour, data]) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      orders: data.orders,
      revenue: data.revenue,
    }));

    // Find peak hour
    const peakHourData = this.hourlyData.reduce((max, current) =>
      current.orders > max.orders ? current : max
    );
    this.peakHour = peakHourData.hour;
  }

  private calculateDailyRevenue() {
    const dailyMap = new Map<string, { revenue: number; orders: number }>();

    this.totalOrders.forEach((order) => {
      const date = new Date(order.timestamp).toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { revenue: 0, orders: 0 };
      dailyMap.set(date, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1,
      });
    });

    this.dailyRevenue = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateTopItems() {
    const itemMap = new Map<
      string,
      { quantity: number; revenue: number; category: string }
    >();

    this.totalOrders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = itemMap.get(item.name) || {
          quantity: 0,
          revenue: 0,
          category: item.category,
        };
        itemMap.set(item.name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.price * item.quantity,
          category: item.category,
        });
      });
    });

    this.topItems = Array.from(itemMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private calculatePaymentMethodData() {
    const paymentMap = new Map<string, { amount: number; count: number }>();
    let totalRevenue = 0;

    this.totalOrders.forEach((order) => {
      const method = order.payment.method;
      const existing = paymentMap.get(method) || { amount: 0, count: 0 };
      paymentMap.set(method, {
        amount: existing.amount + order.total,
        count: existing.count + 1,
      });
      totalRevenue += order.total;
    });

    this.paymentMethodData = Array.from(paymentMap.entries())
      .map(([method, data]) => ({
        method: this.getPaymentMethodName(method),
        amount: data.amount,
        percentage: totalRevenue > 0 ? (data.amount / totalRevenue) * 100 : 0,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // Utility methods
  formatValue(metric: SalesMetric): string {
    switch (metric.format) {
      case 'currency':
        return this.formatPrice(metric.value);
      case 'percentage':
        return `${metric.value.toFixed(1)}%`;
      default:
        return metric.value.toLocaleString();
    }
  }

  formatPrice(price: number): string {
    return this.orderHistoryService.formatPrice(price);
  }

  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  private getPaymentMethodName(methodId: string): string {
    const methods: { [key: string]: string } = {
      cash: 'Cash Payment',
      card: 'Debit/Credit Card',
      mobile: 'Mobile Money',
      'bank-transfer': 'Bank Transfer',
    };
    return methods[methodId] || methodId;
  }

  exportReport() {
    const reportData = this.generateReportCSV();
    // Add UTF-8 BOM to fix encoding issues
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + reportData], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${this.customStartDate}-to-${this.customEndDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateReportCSV(): string {
    const lines: string[] = [];

    // Helper function to escape CSV values only when necessary
    const escapeCSV = (value: string | number): string => {
      const str = String(value);
      // Only escape if the value contains commas, quotes, or newlines
      if (
        str.includes(',') ||
        str.includes('"') ||
        str.includes('\n') ||
        str.includes('\r')
      ) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    // Format numbers with commas and Naira symbol
    const formatCurrency = (value: number): string => {
      const formatted = Math.round(value).toLocaleString('en-US');
      return `₦${formatted}`;
    };

    // Format regular numbers with commas
    const formatNumber = (value: number): string => {
      return Math.round(value).toLocaleString('en-US');
    };

    // Report Header
    lines.push('SALES REPORT');
    lines.push(`Report Period,${this.getCurrentPeriodName()}`);
    lines.push(`Date Range,${this.customStartDate} to ${this.customEndDate}`);
    lines.push(`Generated On,${new Date().toLocaleDateString()}`);
    lines.push(''); // Empty line

    // Key Metrics Section
    lines.push('KEY METRICS');
    lines.push('Metric,Value,Change from Previous Period');
    this.salesMetrics.forEach((metric) => {
      let value: string;
      if (metric.format === 'currency') {
        value = formatCurrency(metric.value);
      } else if (metric.format === 'percentage') {
        value = metric.value.toFixed(1) + '%';
      } else {
        value = formatNumber(metric.value);
      }
      const change =
        (metric.change >= 0 ? '+' : '') + metric.change.toFixed(1) + '%';
      lines.push(
        `${escapeCSV(metric.label)},${escapeCSV(value)},${escapeCSV(change)}`
      );
    });
    lines.push(''); // Empty line

    // Top Items Section
    lines.push('TOP SELLING ITEMS');
    lines.push('Item Name,Category,Quantity Sold,Revenue');
    this.topItems.forEach((item) => {
      lines.push(
        `${escapeCSV(item.name)},${escapeCSV(item.category)},${formatNumber(
          item.quantity
        )},${escapeCSV(formatCurrency(item.revenue))}`
      );
    });
    lines.push(''); // Empty line

    // Payment Methods Section
    lines.push('PAYMENT METHODS BREAKDOWN');
    lines.push('Payment Method,Amount,Percentage,Order Count');
    this.paymentMethodData.forEach((payment) => {
      lines.push(
        `${escapeCSV(payment.method)},${escapeCSV(
          formatCurrency(payment.amount)
        )},${payment.percentage.toFixed(1)}%,${formatNumber(payment.count)}`
      );
    });
    lines.push(''); // Empty line

    // Hourly Performance Section
    const activeHours = this.getActiveHours();
    if (activeHours.length > 0) {
      lines.push('HOURLY PERFORMANCE');
      lines.push('Hour,Orders,Revenue,Average Order Value');
      activeHours.forEach((hour) => {
        const avgOrderValue =
          hour.orders > 0 ? Math.round(hour.revenue / hour.orders) : 0;
        lines.push(
          `${hour.hour},${formatNumber(hour.orders)},${escapeCSV(
            formatCurrency(hour.revenue)
          )},${escapeCSV(formatCurrency(avgOrderValue))}`
        );
      });
      lines.push(''); // Empty line
    }

    // Daily Revenue Section
    if (this.dailyRevenue.length > 0) {
      lines.push('DAILY REVENUE BREAKDOWN');
      lines.push('Date,Orders,Revenue,Average Order Value');
      this.dailyRevenue.forEach((day) => {
        const avgOrderValue =
          day.orders > 0 ? Math.round(day.revenue / day.orders) : 0;
        const formattedDate = new Date(day.date).toLocaleDateString();
        lines.push(
          `${escapeCSV(formattedDate)},${formatNumber(day.orders)},${escapeCSV(
            formatCurrency(day.revenue)
          )},${escapeCSV(formatCurrency(avgOrderValue))}`
        );
      });
    }

    return lines.join('\n');
  }

  getCurrentPeriodName(): string {
    const period = this.reportPeriods.find((p) => p.id === this.selectedPeriod);
    return period?.name || 'Custom Range';
  }

  // Get only hours that have orders (for cleaner display)
  getActiveHours(): HourlyData[] {
    return this.hourlyData.filter((hour) => hour.orders > 0);
  }

  // Calculate percentage for progress bar visualization
  getHourPercentage(hour: HourlyData): number {
    const activeHours = this.getActiveHours();
    if (activeHours.length === 0) return 0;

    const maxRevenue = Math.max(...activeHours.map((h) => h.revenue));
    return maxRevenue > 0 ? (hour.revenue / maxRevenue) * 100 : 0;
  }
}

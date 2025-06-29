import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  OrderHistoryService,
  CompletedOrder,
  DailySummary,
} from '../services/order-history.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: CompletedOrder[] = [];
  filteredOrders: CompletedOrder[] = [];
  dailySummary: DailySummary | null = null;
  selectedOrder: CompletedOrder | null = null;

  // Filters
  searchQuery = '';
  selectedPaymentMethod = 'all';
  selectedDate = new Date().toISOString().split('T')[0]; // Today

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // View state
  showOrderDetail = false;

  paymentMethods = [
    { id: 'all', name: 'All Payment Methods' },
    { id: 'cash', name: 'Cash Payment' },
    { id: 'card', name: 'Debit/Credit Card' },
    { id: 'mobile', name: 'Mobile Money' },
    { id: 'bank-transfer', name: 'Bank Transfer' },
  ];

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit() {
    this.loadOrders();
    this.loadDailySummary();
  }

  loadOrders() {
    if (this.selectedDate) {
      const date = new Date(this.selectedDate);
      this.orders = this.orderHistoryService.getOrdersForDate(date);
    } else {
      this.orders = this.orderHistoryService.getOrders();
    }
    this.applyFilters();
  }

  loadDailySummary() {
    const date = this.selectedDate ? new Date(this.selectedDate) : new Date();
    this.dailySummary = this.orderHistoryService.getDailySummary(date);
  }

  applyFilters() {
    let filtered = [...this.orders];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.cashier.toLowerCase().includes(query) ||
          order.tableNumber?.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }

    // Filter by payment method
    if (this.selectedPaymentMethod !== 'all') {
      filtered = filtered.filter(
        (order) => order.payment.method === this.selectedPaymentMethod
      );
    }

    this.filteredOrders = filtered;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onPaymentMethodChange() {
    this.applyFilters();
  }

  onDateChange() {
    this.loadOrders();
    this.loadDailySummary();
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  get paginatedOrders(): CompletedOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Order actions
  viewOrderDetail(order: CompletedOrder) {
    this.selectedOrder = order;
    this.showOrderDetail = true;
  }

  closeOrderDetail() {
    this.showOrderDetail = false;
    this.selectedOrder = null;
  }

  printReceipt(order: CompletedOrder) {
    // Generate receipt content
    const receiptContent = this.generateReceiptContent(order);

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private generateReceiptContent(order: CompletedOrder): string {
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${this.formatPrice(item.price)}</td>
          <td>${this.formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { font-weight: bold; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>RestaurantPOS</h2>
          <p>Order #: ${order.orderNumber}</p>
          <p>Date: ${new Date(order.timestamp).toLocaleString()}</p>
          <p>Cashier: ${order.cashier}</p>
          ${order.tableNumber ? `<p>Table: ${order.tableNumber}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <table>
          <tr>
            <td>Subtotal:</td>
            <td class="text-right">${this.formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td>Tax (8%):</td>
            <td class="text-right">${this.formatPrice(order.tax)}</td>
          </tr>
          <tr class="total">
            <td>Total:</td>
            <td class="text-right">${this.formatPrice(order.total)}</td>
          </tr>
          <tr>
            <td>Payment Method:</td>
            <td class="text-right">${this.getPaymentMethodName(
              order.payment.method
            )}</td>
          </tr>
          <tr>
            <td>Amount Paid:</td>
            <td class="text-right">${this.formatPrice(
              order.payment.amountPaid
            )}</td>
          </tr>
          ${
            order.payment.change > 0
              ? `
          <tr>
            <td>Change:</td>
            <td class="text-right">${this.formatPrice(
              order.payment.change
            )}</td>
          </tr>
          `
              : ''
          }
        </table>
        
        <div style="text-align: center; margin-top: 20px;">
          <p>Thank you for your business!</p>
          <p>Transaction ID: ${order.payment.transactionId}</p>
        </div>
      </body>
      </html>
    `;
  }

  // Utility methods
  formatPrice(price: number): string {
    return this.orderHistoryService.formatPrice(price);
  }

  getPaymentMethodName(methodId: string): string {
    const method = this.paymentMethods.find((m) => m.id === methodId);
    return method?.name || methodId;
  }

  getOrderStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'refunded':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  }

  // Quick actions
  clearAllFilters() {
    this.searchQuery = '';
    this.selectedPaymentMethod = 'all';
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.loadOrders();
    this.loadDailySummary();
  }

  exportDailySummary() {
    if (!this.dailySummary) return;

    const csvContent = this.generateDailySummaryCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-summary-${this.selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateDailySummaryCSV(): string {
    if (!this.dailySummary) return '';

    let csv = 'Daily Summary Report\n';
    csv += `Date,${this.dailySummary.date}\n`;
    csv += `Total Orders,${this.dailySummary.totalOrders}\n`;
    csv += `Total Revenue,${this.dailySummary.totalRevenue}\n\n`;

    csv += 'Payment Methods\n';
    csv += `Cash,${this.dailySummary.paymentMethods.cash}\n`;
    csv += `Card,${this.dailySummary.paymentMethods.card}\n`;
    csv += `Mobile Money,${this.dailySummary.paymentMethods.mobile}\n`;
    csv += `Bank Transfer,${this.dailySummary.paymentMethods.bankTransfer}\n\n`;

    csv += 'Top Items\n';
    csv += 'Item,Quantity,Revenue\n';
    this.dailySummary.topItems.forEach((item) => {
      csv += `${item.name},${item.quantity},${item.revenue}\n`;
    });

    return csv;
  }
}

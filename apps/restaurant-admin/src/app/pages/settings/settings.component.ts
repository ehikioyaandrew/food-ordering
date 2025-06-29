import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface RestaurantProfile {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  address: Address;
  businessHours: BusinessHours[];
  socialMedia: SocialMedia;
  pricing: PricingInfo;
  features: RestaurantFeatures;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  isBreakTime?: boolean;
  breakStart?: string;
  breakEnd?: string;
}

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

interface PricingInfo {
  currency: string;
  deliveryFee: number;
  minimumOrder: number;
  serviceFee: number;
  taxRate: number;
}

interface RestaurantFeatures {
  delivery: boolean;
  pickup: boolean;
  dineIn: boolean;
  reservation: boolean;
  loyaltyProgram: boolean;
  giftCards: boolean;
  coupons: boolean;
}

interface PaymentSettings {
  stripe: PaymentProvider;
  paypal: PaymentProvider;
  square: PaymentProvider;
  acceptedCards: string[];
  cashOnDelivery: boolean;
  bankTransfer: boolean;
  paymentProcessing: {
    currency: string;
    processingFee: number;
    autoRefund: boolean;
    refundPolicy: string;
  };
}

interface PaymentProvider {
  enabled: boolean;
  publicKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  testMode: boolean;
}

interface NotificationSettings {
  orderNotifications: {
    newOrder: boolean;
    orderCancelled: boolean;
    orderCompleted: boolean;
    orderDelayed: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  businessNotifications: {
    weeklyReport: boolean;
    monthlyReport: boolean;
    lowInventory: boolean;
    staffUpdates: boolean;
    customerReviews: boolean;
    promotions: boolean;
    email: boolean;
    sms: boolean;
  };
  systemNotifications: {
    maintenance: boolean;
    updates: boolean;
    security: boolean;
    backups: boolean;
    email: boolean;
  };
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordRequirements: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  apiAccess: {
    enabled: boolean;
    apiKey?: string;
    rateLimiting: boolean;
    allowedIPs: string[];
  };
  dataRetention: {
    customerData: number; // days
    orderHistory: number; // days
    analytics: number; // days
  };
}

interface IntegrationSettings {
  pos: {
    enabled: boolean;
    provider: string;
    apiKey?: string;
    syncInventory: boolean;
    syncOrders: boolean;
  };
  delivery: {
    uberEats: { enabled: boolean; apiKey?: string };
    doordash: { enabled: boolean; apiKey?: string };
    grubhub: { enabled: boolean; apiKey?: string };
    ownDelivery: { enabled: boolean; radius: number; drivers: number };
  };
  accounting: {
    quickbooks: { enabled: boolean; apiKey?: string };
    xero: { enabled: boolean; apiKey?: string };
    autoSync: boolean;
  };
  marketing: {
    mailchimp: { enabled: boolean; apiKey?: string };
    constantContact: { enabled: boolean; apiKey?: string };
    autoSegmentation: boolean;
  };
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  // Current active tab
  activeTab = 'profile'; // 'profile', 'payment', 'notifications', 'security', 'integrations'

  // Restaurant profile data
  restaurantProfile: RestaurantProfile = {
    id: 1,
    name: "Mario's Pizzeria",
    description:
      'Authentic Italian pizzas made with fresh ingredients and traditional recipes passed down through generations.',
    cuisine: 'Italian',
    email: 'info@mariospizzeria.com',
    phone: '+234 802 123 4567',
    website: 'https://mariospizzeria.com',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    coverImage:
      'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
    address: {
      street: '15 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
      zipCode: '106104',
      country: 'Nigeria',
      latitude: 6.4281,
      longitude: 3.4219,
    },
    businessHours: [
      { day: 'Monday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'Tuesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'Wednesday', isOpen: true, openTime: '10:00', closeTime: '22:00' },
      { day: 'Thursday', isOpen: true, openTime: '10:00', closeTime: '23:00' },
      { day: 'Friday', isOpen: true, openTime: '10:00', closeTime: '23:00' },
      { day: 'Saturday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
      { day: 'Sunday', isOpen: true, openTime: '12:00', closeTime: '21:00' },
    ],
    socialMedia: {
      facebook: 'https://facebook.com/mariospizzeria',
      instagram: 'https://instagram.com/mariospizzeria',
      twitter: 'https://twitter.com/mariospizzeria',
    },
    pricing: {
      currency: 'NGN',
      deliveryFee: 1500,
      minimumOrder: 5000,
      serviceFee: 500,
      taxRate: 7.5,
    },
    features: {
      delivery: true,
      pickup: true,
      dineIn: true,
      reservation: true,
      loyaltyProgram: true,
      giftCards: false,
      coupons: true,
    },
  };

  // Payment settings - Nigeria focused
  paymentSettings: PaymentSettings = {
    stripe: {
      enabled: false,
      testMode: true,
    },
    paypal: {
      enabled: false,
      testMode: true,
    },
    square: {
      enabled: false,
      testMode: true,
    },
    acceptedCards: ['visa', 'mastercard', 'verve'],
    cashOnDelivery: true,
    bankTransfer: true,
    paymentProcessing: {
      currency: 'NGN',
      processingFee: 1.5,
      autoRefund: true,
      refundPolicy: 'Full refunds within 24 hours of cancellation',
    },
  };

  // Nigerian payment providers
  nigerianPaymentProviders = {
    paystack: {
      enabled: true,
      publicKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      testMode: true,
    },
    flutterwave: {
      enabled: true,
      publicKey: 'FLWPUBK_TEST...',
      secretKey: 'FLWSECK_TEST...',
      testMode: true,
    },
    opay: {
      enabled: false,
      merchantId: '',
      apiKey: '',
      testMode: true,
    },
    kuda: {
      enabled: false,
      apiKey: '',
      testMode: true,
    },
  };

  // Notification settings
  notifications: NotificationSettings = {
    orderNotifications: {
      newOrder: true,
      orderCancelled: true,
      orderCompleted: false,
      orderDelayed: true,
      email: true,
      sms: true,
      push: true,
    },
    businessNotifications: {
      weeklyReport: true,
      monthlyReport: true,
      lowInventory: true,
      staffUpdates: true,
      customerReviews: true,
      promotions: false,
      email: true,
      sms: false,
    },
    systemNotifications: {
      maintenance: true,
      updates: true,
      security: true,
      backups: false,
      email: true,
    },
  };

  // Security settings
  security: SecuritySettings = {
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
    },
    apiAccess: {
      enabled: false,
      rateLimiting: true,
      allowedIPs: [],
    },
    dataRetention: {
      customerData: 1095, // 3 years
      orderHistory: 2555, // 7 years
      analytics: 365, // 1 year
    },
  };

  // Integration settings - Nigeria focused
  integrations: IntegrationSettings = {
    pos: {
      enabled: true,
      provider: 'RestaurantPOS (Internal)',
      apiKey: 'pos_sync_key_' + Math.random().toString(36).substr(2, 9),
      syncInventory: true,
      syncOrders: true,
    },
    delivery: {
      uberEats: { enabled: false },
      doordash: { enabled: false },
      grubhub: { enabled: false },
      ownDelivery: { enabled: true, radius: 10, drivers: 5 },
    },
    accounting: {
      quickbooks: { enabled: false },
      xero: { enabled: false },
      autoSync: false,
    },
    marketing: {
      mailchimp: { enabled: false },
      constantContact: { enabled: false },
      autoSegmentation: false,
    },
  };

  // RestaurantPOS Integration Settings
  restaurantPOSSettings = {
    isConnected: true,
    version: '1.0.0',
    lastSync: new Date(),
    syncInterval: 30, // seconds
    features: {
      realTimeInventory: true,
      orderManagement: true,
      userRoles: true,
      receiptPrinting: true,
      paymentProcessing: true,
      taxCalculation: true,
      cartPersistence: true,
    },
    syncStatus: {
      orders: 'synced',
      inventory: 'synced',
      menu: 'synced',
      users: 'synced',
      payments: 'synced',
    },
    endpoints: {
      orders: '/api/pos/orders',
      inventory: '/api/pos/inventory',
      menu: '/api/pos/menu',
      users: '/api/pos/users',
      sync: '/api/pos/sync',
    },
    cashiers: [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Senior Cashier',
        shift: 'Morning (9AM - 5PM)',
        accessLevel: 'full',
        permissions: ['orders', 'payments', 'refunds', 'reports'],
        isActive: true,
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Cashier',
        shift: 'Evening (5PM - 11PM)',
        accessLevel: 'standard',
        permissions: ['orders', 'payments'],
        isActive: true,
      },
    ],
    settings: {
      taxRate: 8.0,
      currency: 'NGN',
      autoSync: true,
      printReceipts: true,
      requireCashierLogin: true,
      allowRefunds: true,
      maxRefundDays: 7,
    },
  };

  // Nigerian delivery platforms
  nigerianDeliveryPlatforms = {
    jumia: { enabled: true, apiKey: '', commission: 20 },
    bolt: { enabled: false, apiKey: '', commission: 15 },
    glovo: { enabled: false, apiKey: '', commission: 25 },
    chowdeck: { enabled: true, apiKey: '', commission: 18 },
  };

  // Available options - Nigeria focused
  cuisineTypes = [
    'Nigerian',
    'Italian',
    'Chinese',
    'American',
    'Indian',
    'Lebanese',
    'Thai',
    'Continental',
    'Fast Food',
    'Local Dishes',
    'Intercontinental',
    'Other',
  ];
  currencies = ['NGN', 'USD', 'EUR', 'GBP'];
  countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States'];
  nigerianStates = [
    'Lagos',
    'Abuja (FCT)',
    'Kano',
    'Rivers',
    'Oyo',
    'Delta',
    'Edo',
    'Kwara',
    'Kaduna',
    'Plateau',
    'Benue',
    'Niger',
    'Imo',
    'Ogun',
    'Anambra',
    'Bauchi',
    'Sokoto',
    'Kebbi',
    'Cross River',
    'Osun',
    'Akwa Ibom',
    'Ondo',
    'Enugu',
    'Zamfara',
    'Gombe',
    'Ekiti',
    'Kogi',
    'Taraba',
    'Adamawa',
    'Nasarawa',
    'Katsina',
    'Abia',
    'Jigawa',
    'Yobe',
    'Bayelsa',
    'Borno',
    'Ebonyi',
  ];
  posProviders = [
    'RestaurantPOS (Internal)',
    'SystemSpecs (Remita)',
    'Interswitch',
    'AppZone (Zone)',
    'Paystack Terminal',
    'Flutterwave Store',
    'Kuda POS',
    'OPay POS',
    'Other',
  ];

  // Form states
  isLoading = false;
  showPasswordModal = false;
  showApiKeyModal = false;
  selectedApiProvider = '';

  constructor(private router: Router) {}

  // Navigation methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  // Tab navigation
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Save methods
  saveProfile() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('Restaurant profile updated successfully!');
    }, 1000);
  }

  savePaymentSettings() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Payment settings updated successfully!');
    }, 1000);
  }

  saveNotifications() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Notification preferences updated successfully!');
    }, 1000);
  }

  saveSecurity() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Security settings updated successfully!');
    }, 1000);
  }

  saveIntegrations() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Integration settings updated successfully!');
    }, 1000);
  }

  // Utility methods
  onFileSelected(event: any, type: 'logo' | 'cover') {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload to a file service
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'logo') {
          this.restaurantProfile.logo = e.target?.result as string;
        } else {
          this.restaurantProfile.coverImage = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  generateApiKey() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'mk_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.security.apiAccess.apiKey = result;
  }

  testIntegration(provider: string) {
    alert(
      `Testing ${provider} integration... (This would test the actual connection in a real app)`
    );
  }

  resetToDefaults() {
    if (
      confirm(
        'Are you sure you want to reset all settings to defaults? This action cannot be undone.'
      )
    ) {
      // Reset logic here
      alert('Settings reset to defaults');
    }
  }

  exportSettings() {
    const settings = {
      profile: this.restaurantProfile,
      payment: this.paymentSettings,
      notifications: this.notifications,
      security: this.security,
      integrations: this.integrations,
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'restaurant-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  // Modal methods
  openPasswordModal() {
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  openApiKeyModal(provider: string) {
    this.selectedApiProvider = provider;
    this.showApiKeyModal = true;
  }

  closeApiKeyModal() {
    this.showApiKeyModal = false;
    this.selectedApiProvider = '';
  }

  addAllowedIP() {
    const ip = prompt('Enter IP address:');
    if (ip && ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
      this.security.apiAccess.allowedIPs.push(ip);
    } else if (ip) {
      alert('Please enter a valid IP address');
    }
  }

  removeAllowedIP(index: number) {
    this.security.apiAccess.allowedIPs.splice(index, 1);
  }

  // Nigerian-specific methods
  toggleNigerianPaymentProvider(provider: string) {
    if (provider in this.nigerianPaymentProviders) {
      (this.nigerianPaymentProviders as any)[provider].enabled = !(
        this.nigerianPaymentProviders as any
      )[provider].enabled;
    }
  }

  toggleNigerianDeliveryPlatform(platform: string) {
    if (platform in this.nigerianDeliveryPlatforms) {
      (this.nigerianDeliveryPlatforms as any)[platform].enabled = !(
        this.nigerianDeliveryPlatforms as any
      )[platform].enabled;
    }
  }

  // Format currency for Nigerian Naira
  formatCurrency(amount: number): string {
    if (this.restaurantProfile.pricing.currency === 'NGN') {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.restaurantProfile.pricing.currency,
    }).format(amount);
  }

  // Validate Nigerian phone number
  validateNigerianPhone(phone: string): boolean {
    const nigerianPhoneRegex = /^(\+234|234|0)[789][01]\d{8}$/;
    return nigerianPhoneRegex.test(phone.replace(/\s+/g, ''));
  }

  // Get Nigerian business hours in local time
  getLocalTime(): string {
    return new Date().toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Handle state selection
  onStateChange(event: any) {
    const state = event.target?.value;
    if (state) {
      this.restaurantProfile.address.state = state;
      // You could add logic here to update delivery zones based on state
    }
  }

  // RestaurantPOS Integration Methods
  syncWithPOS() {
    this.isLoading = true;
    // Simulate POS sync
    setTimeout(() => {
      this.restaurantPOSSettings.lastSync = new Date();
      this.restaurantPOSSettings.syncStatus = {
        orders: 'synced',
        inventory: 'synced',
        menu: 'synced',
        users: 'synced',
        payments: 'synced',
      };
      this.isLoading = false;
      alert(
        '✅ Successfully synced with RestaurantPOS!\n\n' +
          '📊 Orders: Synced\n' +
          '📦 Inventory: Synced\n' +
          '📋 Menu: Synced\n' +
          '👥 Users: Synced\n' +
          '💳 Payments: Synced'
      );
    }, 2000);
  }

  testPOSConnection() {
    this.isLoading = true;
    // Simulate connection test
    setTimeout(() => {
      this.isLoading = false;
      alert(
        '🔗 RestaurantPOS Connection Test Results:\n\n' +
          '✅ Status: Connected\n' +
          '✅ Version: ' +
          this.restaurantPOSSettings.version +
          '\n' +
          '✅ Response Time: 45ms\n' +
          '✅ All endpoints accessible\n' +
          '✅ Real-time sync: Active\n\n' +
          'Your POS system is working perfectly!'
      );
    }, 1500);
  }

  viewPOSLogs() {
    alert(
      '📋 Recent POS Activity:\n\n' +
        '• 14:32 - Order #1001 processed by Sarah Johnson\n' +
        '• 14:28 - Menu item "Margherita Pizza" updated\n' +
        '• 14:25 - Inventory sync completed\n' +
        '• 14:20 - Michael Chen logged in\n' +
        '• 14:15 - Payment processed: ₦5,500\n' +
        '• 14:10 - Receipt printed for Order #1000\n\n' +
        'All systems operating normally ✅'
    );
  }

  managePOSUsers() {
    const cashierList = this.restaurantPOSSettings.cashiers
      .map(
        (c) =>
          `• ${c.name} (${c.role}) - ${c.shift} ${c.isActive ? '✅' : '❌'}`
      )
      .join('\n');

    alert(
      '👥 RestaurantPOS User Management:\n\n' +
        'Active Cashiers:\n' +
        cashierList +
        '\n\n' +
        'To add/remove cashiers or change permissions,\n' +
        'access the POS User Management panel.'
    );
  }

  restartPOSSync() {
    if (
      confirm(
        '⚠️ This will restart the POS synchronization service.\n\nAny pending transactions may be affected.\nContinue?'
      )
    ) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        alert(
          '🔄 POS Sync Service Restarted Successfully!\n\nAll services are back online.'
        );
      }, 1000);
    }
  }

  updatePOSSettings() {
    alert(
      '⚙️ POS Settings Updated!\n\n' +
        '• Tax Rate: ' +
        this.restaurantPOSSettings.settings.taxRate +
        '%\n' +
        '• Currency: ' +
        this.restaurantPOSSettings.settings.currency +
        '\n' +
        '• Auto Sync: ' +
        (this.restaurantPOSSettings.settings.autoSync
          ? 'Enabled'
          : 'Disabled') +
        '\n' +
        '• Receipt Printing: ' +
        (this.restaurantPOSSettings.settings.printReceipts
          ? 'Enabled'
          : 'Disabled') +
        '\n\n' +
        'Changes will take effect immediately.'
    );
  }

  exportPOSData() {
    const posData = {
      settings: this.restaurantPOSSettings,
      lastExport: new Date(),
      exportedBy: 'Restaurant Admin',
    };

    const dataStr = JSON.stringify(posData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'restaurant-pos-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  // Get POS connection status badge
  getPOSStatusBadge(): string {
    return this.restaurantPOSSettings.isConnected
      ? '🟢 Connected'
      : '🔴 Disconnected';
  }

  // Get sync status for specific component
  getSyncStatusIcon(component: string): string {
    const status = (this.restaurantPOSSettings.syncStatus as any)[component];
    switch (status) {
      case 'synced':
        return '✅';
      case 'syncing':
        return '🔄';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  }

  // Format last sync time
  getLastSyncTime(): string {
    return this.restaurantPOSSettings.lastSync.toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  // Get active cashier count
  getActiveCashierCount(): number {
    return this.restaurantPOSSettings.cashiers.filter((c) => c.isActive).length;
  }

  // Get total cashier count
  getTotalCashierCount(): number {
    return this.restaurantPOSSettings.cashiers.length;
  }

  // Get cashier count display
  getCashierCountDisplay(): string {
    return `${this.getActiveCashierCount()}/${this.getTotalCashierCount()}`;
  }

  // Get auto sync status display
  getAutoSyncStatusDisplay(): string {
    return this.restaurantPOSSettings.settings.autoSync
      ? '✅ Enabled'
      : '❌ Disabled';
  }
}

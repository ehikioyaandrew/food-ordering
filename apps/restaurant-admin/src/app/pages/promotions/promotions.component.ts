import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface DiscountCode {
  id: number;
  code: string;
  name: string;
  type: 'percentage' | 'fixed' | 'free_delivery' | 'bogo';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableItems?: string[];
  targetCustomers: 'all' | 'new' | 'loyalty' | 'segment';
  description: string;
  termsAndConditions: string;
}

interface MarketingCampaign {
  id: number;
  name: string;
  type: 'email' | 'sms' | 'push' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  targetAudience: string;
  targetCount: number;
  sentCount: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  scheduledDate?: string;
  createdDate: string;
  subject: string;
  content: string;
  discountCode?: DiscountCode;
  budget?: number;
  spent?: number;
  revenue?: number;
}

interface CustomerSegment {
  id: number;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  customerCount: number;
  lastUpdated: string;
}

interface SegmentCriteria {
  loyaltyTier?: string[];
  totalOrdersMin?: number;
  totalOrdersMax?: number;
  totalSpentMin?: number;
  totalSpentMax?: number;
  lastOrderDays?: number;
  location?: string[];
  joinedWithinDays?: number;
}

interface PromoAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalCodes: number;
  activeCodes: number;
  totalRedemptions: number;
  revenueFromPromos: number;
  averageOrderIncrease: number;
  topPerformingCode: string;
}

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss',
})
export class PromotionsComponent {
  // Data arrays
  discountCodes: DiscountCode[] = [];
  campaigns: MarketingCampaign[] = [];
  customerSegments: CustomerSegment[] = [];

  // Modal states
  showCodeModal = false;
  showCampaignModal = false;
  showSegmentModal = false;
  showAnalyticsModal = false;
  selectedCode: DiscountCode | null = null;
  selectedCampaign: MarketingCampaign | null = null;

  // Form data
  newCode: Partial<DiscountCode> = {};
  newCampaign: Partial<MarketingCampaign> = {};
  newSegment: Partial<CustomerSegment> = {};

  // View states
  currentView = 'overview'; // 'overview', 'codes', 'campaigns', 'segments', 'analytics'

  // Filters
  codeStatusFilter = 'all';
  campaignStatusFilter = 'all';
  searchTerm = '';

  constructor(private router: Router) {
    this.initializeData();
  }

  initializeData() {
    // Initialize customer segments
    this.customerSegments = [
      {
        id: 1,
        name: 'VIP Customers',
        description: 'High-value customers with 20+ orders',
        criteria: {
          totalOrdersMin: 20,
          totalSpentMin: 50000,
        },
        customerCount: 15,
        lastUpdated: '2024-01-15',
      },
      {
        id: 2,
        name: 'New Customers',
        description: 'Customers who joined within last 30 days',
        criteria: {
          joinedWithinDays: 30,
        },
        customerCount: 32,
        lastUpdated: '2024-01-14',
      },
      {
        id: 3,
        name: 'Inactive Customers',
        description: "Customers who haven't ordered in 60+ days",
        criteria: {
          lastOrderDays: 60,
        },
        customerCount: 28,
        lastUpdated: '2024-01-13',
      },
      {
        id: 4,
        name: 'Gold Members',
        description: 'Customers with Gold loyalty status',
        criteria: {
          loyaltyTier: ['Gold', 'Platinum'],
        },
        customerCount: 8,
        lastUpdated: '2024-01-12',
      },
    ];

    // Initialize discount codes
    this.discountCodes = [
      {
        id: 1,
        code: 'WELCOME20',
        name: 'New Customer Welcome',
        type: 'percentage',
        value: 20,
        minOrderAmount: 1500,
        maxDiscount: 1000,
        usageLimit: 100,
        usedCount: 67,
        validFrom: '2024-01-01',
        validUntil: '2024-03-31',
        isActive: true,
        targetCustomers: 'new',
        description: '20% off for new customers',
        termsAndConditions:
          'Valid for first-time customers only. Minimum order ₦1500.',
      },
      {
        id: 2,
        code: 'PIZZA50',
        name: 'Pizza Special',
        type: 'fixed',
        value: 500,
        minOrderAmount: 2000,
        usageLimit: 200,
        usedCount: 134,
        validFrom: '2024-01-10',
        validUntil: '2024-02-10',
        isActive: true,
        applicableItems: ['Pizza'],
        targetCustomers: 'all',
        description: '₦500 off on pizza orders',
        termsAndConditions:
          'Valid on pizza orders above ₦2000. Cannot be combined with other offers.',
      },
      {
        id: 3,
        code: 'FREESHIP',
        name: 'Free Delivery Weekend',
        type: 'free_delivery',
        value: 0,
        minOrderAmount: 1000,
        usageLimit: 500,
        usedCount: 234,
        validFrom: '2024-01-13',
        validUntil: '2024-01-21',
        isActive: true,
        targetCustomers: 'all',
        description: 'Free delivery on all orders',
        termsAndConditions: 'Valid on weekends. Minimum order ₦1000.',
      },
      {
        id: 4,
        code: 'BOGO25',
        name: 'Buy One Get One',
        type: 'bogo',
        value: 50,
        minOrderAmount: 3000,
        usageLimit: 50,
        usedCount: 23,
        validFrom: '2024-01-15',
        validUntil: '2024-01-25',
        isActive: false,
        targetCustomers: 'loyalty',
        description: 'Buy one pizza, get second 50% off',
        termsAndConditions:
          'Valid on selected pizzas. Lower-priced item gets discount.',
      },
      {
        id: 5,
        code: 'VIP15',
        name: 'VIP Member Exclusive',
        type: 'percentage',
        value: 15,
        minOrderAmount: 2500,
        maxDiscount: 2000,
        usageLimit: 30,
        usedCount: 18,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        isActive: true,
        targetCustomers: 'loyalty',
        description: '15% off for VIP members',
        termsAndConditions: 'Exclusive for Gold and Platinum members.',
      },
    ];

    // Initialize marketing campaigns
    this.campaigns = [
      {
        id: 1,
        name: 'New Year Pizza Blast',
        type: 'email',
        status: 'completed',
        targetAudience: 'All Customers',
        targetCount: 1250,
        sentCount: 1250,
        openRate: 34.5,
        clickRate: 8.2,
        conversionRate: 2.8,
        scheduledDate: '2024-01-01',
        createdDate: '2023-12-28',
        subject: '🍕 New Year Special: 20% Off All Pizzas!',
        content:
          'Start the new year with our delicious pizzas. Use code NEWYEAR20 for 20% off.',
        discountCode: this.discountCodes[0],
        budget: 25000,
        spent: 18500,
        revenue: 125000,
      },
      {
        id: 2,
        name: 'Weekend Free Delivery',
        type: 'sms',
        status: 'active',
        targetAudience: 'Active Customers',
        targetCount: 856,
        sentCount: 856,
        openRate: 92.1,
        clickRate: 15.3,
        conversionRate: 5.2,
        scheduledDate: '2024-01-13',
        createdDate: '2024-01-12',
        subject: 'Weekend Special: Free Delivery!',
        content:
          'Enjoy free delivery this weekend. Order now with code FREESHIP.',
        discountCode: this.discountCodes[2],
        budget: 15000,
        spent: 12800,
        revenue: 87500,
      },
      {
        id: 3,
        name: 'VIP Member Appreciation',
        type: 'push',
        status: 'scheduled',
        targetAudience: 'VIP Customers',
        targetCount: 125,
        sentCount: 0,
        scheduledDate: '2024-01-20',
        createdDate: '2024-01-15',
        subject: 'Exclusive VIP Offer Inside!',
        content:
          'Special appreciation offer for our VIP members. 15% off your next order.',
        discountCode: this.discountCodes[4],
        budget: 8000,
        spent: 0,
        revenue: 0,
      },
      {
        id: 4,
        name: 'Social Media Contest',
        type: 'social',
        status: 'active',
        targetAudience: 'Social Followers',
        targetCount: 3200,
        sentCount: 2850,
        openRate: 12.4,
        clickRate: 3.8,
        conversionRate: 1.2,
        scheduledDate: '2024-01-10',
        createdDate: '2024-01-08',
        subject: 'Win Free Pizza for a Month!',
        content:
          'Tag 3 friends and share this post to win free pizza for a month!',
        budget: 35000,
        spent: 28000,
        revenue: 45000,
      },
      {
        id: 5,
        name: 'Birthday Month Special',
        type: 'email',
        status: 'draft',
        targetAudience: 'Birthday Customers',
        targetCount: 87,
        sentCount: 0,
        createdDate: '2024-01-16',
        subject: 'Happy Birthday! Special Gift Inside',
        content:
          'Celebrate your birthday with us. Enjoy a special discount on your next order.',
        budget: 5000,
        spent: 0,
        revenue: 0,
      },
    ];
  }

  // Computed properties
  get filteredCodes() {
    return this.discountCodes.filter((code) => {
      const matchesStatus =
        this.codeStatusFilter === 'all' ||
        (this.codeStatusFilter === 'active' && code.isActive) ||
        (this.codeStatusFilter === 'inactive' && !code.isActive);
      const matchesSearch =
        code.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        code.code.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  get filteredCampaigns() {
    return this.campaigns.filter((campaign) => {
      const matchesStatus =
        this.campaignStatusFilter === 'all' ||
        campaign.status === this.campaignStatusFilter;
      const matchesSearch =
        campaign.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  get analytics(): PromoAnalytics {
    const activeCodes = this.discountCodes.filter((c) => c.isActive).length;
    const activeCampaigns = this.campaigns.filter(
      (c) => c.status === 'active'
    ).length;
    const totalRedemptions = this.discountCodes.reduce(
      (sum, c) => sum + c.usedCount,
      0
    );
    const revenueFromPromos = this.campaigns.reduce(
      (sum, c) => sum + (c.revenue || 0),
      0
    );
    const topCode = this.discountCodes.reduce(
      (top, code) => (code.usedCount > top.usedCount ? code : top),
      this.discountCodes[0]
    );

    return {
      totalCampaigns: this.campaigns.length,
      activeCampaigns,
      totalCodes: this.discountCodes.length,
      activeCodes,
      totalRedemptions,
      revenueFromPromos,
      averageOrderIncrease: 18.5,
      topPerformingCode: topCode?.code || 'N/A',
    };
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  // Modal methods
  openCodeModal() {
    this.newCode = {
      type: 'percentage',
      targetCustomers: 'all',
      isActive: true,
      usageLimit: 100,
      usedCount: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    };
    this.showCodeModal = true;
  }

  openEditCodeModal(code: DiscountCode) {
    this.selectedCode = { ...code };
    this.showCodeModal = true;
  }

  openCampaignModal() {
    this.newCampaign = {
      type: 'email',
      status: 'draft',
      targetAudience: 'All Customers',
      createdDate: new Date().toISOString().split('T')[0],
    };
    this.showCampaignModal = true;
  }

  openEditCampaignModal(campaign: MarketingCampaign) {
    this.selectedCampaign = { ...campaign };
    this.showCampaignModal = true;
  }

  openSegmentModal() {
    this.newSegment = {
      criteria: {},
    };
    this.showSegmentModal = true;
  }

  closeModals() {
    this.showCodeModal = false;
    this.showCampaignModal = false;
    this.showSegmentModal = false;
    this.showAnalyticsModal = false;
    this.selectedCode = null;
    this.selectedCampaign = null;
    this.newCode = {};
    this.newCampaign = {};
    this.newSegment = {};
  }

  // CRUD operations for discount codes
  saveCode() {
    if (this.selectedCode) {
      // Update existing code
      const index = this.discountCodes.findIndex(
        (c) => c.id === this.selectedCode!.id
      );
      if (index !== -1) {
        this.discountCodes[index] = { ...this.selectedCode };
      }
    } else if (this.newCode.code && this.newCode.name) {
      // Add new code
      const newId = Math.max(...this.discountCodes.map((c) => c.id)) + 1;
      const code: DiscountCode = {
        id: newId,
        code: this.newCode.code!,
        name: this.newCode.name!,
        type: this.newCode.type as any,
        value: this.newCode.value || 0,
        minOrderAmount: this.newCode.minOrderAmount || 0,
        maxDiscount: this.newCode.maxDiscount,
        usageLimit: this.newCode.usageLimit || 100,
        usedCount: 0,
        validFrom: this.newCode.validFrom!,
        validUntil: this.newCode.validUntil!,
        isActive: this.newCode.isActive !== false,
        targetCustomers: this.newCode.targetCustomers as any,
        description: this.newCode.description || '',
        termsAndConditions: this.newCode.termsAndConditions || '',
      };
      this.discountCodes.push(code);
    }
    this.closeModals();
  }

  deleteCode(codeId: number) {
    if (confirm('Are you sure you want to delete this discount code?')) {
      this.discountCodes = this.discountCodes.filter((c) => c.id !== codeId);
    }
  }

  toggleCodeStatus(code: DiscountCode) {
    code.isActive = !code.isActive;
  }

  // CRUD operations for campaigns
  saveCampaign() {
    if (this.selectedCampaign) {
      // Update existing campaign
      const index = this.campaigns.findIndex(
        (c) => c.id === this.selectedCampaign!.id
      );
      if (index !== -1) {
        this.campaigns[index] = { ...this.selectedCampaign };
      }
    } else if (this.newCampaign.name && this.newCampaign.subject) {
      // Add new campaign
      const newId = Math.max(...this.campaigns.map((c) => c.id)) + 1;
      const campaign: MarketingCampaign = {
        id: newId,
        name: this.newCampaign.name!,
        type: this.newCampaign.type as any,
        status: this.newCampaign.status as any,
        targetAudience: this.newCampaign.targetAudience!,
        targetCount: this.newCampaign.targetCount || 0,
        sentCount: 0,
        createdDate: this.newCampaign.createdDate!,
        subject: this.newCampaign.subject!,
        content: this.newCampaign.content || '',
        budget: this.newCampaign.budget,
        spent: 0,
        revenue: 0,
      };
      this.campaigns.push(campaign);
    }
    this.closeModals();
  }

  deleteCampaign(campaignId: number) {
    if (confirm('Are you sure you want to delete this campaign?')) {
      this.campaigns = this.campaigns.filter((c) => c.id !== campaignId);
    }
  }

  // Utility methods
  getCodeTypeColor(type: string): string {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'fixed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'free_delivery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'bogo':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCampaignTypeColor(type: string): string {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'sms':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'push':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'social':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'paused':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getUsagePercentage(code: DiscountCode): number {
    return (code.usedCount / code.usageLimit) * 100;
  }

  isCodeExpired(code: DiscountCode): boolean {
    return new Date(code.validUntil) < new Date();
  }

  generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Form getters/setters to fix template binding issues
  get codeFormCode(): string {
    return this.selectedCode?.code || this.newCode.code || '';
  }
  set codeFormCode(value: string) {
    if (this.selectedCode) this.selectedCode.code = value;
    else this.newCode.code = value;
  }

  get codeFormName(): string {
    return this.selectedCode?.name || this.newCode.name || '';
  }
  set codeFormName(value: string) {
    if (this.selectedCode) this.selectedCode.name = value;
    else this.newCode.name = value;
  }

  get codeFormType(): string {
    return this.selectedCode?.type || this.newCode.type || 'percentage';
  }
  set codeFormType(value: any) {
    if (this.selectedCode) this.selectedCode.type = value;
    else this.newCode.type = value;
  }

  get codeFormValue(): number {
    return this.selectedCode?.value || this.newCode.value || 0;
  }
  set codeFormValue(value: number) {
    if (this.selectedCode) this.selectedCode.value = value;
    else this.newCode.value = value;
  }

  get codeFormMinOrderAmount(): number {
    return (
      this.selectedCode?.minOrderAmount || this.newCode.minOrderAmount || 0
    );
  }
  set codeFormMinOrderAmount(value: number) {
    if (this.selectedCode) this.selectedCode.minOrderAmount = value;
    else this.newCode.minOrderAmount = value;
  }

  get codeFormUsageLimit(): number {
    return this.selectedCode?.usageLimit || this.newCode.usageLimit || 100;
  }
  set codeFormUsageLimit(value: number) {
    if (this.selectedCode) this.selectedCode.usageLimit = value;
    else this.newCode.usageLimit = value;
  }

  get codeFormValidFrom(): string {
    return this.selectedCode?.validFrom || this.newCode.validFrom || '';
  }
  set codeFormValidFrom(value: string) {
    if (this.selectedCode) this.selectedCode.validFrom = value;
    else this.newCode.validFrom = value;
  }

  get codeFormValidUntil(): string {
    return this.selectedCode?.validUntil || this.newCode.validUntil || '';
  }
  set codeFormValidUntil(value: string) {
    if (this.selectedCode) this.selectedCode.validUntil = value;
    else this.newCode.validUntil = value;
  }

  get codeFormTargetCustomers(): string {
    return (
      this.selectedCode?.targetCustomers ||
      this.newCode.targetCustomers ||
      'all'
    );
  }
  set codeFormTargetCustomers(value: any) {
    if (this.selectedCode) this.selectedCode.targetCustomers = value;
    else this.newCode.targetCustomers = value;
  }

  get codeFormDescription(): string {
    return this.selectedCode?.description || this.newCode.description || '';
  }
  set codeFormDescription(value: string) {
    if (this.selectedCode) this.selectedCode.description = value;
    else this.newCode.description = value;
  }

  // Campaign form getters/setters
  get campaignFormName(): string {
    return this.selectedCampaign?.name || this.newCampaign.name || '';
  }
  set campaignFormName(value: string) {
    if (this.selectedCampaign) this.selectedCampaign.name = value;
    else this.newCampaign.name = value;
  }

  get campaignFormType(): string {
    return this.selectedCampaign?.type || this.newCampaign.type || 'email';
  }
  set campaignFormType(value: any) {
    if (this.selectedCampaign) this.selectedCampaign.type = value;
    else this.newCampaign.type = value;
  }

  get campaignFormSubject(): string {
    return this.selectedCampaign?.subject || this.newCampaign.subject || '';
  }
  set campaignFormSubject(value: string) {
    if (this.selectedCampaign) this.selectedCampaign.subject = value;
    else this.newCampaign.subject = value;
  }

  get campaignFormContent(): string {
    return this.selectedCampaign?.content || this.newCampaign.content || '';
  }
  set campaignFormContent(value: string) {
    if (this.selectedCampaign) this.selectedCampaign.content = value;
    else this.newCampaign.content = value;
  }

  get campaignFormTargetAudience(): string {
    return (
      this.selectedCampaign?.targetAudience ||
      this.newCampaign.targetAudience ||
      'All Customers'
    );
  }
  set campaignFormTargetAudience(value: string) {
    if (this.selectedCampaign) this.selectedCampaign.targetAudience = value;
    else this.newCampaign.targetAudience = value;
  }

  get campaignFormTargetCount(): number {
    return (
      this.selectedCampaign?.targetCount || this.newCampaign.targetCount || 0
    );
  }
  set campaignFormTargetCount(value: number) {
    if (this.selectedCampaign) this.selectedCampaign.targetCount = value;
    else this.newCampaign.targetCount = value;
  }

  get campaignFormBudget(): number {
    return this.selectedCampaign?.budget || this.newCampaign.budget || 0;
  }
  set campaignFormBudget(value: number) {
    if (this.selectedCampaign) this.selectedCampaign.budget = value;
    else this.newCampaign.budget = value;
  }

  get campaignFormScheduledDate(): string {
    return (
      this.selectedCampaign?.scheduledDate ||
      this.newCampaign.scheduledDate ||
      ''
    );
  }
  set campaignFormScheduledDate(value: string) {
    if (this.selectedCampaign) this.selectedCampaign.scheduledDate = value;
    else this.newCampaign.scheduledDate = value;
  }
}

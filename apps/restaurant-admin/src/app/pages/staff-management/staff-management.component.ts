import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface MenuSection {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

interface StaffRole {
  id: number;
  name: string;
  level: number;
  color: string;
  description: string;
}

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  avatar: string;
  permissions: Permission[];
  assignedSections: MenuSection[];
  lastLogin?: string;
  shift?: string;
  salary?: number;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.scss',
})
export class StaffManagementComponent implements OnInit {
  staffMembers: StaffMember[] = [];
  roles: StaffRole[] = [];
  permissions: Permission[] = [];
  sections: MenuSection[] = [];

  // Modal states
  showAddStaffModal = false;
  showEditStaffModal = false;
  showRoleModal = false;
  showSectionModal = false;
  showAddSectionModal = false;
  selectedStaff: StaffMember | null = null;

  // Form data
  newStaff: Partial<StaffMember> = {};
  selectedRole: StaffRole | null = null;
  newSection: Partial<MenuSection> = {};

  // Filters
  statusFilter = 'all';
  roleFilter = 'all';
  searchTerm = '';

  constructor(private router: Router) {
    this.initializeData();
  }

  ngOnInit() {
    // Additional initialization logic if needed
  }

  initializeData() {
    // Initialize sections
    this.sections = [
      {
        id: 1,
        name: 'Food',
        description: 'Main course items, appetizers, entrees',
        color: 'bg-red-500',
        icon: '🍽️',
        isActive: true,
      },
      {
        id: 2,
        name: 'Drinks',
        description: 'Beverages, soft drinks, juices, coffee',
        color: 'bg-blue-500',
        icon: '🥤',
        isActive: true,
      },
      {
        id: 3,
        name: 'Snacks',
        description: 'Light bites, chips, crackers, nuts',
        color: 'bg-yellow-500',
        icon: '🍿',
        isActive: true,
      },
      {
        id: 4,
        name: 'Desserts',
        description: 'Sweet treats, cakes, ice cream',
        color: 'bg-pink-500',
        icon: '🍰',
        isActive: true,
      },
      {
        id: 5,
        name: 'Alcohol',
        description: 'Beer, wine, spirits, cocktails',
        color: 'bg-purple-500',
        icon: '🍺',
        isActive: true,
      },
      {
        id: 6,
        name: 'Breakfast',
        description: 'Morning items, pancakes, eggs',
        color: 'bg-orange-500',
        icon: '🥞',
        isActive: false,
      },
    ];

    // Initialize roles
    this.roles = [
      {
        id: 1,
        name: 'Owner',
        level: 1,
        color: 'bg-red-500',
        description: 'Full system access',
      },
      {
        id: 2,
        name: 'Manager',
        level: 2,
        color: 'bg-purple-500',
        description: 'Restaurant operations management',
      },
      {
        id: 3,
        name: 'Assistant Manager',
        level: 3,
        color: 'bg-blue-500',
        description: 'Support management tasks',
      },
      {
        id: 4,
        name: 'Head Chef',
        level: 4,
        color: 'bg-orange-500',
        description: 'Kitchen operations lead',
      },
      {
        id: 5,
        name: 'Chef',
        level: 5,
        color: 'bg-yellow-500',
        description: 'Food preparation',
      },
      {
        id: 6,
        name: 'Cashier',
        level: 6,
        color: 'bg-green-500',
        description: 'Handle payments and orders',
      },
      {
        id: 7,
        name: 'Waiter/Waitress',
        level: 7,
        color: 'bg-teal-500',
        description: 'Customer service',
      },
      {
        id: 8,
        name: 'Delivery Driver',
        level: 8,
        color: 'bg-indigo-500',
        description: 'Food delivery',
      },
      {
        id: 9,
        name: 'Cleaner',
        level: 9,
        color: 'bg-gray-500',
        description: 'Maintenance and cleaning',
      },
    ];

    // Initialize permissions
    this.permissions = [
      {
        id: 1,
        name: 'manage_menu',
        description: 'Add, edit, delete menu items',
        category: 'Menu',
      },
      {
        id: 2,
        name: 'view_orders',
        description: 'View all orders',
        category: 'Orders',
      },
      {
        id: 3,
        name: 'manage_orders',
        description: 'Update order status',
        category: 'Orders',
      },
      {
        id: 4,
        name: 'view_analytics',
        description: 'Access analytics dashboard',
        category: 'Analytics',
      },
      {
        id: 5,
        name: 'manage_staff',
        description: 'Add, edit, remove staff',
        category: 'Staff',
      },
      {
        id: 6,
        name: 'manage_roles',
        description: 'Create and modify roles',
        category: 'Staff',
      },
      {
        id: 7,
        name: 'handle_payments',
        description: 'Process payments and refunds',
        category: 'Finance',
      },
      {
        id: 8,
        name: 'view_reports',
        description: 'Access financial reports',
        category: 'Finance',
      },
      {
        id: 9,
        name: 'manage_promotions',
        description: 'Create promotional campaigns',
        category: 'Marketing',
      },
      {
        id: 10,
        name: 'manage_customers',
        description: 'View and manage customer data',
        category: 'Customers',
      },
    ];

    // Initialize staff members with mock data
    this.staffMembers = [
      {
        id: 1,
        name: 'John Anderson',
        email: 'john@mariospizza.com',
        phone: '+1 (555) 123-4567',
        role: this.roles[0], // Owner
        status: 'active',
        joinDate: '2020-01-15',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        permissions: this.permissions,
        assignedSections: this.sections.filter((s) => s.isActive), // Owner has access to all sections
        lastLogin: '2024-01-15 09:30:00',
        shift: 'Full-time',
        salary: 75000,
      },
      {
        id: 2,
        name: 'Sarah Williams',
        email: 'sarah@mariospizza.com',
        phone: '+1 (555) 234-5678',
        role: this.roles[1], // Manager
        status: 'active',
        joinDate: '2021-03-10',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face',
        permissions: this.permissions.slice(0, 8),
        assignedSections: this.sections.filter((s) =>
          ['Food', 'Drinks', 'Desserts'].includes(s.name)
        ),
        lastLogin: '2024-01-15 08:45:00',
        shift: 'Morning',
        salary: 55000,
      },
      {
        id: 3,
        name: 'Michael Chen',
        email: 'michael@mariospizza.com',
        phone: '+1 (555) 345-6789',
        role: this.roles[3], // Head Chef
        status: 'active',
        joinDate: '2021-06-20',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        permissions: this.permissions.filter((p) =>
          ['Menu', 'Orders'].includes(p.category)
        ),
        assignedSections: this.sections.filter((s) =>
          ['Food', 'Desserts'].includes(s.name)
        ),
        lastLogin: '2024-01-15 07:00:00',
        shift: 'Full-time',
        salary: 48000,
      },
      {
        id: 4,
        name: 'Emma Thompson',
        email: 'emma@mariospizza.com',
        phone: '+1 (555) 456-7890',
        role: this.roles[5], // Cashier
        status: 'active',
        joinDate: '2022-09-05',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        permissions: this.permissions.filter((p) =>
          ['Orders', 'Finance'].includes(p.category)
        ),
        assignedSections: this.sections.filter((s) =>
          ['Drinks', 'Snacks'].includes(s.name)
        ),
        lastLogin: '2024-01-14 18:30:00',
        shift: 'Evening',
        salary: 32000,
      },
      {
        id: 5,
        name: 'David Rodriguez',
        email: 'david@mariospizza.com',
        phone: '+1 (555) 567-8901',
        role: this.roles[7], // Delivery Driver
        status: 'active',
        joinDate: '2023-02-14',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        permissions: this.permissions.filter((p) => p.name === 'view_orders'),
        assignedSections: [], // Delivery driver doesn't need section access
        lastLogin: '2024-01-15 11:15:00',
        shift: 'Flexible',
        salary: 28000,
      },
      {
        id: 6,
        name: 'Lisa Park',
        email: 'lisa@mariospizza.com',
        phone: '+1 (555) 678-9012',
        role: this.roles[4], // Chef
        status: 'inactive',
        joinDate: '2022-11-30',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        permissions: this.permissions.filter((p) => p.category === 'Menu'),
        assignedSections: this.sections.filter((s) => s.name === 'Food'),
        lastLogin: '2024-01-10 16:20:00',
        shift: 'Night',
        salary: 38000,
      },
    ];
  }

  // Computed properties
  get filteredStaff() {
    return this.staffMembers.filter((staff) => {
      const matchesStatus =
        this.statusFilter === 'all' || staff.status === this.statusFilter;
      const matchesRole =
        this.roleFilter === 'all' ||
        staff.role.id.toString() === this.roleFilter;
      const matchesSearch =
        staff.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesRole && matchesSearch;
    });
  }

  get activeStaffCount() {
    return this.staffMembers.filter((s) => s.status === 'active').length;
  }

  get inactiveStaffCount() {
    return this.staffMembers.filter((s) => s.status === 'inactive').length;
  }

  get totalRoles() {
    return this.roles.length;
  }

  get activeSections() {
    return this.sections.filter((s) => s.isActive);
  }

  get totalSections() {
    return this.sections.length;
  }

  // Modal methods
  openAddStaffModal() {
    this.newStaff = {
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      permissions: [],
      assignedSections: [],
    };
    this.showAddStaffModal = true;
  }

  openEditStaffModal(staff: StaffMember) {
    this.selectedStaff = { ...staff };
    this.showEditStaffModal = true;
  }

  closeModals() {
    this.showAddStaffModal = false;
    this.showEditStaffModal = false;
    this.showRoleModal = false;
    this.showSectionModal = false;
    this.showAddSectionModal = false;
    this.selectedStaff = null;
    this.newStaff = {};
  }

  // CRUD operations
  addStaff() {
    if (this.newStaff.name && this.newStaff.email && this.selectedRole) {
      const newId = Math.max(...this.staffMembers.map((s) => s.id)) + 1;
      const staff: StaffMember = {
        id: newId,
        name: this.newStaff.name,
        email: this.newStaff.email,
        phone: this.newStaff.phone || '',
        role: this.selectedRole,
        status: this.newStaff.status as 'active' | 'inactive' | 'suspended',
        joinDate:
          this.newStaff.joinDate || new Date().toISOString().split('T')[0],
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&${newId}`,
        permissions: this.newStaff.permissions || [],
        assignedSections: this.newStaff.assignedSections || [],
        shift: this.newStaff.shift,
        salary: this.newStaff.salary,
      };

      this.staffMembers.push(staff);
      this.closeModals();
    }
  }

  updateStaff() {
    if (this.selectedStaff) {
      const index = this.staffMembers.findIndex(
        (s) => s.id === this.selectedStaff!.id
      );
      if (index !== -1) {
        this.staffMembers[index] = { ...this.selectedStaff };
        this.closeModals();
      }
    }
  }

  deleteStaff(staffId: number) {
    if (confirm('Are you sure you want to remove this staff member?')) {
      this.staffMembers = this.staffMembers.filter((s) => s.id !== staffId);
    }
  }

  toggleStaffStatus(staff: StaffMember) {
    staff.status = staff.status === 'active' ? 'inactive' : 'active';
  }

  // Role management
  selectRole(role: StaffRole) {
    this.selectedRole = role;
    if (this.showAddStaffModal) {
      this.newStaff.role = role;
    } else if (this.selectedStaff) {
      this.selectedStaff.role = role;
    }
  }

  // Permission management
  togglePermission(permission: Permission) {
    if (this.showAddStaffModal) {
      const permissions = this.newStaff.permissions || [];
      const index = permissions.findIndex((p) => p.id === permission.id);
      if (index > -1) {
        permissions.splice(index, 1);
      } else {
        permissions.push(permission);
      }
      this.newStaff.permissions = permissions;
    } else if (this.selectedStaff) {
      const index = this.selectedStaff.permissions.findIndex(
        (p) => p.id === permission.id
      );
      if (index > -1) {
        this.selectedStaff.permissions.splice(index, 1);
      } else {
        this.selectedStaff.permissions.push(permission);
      }
    }
  }

  hasPermission(permission: Permission): boolean {
    if (this.showAddStaffModal) {
      return (this.newStaff.permissions || []).some(
        (p) => p.id === permission.id
      );
    } else if (this.selectedStaff) {
      return this.selectedStaff.permissions.some((p) => p.id === permission.id);
    }
    return false;
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  formatSalary(salary: number | undefined): string {
    return salary ? `₦${salary.toLocaleString()}` : 'Not set';
  }

  // Section management methods
  openSectionModal() {
    this.showSectionModal = true;
  }

  openAddSectionModal() {
    this.newSection = {
      name: '',
      description: '',
      color: 'bg-gray-500',
      icon: '📋',
      isActive: true,
    };
    this.showAddSectionModal = true;
  }

  addSection() {
    if (this.newSection.name && this.newSection.description) {
      const newId = Math.max(...this.sections.map((s) => s.id)) + 1;
      const section: MenuSection = {
        id: newId,
        name: this.newSection.name,
        description: this.newSection.description,
        color: this.newSection.color || 'bg-gray-500',
        icon: this.newSection.icon || '📋',
        isActive: this.newSection.isActive !== false,
      };

      this.sections.push(section);
      this.closeModals();
    }
  }

  toggleSection(sectionId: number) {
    const section = this.sections.find((s) => s.id === sectionId);
    if (section) {
      section.isActive = !section.isActive;

      // Remove inactive sections from all staff members
      if (!section.isActive) {
        this.staffMembers.forEach((staff) => {
          staff.assignedSections = staff.assignedSections.filter(
            (s) => s.id !== sectionId
          );
        });
      }
    }
  }

  deleteSection(sectionId: number) {
    if (
      confirm(
        'Are you sure you want to delete this section? It will be removed from all staff members.'
      )
    ) {
      this.sections = this.sections.filter((s) => s.id !== sectionId);

      // Remove section from all staff members
      this.staffMembers.forEach((staff) => {
        staff.assignedSections = staff.assignedSections.filter(
          (s) => s.id !== sectionId
        );
      });
    }
  }

  // Section assignment methods
  toggleSectionAssignment(section: MenuSection) {
    if (this.showAddStaffModal) {
      const sections = this.newStaff.assignedSections || [];
      const index = sections.findIndex((s) => s.id === section.id);
      if (index > -1) {
        sections.splice(index, 1);
      } else {
        sections.push(section);
      }
      this.newStaff.assignedSections = sections;
    } else if (this.selectedStaff) {
      const index = this.selectedStaff.assignedSections.findIndex(
        (s) => s.id === section.id
      );
      if (index > -1) {
        this.selectedStaff.assignedSections.splice(index, 1);
      } else {
        this.selectedStaff.assignedSections.push(section);
      }
    }
  }

  hasSectionAssignment(section: MenuSection): boolean {
    if (this.showAddStaffModal) {
      return (this.newStaff.assignedSections || []).some(
        (s) => s.id === section.id
      );
    } else if (this.selectedStaff) {
      return this.selectedStaff.assignedSections.some(
        (s) => s.id === section.id
      );
    }
    return false;
  }

  getStaffCountForSection(sectionId: number): number {
    return this.staffMembers.filter((staff) =>
      staff.assignedSections.some((section) => section.id === sectionId)
    ).length;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

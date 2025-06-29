import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  itemCount: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  prepTime: number;
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.scss',
})
export class MenuManagementComponent implements OnInit {
  categories: Category[] = [];
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  selectedCategory = 'all';
  searchTerm = '';
  showAddItemModal = false;
  showAddCategoryModal = false;
  editingItem: MenuItem | null = null;
  editingCategory: Category | null = null;

  // Form data
  itemForm: Partial<MenuItem> = {};
  categoryForm: Partial<Category> = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMockData();
    this.filterItems();
  }

  loadMockData() {
    // Mock categories
    this.categories = [
      {
        id: '1',
        name: 'Appetizers',
        description: 'Start your meal right',
        isActive: true,
        itemCount: 4,
      },
      {
        id: '2',
        name: 'Main Courses',
        description: 'Hearty main dishes',
        isActive: true,
        itemCount: 6,
      },
      {
        id: '3',
        name: 'Pizzas',
        description: 'Fresh baked pizzas',
        isActive: true,
        itemCount: 5,
      },
      {
        id: '4',
        name: 'Desserts',
        description: 'Sweet endings',
        isActive: true,
        itemCount: 3,
      },
      {
        id: '5',
        name: 'Beverages',
        description: 'Refreshing drinks',
        isActive: true,
        itemCount: 4,
      },
    ];

    // Mock menu items
    this.menuItems = [
      {
        id: '1',
        name: 'Bruschetta',
        description: 'Toasted bread with fresh tomatoes, basil, and garlic',
        price: 850,
        category: 'Appetizers',
        image:
          'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
        isAvailable: true,
        isPopular: true,
        prepTime: 10,
        ingredients: ['Bread', 'Tomatoes', 'Basil', 'Garlic', 'Olive Oil'],
        allergens: ['Gluten'],
      },
      {
        id: '2',
        name: 'Margherita Pizza',
        description:
          'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 2500,
        category: 'Pizzas',
        image:
          'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
        isAvailable: true,
        isPopular: true,
        prepTime: 15,
        ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
        allergens: ['Gluten', 'Dairy'],
      },
      {
        id: '3',
        name: 'Chicken Parmesan',
        description:
          'Breaded chicken breast with marinara sauce and melted cheese',
        price: 3200,
        category: 'Main Courses',
        image:
          'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
        isAvailable: true,
        isPopular: false,
        prepTime: 25,
        ingredients: [
          'Chicken Breast',
          'Breadcrumbs',
          'Marinara Sauce',
          'Parmesan Cheese',
        ],
        allergens: ['Gluten', 'Dairy'],
      },
      {
        id: '4',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked layers',
        price: 1200,
        category: 'Desserts',
        image:
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        isAvailable: true,
        isPopular: true,
        prepTime: 5,
        ingredients: ['Mascarpone', 'Ladyfingers', 'Coffee', 'Cocoa'],
        allergens: ['Dairy', 'Eggs'],
      },
      {
        id: '5',
        name: 'Italian Soda',
        description: 'Refreshing sparkling water with natural fruit flavors',
        price: 650,
        category: 'Beverages',
        image:
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        isAvailable: true,
        isPopular: false,
        prepTime: 2,
        ingredients: ['Sparkling Water', 'Natural Flavoring', 'Ice'],
        allergens: [],
      },
    ];
  }

  filterItems() {
    let filtered = this.menuItems;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(
        (item) => item.category === this.selectedCategory
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(search))
      );
    }

    this.filteredItems = filtered;
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.filterItems();
  }

  onSearchChange() {
    this.filterItems();
  }

  // Item management methods
  openAddItemModal() {
    this.editingItem = null;
    this.itemForm = {
      isAvailable: true,
      isPopular: false,
      ingredients: [],
      allergens: [],
      prepTime: 10,
      category:
        this.selectedCategory !== 'all' ? this.selectedCategory : 'Appetizers',
    };
    this.showAddItemModal = true;
  }

  openEditItemModal(item: MenuItem) {
    this.editingItem = item;
    this.itemForm = { ...item };
    this.showAddItemModal = true;
  }

  closeItemModal() {
    this.showAddItemModal = false;
    this.editingItem = null;
    this.itemForm = {};
  }

  saveItem() {
    if (this.editingItem) {
      // Update existing item
      const index = this.menuItems.findIndex(
        (item) => item.id === this.editingItem!.id
      );
      if (index !== -1) {
        this.menuItems[index] = {
          ...this.editingItem,
          ...this.itemForm,
        } as MenuItem;
      }
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: this.itemForm.name || '',
        description: this.itemForm.description || '',
        price: this.itemForm.price || 0,
        category: this.itemForm.category || 'Appetizers',
        image:
          this.itemForm.image ||
          'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400',
        isAvailable: this.itemForm.isAvailable ?? true,
        isPopular: this.itemForm.isPopular ?? false,
        prepTime: this.itemForm.prepTime || 10,
        ingredients: this.itemForm.ingredients || [],
        allergens: this.itemForm.allergens || [],
      };
      this.menuItems.push(newItem);
    }

    this.filterItems();
    this.closeItemModal();
  }

  deleteItem(item: MenuItem) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.menuItems = this.menuItems.filter((i) => i.id !== item.id);
      this.filterItems();
    }
  }

  toggleItemAvailability(item: MenuItem) {
    item.isAvailable = !item.isAvailable;
  }

  toggleItemPopular(item: MenuItem) {
    item.isPopular = !item.isPopular;
  }

  // Category management methods
  openAddCategoryModal() {
    this.editingCategory = null;
    this.categoryForm = { isActive: true };
    this.showAddCategoryModal = true;
  }

  openEditCategoryModal(category: Category) {
    this.editingCategory = category;
    this.categoryForm = { ...category };
    this.showAddCategoryModal = true;
  }

  closeCategoryModal() {
    this.showAddCategoryModal = false;
    this.editingCategory = null;
    this.categoryForm = {};
  }

  saveCategory() {
    if (this.editingCategory) {
      // Update existing category
      const index = this.categories.findIndex(
        (cat) => cat.id === this.editingCategory!.id
      );
      if (index !== -1) {
        this.categories[index] = {
          ...this.editingCategory,
          ...this.categoryForm,
        } as Category;
      }
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: this.categoryForm.name || '',
        description: this.categoryForm.description || '',
        isActive: this.categoryForm.isActive ?? true,
        itemCount: 0,
      };
      this.categories.push(newCategory);
    }

    this.closeCategoryModal();
  }

  deleteCategory(category: Category) {
    if (
      confirm(
        `Are you sure you want to delete the "${category.name}" category?`
      )
    ) {
      // Check if category has items
      const hasItems = this.menuItems.some(
        (item) => item.category === category.name
      );
      if (hasItems) {
        alert(
          'Cannot delete category that contains menu items. Please move or delete all items first.'
        );
        return;
      }
      this.categories = this.categories.filter((c) => c.id !== category.id);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  // Utility methods
  formatPrice(price: number): string {
    return `₦${price.toLocaleString()}`;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  addIngredient() {
    if (!this.itemForm.ingredients) this.itemForm.ingredients = [];
    this.itemForm.ingredients.push('');
  }

  removeIngredient(index: number) {
    if (this.itemForm.ingredients) {
      this.itemForm.ingredients.splice(index, 1);
    }
  }

  addAllergen() {
    if (!this.itemForm.allergens) this.itemForm.allergens = [];
    this.itemForm.allergens.push('');
  }

  removeAllergen(index: number) {
    if (this.itemForm.allergens) {
      this.itemForm.allergens.splice(index, 1);
    }
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }
}

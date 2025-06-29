import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonProgressBar,
  IonChip,
  IonAvatar,
  IonImg,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  checkmarkCircle,
  restaurant,
  bicycle,
  home,
  call,
  chatbubble,
  location,
  time,
  receipt,
} from 'ionicons/icons';

interface OrderStatus {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  timestamp?: string;
}

interface DeliveryPerson {
  name: string;
  rating: number;
  photo: string;
  phone: string;
  vehicleType: string;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonProgressBar,
    IonChip,
    IonAvatar,
    IonImg,
  ],
})
export class OrderTrackingComponent implements OnInit {
  orderId = 'ORD-12345';
  estimatedDeliveryTime = '20-25 min';
  currentStatus = 'Preparing';
  orderTotal = 28.5;
  restaurantName = "Mario's Pizzeria";

  orderStatuses: OrderStatus[] = [
    {
      id: 1,
      title: 'Order Confirmed',
      description: 'Your order has been received',
      completed: true,
      timestamp: '2:15 PM',
    },
    {
      id: 2,
      title: 'Preparing',
      description: 'Restaurant is preparing your food',
      completed: true,
      timestamp: '2:18 PM',
    },
    {
      id: 3,
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      completed: false,
    },
    {
      id: 4,
      title: 'Delivered',
      description: 'Order delivered to your address',
      completed: false,
    },
  ];

  deliveryPerson: DeliveryPerson = {
    name: 'Alex Johnson',
    rating: 4.8,
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    vehicleType: 'Bicycle',
  };

  constructor(private router: Router) {
    addIcons({
      arrowBack,
      checkmarkCircle,
      restaurant,
      bicycle,
      home,
      call,
      chatbubble,
      location,
      time,
      receipt,
    });
  }

  ngOnInit() {
    // Simulate order progress
    this.simulateOrderProgress();
  }

  simulateOrderProgress() {
    // Simulate status updates
    setTimeout(() => {
      this.orderStatuses[2].completed = true;
      this.orderStatuses[2].timestamp = '2:25 PM';
      this.currentStatus = 'Out for Delivery';
    }, 10000); // After 10 seconds

    setTimeout(() => {
      this.orderStatuses[3].completed = true;
      this.orderStatuses[3].timestamp = '2:40 PM';
      this.currentStatus = 'Delivered';
    }, 25000); // After 25 seconds
  }

  callDeliveryPerson() {
    // In a real app, this would initiate a phone call
    console.log('Calling delivery person:', this.deliveryPerson.phone);
  }

  chatWithDeliveryPerson() {
    // In a real app, this would open a chat interface
    console.log('Opening chat with delivery person');
  }

  goToOrderDetails() {
    // Navigate to detailed order view
    this.router.navigate(['/order-details', this.orderId]);
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

  get progressPercentage(): number {
    const completedSteps = this.orderStatuses.filter(
      (status) => status.completed
    ).length;
    return (completedSteps / this.orderStatuses.length) * 100;
  }
}

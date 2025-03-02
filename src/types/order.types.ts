import { Address } from './address.types';
import { UserInfo } from './auth.types';
import { Pagination } from './pagination.types';
import { Product } from './product.types';

// Enum cho OrderStatus (giả định các giá trị dựa trên backend)
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Model cho OrderItem
export interface OrderItem {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  product: Product; // Quan hệ ManyToOne với Product
  quantity: number;
  unitPrice: number; // BigDecimal ánh xạ thành number trong TypeScript
}

// Model cho Order
export interface Order {
  id: number; // Long trong Java ánh xạ thành number trong TypeScript
  orderId: string; // UUID dưới dạng string
  user: UserInfo; // Quan hệ ManyToOne với User
  shippingAddress: Address; // Quan hệ OneToOne với Address
  paymentMethod: string;
  status: OrderStatus; // Enum ánh xạ từ OrderStatus
  totalAmount: number; // BigDecimal ánh xạ thành number trong TypeScript
  discountAmount: number; // BigDecimal ánh xạ thành number trong TypeScript
  finalAmount: number; // BigDecimal ánh xạ thành number trong TypeScript
  orderDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  orderItems: OrderItem[]; // Quan hệ OneToMany với OrderItem
}

 
export interface OrderListResponse {
  status: string;
  message: string;
  data: Order[];
  pagination: Pagination;
}

// Type cho chi tiết đơn hàng
export type OrderDetailsResponse = Order;